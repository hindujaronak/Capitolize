var _ = require( 'lodash' );
module.exports = function( app ) {
  var config = app.config;
  return function( user ) {
    if ( user.status == undefined ) user.status = 'ENABLED';
    user.href = config.accounts_href + '/' + user.id;
    user.groups = {
      href: user.href + '/groups',
      items: _.map( user.roles, function( role ) {
	return {
          href: config.groups_href + '/' + role.id,
          description: role.description,
          name: role.name,
          status: role.status || 'ENABLED',
          customData: role.customData,
	};
      }),
    };
    
    return user;
  }
};
