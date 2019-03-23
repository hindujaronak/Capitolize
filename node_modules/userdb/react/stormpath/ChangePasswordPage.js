import React from 'react';
import ReactDOM from 'react-dom';

import BaseAuthPage from './BaseAuthPage';
import { Link } from 'react-router';
import { ChangePasswordForm, LogoutLink } from 'react-stormpath';
import utils from '../lib/utils';

export default class ChangePasswordPage extends React.Component {

  validatePassword( e, next ) {
    if ( ! ( e.data.password == e.data.confirmPassword ) ) return next( new Error( 'Password fields do not match' ) );
    utils.makeRequest( '/users/check_password', { password: e.data.password } ).then( (res) => {
      if ( res.good ) return next();
      else return next( new Error( res.error ) );
    }).fail( (err) => {
      next( new Error( utils.responseErrorText( err ) ) );
    });
  }

  render() {
    return (
      <BaseAuthPage pageTitle="Change Password" formTitle="Create New Password" formClass="login-form clearfix">
	<ChangePasswordForm spToken={this.props.location.query.sptoken || this.props.location.query.token} onSubmit={this.validatePassword.bind(this)}>
	  <div spIf="form.error" className="alert alert-danger">
	    <span spBind="form.errorMessage" />
	  </div>
	  <div spIf="form.sent">
	    <p>Your new password has been set. Please <a href="/logout">login</a>.</p>
	  </div>
	  <div spIf="!form.sent">
	    <p className="hint">
	      You or someone on your behalf has requested a password change.  Please type in your
	      new password below.
	    </p>
	    <div className="form-group">
	      <label className="control-label visible-ie8 visible-ie9">Password</label>
	      <div className="input-icon">
		<input className="form-control placeholder-no-fix" type="password" autoComplete="off"
		       id="password" placeholder="Password" name="password" />
	      </div>
	    </div>
	    <div className="form-group">
	      <label className="control-label visible-ie8 visible-ie9">Re-type Your Password</label>
	      <div className="input-icon">
		<input className="form-control placeholder-no-fix" type="password" autoComplete="off"
		       placeholder="Re-type Your Password"
		       id="confirmPassword" name="confirmPassword" />
	      </div>
	    </div>
	    <div className="form-actions">
	      <button type="submit" id="register-submit-btn" className="btn btn-success uppercase pull-right">
		<span spIf="!form.processing">Submit</span>
		<span spIf="form.processing">Setting New Password...</span>
	      </button>
	    </div>
	  </div>
	</ChangePasswordForm>
      </BaseAuthPage>
    );
  }
}

ChangePasswordPage.contextTypes = {
  brand: React.PropTypes.object
};
