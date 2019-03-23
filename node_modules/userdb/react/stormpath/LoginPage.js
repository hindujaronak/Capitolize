import React from 'react';
import ReactDOM from 'react-dom';

import BaseAuthPage from './BaseAuthPage';
import { Link } from 'react-router';
import { LoginForm } from 'react-stormpath';

export default class LoginPage extends React.Component {

  state = {
    showError: false,
    errorMessage: {}
  };

  onSubmit = ( e, next ) => {
    this.setState({ showError: false });
    next();
  }
  
  onError = ( e, next ) => {
    this.setState({
      showError: true,
      errorMessage: { __html: e.error }
    });
    next();
  }

  createErrorMarkup = () => {
    return this.state.errorMessage;
  }

  render() {
    return (
      <BaseAuthPage pageTitle="Login" formTitle="%APP% Login" formClass="login-form clearfix">
	<LoginForm {...this.props} onSubmit={this.onSubmit} onSubmitError={this.onError}>
	  { this.state.showError ? <div className="alert alert-danger" dangerouslySetInnerHTML={this.createErrorMarkup()} /> : <span></span> }
	  <div className="row">
	    <div className="col-xs-6">
	      <input className="form-control form-control-solid placeholder-no-fix form-group"
		     type="text" autoComplete="false" placeholder="Username"
		     id="username" name="username" required />
	    </div>
	    <div className="col-xs-6">
	      <input className="form-control form-control-solid placeholder-no-fix form-group"
		     type="password" autoComplete="false" placeholder="Password"
		     id="password" name="password" required />
	    </div>
	  </div>
	  <div className="row">
	    <div className="col-sm-4">
	    </div>
	    <div className="col-sm-8 text-right">
	      <div className="forgot-password">
		<Link to="/forgot" className="forget-password">Forgot Password?</Link>
	      </div>
	      <button className="btn blue btn-success" type="submit">Sign In</button>
	    </div>
	  </div>
	</LoginForm>
      </BaseAuthPage>
    );
  }
}

