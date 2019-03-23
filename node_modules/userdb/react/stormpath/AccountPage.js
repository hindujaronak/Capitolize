import React from 'react';
import ReactDOM from 'react-dom';
import GlobalSideEffects from '../components/GlobalSideEffects';

import { UserProfileForm } from 'react-stormpath';

export default class AccountPage extends React.Component {

  static contextTypes = {
    brand: React.PropTypes.object,
  };
  
  loading( busy ) {
  }

  backstretch() {
    $('.backstretch', this.view).backstretch([
      this.context.brand.backstretch[1]
    ], {
      fade: 1000,
      duration: 8000
    });
  }

  componentDidMount() {
    this.view = $(ReactDOM.findDOMNode(this));
    $('form', this.view).addClass( 'form-horizontal' ).addClass( 'account-form' );
    head.load([
      "/vendor/backstretch/jquery.backstretch.min.js"
    ], () => {
      this.backstretch();
    });
  }

  componentWillUnmount() {
    $('.backstretch', this.view).backstretch( 'destroy' );
  }

  submit( e, next ) {
    var err = false;
    [ 'givenName', 'surname', 'email' ].forEach( (field) => {
      if ( ! e.data[ field ] || e.data[ field ] == '' ) {
        err = true;
      }
    });
    if ( err ) return next( new Error( 'First, last and email require values.' ) );

    if ( e.data.password ) {
      if ( e.data.password != e.data.rpassword ) {
        return next( new Error( 'The password fields do not match' ) );
      }
    }
    next();
  }

  render() {
    return(
      <GlobalSideEffects title="Account Settings" bodyClass="no-padding">
	<div className="login" style={{backgroundColor: "white"}}>
          <div className="user-login-5">
            <div className="row bs-reset">
              <div className="col-md-6 bs-reset">
                <div className="login-bg" style={{backgroundImage: 'url(' + this.context.brand.backstretch[1] + ')'}}></div>
              </div>
              <div className="col-md-6 login-container bs-reset">
                <div className="login-content">
                  <UserProfileForm onSubmit={this.submit.bind(this)}>
                    <div className="form-group">
                      <label htmlFor="firstname" className="control-label col-sm-4 col-lg-3">First Name</label>
                      <div className="col-sm-8 col-lg-9">
                        <input type="text" name="givenName" className="form-control"  />
                      </div>
                    </div>
                    <div className="form-group">
                      <label htmlFor="lastname" className="control-label col-sm-4 col-lg-3">Last Name</label>
                      <div className="col-sm-8 col-lg-9">
                        <input type="text" name="surname" className="form-control" />
                      </div>
                    </div>
                    <div className="form-group">
                      <label htmlFor="email" className="control-label col-sm-4 col-lg-3">Email Address</label>
                      <div className="col-sm-8 col-lg-9">
                        <input name="email" type="email" className="form-control" />
                      </div>
                    </div>
                    <div className="form-group">
                      <label htmlFor="password" className="control-label col-sm-4 col-lg-3">New Password</label>
                      <div className="col-sm-8 col-lg-9">
                        <input name="password" type="password" className="form-control" />
                      </div>
                    </div>
                    <div className="form-group">
                      <label htmlFor="rpassword" className="control-label col-sm-4 col-lg-3">Confirm New Password</label>
                      <div className="col-sm-8 col-lg-9">
                        <input name="rpassword" type="password" className="form-control" />
                      </div>
                    </div>
                    <div className="formGroup" >
                      <div spIf="form.error" className="verify alert alert-danger">
                        <span spBind="form.errorMessage" />
                      </div>
                      <div spIf="form.successful" className="verify alert alert-success">
                        Profile updated.
                      </div>
                    </div>
                    <div className="form-group">
                      <div className="col-sm-offset-4 col-sm-8 col-lg-offset-3 col-lg-9">
                        <button type="submit" className="btn btn-primary">Submit Changes</button>
                      </div>
                    </div>
                  </UserProfileForm>
		</div>
                <div className="login-footer">
                  <div className="row bs-reset">
                    <div className="col-xs-5 bs-reset">
                    </div>
                    <div className="col-xs-7 bs-reset">
                      <div className="login-copyright text-right">
                        <p>Copyright © {this.context.brand.copyright.company} {this.context.brand.copyright.year}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </GlobalSideEffects>
    );
  }
}

