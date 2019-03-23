import React from 'react';
import ReactDOM from 'react-dom';

import utils from '../lib/utils';

import { ChangePasswordForm } from 'react-stormpath';

export default class PasswordExpiredForm extends ChangePasswordForm {

  onFormSubmit(e) {
    e.preventDefault();
    e.persist();

    var next = (err, data) => {
      if (err) {
        return this.setState({
          isFormProcessing: false,
          errorMessage: err.message
        });
      }

      // If the user didn't specify any data,
      // then simply default to what we have in state.
      data = data || this.state.fields;

      if ('confirmPassword' in data && data.password !== data.confirmPassword) {
        return this.setState({
          isFormProcessing: false,
          errorMessage: 'Passwords do not match.'
        });
      }

      delete data.confirmPassword;
      utils.makeRequest( '/expired', data ).then( (res) => {
        this.setState({
          isFormProcessing: false,
          isFormSent: true
        });
      }).fail( (err) => {
	this.setState({
          isFormProcessing: false,
          errorMessage: utils.responseErrorText( err )
        });
      });

      this.setState({
	errorMessage: null,
	isFormSent: false,
	isFormProcessing: true
      });

    }
    var data = this.state.fields;
    if (this.props.onSubmit) {
      e.data = data;
      this.props.onSubmit(e, next);
    } else {
      next(null, data);
    }
  }
  
}

