import React from 'react';
import ReactDOM from 'react-dom';
import Select from 'react-select';
import utils from '../lib/utils';

export default class RolesPicker extends React.Component {

  state = {
    availableRoles: [],
    roles: this.mapRoles( this.props.roles )
  };

  mapRoles( roles ) {
    return roles.map( ( r ) => { return { label: r.name, value: r.id }; } );
  }

  unmapRoles( roles ) {
    return roles.map( ( r ) => { return { name: r.label, id: r.value, account_id: this.props.account_id }; } );
  }
  
  fetchData = ( accountId ) => {
    if ( ! accountId ) return this.setState({ availableRoles: [] });
    utils.makeRequest( '/accounts/roles_for_account', { accountId: accountId } ).then( (roles) => {
      this.setState({ availableRoles: this.mapRoles( roles ) });
    }).fail( (err) => {
      utils.handleError( err );
    });
  }

  componentWillMount() {
    this.fetchData( this.props.account_id );
  }

  componentWillReceiveProps( nextProps ) {
    if ( nextProps.account_id != this.props.account_id ) {
      this.setState({ roles: [] });
      this.fetchData( nextProps.account_id );
    }
  }

  onChange = ( val ) => {
    this.setState({ roles: val });
    this.props.onChange({ value: this.unmapRoles( val ) });
  }

  render() {
    return(
      <Select {...this.props} multi={true} options={this.state.availableRoles} value={this.state.roles} onChange={this.onChange}/>
    );
  }
  
}
