var _ = require( 'lodash' );

module.exports = function( app, udb ) {

  app.post( '/accounts/select_list', udb.authenticated, udb.authorized( ['super-admin'] ), function( req, res, next ) {

    if ( ! req.user.has( 'super-admin' ) ) {
      return res.jsonp({ options: [], complete: true });
    }

    var where = {};
    if ( req.body.q && req.body.q.length ) {
      where = [ 'accounts.name', 'like', '%'+req.body.q+'%' ];
    }

    udb.getAccounts( where, function( err, list ) {
      if ( err ) return next( err );
      var complete = ( ! ( req.body.q && req.body.q.length ) );
      mapped = _.map( list, function( a ) {
	return { label: a.name, value: a.id, roles: _.map( a.roles, function( r ) { return { label: r.name, value: r.id }; } ) };
      });
      var sorted = _.sortBy( mapped, 'label' );
      res.jsonp({ options: sorted, complete: complete });
    });
  });

  app.post( '/accounts/roles_for_account', udb.authenticated, udb.authorized( ['super-admin', 'admin'], false ), function( req, res, next ) {
    if ( req.body.accountId == undefined ) return res.jsonp([]);
    udb.getAccounts({ 'accounts.id': req.body.accountId }, function( err, accounts ) {
      if ( err ) return next( err );
      res.jsonp( accounts[0].roles );
    });
  });

  app.post( '/accounts/list', udb.authenticated, udb.authorized( ['super-admin', 'admin'], false ), function( req, res, next ) {
    // If the user is not super-admin, return only the admin user's account
    if ( ! req.user.has( 'super-admin' ) ) {
      accountId = req.user.accounts[0].id;
      req.body.where = { id: accountId };
    }
    udb.searchForAccounts( req.body, function( err, accounts ) {
      if ( err ) return next( err );
      return res.jsonp( accounts );
    });
  });

  app.post( '/accounts/change_account_status', udb.authenticated, udb.authorized( ['super-admin', 'admin'], false ), function( req, res, next ) {
    var accountId = req.body.accountId;
    if ( ! req.user.has( 'super-admin' ) && ( accountId != req.user.accounts[0].id ) ) {
      return res.status( 403 ).send( 'User does not have permission to perform this task' );
    }
    // changes the status if the account.  not sure what this means... => DISABLED maybe should mean
    // to change all the users to DISABLED, and => ENABLED to change all the users to ENABLED.
    udb.changeAccountStatus( accountId, req.body.status, function( err ) {
      if ( err ) return next( err );
      res.jsonp();
    });
  });

  app.post( '/accounts/remove', udb.authenticated, udb.authorized( ['super-admin', 'admin'], false ), function( req, res, next ) {
    var accountId = req.body.accountId;
    if ( ! req.user.has( 'super-admin' ) && ( accountId != req.user.accounts[0].id ) ) {
      return res.status( 403 ).send( 'User does not have permission to perform this task' );
    }
    // Remove the account, its roles and all users belonging to this account
    udb.removeAccount( accountId, function( err ) {
      if ( err ) return next( err );
      res.jsonp();
    });
  });

  app.post( '/accounts/update', udb.authenticated, udb.authorized( ['super-admin', 'admin'], false ), function( req, res, next ) {
    var accountId = req.body.id;
    if ( ! req.user.has( 'super-admin' ) && ( accountId != req.user.accounts[0].id ) ) {
      return res.status( 403 ).send( 'User does not have permission to perform this task' );
    }
    var account = { id: accountId };
    [ 'name', 'description', 'status', 'customData' ].forEach( function( p ) {
      account[p] = req.body[p];
    });

    udb.upsertAccount( account, function( err, account ) {
      if ( err ) return next( err );
      // if this is a new account, create an admin role
      udb.findOrCreateRole({ name: 'admin', account_id: account.id }, function( err, role ) {
	if ( err ) return next( err );
	res.jsonp( account );
      });
    });
    
  });
}

