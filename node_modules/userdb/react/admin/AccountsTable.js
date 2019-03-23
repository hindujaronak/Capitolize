import React from 'react';
import ReactDOM from 'react-dom';
import utils from '../lib/utils';
import {findIndex} from 'lodash';

import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import Confirm from 'react-confirm-bootstrap';
import Alert from 'react-alert';

export default class AccountsTable extends React.Component {

  state = {
    data: [],
    totalDataSize: 0,
    currentPage: 1,
    sizePerPage: this.props.sizePerPage || 10,
    sortField: 'name',
    sortOrder: 'asc',
    searchString: null,
  };

  fetchAccounts( page, sizePerPage, sortField, sortOrder, searchString ) {
    let currentIndex = (page - 1) * sizePerPage;
    return utils.makeRequest( '/accounts/list',
			      { offset: currentIndex, limit: sizePerPage,
				select: [ 'accounts.id', 'accounts.name', 'accounts.status', 'accounts.customData' ],
				orderby: [ sortField, sortOrder ], searchString: searchString } )
		.then( (data) => {
		  this.setState({
		    data: data.accounts,
		    currentPage: page,
		    totalDataSize: data.total,
		    sortField: sortField,
		    sortOrder: sortOrder,
		    searchString: searchString,
		  });
		}).fail( (err) => {
		  this.msg.show( 'There was a problem listing the accounts.', { type: 'error' });
		});
  }
  
  componentWillMount() {
    this.fetchAccounts( this.state.currentPage, this.state.sizePerPage, this.state.sortField, this.state.sortOrder, this.state.searchString );
  }

  componentDidMount() {
    this.view = ReactDOM.findDOMNode( this );
    if ( utils.user( this.props.currentUser ).has( 'super-admin' ) ) {
      let btn = $( '.react-bs-table-tool-bar .btn-group', this.view ).append(
	'<button class="btn btn-primary"><span class="icon-plus"></span>New</button>'
      );
      btn.on( 'click', () => {
	this.addAccount();
      });
    }
  }

  onPageChange = ( page, sizePerPage ) => {
    this.fetchAccounts( page, sizePerPage, this.state.sortField, this.state.sortOrder, this.state.searchString );
  }

  onSizePerPageList = (sizePerPage) => {
    return this.fetchAccounts( this.state.currentPage, sizePerPage, this.state.sortField, this.state.sortOrder, this.state.searchString ).then( () => {
      this.setState({ sizePerPage: sizePerPage });
    });
  }

  onSortChange = ( field, order ) => {
    this.fetchAccounts( this.state.currentPage, this.state.sizePerPage, field, order, this.state.searchString );
  }

  onSearchChange = ( searchText, colInfos, multiColumnSearch ) => {
    if ( searchText.length == 0 ) {
      return this.fetchAccounts( this.state.currentPage, this.state.sizePerPage, this.state.sortField, this.state.sortOrder, null );
    }
    if ( ! ( searchText.length >= 2 ) ) return;
    this.fetchAccounts( 1, this.state.sizePerPage, this.state.sortField, this.state.sortOrder, '%'+searchText+'%' );
  }

  toggleDropdown = ( e ) => {
    // nothing to do, yet!
  }

  disableAccount = ( account, action ) => {
    utils.makeRequest( '/accounts/change_account_status', { accountId: account.id, newStatus: action } ).then( ( newAccount ) => {
      let idx = findIndex( this.state.data, { id: newAccount.id } );
      if ( idx == -1 ) return; // account may not be on screen
      let newData = [
	...this.state.data.slice( 0, idx ),
	newAccount,
	...this.state.data.slice( idx + 1 )
      ];
      this.setState({ data: newData });
      this.msg.show( 'Account status has been changed!', { type: 'success' });
    }).fail( (err) => {
      this.msg.show( 'There was a problem changing the account status!', { type: 'error' });
    });
  }

  gotoUsers = (e) => {
    let accountId = $(e.target).data( 'accountid' );
    let accountName = $(e.target).data( 'accountname' );
    this.props.onNavigateToUsers( accountId, accountName );
  }

  gotoRoles = (e) => {
    let accountId = $(e.target).data( 'accountid' );
    let accountName = $(e.target).data( 'accountname' );
    this.props.onNavigateToRoles( accountId, accountName );
  }

  actionsFormatter = ( cell, row ) => {
    let account = row;
    let statusAction = 'Disable';
    let statusStatus = 'DISABLED';
    if ( account.status == 'DISABLED' ) { statusAction = 'Enable'; statusStatus = 'ENABLED'; }
    if ( account.status == 'LOCKED'   ) { statusAction = 'Unlock'; statusStatus = 'ENABLED'; }
    return(
      <div className="userdb-accounts-table-actions">
	<a className="btn btn-xs btn-warning" onClick={this.editAccount.bind( this, account )}><span className="icon-pencil"></span>Edit</a>
	<a style={{ marginLeft: '4px' }} className="btn btn-xs btn-danger" onClick={this.deleteAccount.bind( this, account )}><span className="icon-trash"></span>Delete</a>
	<div style={{marginLeft: '4px', display: 'inline-block'}} className="dropdown">
          <a onClick={this.toggleDropdown} className="dropdown-toggle btn btn-xs btn-default" role="button" data-toggle="dropdown">more...</a>
          <ul style={{left: '-100px'}} className="dropdown-menu" role="menu" aria-labelledby="dropdownMenu">
	    <Confirm onConfirm={this.disableAccount.bind(this,account,statusStatus)}
		     title={statusAction + ' Account'}
		     body={'Change this accounts status to ' + statusStatus.toUpperCase() + '?'}
		     confirmText="Change Status">
	      <li><a>{statusAction} account</a></li>
	    </Confirm>
	    <li><a onClick={this.gotoUsers} data-accountid={account.id} data-accountname={account.name}>users...</a></li>
	    <li><a onClick={this.gotoRoles} data-accountid={account.id} data-accountname={account.name}>roles...</a></li>
          </ul>
        </div>
      </div>
    );
  }

  editAccount = ( account ) => {
    if ( ! this.props.onModifyAccount ) return;
    this.props.onModifyAccount( account, this.props.accountId, (err, newAccount) => {
      if ( err ) return;  // caller should have notified the account
      let idx = findIndex( this.state.data, { id: account.id } );
      if ( idx == -1 ) return; // account may not be on screen
      let newData = [
	...this.state.data.slice( 0, idx ),
	newAccount,
	...this.state.data.slice( idx + 1 )
      ];
      this.setState({ data: newData });      
    });
  }
  
  deleteAccount = ( account ) => {
    let rm = () => {
      let idx = findIndex( this.state.data, { id: account.id } );
      if ( idx == -1 ) return console.error( 'cannot find', account.id );
      utils.makeRequest( '/accounts/remove', { accountId: account.id } ).then( () => {
	let newData = [
	  ...this.state.data.slice( 0, idx ),
	  ...this.state.data.slice( idx + 1 )
	];
	this.setState({ data: newData });
      }).fail((err) => {
	this.msg.show( 'There was a problem removing this account.', { type: 'error' });
      });
    }
    if ( this.props.onDeleteAccount ) {
      this.props.onDeleteAccount( account, (ok) => {
	if ( ok ) rm();
      });
    }
    else {
      rm();
    }
  }

  addAccount = () => {
    if ( ! this.props.onAddAccount ) return;
    this.props.onAddAccount( this.props.accountId, (err, newAccount) => {
      if ( err ) return; // caller should have notified account
      let newData = [
	newAccount,
	...this.state.data
      ];
      this.setState({ data: newData });
    });
  }
  
  render() {
    return(
      <div className="udb-accounts-table">
	<BootstrapTable ref="table" data={ this.state.data } remote={ true } pagination={ true } search={true} multiColumnSearch={true}
			fetchInfo={ { dataTotalSize: this.state.totalDataSize } }
			options={{ sizePerPage: this.state.sizePerPage,
                                   onPageChange: this.onPageChange,
                                   sizePerPageList: [ 5, 10, 20, 50, 100 ],
                                   pageStartIndex: 1,
                                   page: this.state.currentPage,
                                   onSizePerPageList: this.onSizePerPageList,
				   onSortChange: this.onSortChange,
			           onSearchChange: this.onSearchChange, clearSearch: true
			  }}>
	  <TableHeaderColumn dataField='id' isKey={true} hidden={true}>ID</TableHeaderColumn>
	  <TableHeaderColumn dataSort={true} dataField='name'>Name</TableHeaderColumn>
	  <TableHeaderColumn dataSort={true} dataField='description'>Description</TableHeaderColumn>
	  <TableHeaderColumn dataSort={true} dataField='status'>Status</TableHeaderColumn>
	  <TableHeaderColumn width="195" dataFormat={this.actionsFormatter}>actions</TableHeaderColumn>
	</BootstrapTable>
	<Alert ref={a => this.msg = a}
	       offset={14}
	       position='bottom left'
	       theme='dark'
	       time={5000}
	       transition='scale'
	/>
      </div>
    );
  }
}
