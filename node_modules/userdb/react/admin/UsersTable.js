import React from 'react';
import ReactDOM from 'react-dom';
import utils from '../lib/utils';
import {findIndex} from 'lodash';

import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import Confirm from 'react-confirm-bootstrap';
import Alert from 'react-alert';

import ImportUsersModal from './ImportUsersModal';

export default class UsersTable extends React.Component {

  state = {
    data: [],
    totalDataSize: 0,
    currentPage: 1,
    sizePerPage: this.props.sizePerPage || 10,
    sortField: 'fullName',
    sortOrder: 'asc',
    searchString: null,
    showImportModal: false,
  };

  fetchUsers( page, sizePerPage, sortField, sortOrder, searchString ) {
    let currentIndex = (page - 1) * sizePerPage;
    if ( sortField == 'accounts' ) sortField = 'accounts.name';
    if ( sortField == 'roles' ) sortField = 'roles.name';
    if ( sortField == 'status' ) sortField = 'users.status';
    return utils.makeRequest( '/users/list',
			      { accountId: this.props.accountId,
				offset: currentIndex, limit: sizePerPage,
				withAccounts: true, withRoles: true,
				select: [ 'users.fullName', 'users.email', 'users.status', 'users.id', 'users.account_id',
					  'users.givenName', 'users.middleName', 'users.surname',
					  'accounts.id', 'accounts.name', 'accounts.customData',
					  'roles.*' ],
				orderby: [ sortField, sortOrder ], searchString: searchString } )
		.then( (data) => {
		  this.setState({
		    data: data.users,
		    currentPage: page,
		    totalDataSize: data.total,
		    sortField: sortField,
		    sortOrder: sortOrder,
		    searchString: searchString,
		  });
		}).fail( (err) => {
		  this.msg.show( 'There was a problem listing the users.', { type: 'error' });
		});
  }
  
  componentWillMount() {
    this.fetchUsers( this.state.currentPage, this.state.sizePerPage, this.state.sortField, this.state.sortOrder, this.state.searchString );
  }

  componentDidMount() {
    this.view = ReactDOM.findDOMNode( this );
    let btn = $( '.react-bs-table-tool-bar .btn-group', this.view ).append(
      '<button class="btn btn-primary add-user"><span class="icon-plus"></span>New</button>'
    );
    btn.find('.add-user').on( 'click', () => {
      this.addUser();
    });
    btn = $( '.react-bs-table-tool-bar .btn-group', this.view ).append(
      '<button class="btn btn-warning import-users"><span class="icon-cloud-upload"></span>Import</button>'
    );
    btn.find('.import-users').on( 'click', () => {
      this.setState({ showImportModal: true });
    });
  }

  hideImportModal = () => {
    this.setState({ showImportModal: false });
  }

  usersImported = () => {
    this.setState({ showImportModal: false });
    this.fetchUsers( this.state.currentPage, this.state.sizePerPage, this.state.sortField, this.state.sortOrder, this.state.searchString );
  }

  componentDidUpdate(prevProps, prevState) {
    if ( prevProps.accountId != this.props.accountId ) {
      this.fetchUsers( this.state.currentPage, this.state.sizePerPage, this.state.sortField, this.state.sortOrder, this.state.searchString );
    }
  }

  onPageChange = ( page, sizePerPage ) => {
    this.fetchUsers( page, sizePerPage, this.state.sortField, this.state.sortOrder, this.state.searchString );
  }

  onSizePerPageList = (sizePerPage) => {
    return this.fetchUsers( this.state.currentPage, sizePerPage, this.state.sortField, this.state.sortOrder, this.state.searchString ).then( () => {
      this.setState({ sizePerPage: sizePerPage });
    });
  }

  onSortChange = ( field, order ) => {
    this.fetchUsers( this.state.currentPage, this.state.sizePerPage, field, order, this.state.searchString );
  }

  onSearchChange = ( searchText, colInfos, multiColumnSearch ) => {
    if ( searchText.length == 0 ) {
      return this.fetchUsers( this.state.currentPage, this.state.sizePerPage, this.state.sortField, this.state.sortOrder, null );
    }
    if ( ! ( searchText.length >= 2 ) ) return;
    this.fetchUsers( 1, this.state.sizePerPage, this.state.sortField, this.state.sortOrder, '%'+searchText+'%' );
  }

  formatAccountColumn = ( accounts, user, formatExtraData, rowIdx ) => {
    return accounts[0].name;
  }
  
  formatRolesColumn = ( roles, user, formatExtraData, rowIdx ) => {
    return roles.map( function( r ) { return r.name; } ).join( ', ' );
  }

  toggleDropdown = ( e ) => {
    // nothing to do, yet!
  }

  disableAccount = ( user, action ) => {
    utils.makeRequest( '/users/change_account_status', { userId: user.id, newStatus: action } ).then( ( newUser ) => {
      let idx = findIndex( this.state.data, { id: newUser.id } );
      if ( idx == -1 ) return; // user may not be on screen
      let newData = [
	...this.state.data.slice( 0, idx ),
	newUser,
	...this.state.data.slice( idx + 1 )
      ];
      this.setState({ data: newData });
      this.msg.show( 'Account status has been changed!', { type: 'success' });
    }).fail( (err) => {
      this.msg.show( 'There was a problem changing the account status!', { type: 'error' });
    });
  }

  resendInvite = ( user ) => {
    utils.makeRequest( '/users/resend_invite', { userId: user.id } ).then( () => {
      this.msg.show( 'Account invite has been resent!', { type: 'success' });
    }).fail( (err) => {
      this.msg.show( 'There was a problem sending the invite email.', { type: 'error' });
    });
  }

  resetPassword = ( user ) => {
    utils.makeRequest( '/users/reset_password', { userId: user.id } ).then( () => {
      this.msg.show( 'Password reset email has been sent!', { type: 'success' });
    }).fail( (err) => {
      this.msg.show( 'There was a problem sending the password reset email.', { type: 'error' });
    });
  }

  actionsFormatter = ( cell, row ) => {
    let user = row;
    let statusAction = 'Disable';
    let statusStatus = 'DISABLED';
    if ( user.status == 'DISABLED' ) { statusAction = 'Enable'; statusStatus = 'ENABLED'; }
    if ( user.status == 'LOCKED'   ) { statusAction = 'Unlock'; statusStatus = 'ENABLED'; }
    return(
      <div className="userdb-users-table-actions">
	<a className="btn btn-xs btn-warning" onClick={this.editUser.bind( this, user )}><span className="icon-pencil"></span>Edit</a>
	<a style={{ marginLeft: '4px' }} className="btn btn-xs btn-danger" onClick={this.deleteUser.bind( this, user )}><span className="icon-trash"></span>Delete</a>
	<div style={{marginLeft: '4px', display: 'inline-block'}} className="dropdown">
          <a onClick={this.toggleDropdown} className="dropdown-toggle btn btn-xs btn-default" role="button" data-toggle="dropdown">more...</a>
          <ul style={{left: '-100px'}} className="dropdown-menu" role="menu" aria-labelledby="dropdownMenu">
	    <Confirm onConfirm={this.disableAccount.bind(this,user,statusStatus)}
		     title={statusAction + ' Account'}
		     body={'Change this users account status to ' + statusStatus.toUpperCase() + '?'}
		     confirmText="Change Status">
	      <li><a>{statusAction} account</a></li>
	    </Confirm>
	    <Confirm onConfirm={this.resendInvite.bind(this,user)}
		     title="Resend Invite"
		     body="Resend account invite?  This will resend the account invite email to this user."
		     confirmText="Resend Invite">
	      <li><a>resend invite</a></li>
	    </Confirm>
	    <Confirm onConfirm={this.resetPassword.bind(this,user)}
		     title="Reset Password"
		     body="Reset this users password?  This will send email to the user asking them to reset their password."
		     confirmText="Reset Password">
	      <li><a>reset password</a></li>
	    </Confirm>
          </ul>
        </div>
      </div>
    );
  }

  editUser = ( user ) => {
    if ( ! this.props.onModifyUser ) return;
    this.props.onModifyUser( user, this.props.accountId, (err, newUser) => {
      if ( err ) return;  // caller should have notified the user
      let idx = findIndex( this.state.data, { id: user.id } );
      if ( idx == -1 ) return; // user may not be on screen
      let newData = [
	...this.state.data.slice( 0, idx ),
	newUser,
	...this.state.data.slice( idx + 1 )
      ];
      this.setState({ data: newData });      
    });
  }
  
  deleteUser = ( user ) => {
    let rm = () => {
      let idx = findIndex( this.state.data, { id: user.id } );
      if ( idx == -1 ) return console.error( 'cannot find', user.id );
      utils.makeRequest( '/users/remove', { userId: user.id } ).then( () => {
	let newData = [
	  ...this.state.data.slice( 0, idx ),
	  ...this.state.data.slice( idx + 1 )
	];
	this.setState({ data: newData });
      }).fail((err) => {
	this.msg.show( 'There was a problem removing this user.', { type: 'error' });
      });
    }
    if ( this.props.onDeleteUser ) {
      this.props.onDeleteUser( user, (ok) => {
	if ( ok ) rm();
      });
    }
    else {
      rm();
    }
  }

  addUser = () => {
    if ( ! this.props.onAddUser ) return;
    this.props.onAddUser( this.props.accountId, (err, newUser) => {
      if ( err ) return; // caller should have notified user
      let newData = [
	newUser,
	...this.state.data
      ];
      this.setState({ data: newData });
    });
  }
  
  render() {
    // hide the accounts column if we are only looking at one account, or if the
    // logged in user is not a super-admin
    let accountsColumnHidden =
    ( this.props.accountId != undefined || ! utils.user( this.props.currentUser ).has( 'super-admin' ) );
    return(
      <div className="udb-users-table">
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
	  <TableHeaderColumn dataSort={true} dataField='fullName'>Name</TableHeaderColumn>
	  <TableHeaderColumn dataSort={true} dataField='email'>Email</TableHeaderColumn>
	  <TableHeaderColumn dataSort={true} dataField='accounts' hidden={accountsColumnHidden} dataFormat={this.formatAccountColumn}>Account</TableHeaderColumn>
	  <TableHeaderColumn dataSort={true} dataField='roles' dataFormat={this.formatRolesColumn}>Roles</TableHeaderColumn>
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
	<ImportUsersModal accountId={this.props.accountId} show={this.state.showImportModal} onHide={this.hideImportModal} success={this.usersImported} />
      </div>
    );
  }
}
