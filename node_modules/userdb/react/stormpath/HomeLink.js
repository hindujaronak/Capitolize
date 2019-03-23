import React from 'react';
import { context } from 'react-stormpath';

export default class HomeLink extends React.Component {
  render() {
    var router = context.getRouter();
    var homeRoute = ( router.getHomeRoute() || {} ).path || '/';
    return(
      <a href={homeRoute} {...this.props}>
	{ this.props.children ? this.props.children : 'Home' }
      </a>
    );
  }
}
