var _   = require( 'lodash' );
var jwt = require( 'njwt' );

module.exports = function( app ) {
  var utils = {};

  // A middleware function for tracing incoming requests
  utils.tracer = function() {
    var sprintf = require( 'sprintf-js' ).sprintf;
    return function( req, res, next ) {
      var query = require('url').parse(req.url,true).query;
      // Summary of incoming request
      var buf = [];
      buf.push( sprintf( "| %s %s %s ( %s )", req.method.toUpperCase(), req.headers['content-type'], req.path, ( req.user ? req.user.email : 'anonymous' ) ) );
      _.forIn( query, function( v, k ) {
        if ( v instanceof Array )
          v = JSON.stringify(v);
        buf.push( sprintf( "| - %-15s : %s", k, v ) );
      });
      if ( req.headers['content-type'] == 'application/json' ) {
	var json = _.cloneDeep( req.body );
	_.forIn( json, function( v, k ) {
	  if ( k.match( /[Pp]assword/ ) ) json[k] = '(blocked)';
	});
        var jsonStr = JSON.stringify( json, null, 2 );
        lines = jsonStr.split("\n");
        if ( lines.length > 40 ) {
          lines = lines.slice( 0, 39 );
          lines.push( '... output truncated ...' );
        }
        lines.forEach( function( line ) {
          buf.push( sprintf( "|   %s", line ) );
        });      
      }
      else {
        _.forIn( req.body, function( v, k ) {
          if ( typeof v != 'string' ) v = JSON.stringify( v );
          if ( typeof v == 'string' ) {
            if ( k.match( /password/i ) ) v = '(blocked)';
            var lines = [];
            if ( v.indexOf('{')==0 || v.indexOf('[')==0 ) {
              try {
                var json = JSON.stringify( JSON.parse(v), null, 2 );
                lines = json.split("\n");
                v = "(json...):";
              } catch(err) {
              }
            }
            buf.push( sprintf( "| - %-15s : %s", k, v ) );
            if ( lines.length )
              lines.forEach( function( line ) {
                buf.push( sprintf( "|   %s", line ) );
              });
          }
        });
      }
      app.log.debug( buf.join( "\n" ) );
      next();
    };
  };

  utils.createToken = function( data, exp ) {
    var token = jwt.create({ sub: data }, app.config.tokenSigningKey );
    token.setExpiration( new Date().getTime() + ( exp * 1000 ) ); // exp is in seconds
    return token.compact();
  }

  utils.verifyToken = function( token ) {
    try {
      var verified = jwt.verify( token, app.config.tokenSigningKey );
      return verified.body.sub;
    } catch( err ) {
      return null;
    }
  }

  return utils;
}
