var _ = require( 'lodash' );

module.exports = function( app, pwhash ) {
  var knex = require( 'knex' )( app.config );

  var lib = {};

  function inflate( o ) {
    if ( o.customData && ! ( o.customData instanceof Object ) ) o.customData = JSON.parse( o.customData );
    if ( o.roles ) {
      o.roles = o.roles.map( function( r ) { inflate( r ); return r; } );
    }
  }

  function deflate( o ) {
    if ( o.customData && ( o.customData instanceof Object ) ) o.customData = JSON.stringify( o.customData );
    if ( o.roles ) {
      o.roles = o.roles.map( function( r ) { deflate( r ); return r; } );
    }
  }

  // Utility for turning a joined table into a hierarchy of objects
  lib.joinMerge = function( rows, primary_table_name ) {
    var result = [];
    rows.forEach( function( row ) {
      var primary_table = row[ primary_table_name ];
      var found = _.find( result, function( item ) { return item.id == primary_table.id; } );
      if ( found ) primary_table = found;
      else result.push( primary_table );
      _.forIn( row, function( sub_table, sub_table_name ) {
	if ( sub_table_name == primary_table_name ) return;
	if ( ! primary_table[ sub_table_name ] ) {
          primary_table[ sub_table_name ] = [];
          if ( sub_table.id !== null )
            primary_table[ sub_table_name ].push( sub_table );
	}
	else {
          if ( sub_table.id === null ) return;
          var found = _.find( primary_table[ sub_table_name ], function( item ) {
            return item.id == sub_table.id;
          });
          if ( ! found ) primary_table[ sub_table_name ].push( sub_table );
	}
      });
    });
    return result;
  };

  // Return a user based on id.  User must be ENABLED.
  lib.findUserById = function( id, cb ) {
    knex( 'users' )
    .select( 'users.*', 'roles.*', 'accounts.*' )
    .options({ nestTables: true })
    .leftJoin( 'users_roles', 'users_roles.user_id', '=', 'users.id' )
    .leftJoin( 'roles', 'roles.id', '=', 'users_roles.role_id' )
    .join( 'accounts', 'accounts.id', '=', 'users.account_id' )
    .where({ 'users.id': id, 'users.status': 'ENABLED' })
    .then( function( rs ) {
      if ( ! rs.length ) return cb();
      var users = lib.joinMerge( rs, 'users' );
      if ( users[0] ) inflate( users[0] );
      return cb( null, users[0] );
    }).catch( cb );
  };

  // Return a user based on id.  Status does not matter.
  lib.findAnyUserById = function( id, cb ) {
    knex( 'users' )
    .select( 'users.*', 'roles.*', 'accounts.*' )
    .options({ nestTables: true })
    .leftJoin( 'users_roles', 'users_roles.user_id', '=', 'users.id' )
    .leftJoin( 'roles', 'roles.id', '=', 'users_roles.role_id' )
    .join( 'accounts', 'accounts.id', '=', 'users.account_id' )
    .where({ 'users.id': id })
    .then( function( rs ) {
      if ( ! rs.length ) return cb();
      var users = lib.joinMerge( rs, 'users' );
      if ( users[0] ) inflate( users[0] );
      return cb( null, users[0] );
    }).catch( cb );
  };

  // Return a user based on email or username.  User must be ENABLED.
  lib.findUserByName = function( username, cb ) {
    if ( username == undefined ) {
      app.log.error( 'findUserByName: username is not defined:', username );
      console.trace( 'here' );
      return cb( new Error( 'username is not defined' ) );
    }
    knex( 'users' )
    .select( 'users.*', 'roles.*', 'accounts.*' )
    .options({ nestTables: true })
    .leftJoin( 'users_roles', 'users_roles.user_id', '=', 'users.id' )
    .leftJoin( 'roles', 'roles.id', '=', 'users_roles.role_id' )
    .join( 'accounts', 'accounts.id', '=', 'users.account_id' )
    .where({'users.status': 'ENABLED'}).andWhere( function() {
      this.where({ 'users.email': username }).orWhere({'users.username': username });
    })
    .then( function( rs ) {
      if ( ! rs.length ) return cb();
      var users = lib.joinMerge( rs, 'users' );
      if ( users[0] ) inflate( users[0] );
      return cb( null, users[0] );
    }).catch( cb );
  };

  lib.removeUser = function( userId, cb ) {
    knex( 'users' ).where({ id: userId }).del().then( function() {
      cb();
    }).catch( cb );
  };

  // Save a user.  If password is included, it must already be hashed.
  lib.saveUser = function( user, cb ) {
    if ( user.password != undefined ) user.password_updated_on = Math.round( new Date().getTime() / 1000 );
    deflate( user );
    knex( 'users' ).where({ id: user.id }).update( user ).then( function() {
      return cb();
    }).catch( cb );
  };

  // Find users based on a simple query, ie. { email: address }
  //
  // Can optionally include options:
  //
  // { offset: 0, limit: 10, orderby: [ 'users.id', 'asc' ], searchString: '%foo%', withRoles: true, withAccounts: true, select: [ 'users.fullName', 'accounts.name', ... ] }
  //
  // If opts not defined, get back an array of users.
  // If opts is defined:
  //
  // { total: all-matched-num, users: [ ... ] }
  //
  lib.searchForUsers = function( query, opts, cb ) {
    if ( cb == undefined ) {
      cb = opts;
      knex( 'users' ).where( query ).then( function( rs ) {
	cb( null, rs.map( function( user ) { inflate( user ); return user; } ) );
      }).catch( cb );
    }
    else {
      var offset = ( opts.offset != undefined ? opts.offset : 0 );
      var limit  = ( opts.limit != undefined ? opts.limit : 100000 );
      var orderField = ( opts.orderby && opts.orderby.length ? opts.orderby[0] : 'fullName' );
      var orderDir = ( opts.orderby && opts.orderby.length ? opts.orderby[1] : 'asc' );
      var andWhere = '';
      if ( opts.searchString ) {
	andWhere = [ "users.givenName like '" + opts.searchString + "'",
		     "users.middleName like '" + opts.searchString + "'",
		     "users.surname like '" + opts.searchString + "'",
		     "users.username like '" + opts.searchString + "'",
		     "users.email like '" + opts.searchString + "'",
		     "users.status like '" + opts.searchString + "'" ].join( ' OR ' );
	if ( opts.withAccounts ) {
	  andWhere += " OR accounts.name like '" + opts.searchString + "'"; 
	}
	if ( opts.withRoles ) {
	  andWhere += " OR roles.name like '" + opts.searchString + "'"; 
	}
      }
      var cq = knex( 'users' ).count( 'users.id' );
      if ( opts.withAccounts ) cq = cq.join( 'accounts', 'accounts.id', '=', 'users.account_id' );
      if ( opts.withRoles ) {
	cq = cq.leftJoin( 'users_roles', 'users_roles.user_id', '=', 'users.id' );
	cq = cq.leftJoin( 'roles', 'roles.id', '=', 'users_roles.role_id' );
      }
      cq = cq.where( query ).andWhereRaw( andWhere );
      
      cq.then( function( rs ) {
	var count = rs[0]['count(`users`.`id`)'];
	var q = knex( 'users' );
	if ( opts.select ) q = q.select( opts.select );
	if ( opts.withAccounts || opts.withRoles ) q = q.options({ nestTables: true });
	if ( opts.withAccounts ) q = q.join( 'accounts', 'accounts.id', '=', 'users.account_id' );
	if ( opts.withRoles ) {
	  q = q.leftJoin( 'users_roles', 'users_roles.user_id', '=', 'users.id' );
	  q = q.leftJoin( 'roles', 'roles.id', '=', 'users_roles.role_id' );
	}
	q = q.where( query ).andWhereRaw( andWhere );
	q = q.limit( limit ).offset( offset );
	q = q.orderBy( orderField, orderDir );
	q.then( function( rs ) {
	  if ( opts.withAccounts || opts.withRoles )
	    rs = lib.joinMerge( rs, 'users' );
	  cb( null, {
	    total: count,
	    users: rs.map( function( user ) { inflate( user ); return user; } ),
	  });
	}).catch( cb );
      }).catch( cb );
    }
  };

  // Find users based on a search string.  See below.
  lib.searchForUsersQ = function( q, cb ) {
    var Q = '%'+q+'%';
    knex( 'users' )
    .where( 'givenName', 'like', Q )
    .orWhere( 'middleName', 'like', Q )
    .orWhere( 'surname', 'like', Q )
    .orWhere( 'username', 'like', Q )
    .orWhere( 'email', 'like', Q )
    .then( function( rs ) {
      cb( null, rs.map( function( user ) { inflate( user ); return user; } ) );
    }).catch( cb );
  };

  // Given a token, find the user with that token.
  lib.verifyPasswordResetToken = function( sptoken, cb ) {
    knex( 'users' ).where({ emailVerificationToken: sptoken }).then( function( rs ) {
      if ( ! rs.length ) return cb();
      else return cb( null, rs[0] );
    }).catch( cb );
  };

  // Given a user struct, find it and return it or create it if its not already in the db.
  lib.findOrCreateUser = function( user, password, cb ) {
    knex( 'users' ).where({ email: user.email }).then( function( rs ) {
      if ( rs.length ) {
	inflate( rs[0] );
	return cb( null, rs[0] );
      }
      pwhash( password, function( err, hash ) {
	if ( err ) return cb( err );
	user.password = hash;
	user.password_updated_on = Math.round( new Date().getTime() / 1000 );
	user.id = require( 'shortid' ).generate();
	if ( ! user.username ) user.username = user.email;
	if ( ! user.fullName ) {
          if ( ! user.middleName ) user.fullName = [ user.givenName, user.surname ].join( ' ' );
          else user.fullName = [ user.givenName, user.middleName, user.surname ].join( ' ' );
	}
	if ( ! user.status ) user.status = 'PENDING';
	deflate( user );
	knex( 'users' ).insert( user ).then( function() {
	  inflate( user );
          cb( null, user );
	}).catch( cb );
      });
    }).catch( cb );
  };

  // get the account for a user
  lib.getUserAccount = function( user, cb ) {
    lib.getAccounts({ 'accounts.id': user.account_id }, function( err, accounts ) {
      if ( err ) return cb( err );
      cb( null, accounts[0] );
    });
  }

  // get the users for an account
  lib.getAccountUsers = function( account, cb ) {
    lib.searchForUsers({ account_id: account.id }, cb );
  }

  // get all accounts.  where is optional. where={id: XX} will get a particular account
  lib.getAccounts = function( where, cb ) {
    if ( ! cb ) where = cb;
    knex( 'accounts' )
      .select( 'accounts.*', 'roles.*' )
      .options({ nestTables: true })
      .leftJoin( 'roles', 'roles.account_id', '=', 'accounts.id' )
      .where( where )
      .then( function( rs ) {
	var accounts = lib.joinMerge( rs, 'accounts' );
	cb( null, accounts.map( function( o ) { inflate(o); return o; } ) );
      }).catch( cb );
  }

  lib.searchForAccounts = function( opts, cb ) {
    var query = opts.where || {};
    var offset = ( opts.offset != undefined ? opts.offset : 0 );
    var limit  = ( opts.limit != undefined ? opts.limit : 100000 );
    var orderField = ( opts.orderby && opts.orderby.length ? opts.orderby[0] : 'name' );
    var orderDir = ( opts.orderby && opts.orderby.length ? opts.orderby[1] : 'asc' );
    var andWhere = '';
    if ( opts.searchString ) {
      andWhere = [ "accounts.name like '" + opts.searchString + "'",
                   "accounts.description like '" + opts.searchString + "'",
                   "accounts.status like '" + opts.searchString + "'" ].join( ' OR ' );
      if ( opts.withRoles ) {
        andWhere += " OR roles.name like '" + opts.searchString + "'"; 
      }
    }
    var cq = knex( 'accounts' ).count( 'accounts.id' );
    if ( opts.withRoles ) {
      cq = cq.leftJoin( 'accounts_roles', 'accounts_roles.account_id', '=', 'accounts.id' );
      cq = cq.leftJoin( 'roles', 'roles.id', '=', 'accounts_roles.role_id' );
    }
    cq = cq.where( query ).andWhereRaw( andWhere );
    
    cq.then( function( rs ) {
      var count = rs[0]['count(`accounts`.`id`)'];
      var q = knex( 'accounts' );
      if ( opts.select ) q = q.select( opts.select );
      if ( opts.withRoles ) q = q.options({ nestTables: true });
      if ( opts.withRoles ) {
        q = q.leftJoin( 'accounts_roles', 'accounts_roles.account_id', '=', 'accounts.id' );
        q = q.leftJoin( 'roles', 'roles.id', '=', 'accounts_roles.role_id' );
      }
      q = q.where( query ).andWhereRaw( andWhere );
      q = q.limit( limit ).offset( offset );
      q = q.orderBy( orderField, orderDir );
      q.then( function( rs ) {
        if ( opts.withRoles )
          rs = lib.joinMerge( rs, 'accounts' );
        cb( null, {
          total: count,
          accounts: rs.map( function( account ) { inflate( account ); return account; } ),
        });
      }).catch( cb );
    }).catch( cb );
  }

  // Given a account, find it and return it, or create it if its not already in the db
  lib.findOrCreateAccount = function( account, cb ) {
    knex( 'accounts' ).where({ name: account.name }).then( function( rs ) {
      if ( rs.length ) {
	inflate( rs[0] );
	return cb( null, rs[0] );
      }
      account.id = require( 'shortid' ).generate();
      deflate( account );
      knex( 'accounts' ).insert( account ).then( function() {
	inflate( account );
	cb( null, account );
      }).catch( cb );
    }).catch( cb );
  };

  // update or insert an account
  lib.upsertAccount = function( account, cb ) {
    if ( account.id ) {
      deflate( account );
      knex( 'accounts' ).where({ id: account.id }).update( account ).then( function() {
	knex( 'accounts' ).where({ id: account.id }).then( function( accounts ) {
	  inflate( accounts[0] );
	  cb( null, accounts[0] );
	}).catch( cb );
      }).catch( cb );
    }
    else {
      account.id = require( 'shortid' ).generate();
      deflate( account );
      knex( 'accounts' ).insert( account ).then( function() {
	knex( 'accounts' ).where({ id: account.id }).then( function( accounts ) {
	  inflate( accounts[0] );
	  cb( null, accounts[0] );
	}).catch( cb );
      }).catch( cb );
    }
  }

  lib.removeAccount = function( accountId, cb ) {
    knex( 'users' ).where({ account_id: accountId }).del().then( function() {
      knex( 'roles' ).where({ account_id: accountId }).del().then( function() {
	knex( 'accounts' ).where({ id: accountId }).del().then( function() {
	  cb();
	}).catch( cb );
      }).catch( cb );
    }).catch( cb );
  }

  // update or insert an role
  lib.upsertRole = function( role, cb ) {
    if ( role.id ) {
      deflate( role );
      knex( 'roles' ).where({ id: role.id }).update( role ).then( function() {
	knex( 'roles' ).where({ id: role.id }).then( function( roles ) {
	  inflate( roles[0] );
	  cb( null, roles[0] );
	}).catch( cb );
      }).catch( cb );
    }
    else {
      role.id = require( 'shortid' ).generate();
      deflate( role );
      knex( 'roles' ).insert( role ).then( function() {
	knex( 'roles' ).where({ id: role.id }).then( function( roles ) {
	  inflate( roles[0] );
	  cb( null, roles[0] );
	}).catch( cb );
      }).catch( cb );
    }
  }

  lib.removeRole = function( roleId, cb ) {
    knex( 'roles' ).where({ id: roleId }).del().then( function() {
      cb();
    }).catch( cb );
  }

  lib.searchForRoles = function( opts, cb ) {
    var query = opts.where || {};
    var offset = ( opts.offset != undefined ? opts.offset : 0 );
    var limit  = ( opts.limit != undefined ? opts.limit : 100000 );
    var orderField = ( opts.orderby && opts.orderby.length ? opts.orderby[0] : 'name' );
    var orderDir = ( opts.orderby && opts.orderby.length ? opts.orderby[1] : 'asc' );
    var andWhere = '';
    if ( opts.searchString ) {
      andWhere = [ "roles.name like '" + opts.searchString + "'",
                   "roles.description like '" + opts.searchString + "'",
                   "roles.status like '" + opts.searchString + "'" ].join( ' OR ' );
    }
    var cq = knex( 'roles' ).count( 'roles.id' );
    cq = cq.where( query ).andWhereRaw( andWhere );
    
    cq.then( function( rs ) {
      var count = rs[0]['count(`roles`.`id`)'];
      var q = knex( 'roles' );
      if ( opts.select ) q = q.select( opts.select );
      q = q.where( query ).andWhereRaw( andWhere );
      q = q.limit( limit ).offset( offset );
      q = q.orderBy( orderField, orderDir );
      q.then( function( rs ) {
        cb( null, {
          total: count,
          roles: rs.map( function( role ) { inflate( role ); return role; } ),
        });
      }).catch( cb );
    }).catch( cb );
  }

  lib.changeAccountStatus = function( accountId, newStatus, cb ) {
    // If account => DISABLED, then set all users to DISABLED
    // If account => ENABLED then all users are set to ENABLE
    knex( 'accounts' ).where({ id: accountId }).update({ status: newStatus }).then( function() {
      knex( 'users' ).where({ account_id: accountId }).update({ status: newStatus }).then( function() {
	cb();
      }).catch( cb );
    }).catch( cb );
  }
  
  // Given a role, find it and return it, or create it if its not already in the db
  lib.findOrCreateRole = function( role, cb ) {
    if ( ! role.account_id ) return cb( new Error( 'role.account_id is required' ) );
    knex( 'roles' ).where({ name: role.name, account_id: role.account_id }).then( function( rs ) {
      if ( rs.length ) {
	inflate( rs[0] );
	return cb( null, rs[0] );
      }
      role.id = require( 'shortid' ).generate();
      deflate( role );
      knex( 'roles' ).insert( role ).then( function() {
	inflate( role );
	cb( null, role );
      }).catch( cb );
    }).catch( cb );
  };

  // Add a role to a user.  If the user already has it, nothing happens.  The role
  // must already exist.
  lib.addRoleToUser = function( role, user, cb ) {
    knex( 'users_roles' ).where({ user_id: user.id, role_id: role.id }).then( function( rs ) {
      if ( rs.length ) return cb();
      knex( 'users_roles' ).insert({ user_id: user.id, role_id: role.id }).then( function() {
	return cb();
      }).catch( cb );
    }).catch( cb );
  };

  // remove a role from a user
  lib.removeRoleFromUser = function( role, user, cb ) {
    knex( 'users_roles' ).where({ user_id: user.id, role_id: role.id }).del().then( function() {
      cb();
    }).catch( cb );
  }

  lib.rememberPassword = function( user, cb ) {
    knex( 'old_passwords' ).insert({ user_id: user.id, password: user.password }).then( function() {
      cb();
    }).catch( cb );
  };

  lib.getOldPasswords = function( user, nMostRecent, cb ) {
    knex( 'old_passwords' ).where({ user_id: user.id }).orderBy( 'created_date', 'desc' ).limit( nMostRecent ).then( function( rs ) {
      cb( null, rs.map( function( u ) { return u.password; } ) );
    }).catch( cb );
  };

  return lib;
};

  
