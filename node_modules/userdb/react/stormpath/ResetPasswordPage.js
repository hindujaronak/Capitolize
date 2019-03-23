import React from 'react';
import ReactDOM from 'react-dom';

import BaseAuthPage from './BaseAuthPage';
import { Link } from 'react-router';
import { ResetPasswordForm } from 'react-stormpath';

export default class ResetPasswordPage extends React.Component {

  render() {
    return (
      <BaseAuthPage pageTitle="Reset Password" formTitle="Reset Password" formClass="forget-form clearfix">
	<ResetPasswordForm {...this.props}>
	  <div spIf="form.sent">
	    <p>
	      We have sent a password reset link to the email address of the account that you specified.
	    </p>
	    <p>
	      Please check your email for this message, then click on the link.
	    </p>
	  </div>
	  <div spIf="!form.sent">
	    <h3 className="font-green">Forgot Password ?</h3>
	    <p> Enter your e-mail address below to reset your password. </p>
	    <div className="form-group">
	      <input className="form-control placeholder-no-fix form-group" type="text" autoComplete="off" placeholder="Email" id="email" name="email" />
	    </div>
	    <div className="form-actions">
	      <Link to="/login" id="back-btn" className="btn grey btn-default">Back</Link>
	      <button type="submit" className="btn blue btn-success uppercase pull-right">Submit</button>
	    </div>
	  </div>
	</ResetPasswordForm>
      </BaseAuthPage>
    );
  }
}
