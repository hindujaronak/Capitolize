import React from 'react';
import ReactDOM from 'react-dom';
import utils from '../lib/utils';
import {findIndex} from 'lodash';

import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import Confirm from 'react-confirm-bootstrap';
import Alert from 'react-alert';

export default class RolesTable extends React.Component {

  state = {
    data: [],
    totalDataSize: 0,
    currentPage: 1,
    sizePerPage: this.props.sizePerPage || 10,
    sortField: 'name',
    sortOrder: 'asc',
    searchString: null,
  };

  fetchRoles( page, sizePerPage, sortField, sortOrder, searchString ) {
    let currentIndex = (page - 1) * sizePerPage;
    return utils.makeRequest( '/roles/list',
			      { where: { 'roles.account_id': this.props.accountId },
				offset: currentIndex, limit: sizePerPage,
				select: [ 'roles.id', 'roles.name', 'roles.status', 'roles.customData' ],
				orderby: [ sortField, sortOrder ], searchString: searchString } )
		.then( (data) => {
		  this.setState({
		    data: data.roles,
		    currentPage: page,
		    totalDataSize: data.total,
		    sortField: sortField,
		    sortOrder: sortOrder,
		    searchString: searchString,
		  });
		}).fail( (err) => {
		  this.msg.show( 'There was a problem listing the roles.', { type: 'error' });
		});
  }
  
  componentWillMount() {
    this.fetchRoles( this.state.currentPage, this.state.sizePerPage, this.state.sortField, this.state.sortOrder, this.state.searchString );
  }

  componentDidMount() {
    this.view = ReactDOM.findDOMNode( this );
    if ( utils.user( this.props.currentUser ).has( 'super-admin' ) ) {
      let btn = $( '.react-bs-table-tool-bar .btn-group', this.view ).append(
	'<button class="btn btn-primary"><span class="icon-plus"></span>New</button>'
      );
      btn.on( 'click', () => {
	this.addRole();
      });
    }
  }

  onPageChange = ( page, sizePerPage ) => {
    this.fetchRoles( page, sizePerPage, this.state.sortField, this.state.sortOrder, this.state.searchString );
  }

  onSizePerPageList = (sizePerPage) => {
    return this.fetchRoles( this.state.currentPage, sizePerPage, this.state.sortField, this.state.sortOrder, this.state.searchString ).then( () => {
      this.setState({ sizePerPage: sizePerPage });
    });
  }

  onSortChange = ( field, order ) => {
    this.fetchRoles( this.state.currentPage, this.state.sizePerPage, field, order, this.state.searchString );
  }

  onSearchChange = ( searchText, colInfos, multiColumnSearch ) => {
    if ( searchText.length == 0 ) {
      return this.fetchRoles( this.state.currentPage, this.state.sizePerPage, this.state.sortField, this.state.sortOrder, null );
    }
    if ( ! ( searchText.length >= 2 ) ) return;
    this.fetchRoles( 1, this.state.sizePerPage, this.state.sortField, this.state.sortOrder, '%'+searchText+'%' );
  }

  actionsFormatter = ( cell, row ) => {
    let role = row;
    let statusAction = 'Disable';
    let statusStatus = 'DISABLED';
    if ( role.status == 'DISABLED' ) { statusAction = 'Enable'; statusStatus = 'ENABLED'; }
    if ( role.status == 'LOCKED'   ) { statusAction = 'Unlock'; statusStatus = 'ENABLED'; }
    return(
      <div className="userdb-roles-table-actions">
	<a className="btn btn-xs btn-warning" onClick={this.editRole.bind( this, role )}><span className="icon-pencil"></span>Edit</a>
	<a style={{ marginLeft: '4px' }} className="btn btn-xs btn-danger" onClick={this.deleteRole.bind( this, role )}><span className="icon-trash"></span>Delete</a>
      </div>
    );
  }

  editRole = ( role ) => {
    if ( ! this.props.onModifyRole ) return;
    this.props.onModifyRole( role, this.props.accountId, (err, newRole) => {
      if ( err ) return;  // caller should have notified the role
      let idx = findIndex( this.state.data, { id: role.id } );
      if ( idx == -1 ) return; // role may not be on screen
      let newData = [
	...this.state.data.slice( 0, idx ),
	newRole,
	...this.state.data.slice( idx + 1 )
      ];
      this.setState({ data: newData });      
    });
  }
  
  deleteRole = ( role ) => {
    let rm = () => {
      let idx = findIndex( this.state.data, { id: role.id } );
      if ( idx == -1 ) return console.error( 'cannot find', role.id );
      utils.makeRequest( '/roles/remove', { roleId: role.id } ).then( () => {
	let newData = [
	  ...this.state.data.slice( 0, idx ),
	  ...this.state.data.slice( idx + 1 )
	];
	this.setState({ data: newData });
      }).fail((err) => {
	this.msg.show( 'There was a problem removing this role.', { type: 'error' });
      });
    }
    if ( this.props.onDeleteRole ) {
      this.props.onDeleteRole( role, (ok) => {
	if ( ok ) rm();
      });
    }
    else {
      rm();
    }
  }

  addRole = () => {
    if ( ! this.props.onAddRole ) return;
    this.props.onAddRole( this.props.accountId, (err, newRole) => {
      if ( err ) return; // caller should have notified role
      let newData = [
	newRole,
	...this.state.data
      ];
      this.setState({ data: newData });
    });
  }
  
  render() {
    return(
      <div className="udb-roles-table">
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
