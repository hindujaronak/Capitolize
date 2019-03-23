var GetOpts = require( 'node-getopt' );
var async   = require( 'async' );
var sprintf = require( 'sprintf-js' ).sprintf;

application();

function application() {

  var getopts = GetOpts.create([
    [ '', 'config=[FILENAME]', 'Full path/file to config' ],
    [ '', 'fullname[=FULLNAME]', 'Fullname of user' ],
    [ '', 'firstname[=FULLNAME]', 'First name of user' ],
    [ '', 'lastname[=FULLNAME]', 'Last name of user' ],
    [ '', 'email[=EMAIL]', 'Email of user' ],
    [ '', 'account[=NAME]', 'Account name of user' ],
    [ '', 'role[=ROLE]', 'Role for user' ],
    [ '', 'password=[PASSWORD]', 'Optional - password for user' ],
    [ '', 'disableWorkflow', 'Disable email workflow for new user(s)' ],

    [ '', 'json[=FILE]', 'Read users to add from JSON formatted file' ],
    [ '', 'csv[=FILE]', 'Read users to add from a CSV file' ],
    [ '', 'csvNoHeader', 'CSV input file has no header row' ],

    [ 'h', 'help', 'Display this help' ],
  ]);
  getopts.bindHelp();
  var opt = getopts.parseSystem();
  var options = opt.options;

  if ( ! options.config ) {
    console.log( 'You must supply a config file!' );
    process.exit(1);
  }
  var _config = require( options.config );
  var app = { log: require( 'winston' ), config: _config };

  app.config.logger = app.log;

  var userdb = require( '../index' );
  userdb.initialize( app, app.config );

  async.waterfall([
    function( cb ) {
      // get users
      if ( options.email && ( options.fullname || ( options.firstname && options.lastname ) ) ) {
	// Doing a single user
	return cb( null, [ options ] );
      }
      else if ( options.json ) {
	try {
	  var users = require( options.json );
	  return cb( null, users );
	} catch( err ) {
	  return cb( new Error( 'Failed to read JSON file: ' + options.json + ': ' + err.message ) );
	}
      }
      else if ( options.csv ) {
	var parse = require('csv-parse');
	var fs = require( 'fs' );
	var data = fs.readFileSync( options.csv, 'utf8' );
	parse( data, function( err, rows ) {
	  if ( err ) return cb( err );
	  var users = [];
	  if ( ! options.csvNoHeader ) rows.shift();
	  rows.forEach( function( row ) {
	    users.push({
	      firstname: row[0],
	      lastname: row[1],
	      email: row[2],
	      role: ( row[3] == '' ? null : row[3] ),
	      password: ( row[4] == '' ? null : row[4] ),
	      account: ( row[5] == '' ? null : row[5] ),
	    });
	  });
	  return cb( null, users );
	});
      }
    },
    function( users, cb ) {
      app.log.info( sprintf( '%-30s %-30s %-30s',
			     'Fullname', 'Email', 'ID' ) );
      async.eachSeries( users, function( u, cb ) {
	if ( ! u.fullname ) u.fullname = u.firstname + ' ' + u.lastname;
	if ( ! u.firstname ) {
	  var p = u.fullname.split(/\s+/);
	  u.firstname = p.shift();
	  u.lastname = p.join( ' ' );
	}
	var dbu = {
	  email: u.email,
	  givenName: u.firstname,
	  surname: u.lastname,
	  customData: {},
	  status: ( options.disableWorkflow ? 'ENABLED' : 'PENDING' )
	};
	async.waterfall([
	  function( cb ) {
	    userdb.findOrCreateAccount({ name: u.account }, function( err, account ) {
	      if ( err ) return cb( err );
	      dbu.account_id = account.id;
	      cb( null, account );
	    });
	  },
	  function( account, cb ) {
	    // every account should have an admin role
	    userdb.findOrCreateRole( { name: 'admin', account_id: account.id }, function( err, role ) {
	      if ( err ) return cb( err );
	      cb( null, account );
	    });
	  },
	  function( account, cb ) {
	    userdb.findOrCreateRole( { name: u.role, account_id: account.id }, function( err, role ) {
	      if ( err ) return cb( err );
	      cb( null, role );
	    });
	  },
	  function( role, cb ) {
	    userdb.findOrCreateUser( dbu, (u.password || 'new123'), function( err, user ) {
	      if ( err ) return cb( err );
	      cb( null, user, role );
	    });
	  },
	  function( user, role, cb ) {
	    if ( ! role ) return cb( null, user );
	    userdb.addRoleToUser( role, user, function( err ) {
	      if ( err ) return cb( err );
	      cb( null, user );
	    });
	  },
	  function( user, cb ) {
	    if ( options.disableWorkflow ) return cb( null, user );
	    userdb.newUserWorkflow( user, function( err ) {
	      if ( err ) return cb( err );
	      cb( null, user );
	    });
	  },
	], function( err, user ) {
	  if ( err ) return cb( err );
	  app.log.info( sprintf( '%-30s %-30s %-30s', user.fullName, user.email, user.id ) );
	  return cb();
	});
      }, cb );
    }
  ], function( err ) {
    if ( err ) app.log.error( err );
    process.exit( ( err ? 1 : 0 ) );
  });
}
