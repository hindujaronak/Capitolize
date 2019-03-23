import React from 'react';
import ReactDOM from 'react-dom';
import GlobalSideEffects from '../components/GlobalSideEffects';

class BaseAuthPage extends React.Component {

  static contextTypes = {
    brand: React.PropTypes.object,
  };

  componentDidMount() {
    this.view = $(ReactDOM.findDOMNode( this ));
    head.load([
      "/vendor/backstretch/jquery.backstretch.min.js"
    ], () => {
      $('.login-bg', this.view).backstretch( this.context.brand.backstretch, {
	fade: 1000,
	duration: 4000
      });
    });
  }

  componentWillUnmount() {
    $('.login-bg', this.view).backstretch( 'destroy' );
  }

  render() {
    var title = ( this.props.formTitle || '' ).replace( '%APP%', this.context.brand.appName );
    var pageTitle = this.props.pageTitle || 'Auth';
    var bodyClass = this.props.bodyClass || '';
    return (
      <GlobalSideEffects title={pageTitle} bodyClass={bodyClass}>
        <div className="login" style={{backgroundColor: "white"}}>
          <div className="user-login-5">
            <div className="row bs-reset">
              <div className="col-md-6 bs-reset">
                <div className="login-bg" style={{backgroundImage: 'url(' + this.context.brand.backstretch[0] + ')'}}>
		  <img className="login-logo" src={this.context.brand.loginLogo} />
                </div>
              </div>
              <div className="col-md-6 login-container bs-reset">
                <div className="login-content">
                  <h1>{title}</h1>
                  <div className={this.props.formClass}>{this.props.children}</div>
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

export default BaseAuthPage;
