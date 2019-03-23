import React from 'react';
import ReactDOM from 'react-dom';
import { cloneDeep } from 'lodash';
import Select from 'react-select';
import utils from '../lib/utils';
import CustomDataField from './CustomDataField';

export default class RoleForm extends React.Component {

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
    [ 'id', 'name', 'description', 'customData', 'account_id' ].forEach( function(f) {
      formData[f] = fields[f];
    });
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

      utils.makeRequest( '/roles/update', data ).then( (user) => {
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
      name: 'Name',
      description: 'Description',
    };
    let error = null;
    [ 'name' ].forEach( (required) => {
      if ( ! ( this.state.fields[ required ] && this.state.fields[ required ].length ) )
	if ( ! error ) error = ( labelMap[ required ] ? labelMap[ required ] : required ) + ' is a required field.'; 
    });

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
      if ( this.props.accountId ) {
	let newFields = cloneDeep( this.state.fields );
	newFields.account_id = this.props.accountId;
	this.setState({ fields: newFields });
      }
    }
  }
  
  render() {
    return (
      <form onSubmit={this._onFormSubmit}>
        <div className="form-horizontal">

	  <input type="hidden" name="id" />

          <div className="form-group">
            <label htmlFor="name" className="col-xs-12 col-sm-3 control-label">Role Name</label>
            <div className="col-xs-12 col-sm-9">
              <input type="text" className="form-control" id="name" name="name" placeholder="Role name"
		     onChange={this.fieldChange.bind(this,'name','text')} value={this.state.fields.name}/>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="description" className="col-xs-12 col-sm-3 control-label">Description</label>
            <div className="col-xs-12 col-sm-9">
              <input type="text" className="form-control" id="description" name="description" placeholder="Description"
		     onChange={this.fieldChange.bind(this,'description','text')} value={this.state.fields.description}/>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="status" className="col-xs-12 col-sm-3 control-label">Status</label>
            <div className="col-xs-12 col-sm-9">
	      <Select className="form-control" id="status" name="status" placeholder="Status"
		      options={[
			{ label: 'ENABLED', value: 'ENABLED' },
			{ label: 'DISABLED', value: 'DISABLED' },
		      ]}
		      onChange={this.fieldChange.bind(this,'status','select')}
		      value={this.state.fields.status || 'ENABLED' }
	      />
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
