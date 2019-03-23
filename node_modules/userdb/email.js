var nodemailer = require('nodemailer');
var ses = require('nodemailer-ses-transport');

var _ = require( 'lodash' );

module.exports = function( _options ) {
  var options = _.cloneDeep( _options );
  var transporter = nodemailer.createTransport( options.options );

  function send( type, user, config, cb ) {

    var template = config.email[ type ].template;

    var envelope = {
      subject: config.email[ type ].subject,
      to: user.email,
      from: options.from
    };

    var uri, url;
    if ( config.email[ type ].endpoint ) {
      uri = config.email[ type ].endpoint;
    }

    if ( user.emailVerificationToken && uri ) {
      url = uri + '?sptoken=' + user.emailVerificationToken;
    }
    else {
      url = uri;
    }

    var model = {
      envelope: envelope,
      user: user,
      token: user.emailVerificationToken,
      url: url,
      uri: uri,
    };

    require( 'ejs' ).renderFile( __dirname + '/email-templates/' + template, model, function( err, html ) {
      if ( err ) return cb( err );
      envelope[ config.email[ type ].format ] = html;
      transporter.sendMail( envelope, function( err, info ) {
	if ( err ) return cb( err );
	else cb( null, info );
      });
    });
  }

  return {
    send: send
  };
};
