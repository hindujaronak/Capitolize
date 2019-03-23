var _ = require( 'lodash' );

module.exports = function( app, udb ) {

  app.post( '/roles/list', udb.authenticated, udb.authorized( ['super-admin'] ), function( req, res, next ) {
    udb.searchForRoles( req.body, function( err, roles ) {
      if ( err ) return next( err );
      res.jsonp( roles );
    });
  });

  app.post( '/roles/remove', udb.authenticated, udb.authorized( ['super-admin', 'admin'], false ), function( req, res, next ) {
    udb.removeRole( req.body.roleId, function( err ) {
      if ( err ) return next( err );
      res.jsonp();
    });
  });

  app.post( '/roles/update', udb.authenticated, udb.authorized( ['super-admin', 'admin'], false ), function( req, res, next ) {
    var role = { id: req.body.id };
    [ 'name', 'description', 'status', 'customData', 'account_id' ].forEach( function( p ) {
      role[p] = req.body[p];
    });

    udb.upsertRole( role, function( err, role ) {
      if ( err ) return next( err );
      res.jsonp( role );
    });
  });
}

