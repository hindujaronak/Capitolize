import React from 'react';
import ReactDOM from 'react-dom';
import Select from 'react-select';
import { cloneDeep } from 'lodash';

import utils from '../lib/utils';
import AccountPicker from './AccountPicker';
import RolesPicker from './RolesPicker';
import CustomDataField from './CustomDataField';

export default class UserForm extends React.Component {

  state = {
    fields: this.props.form,
    errorMessage: null,
    isFormProcessing: false,
    isFormSuccessful: false,
  };

  _error( err ) {
    this.setState({
      isFormProcessing: false,
      isFormSuccessful: false,
      errorMessage: err.message || err.responseText
    });
  }

  fixUp( fields ) {
    let formData = {};
    [ 'id', 'givenName', 'middleName', 'surname', 'email', 'status',
      'customData', 'roles', 'account_id', 'password' ].forEach( function(f) {
	formData[f] = fields[f];
      });
    if ( formData.middleName )
      formData.fullName = [ formData.givenName, formData.middleName, formData.surname ]. join( ' ' );
    else
      formData.fullName = [ formData.givenName, formData.surname ]. join( ' ' );
    return formData;
  }

  _onFormSubmit = (e) => {
    e.preventDefault();
    e.persist();
    
    var next = (err, data) => {
      if (err) {
        return this._error( err );
      }

      // If the user didn't specify any data,
      // then simply default to what we have in state.
      data = data || this.state.fields;

      utils.makeRequest( '/users/update', data ).then( (user) => {
        this.setState({
          isFormProcessing: false,
          isFormSuccessful: true,
          errorMessage: null
        });
	
	if ( this.props.onSubmitted )
	  this.props.onSubmitted( null, user );

      }).fail( ( err ) => {
	this._error( err );
      });
    };

    // Check for form validation errors ...

    let labelMap = {
      givenName: 'First Name',
      surname: 'Last Name',
      email: 'Email',
    };
    let error = null;
    [ 'givenName', 'surname', 'email' ].forEach( (required) => {
      if ( ! ( this.state.fields[ required ] && this.state.fields[ required ].length ) )
	if ( ! error ) error = ( labelMap[ required ] ? labelMap[ required ] : required ) + ' is a required field.'; 
    });

    if ( !this.state.fields.id && this.state.fields.status && this.state.fields.status != 'PENDING' ) {
      if ( ! ( this.state.fields.password && this.state.fields.password.length &&
	       this.state.fields.password2 && this.state.fields.password2.length &&
	       this.state.fields.password == this.state.fields.password2 ) ) {
		 if ( ! error ) error = 'password fields are required and need to match.';
      }
    }

    if ( ! this.state.fields.id ) {
      if ( ! ( this.state.fields.account_id && this.state.fields.account_id.length ) ) {
	if ( ! error ) error = 'you must choose an account for this user.';
      }
    }
    
    if ( error ) {
      return this._error( new Error( error ) );
    }

    // done with validation checks
    
    this.setState({
      isFormProcessing: true
    });

    let data = this.fixUp( this.state.fields );

    if (this.props.onSubmit) {
      this.props.onSubmit(data, next);
    } else {
      next(null, data);
    }
  }

  fieldChange = ( fieldName, fieldType, v ) => {
    let val = null;
    if ( fieldType == 'text' ) val = v.target.value;
    else if ( fieldType = 'select' ) val = v.value;
    let newFields = cloneDeep( this.state.fields );
    newFields[ fieldName ] = val;
    this.setState({ fields: newFields });
  }

  componentWillMount() {
    if ( ! this.state.fields.account_id ) {
      // this is a new user add.  if the logged in user is not super-admin, then
      // set the new user account id equal to the logged in user's account id.
      if ( ! utils.user( this.props.loggedInUser ).has( 'super-admin' ) ) {
	let newFields = cloneDeep( this.state.fields );
	newFields.account_id = this.props.loggedInUser.account_id;
	this.setState({ fields: newFields });
      }
      else {
	// super-admin
	if ( this.props.accountId ) {
	  let newFields = cloneDeep( this.state.fields );
	  newFields.account_id = this.props.accountId;
	  this.setState({ fields: newFields });
	}
      }
    }
  }
  
  render() {

    // this.props.accountId will be non-null if we are looking at a particular account
    // if its null AND THE LOGGED IN USER is a super-admin, then display a list of accounts IF THIS IS A NEW USER to choose from
    // if its null and the logged in user is not a super-admin, then do not display accounts, and use loggedInUser accountId for the new user

    let displayAccounts = ( !this.state.fields.id &&
			    !this.props.accountId &&
			    utils.user( this.props.loggedInUser ).has( 'super-admin' ) );

    let displayPassword = ( !this.state.fields.id &&
			    ( this.state.fields.status=='ENABLED' || this.state.fields.status=='DISABLED' || this.state.fields.status=='LOCKED' ) );
    
    return (
      <form onSubmit={this._onFormSubmit}>
        <div className="form-horizontal">

	  <input type="hidden" name="id" />

	  {displayAccounts ? (
             <div className="form-group">
               <label htmlFor="account_id" className="col-xs-12 col-sm-3 control-label">Account</label>
               <div className="col-xs-12 col-sm-9">
		 <AccountPicker className="form-control" id="account_id" name="account_id" placeholder="Choose Account"
				onChange={this.fieldChange.bind(this,'account_id','select')} value={this.state.fields.account_id}/>
               </div>
             </div>	     
	  ) : null }
	  
          <div className="form-group">
            <label htmlFor="givenName" className="col-xs-12 col-sm-3 control-label">First Name</label>
            <div className="col-xs-12 col-sm-9">
              <input type="text" className="form-control" id="givenName" name="givenName" placeholder="First name"
		     onChange={this.fieldChange.bind(this,'givenName','text')} value={this.state.fields.givenName}/>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="middleName" className="col-xs-12 col-sm-3 control-label">Middle Name</label>
            <div className="col-xs-12 col-sm-9">
              <input type="text" className="form-control" id="middleName" name="middleName" placeholder="Middle name"
		     onChange={this.fieldChange.bind(this,'middleName','text')} value={this.state.fields.middleName}/>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="surname" className="col-xs-12 col-sm-3 control-label">Last Name</label>
            <div className="col-xs-12 col-sm-9">
              <input type="text" className="form-control" id="surname" name="surname" placeholder="Last name"
		     onChange={this.fieldChange.bind(this,'surname','text')} value={this.state.fields.surname}/>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="email" className="col-xs-12 col-sm-3 control-label">Email</label>
            <div className="col-xs-12 col-sm-9">
              <input type="text" className="form-control" id="email" name="email" placeholder="Email address" 
		     onChange={this.fieldChange.bind(this,'email','text')} value={this.state.fields.email}/>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="status" className="col-xs-12 col-sm-3 control-label">Status</label>
            <div className="col-xs-12 col-sm-9">
	      <Select className="form-control" id="status" name="status" placeholder="Status"
		      options={[
			{ label: 'PENDING', value: 'PENDING' },
			{ label: 'ENABLED', value: 'ENABLED' },
			{ label: 'DISABLED', value: 'DISABLED' },
			{ label: 'LOCKED', value: 'LOCKED' },
		      ]}
		      onChange={this.fieldChange.bind(this,'status','select')}
		      value={this.state.fields.status || 'PENDING' }
	      />
            </div>
          </div>

	  {displayPassword ? (
	     <div>
               <div className="form-group">
		 <label htmlFor="password" className="col-xs-12 col-sm-3 control-label">Password</label>
		 <div className="col-xs-12 col-sm-9">
		   <input type="password" className="form-control" id="password" name="password" placeholder="Password" 
			  onChange={this.fieldChange.bind(this,'password','text')} value={this.state.fields.password}/>
		 </div>
               </div>
               <div className="form-group">
		 <label htmlFor="password2" className="col-xs-12 col-sm-3 control-label">Confirm Password</label>
		 <div className="col-xs-12 col-sm-9">
		   <input type="password" className="form-control" id="password2" name="password2" placeholder="Confirm Password" 
			  onChange={this.fieldChange.bind(this,'password2','text')} value={this.state.fields.password2}/>
		 </div>
               </div>
	     </div>
	  ) : null }

          <div className="form-group">
            <label htmlFor="roles" className="col-xs-12 col-sm-3 control-label">Roles</label>
            <div className="col-xs-12 col-sm-9">
	      <RolesPicker className="form-control" id="roles" name="roles" placeholder="Select Roles"
			   roles={this.state.fields.roles || []}
			   account_id={this.props.accountId || this.state.fields.account_id}
			   onChange={this.fieldChange.bind(this,'roles','select')} value={this.state.fields.roles}/>
            </div>
          </div>

	  {this.props.showCustomData ? (
             <div className="form-group">
               <label htmlFor="customData" className="col-xs-12 col-sm-3 control-label">CustomData</label>
               <div className="col-xs-12 col-sm-9">
		 <CustomDataField className="form-control" id="customData" name="customData"
				  rows={5}
				  onChange={this.fieldChange.bind(this,'customData','text')} value={this.state.fields.customData}/>
               </div>
             </div>
	   ) : null }
	  
	  {this.props.children}
	  
	  <div key="update-button" className="form-group">
	    <div className="col-sm-offset-3 col-sm-9">
	      {this.state.errorMessage ? <p className="alert alert-danger"><span>{this.state.errorMessage}</span></p> : null }
	      {this.state.isFormSuccessfull ? <p className="alert alert-success">User updated.</p> : null }
	      { this.props.onCancel ? ( <button style={{marginRight: '5px'}} className="btn btn-default" onClick={this.props.onCancel}>Cancel</button> ) : null }
              <button type="submit" className="btn btn-primary">
		{this.state.isFormProcessing ? <span>Updating...</span> : <span>Update</span> }
              </button>
            </div>
          </div>

	</div>
      </form>
    );
  }
}
