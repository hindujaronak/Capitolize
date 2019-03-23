var yaml = require( 'js-yaml' );
var fs = require( 'fs' );
var _ = require( 'lodash' );
var path = require( 'path' );

var async = require( 'async' );

var session = require( 'express-session' );
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

// This is used to respond to requests with errors.
function HttpError( req, status, message ) {
  this.constructor.prototype.__proto__ = Error.prototype;
  Error.captureStackTrace(this, this.constructor);
  this.name = this.constructor.name;
  this.message = message;
  this.status = status;

  if (( req.accepts(['html', 'json'] ) === 'json' ) || req.xhr ) {
    this.message = JSON.stringify({ status: this.status, message: this.message });
  }
}

var UserDB = function() {
  this._id = require( 'shortid' ).generate();
  this._config = {};
}

// This is for logging events (forgot password, verify account, authentication, etc.
// Can be used to justify HIPPA compliance.
// Generates:
//
//    *type*: UserDB: *arguments*
//
UserDB.prototype.logEvent = function() {
  var args = [];
  for(var i = 0; i < arguments.length; i++) {
    args.push(arguments[i]);
  }
  var type = args.shift();
  args.unshift( 'UserDB:' );
  this.log[ type ].apply( null, args );
}

UserDB.prototype.initialize = function( app, _config ) {
  var self = this;
  
  // grab the defaults
  var defaults = yaml.safeLoad( fs.readFileSync( path.join( __dirname, 'defaults.yml' ), 'utf8' ) );

  // merge the defaults with the incoming options into a config
  self._config = {};
  _.merge( self._config, defaults, _config );

  // deal with the logger
  if ( self.config().logger ) {
    self.log = self.config().logger;
  }
  else {
    self.log = require( 'winston' );
  }

  // some utility functions
  self.utils = require( './utils' )({ log: self.log, config: self.config() });

  // instanciate the database driver
  try {
    self._db = require( path.join( __dirname, 'database-drivers', self.config().database.driver ) )({ log: self.log, config: self.config().database.options }, self.createPasswordHash.bind(this) );
  }
  catch( err ) {
    throw( err );
  }

  // instanciate the transformer
  if ( self.config().transformer ) {
    if ( self.config().transformer instanceof Function ) {
      self._transformer = self.config().transformer;
    }
    else {
      try {
	self._transformer = require( path.join( __dirname, 'transformers', self.config().transformer ) )({ log: self.log, config: self.config() });
      }
      catch( err ) {
	throw( err );
      }
    }
  }
  else {
    self._transformer = function( user ) {
      return user;
    };
  }

  self.transformer = function( user ) {
    // remove any maintanence properties that a client shouldn't see
    [ 'password_updated_on', 'last_login_on', 'last_failed_login_on', 'failed_login_count' ].forEach( function( key ) {
      delete user[ key ];
    });
    // call the client-installed transformer (ie stormpath)
    return this._transformer( user );
  }

  /*
     Everything from here on down presumes that express is being used.  Passport, session,
     endpoints, etc.
   */
  var isExpress = false;
  if ( app.use instanceof Function )
    isExpress = true;
  
  if ( isExpress ) {
    // Install the session for passport
    //
    // If maxAge is set, honor it.  Else, if the config sessionsExpireInSeconds is
    // set and non-zero, use that for maxAge.  Else leave it alone (sessions won't expired).
    //
    if ( ! self.config().session.cookie ) {
      // establish defaults as stated in express-session doc, except for maxAge
      self.config().session.cookie = { path: '/', httpOnly: true, secure: false };
    }
    if ( self.config().session.cookie.maxAge == undefined ) {
      if ( self.config().sessionsExpireInSeconds ) {
	self.config().session.cookie.maxAge = self.config().sessionsExpireInSeconds * 1000;
      }
    }
    app.use( session( self.config().session ) );

    // passport
    app.use(passport.initialize());
    app.use(passport.session());

    // The serializer/deserializer
    passport.serializeUser( function( user, done ) {
      if ( ! user.id ) user.id = require( 'path' ).basename( user.href );
      done(null, user.id);
    });
  
    passport.deserializeUser( function( id, done ) {
      self.findUserById( id, function( err, user ) {
	if ( err ) return done( err );
	if ( user ) delete user.password;
	if ( user ) self.addUserHelpers( user );
	done( null, user );
      });
    });
  
    // Install the "local" strategy
    passport.use( "local", new LocalStrategy(
      { usernameField: 'login', passwordField: 'password' },
      function( username, password, done ) {
	self.findUserByName( username, function( err, user ) {
          if ( err ) return done( err, false );
          if ( ! user ) return done( null, false, { message: 'User not found' } );
          self.verifyPassword( user, password, function( err ) {
            if ( err ) return done( err, false );
            delete user.password;
	    self.addUserHelpers( user );
            return done( null, user );
          });
	});
      }
    ));
    
    // Install any other user-supplied strategies
    if ( self.config().strategies ) {
      self.config().strategies({ log: self.log, config: self.config() }, self.verifyPassword );
    }

    if ( self.config().debugEndpoints ) {
      // install a middleware function for tracing incoming requests
      app.use( self.utils.tracer() );
    }

    // Install workflow endpoints
    if ( self.config().endpoints.login.enabled ) {
      app.post( self.config().endpoints.login.uri, self.authenticated, function( req, res, next ) {
	self.logEvent( 'info', 'login:', req.user.email );
	if ( self.config().endpoints.expired.enabled &&
	     ( ( Math.round( new Date().getTime() / 1000 ) - req.user.password_updated_on ) > self.config().passwordsExpireInSeconds ) ) {
	       req.user.password_expired = true; // This will be used by the UX to redirect the user to a password change form after a successful login
	}
	res.json({ account: req.user });
      });
    }
    
    if ( self.config().endpoints.me.enabled ) {
      app.get( self.config().endpoints.me.uri, self.authenticated, function( req, res, next ) {
	if ( self.config().endpoints.expired.enabled &&
	     ( ( Math.round( new Date().getTime() / 1000 ) - req.user.password_updated_on ) > self.config().passwordsExpireInSeconds ) ) {
	       req.user.password_expired = true; // This will be used by the UX to redirect the user to a password change form after a successful login
	}
	res.json({ account: req.user });
      });
    }
    
    if ( self.config().endpoints.logout.enabled ) {
      app.all( self.config().endpoints.logout.uri, self.authenticated, function( req, res, next ) {
	self.logEvent( 'info', 'logout:', req.user.email );
	req.logout();
	res.status( 200 ).end();
      });
    }

    /**
     * This controller either  prompts a user to 'resend' their account verification email,
     * or verifies the sptoken in the URL that the user has arrived with
     *
     * This can only happen if a user has registered with the account verification
     * workflow enabled, and then clicked the link in their email which redirects
     * them to this controller.
     *
     **/
    if ( self.config().endpoints.verify.enabled ) {
      app.post( self.config().endpoints.verify.uri, function( req, res, next ) {
	// This is a resend
	var email = req.body.email || req.body.username || req.body.login; // login is used by stormpath
	self.findUserByName( email, function( err, user ) {
          if ( err ) return next( new HttpError( req, 400, 'Cannot find user:' + err.message ) );
          if ( ! user ) return next(); // We don't want to leak information about the account list, so allow this without error.
          var u = { id: user.id || require( 'path' ).basename( user.href ) };
          u.status = 'PENDING';
          u.emailVerificationToken = self.utils.createToken({ email: email }, self.config().accountVerificationTokenExpire );
          u.email = user.email;
          self.saveUser( u, function( err ) {
            if ( err ) return next( new HttpError( req, 400, err.message ) );
            user.emailVerificationToken = u.emailVerificationToken;
            self.sendAccountVerificationEmail( user, function( err ) {
              if ( err ) self.log.error( err );
              if ( err ) return next( new HttpError( req, 400, err.message ) );
              res.json( user );
            });
          });
	});
      });

      app.get( self.config().endpoints.verify.uri, function( req, res, next ) {
	// This is a verification
	var sptoken = req.query.sptoken;
	self.verifyAccount( sptoken, function( err, user ) {
          if ( err ) return next( new HttpError( req, 400, 'Account validation failed:' + err.message ) );
          if ( ! user ) return next( new HttpError( req, 400, 'Account validation failed: no such user' ) );
	  self.logEvent( 'info', 'new account validated:', user.email );
          next();
	});
      });
    }

    if ( self.config().endpoints.forgot.enabled ) {
      app.all( self.config().endpoints.forgot.uri, function( req, res, next ) {
	var email = req.query.email || req.body.email ||
                    req.query.username || req.body.username ||
		    req.query.login || req.body.login;
	self.findUserByName( email, function( err, user ) {
          if ( err ) return next( new HttpError( req, 400, 'Cannot find user:' + err.message ) );
          if ( ! user ) return res.end(); // NO ERROR to prevent user sniffing
	  self.logEvent( 'info', 'forgot password:', email );
          var u = { id: user.id || require( 'path' ).basename( user.href ) };
          u.emailVerificationToken = self.utils.createToken({ email: email }, self.config().passwordResetTokenExpire );
          u.email = user.email;
          self.saveUser( u, function( err ) {
            if ( err ) return next( new HttpError( req, 400, err.message ) );
            user.emailVerificationToken = u.emailVerificationToken;
            self.sendForgotPasswordEmail( user, function( err ) {
              if ( err ) self.log.error( err );
              if ( err ) return next( new HttpError( req, 400, err.message ) );
              if ( req.method == 'GET' )
		next();
              else
		res.end();
            });
          });
	});
      });

      // and the admin controllers (add/edit/remove accounts/roles/users
      require( './controllers' )( app, self );
    }

    /**
     * Allow a user to change his password.
     *
     * This can only happen if a user has reset their password, received the
     * password reset email, then clicked the link in the email which redirects them
     * to this controller.
     *
     **/
    if ( self.config().endpoints.change.enabled ) {
      app.all( self.config().endpoints.change.uri, function( req, res, next ) {
	var sptoken = req.query.sptoken || req.body.sptoken;
	var password = req.query.password || req.body.password;
	self.verifyPasswordResetToken( sptoken, function( err, user ) {
          if ( err ) return next( new HttpError( req, 400, 'Password reset token validation failed: ' + err.message ) );
          if ( ! user ) return next( new HttpError( req, 400, 'Password reset token validation failed' ) );
          
          // For GET requests, respond with 200 OK if the token is valid.
          if (req.method === 'GET') {
            return next();
          }
	  self.ensurePasswordUnique( user, password, function( err, status ) {
	    if ( err ) return next( new HttpError( req, 400, 'Something bad happened: ' + err.message ) );
	    if ( status ) return next( new HttpError( req, 400, status.message ) );
            self.logEvent( 'info', 'password change:', user.email );
            self.createPasswordHash( password, function( err, hash ) {
              if ( err ) return next( new HttpError( req, 400, err.message ) );
              user.password = hash;
              user.emailVerificationToken = null;
              self.saveUser( user, function( err ) {
		if ( err ) return next( new HttpError( req, 400, err.message ) );
		self.rememberPassword( user, function( err ) {
		  if ( err ) self.log.error( err );
		  self.sendPasswordResetSuccessfulEmail( user, function( err ) {
		    if ( err ) self.log.error( err );
		    res.end();
		  });
		});
              });
	    });
          });
	});
      });
    }

    if ( self.config().endpoints.expired.enabled ) {
      app.post( self.config().endpoints.expired.uri, self.authenticated, function( req, res, next ) {
	var password = req.query.password || req.body.password;
	self.findUserById( req.user.id, function( err, user ) {
	  if ( err ) return next( new HttpError( req, 400, err.message ) );
	  self.ensurePasswordUnique( user, password, function( err, status ) {
	    if ( err ) return next( new HttpError( req, 400, 'Something bad happened on the server: ' + err.message ) );
            if ( status ) return next( new HttpError( req, 400, status.message ) );
            self.logEvent( 'info', 'password change (expired):', req.user.email );
            self.createPasswordHash( password, function( err, hash ) {
              if ( err ) return next( new HttpError( req, 400, err.message ) );
	      var u = {
		id: req.user.id,
		password: hash,
		emailVerificationToken: null
	      };
              self.saveUser( u, function( err ) {
		if ( err ) return next( new HttpError( req, 400, err.message ) );
		self.rememberPassword( user, function( err ) {
		  if ( err ) self.log.error( err );
		  self.sendPasswordResetSuccessfulEmail( req.user, function( err ) {
		    if ( err ) self.log.error( err );
		    req.logout();
		    res.end();
		  });
		});
	      });
            });
          });
	});
      });
    }
    
    // And finally, return a middleware function (in case we need to do anything here)
    return function( req, res, next ) {
      next();
    };
  }
}

UserDB.prototype.config = function() {
  return this._config;
}

UserDB.prototype.addUserHelpers = function( user ) {
  // helper functions for the server side

  // user.has( 'admin' )
  // return true if the user has the role 'admin'
  //
  user[ 'has' ] = function( role ) {
    try {
      var g = _.find( this.roles, function( i ) { return i.name == role; } );
      if ( g ) return true;
      else return false;
    } catch( err ) {
      app.log.error( err );
      return false;
    }
  };

  // user.can( [ 'ops', 'admin' ], all );
  // returns true if the user has a role that matches one of the
  // input roles.  If all is present and true, then the user
  // must have all the roles specified.  If no arguments at
  // all are passed, this function always returns true.  If the
  // user has 'super_admin', this function returns true.
  //
  user[ 'can' ] = function( requiredRoles, all ) {
    all = all === undefined ? false : all;
    if ( requiredRoles === undefined ) return true;
    if ( this.has( 'super_admin' ) ) return true;
    var user_groups = _.map( this.roles, 'name' );
    var intersection = _.intersection( user_groups, requiredRoles );
    if ( ! intersection.length ) return false;
    if ( ! all && intersection.length ) return true;
    if ( intersection.length == requiredRoles.length ) return true;
    return false;
  };

  user[ 'canOnly' ] = function( requiredRoles, all ) {
    all = all === undefined ? false : all;
    if ( requiredRoles === undefined ) return true;
    // if ( this.has( 'super_admin' ) ) return true;
    var user_groups = _.map( this.roles, 'name' );
    var intersection = _.intersection( user_groups, requiredRoles );
    if ( ! intersection.length ) return false;
    if ( ! all && intersection.length ) return true;
    if ( intersection.length == requiredRoles.length ) return true;
    return false;
  };

}

UserDB.prototype.findUserById = function( id, cb ) {
  var self = this;
  self._db.findUserById( id, function( err, user ) {
    if ( err ) return cb( err );
    if ( ! user ) return cb();
    cb( null, self.transformer( user ) );
  });
}

UserDB.prototype.findAnyUserById = function( id, cb ) {
  var self = this;
  self._db.findAnyUserById( id, function( err, user ) {
    if ( err ) return cb( err );
    if ( ! user ) return cb();
    cb( null, self.transformer( user ) );
  });
}

UserDB.prototype.findUserByName = function( name, cb ) {
  var self = this;
  self._db.findUserByName( name, function( err, user ) {
    if ( err ) return cb( err );
    if ( ! user ) return cb();
    cb( null, self.transformer( user ) );
  });
}

UserDB.prototype.saveUser = function( user, cb ) {
  this._db.saveUser( user, cb );
}

UserDB.prototype.removeUser = function( userId, cb ) {
  this._db.removeUser( userId, cb );
}

UserDB.prototype.searchForUsers = function( query, opts, cb ) {
  var self = this;
  if ( ! cb ) {
    cb = opts;
    self._db.searchForUsers( query, function( err, users ) {
      if ( err ) return cb( err );
      cb( null, _.map( users, function( r ) { return self.transformer( r ); } ) );
    });
  }
  else {
    self._db.searchForUsers( query, opts, function( err, users ) {
      if ( err ) return cb( err );
      users.users = _.map( users.users, function( r ) { return self.transformer( r ); } );
      cb( null, users );
    });
  }
}

UserDB.prototype.searchForUsersQ = function( q, cb ) {
  var self = this;
  self._db.searchForUsersQ( q, function( err, users ) {
    if ( err ) return cb( err );
    cb( null, _.map( users, function( r ) { return self.transformer( r ); } ) );
  });
}

UserDB.prototype.verifyPasswordResetToken = function( sptoken, cb ) {
  var self = this;
  self._db.verifyPasswordResetToken( sptoken, function( err, user ) {
    if ( err ) return cb( err );
    var data = self.utils.verifyToken( sptoken );
    if ( ! data ) return cb( new Error( 'Token is expired' ) );
    cb( null, user );
  });
}

UserDB.prototype.verifyPassword = function( user, password, cb ) {
  require('bcryptjs').compare( password, user.password, function( err, good ) {
    if ( err ) return cb( err );
    if ( ! good ) return cb( new Error( 'Password does not match' ) );
    cb();
  });
}

UserDB.prototype.ensurePasswordUnique = function( user, password, cb ) {
  var self = this;
  if ( ! self.config().passwordsCantMatch ) {
    // if we are not ensuring unique passwords, dont bother checking
    return cb( null, null );
  }
  else {
    self._db.getOldPasswords( user, self.config().passwordsCantMatch, function( err, passwordHashes ) {
      if ( err ) return cb( err );
      // there is going to be at most <self.config().passwordsCantMatch>, but there could be a
      // few as zero.
      var status = true;
      async.eachSeries( passwordHashes, function( hash, cb ) {
	require('bcryptjs').compare( password, hash, function( err, good ) {
	  if ( err ) return cb( err );
	  if ( good ) status = false;  // if they match, this is bad!
	  cb();
	});
      }, function( err ) {
	var E = null;
	if ( ! status ) {
	  if ( self.config().passwordsCantMatch == 1 ) {
	    E = new Error( 'New password must not be the same as your existing password' );
	  }
	  else {
	    var num = self.config().passwordsCantMatch;
	    E = new Error( 'New password must not be the same as any of your last ' + num + ' passwords' );
	  }
	}
	cb( err, E );
      });
    });
  }
}

UserDB.prototype.rememberPassword = function( user, cb ) {
  if ( this.config().passwordsCantMatch ) {
    this._db.rememberPassword( user, cb );
  }
  else {
    // If we are not ensuring unqiue passwords, don't bother saving.
    cb();
  }
}

UserDB.prototype.createPasswordHash = function( password, cb ) {
  var errMsg = this.checkPassword( password );
  if ( errMsg ) return cb( new Error( errMsg ) );
  
  require('bcryptjs').genSalt( 10, function( err, salt ) {
    if ( err ) return cb( err );
    require('bcryptjs').hash( password, salt, cb );
  });
};

UserDB.prototype.findOrCreateUser = function( user, password, cb ) {
  this._db.findOrCreateUser( user, password, cb );
}

UserDB.prototype.findOrCreateRole = function( role, cb ) {
  this._db.findOrCreateRole( role, cb );
}

UserDB.prototype.addRoleToUser = function( role, user, cb ) {
  this._db.addRoleToUser( role, user, cb );
}

UserDB.prototype.getUserAccount = function( user, cb ) {
  this._db.getUserAccount( user, cb );
}

UserDB.prototype.getAccountUsers = function( account, cb ) {
  this._db.getAccountUsers( account, cb );
}

UserDB.prototype.getAccounts = function( where, cb ) {
  this._db.getAccounts( where, cb );
}

UserDB.prototype.removeAccount = function( accountId, cb ) {
  this._db.removeAccount( accountId, cb );
}

UserDB.prototype.changeAccountStatus = function( accountId, cb ) {
  this._db.changeAccountStatus( accountId, cb );
}

UserDB.prototype.searchForAccounts = function( query, cb ) {
  this._db.searchForAccounts( query, cb );
}

UserDB.prototype.findOrCreateAccount = function( account, cb ) {
  this._db.findOrCreateAccount( account, cb );
}

UserDB.prototype.upsertAccount = function( account, cb ) {
  this._db.upsertAccount( account, cb );
}

UserDB.prototype.removeRoleFromUser = function( role, user, cb ) {
  this._db.removeRoleFromUser( role, user, cb );
}

UserDB.prototype.searchForRoles = function( query, cb ) {
  this._db.searchForRoles( query, cb );
}

UserDB.prototype.upsertRole = function( role, cb ) {
  this._db.upsertRole( role, cb );
}

UserDB.prototype.removeRole = function( roleId, cb ) {
  this._db.removeRole( roleId, cb );
}

UserDB.prototype.newUserWorkflow = function( user, cb ) {
  var self = this;
  var u = { id: user.id || require( 'path' ).basename( user.href ) };
  u.status = 'PENDING';
  u.emailVerificationToken = self.utils.createToken({ email: user.email }, self.config().accountVerificationTokenExpire );
  u.email = user.email;
  self.saveUser( u, function( err ) {
    if ( err ) return cb( err );
    user.emailVerificationToken = u.emailVerificationToken;
    self.sendAccountVerificationEmail( user, function( err ) {
      if ( err ) cb( err );
      cb();
    });
  });
}

UserDB.prototype.verifyAccount = function( sptoken, cb ) {
  var self = this;
  self.verifyPasswordResetToken( sptoken, function( err, user ) {
    if ( err ) return cb( err );
    if ( ! user ) return cb( new Error( 'Account validation failed: no such user' ) );
    var u = { id: user.id || require( 'path' ).basename( user.href ) };
    u.emailVerificationToken = null;
    u.status = 'ENABLED';
    self.saveUser( u, function( err ) {
      if ( err ) return cb( err );
      user.emailVerificationToken = u.emailVerificationToken;
      self.sendAccountVerificationSuccessfulEmail( user, function( err ) {
        if ( err ) self.log.error( err );
        self.sendAccountWelcomeEmail( user, function( err ) {
          if ( err ) self.log.error( err );
          cb( null, self.transformer( user ) );
        });
      });
    });
  });
}

UserDB.prototype.noteLastSuccessfulLogin = function( username, cb ) {
  var self = this;
  self._db.findUserByName( username, function( err, user ) {
    if ( err ) return cb( err );
    if ( ! user ) return cb( new Error( 'User not found' ) );
    var now = Math.round( new Date().getTime() / 1000 );
    self._db.saveUser({ id: user.id, last_login_on: now, last_failed_login_on: 0, failed_login_count: 0 }, cb );
  });
}

UserDB.prototype.noteLastUnsuccessfulLogin = function( username, originalMessage, cb ) {
  var self = this;
  var message = originalMessage;
  self._db.findUserByName( username, function( err, user ) {
    if ( err ) return cb( err );
    if ( ! user ) return cb( new Error( 'User not found' ) );
    var now = Math.round( new Date().getTime() / 1000 );
    var u = { id: user.id, last_failed_login_on: now };
    u.failed_login_count = user.failed_login_count + 1;
    if ( self.config().disableAccountAfterFailedLoginAttempts > 0 &&
	 ( u.failed_login_count == self.config().disableAccountAfterFailedLoginAttempts ) ) {
	   self.logEvent( 'info', 'account locked:', username );
	   u.failed_login_count = self.config().disableAccountAfterFailedLoginAttempts;
	   u.status = "LOCKED";
	   message = "Account locked after " + self.config().disableAccountAfterFailedLoginAttempts + " failed login attempts";
    }
    self._db.saveUser( u, function( err ) {
      if ( err ) return cb( err );
      else cb( null, message );
    });
  });
}

UserDB.prototype.authenticated = function( req, res, next ) {
  var self = udb;  // In this calling context, there is no this.  So use the global!

  var authenticatedErrorResponse = function( req, res, status, message ) {
    if ( req.accepts(['html', 'json'] ) === 'html' ) {
      var url = self.config().endpoints.login.uri + '?next=' + encodeURIComponent( req.originalUrl );
      return res.redirect( 302, url ); 
    }
    else if (( req.accepts(['html', 'json'] ) === 'json' ) || req.xhr ) {
      return res.status( status ).send( JSON.stringify({ next: req.originalUrl, status: status, message: message }) );
    }
    else {
      return res.status( status ).send( message );
    }
  };
  
  if ( req.isAuthenticated() ) { return next(); }  // cookie present, session deserialized, everything is cool

  // Ok, need to authenticate the user.  Its here that we will check for back-to-back auth failures and lock out
  // users, and make a note on last failed attampt and last successful attempt.
  var realm = req.headers['realm' ] || 'local';
  passport.authenticate( realm, function( err, user, info ) {
    if ( err && req.path == self.config().endpoints.login.uri ) {
      // This is a password match failure on the login screen!
      return self.noteLastUnsuccessfulLogin( (req.body.username || req.query.username || req.body.login || req.query.login), err.message, function( err, message ) {
	if ( err ) return authenticatedErrorResponse( req, res, 401, err.message );
	else return authenticatedErrorResponse( req, res, 401, message );
      });
    }
    if ( err ) return authenticatedErrorResponse( req, res, 401, err.message );
    if ( ! user ) return authenticatedErrorResponse( req, res, 401, info.message );
    req.logIn( user, function( err ) {
      if ( err ) return authenticatedErrorResponse( req, res, 401, err.message );
      self.noteLastSuccessfulLogin( user.email, next );
    });
  })( req, res, next );
}

UserDB.prototype.authorized = function( roles, all ) {
  all = all === false ? false : true;
  return function( req, res, next ) {
    if ( ! req.user.can( roles, all ) )
      return res.status( 403 ).end();
    else
      return next();
  };
};

UserDB.prototype.sendAccountVerificationEmail = function( user, cb ) {
  if ( ! this.config().email.accountVerification.enabled ) return cb();
  var type = 'accountVerification';
  this.logEvent( 'info', 'email sent:', 'type:', type, 'to:', user.email );
  require( './email' )( this.config().smtp ).send( type, user, this.config(), cb );
}

UserDB.prototype.sendAccountVerificationSuccessfulEmail = function( user, cb ) {
  if ( ! this.config().email.accountVerificationSuccessful.enabled ) return cb();
  var type = 'accountVerificationSuccessful';
  this.logEvent( 'info', 'email sent:', 'type:', type, 'to:', user.email );
  require( './email' )( this.config().smtp ).send( type, user, this.config(), cb );
}

UserDB.prototype.sendAccountWelcomeEmail = function( user, cb ) {
  if ( ! this.config().email.accountWelcome.enabled ) return cb();
  var type = 'accountWelcome';
  this.logEvent( 'info', 'email sent:', 'type:', type, 'to:', user.email );
  require( './email' )( this.config().smtp ).send( type, user, this.config(), cb );
}

UserDB.prototype.sendForgotPasswordEmail = function( user, cb ) {
  if ( ! this.config().email.forgotPassword.enabled ) return cb();
  var type = 'forgotPassword';
  this.logEvent( 'info', 'email sent:', 'type:', type, 'to:', user.email );
  require( './email' )( this.config().smtp ).send( type, user, this.config(), cb );
}

UserDB.prototype.sendPasswordResetSuccessfulEmail = function( user, cb ) {
  if ( ! this.config().email.passwordResetSuccessful.enabled ) return cb();
  var type = 'passwordResetSuccessful';
  this.logEvent( 'info', 'email sent:', 'type:', type, 'to:', user.email );
  require( './email' )( this.config().smtp ).send( type, user, this.config(), cb );
}

UserDB.prototype.checkPassword = function( p ) {
  if ( ! this.config().passwordPolicy.enabled ) return null;  // null is good, non-null is an error message

  var spec = this.config().passwordPolicy;

  var anUpperCase = /[A-Z]/;
  var aLowerCase = /[a-z]/; 
  var aNumber = /[0-9]/;
  var aSpecial = /[!|@|#|$|%|^|&|*|(|)|\-|_]/;

  var errorMessage = [
    "Password must be at least", spec.length, "characters long",
    "and contain at least", spec.uppers, "uppercase,",
    spec.lowers, "lowercase,", spec.numbers, "numbers and", spec.specials, "special characters." ].join( ' ' );

  if ( p.length < spec.length ) return errorMessage + '  Length too short.';

  var numUpper = 0;
  var numLower = 0;
  var numNums = 0;
  var numSpecials = 0;
  for(var i=0; i<p.length; i++){
    if(anUpperCase.test(p[i]))
      numUpper++;
    else if(aLowerCase.test(p[i]))
      numLower++;
    else if(aNumber.test(p[i]))
      numNums++;
    else if(aSpecial.test(p[i]))
      numSpecials++;
  }

  if ( numUpper < spec.uppers || numLower < spec.lowers || numNums < spec.numbers || numSpecials < spec.specials ) {
    return errorMessage + '  ' + [ numUpper, numLower, numNums, numSpecials ].join( ', ' );
  }
  
  return null;
}

UserDB.prototype.generateRandomPassword = function() {
  if ( ! this.config().passwordPolicy.enabled ) {
    var spec = {
      length: 8,
      uppers: 1,
      lowers: 1,
      numbers: 1,
      specials: 1,
    };
  }
  else {
    var spec = this.config().passwordPolicy;
  }

  var Uppers = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  var Lowers = 'abcdefghijklmnopqrstuvwxyz';
  var Numbers = '0123456789';
  var Specials = '!@#$%^&*()-_';

  function randomChars( num, set ) {
    var str = '';
    var i = 0;
    for( i=0; i<num; i++ ) {
      str += set.charAt( Math.floor(Math.random() * set.length ) );
    }
    return str;
  }

  var password = '';
  password += randomChars( spec.uppers, Uppers );
  password += randomChars( spec.lowers, Lowers );
  password += randomChars( spec.numbers, Numbers );
  password += randomChars( spec.specials, Specials );
  var more = spec.length - password.length;
  if ( more > 0 ) password += randomChars( more+1, Lowers );
  return password;
}

UserDB.prototype.resetPassword = function( user, cb ) {
  var self = this;
  var u = { id: user.id || require( 'path' ).basename( user.href ) };
  u.emailVerificationToken = self.utils.createToken({ email: user.email }, self.config().passwordResetTokenExpire );
  self.saveUser( u, function( err ) {
    if ( err ) return cb( err );
    user.emailVerificationToken = u.emailVerificationToken;
    self.sendForgotPasswordEmail( user, cb );
  });
}

UserDB.prototype.unlockUser = function( user, cb ) {
  var self = this;
  // unconditionally unlock a user
  if ( user.status != 'LOCKED' ) return cb();
  var u = { id: user.id, status: 'ENABLED', last_failed_login_on: 0, failed_login_count: 0 };
  self.saveUser( u, cb );
}

UserDB.prototype.unlockUsers = function( cb ) {
  var self = this;
  // conditionally unlock users
  self._db.searchForUsers({ status: 'LOCKED' }, function( err, users ) {
    if ( err ) return cb( err );
    var unlocked = [];
    var now = Math.round( new Date().getTime() / 1000 );
    async.eachSeries( users, function( user, cb ) {
      var delta = now - user.last_failed_login_on;
      if ( delta < self.config().reenableLockedAccountsAfterSeconds ) return cb();
      self.unlockUser( user, function( err ) {
	if ( err ) return cb( err );
	unlocked.push( self.transformer( user ) );
	cb();
      });
    }, function( err ) {
      if ( err ) return cb( err );
      cb( null, unlocked );
    });
  });
}

var udb = new UserDB();
module.exports = udb;
