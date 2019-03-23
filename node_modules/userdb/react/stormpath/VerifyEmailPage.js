import React from 'react';
import ReactDOM from 'react-dom';

import BaseAuthPage from './BaseAuthPage';
import { Link } from 'react-router';
import { LoginLink } from 'react-stormpath';
import { context } from 'react-stormpath';

import utils from '../lib/utils';

import { set } from 'lodash';

export default class VerifyEmailPage extends React.Component {

  state = {
    verifyStatus: 'VERIFYING',
    verifyError: null,
    profileStatus: '',
    account: {},
  };

  componentDidMount() {
    this.view = $(ReactDOM.findDOMNode(this));

    // Verify the sptoken
    utils.makeRequest( '/welcome', { sptoken: this.props.location.query.sptoken, token: this.props.location.query.token } ).then( (res) => {
      this.setState({ account: res, verifyStatus: 'VERIFIED' });
    }).fail( (err) => {
      this.setState({ verifyStatus: 'ERROR', verifyError: 'The email link you are trying to verify has expired.' });
    });
  }

  onFormSubmit( e ) {
    e.preventDefault();
    $('.verify', this.view).hide();

    if ( this.state.verifyStatus == 'ERROR' )
      return this.setState({ formError: 'Cannot submit form data.  The email link verification has failed.' });
    
    this.setState({ formError: null });
    
    if ( ! $('input[name="tnc"]').prop('checked') ) {
      return this.setState({ formError: 'You must agree to the Terms of Service and Privacy Policy'});
    }

    if ( ! ( this.state.account.givenName &&
	     this.state.account.surname &&
	     this.state.account.email ) ) {
	       return this.setState({ formError: 'First and last name and email fields are required.' });
    }

    if ( ! ( this.state.account.password && this.state.account.confirmPassword ) ) {
      return this.setState({ formError: 'One or both password fields are missing.' });
    }

    if ( this.state.account.password != this.state.account.confirmPassword ) {
      return this.setState({ formError: 'Password fields do not match.' });
    }

    this.setState({ profileStatus: 'SUBMITTING' });
    utils.makeRequest( '/users/check_password', { password: this.state.account.password } ).then( (res) => {
      if ( ! res.good ) return this.setState({ formError: res.error });
      utils.makeRequest( '/welcomed', this.state.account ).then( (res) => {
	this.setState({ profileStatus: 'SUBMITTED' });
	// The account has changed.  Now lets do the login
	utils.makeRequest( '/login', { username: this.state.account.email, login: this.state.account.email, password: this.state.account.password }).then( (res) => {
	  var router = context.getRouter();
	  var homeRoute = router.getHomeRoute();
	  var authenticatedHomeRoute = router.getAuthenticatedHomeRoute();
	  var redirectTo = (authenticatedHomeRoute || {}).path || (homeRoute || {}).path || '/';
	  /* 
	     router.history.pushState( null, redirectTo );
	     =>> pushState() does not work. Dont know why.
	   */
	  window.location = redirectTo;
	}).fail( (err) => {
	  this.setState({ formError: utils.responseErrorText( err ) });
	});
      }).fail( (err) => {
	this.setState({ profileStatus: 'SUBMITTED', formError: utils.responseErrorText( err ) });
      });
    }).fail( (err) => {
      this.setState({ profileStatus: 'SUBMITTED', formError: utils.responseErrorText( err ) });
    });
  }

  onInputChange( e ) {
    var account = this.state.account;
    _.set( account, $(e.target).attr('name'), e.target.value );
    this.setState({ account: account });
  }

  render() {

    var verifyMessage;
    var formMessage;

    if ( this.state.verifyStatus == 'VERIFYING' ) {
      verifyMessage = <div className="verify alert alert-warning">Verifying email address ...</div>;
    }
    else if ( this.state.verifyStatus == 'VERIFIED' ) {
      verifyMessage = <div className="verify alert alert-success">Email address verified!</div>;
    }
    else if ( this.state.verifyStatus == 'ERROR' ) {
      verifyMessage = <div className="verify alert alert-danger">{this.state.verifyError}</div>;
    }

    if ( this.state.formError ) {
      formMessage = <div className="formMessage alert alert-danger">{this.state.formError}</div>;
    }
    else formMessage = null;

    if ( this.context.checkPassword ) {
      var v = this.context.checkPassword( '', this.context.brand.passwordPolicy );
    }
    else {
      var v = {};
    }
    return (
      <BaseAuthPage pageTitle="Welcome" formTitle="Welcome to %APP%" formClass="welcome-form clearfix" bodyClass="welcome-page">
	<form onSubmit={this.onFormSubmit.bind(this)} autoLogin={true}>
	  {verifyMessage}
	  {formMessage}
	  <p className="hint">
	    You have been registered for access.  To complete registration,
	    please verify/change your personal details and create a password. {v.error}.
	  </p>
	  <div className="form-group">
	    <label htmlFor="givenName" className="control-label visible-ie8 visible-ie9">First Name</label>
	    <input className="form-control placeholder-no-fix" type="text" autoComplete="off"
		   onChange={this.onInputChange.bind(this)}
		   value={this.state.account.givenName}
		   id="givenName" placeholder="First Name" name="givenName" />
	  </div>
	  <div className="form-group">
	    <label htmlFor="surname" className="control-label visible-ie8 visible-ie9">Last Name</label>
	    <input className="form-control placeholder-no-fix" type="text" autoComplete="off"
		   onChange={this.onInputChange.bind(this)}
		   value={this.state.account.surname}
		   id="surname" placeholder="Last Name" name="surname" />
	  </div>
	  <div className="form-group">
	    <label htmlFor="email" className="control-label visible-ie8 visible-ie9">Email Address</label>
	    <input className="form-control placeholder-no-fix" type="email" autoComplete="off"
		   onChange={this.onInputChange.bind(this)}
		   value={this.state.account.email}
		   id="email" placeholder="Email Address" name="email" />
	  </div>
	  <div className="form-group">
	    <label htmlFor="password" className="control-label visible-ie8 visible-ie9">Password</label>
	    <input className="form-control placeholder-no-fix" type="password" autoComplete="off"
		   onChange={this.onInputChange.bind(this)}
		   id="password" placeholder="Password" name="password" />
	  </div>
	  <div className="form-group">
	    <label htmlFor="confirmPassword" className="control-label visible-ie8 visible-ie9">Re-type Your Password</label>
	    <input className="form-control placeholder-no-fix" type="password" autoComplete="off"
		   placeholder="Re-type Your Password"
		   onChange={this.onInputChange.bind(this)}
		   id="confirmPassword" name="confirmPassword" />
	  </div>
	  <div className="form-group margin-top-20 margin-bottom-20">
	    <div className="checkbox">
	      <label>
		<input onChange={this.onInputChange.bind(this)} type="checkbox" name="tnc" /> I agree to the <a href={this.context.brand.TOS}>
		  Terms of Service </a>
		&amp; <a href={this.context.brand.PP}>
		  Privacy Policy </a>
	      </label>
	    </div>
	  </div>
	  <div className="form-actions clearfix">
	    <button type="submit" id="register-submit-btn" className="btn btn-success uppercase pull-right">
	      <span>{ this.state.profileStatus == 'SUBMITTING' ? 'Submitting changes...' : 'Submit'}</span>
	    </button>
	  </div>
	</form>
      </BaseAuthPage>
    );
  }
}

VerifyEmailPage.contextTypes = {
  brand: React.PropTypes.object
};
