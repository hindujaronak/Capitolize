# UserDB

A server side library for implementing account/user/role authentication
and authorization workflow.

## Features

* authentication
* authorization (roles)
* new account verification
* password reset
* password expiration
* password strength policy
* passwords cannot match any of the last N passwords used
* account lockout if too many failed login attempts
* session expiration
* event logging
* user-pluggable persistent store
* user-pluggable transformations
* email (text or html) for account workflow

## History

This library was written to migrate a single page app away from using
[Stormpath](https://stormpath.com/) on the backend, but retaining the
ability to use [react-stormpath](https://github.com/stormpath/stormpath-sdk-react)
on the frontend.  Properly configured, you should be able to use `react-stormpath`
as your SPA views for a backend using this library.

## Installation

```bash
npm install --save userdb
```

or git-clone this repository into the top level of your backend project, then
remove the `.git` subdirectory and check it into your project.

If you go the `git-clone` route, then you'll want to add something like the folloing to your `package.json` file:

```javascript
"scripts": {
    "postinstall": "(cd ./userdb; npm install)",
}
```

If you go the "npm install" route, then add the following into your `webpack.config.js` file:

```javascript
  module: {
    loaders: [
      {
        test: /\.js$/,
        loaders: ['babel-loader'],
	exclude: /node_modules\/(?!(userdb\/react)\/).*/,
	include: [ path.join(__dirname, 'src'), path.join(__dirname,'node_modules','userdb', 'react') ]
      }
    ]
  }
```

In other words, exclude node_modules **except** for "userdb/react" and explicity include node_modules/userdb/react.

## Usage

This library was designed to work with `express`.  In your main application:

```javascript
  var express = require( 'express' );
  var app = express();
  var userdb = require( 'userdb' );  // or require( './userdb' );

  app.use( userdb.initialize( app, options ) );

  // send all NON-XHR requests to index.html so browserHistory in React Router works
  app.get('*', function (req, res, next) {
    if ( req.xhr ) return next();
    res.sendFile(path.join(__dirname, '/static/index.html'));
  });

  // Your POST and other XHR endpoints

  app.post( '/protected', userdb.authenticated, userdb.authorized(['admin','doctor']), function( req, res, next ) {
    console.log( "user:", JSON.stringify( req.user, null, 2 ) );
    if ( req.user.has( 'doctor' ) ) {
      // ...
    }
    res.json( req.user );
  });

  app.listen( 3000 );
```

### Userdb and React UI

If you are using the react UI, then you need to include some css.  The css file is going to be
under node_modules/userdb/react/css/userdb.css.  You can include this by either copying it to your
own css directory, or by including it directly.  To include it directly, you'll probably want something like the
following in your server code:

```javascript
  // static content
  app.use( express.static( path.join( __dirname, 'static' ) ) );
  app.use( express.static( path.join( __dirname, 'node_modules' ) ) );
```

and then in your static/css/styles.css file:

```css
@import "/userdb/react/css/userdb.css";
```

## Configuration

The options that you pass into the `initialize()` function are merged with a set of default options.
The default options are:

```javascript
{
  "debug": true,
  "debugEndpoints": true,
  "logger": null,
  "endpoints": {
    "login": {
      "enabled": true,
      "uri": "/login"
    },
    "logout": {
      "enabled": true,
      "uri": "/logout"
    },
    "me": {
      "enabled": true,
      "uri": "/me"
    },
    "verify": {
      "enabled": false,
      "uri": "/verify"
    },
    "forgot": {
      "enabled": true,
      "uri": "/forgot"
    },
    "change": {
      "enabled": true,
      "uri": "/change"
    },
    "expired": {
      "enabled": false,
      "uri": "/expired"
    }
  },
  "passwordsExpireInSeconds": 2592000,
  "sessionsExpireInSeconds": 0,
  "passwordPolicy": {
    "enabled": false,
    "length": 5,
    "uppers": 0,
    "lowers": 1,
    "numbers": 1,
    "specials": 0
  },
  "disableAccountAfterFailedLoginAttempts": 0,
  "reenableLockedAccountsAfterSeconds": 900,
  "passwordsCantMatch": 0,
  "accounts_href": "http://localhost/accounts",
  "groups_href": "http://localhost/groups",
  "session": {
    "key": "userdb",
    "secret": "jsjjhdhgdghd",
    "resave": false,
    "saveUninitialized": false
  },
  "database": {
    "driver": "knex",
    "options": null
  },
  "strategies": null,
  "smtp": {
    "from": "FROM_EMAIL_ADDRESS",
    "auth": {
      "user": "SMTP_USER",
      "pass": "SMTP_PASS"
    },
    "options": {
      "port": "SMTP_PORT",
      "host": "SMTP_HOST",
      "secure": true,
      "ignoreTLS": false,
      "requireTLS": true,
      "name": "SMTP_SERVER_NAME",
      "localAddress": "0.0.0.0",
      "connectionTimeout": 3000,
      "greetingTimeout": 3000,
      "socketTimeout": 5000,
      "debug": false,
      "lmtp": false,
      "authMethod": "PLAIN",
      "tls": {}
    }
  },
  "email": {
    "accountVerification": {
      "enabled": false,
      "subject": "Please verify your account",
      "template": "account-verification.html",
      "format": "text",
      "endpoint": "http://localhost:3000/verify"
    },
    "accountVerificationSuccessful": {
      "enabled": false,
      "subject": "Your account has been confirmed",
      "template": "account-verification-successful.html",
      "format": "text"
    },
    "accountWelcome": {
      "enabled": false,
      "subject": "Your registration was successful",
      "template": "account-welcome.html",
      "format": "text"
    },
    "forgotPassword": {
      "enabled": false,
      "subject": "Reset your password",
      "template": "forgot-password.html",
      "format": "text",
      "endpoint": "http://localhost:3000/change"
    },
    "passwordResetSuccessful": {
      "enabled": false,
      "subject": "Your password has been changed",
      "template": "password-reset-successful.html",
      "format": "text"
    }
  },
  "transformer": "stormpath",
  "tokenSigningKey": "674a3323-9a91-4bc4-b8a5-0c13d6a08a00",
  "accountVerificationTokenExpire": 86400,
  "passwordResetTokenExpire": 3600
}
```

The defaults are read from `defaults.yml` which is documented, so you can refer to that file
for documentation as well.

The configuration will be explained below in sections; `passport`, `database`, `transformers`, `endpoints`, `password policy`, `smtp`, `email`, and `misc`.

### Passport

The `userdb` library uses [passport](http://passportjs.org/) internally for authentication management.  Passport itself
relies on a persistent session to store a user record associated with a client-side cookie.  The default session is an
in-memory store, which won't work too well in production.  In a production environment, you need to supply something a little
more robust.  You do this with the `session` configuration section, which is passed directly to [express-session](https://github.com/expressjs/session).
Here is an example using a redis store:

```javascript
  var session = require('express-session');
  var RedisStore = require('connect-redis')(session);

  userdbOptions = {
    session: {
      store: new RedisStore({
        "host": "redis",
        "port": 6379,
        "options": {} })
    },
  };

  app.use( userdb.initialize( app, userdbOptions ) );
 
```

By default a "local" strategy is installed for passport.  This is a username/password strategy that searches the backing store (see Database)
for users during authentication.  This may be enough for most applications.  However, you have the ooportunity to install additional strategies
and make use if the `userdb` api to implement them.  You can do this by supplying a function to the `strategies` option.  If a function is supplied,
it will be called with two parameters; `app` and `verifyPassword`:

    function( app, verifyPassword )

The `app` parameter is **not** the express app.  It contains app.log, which is the logger and app.config which is the configuration passed to userdb.
The `verifyPassword` function takes ( user, password ) and will check that user.password hash is equal to the clear text password.  `verifyPassword`
is an async function, which returns either an error, or null if the passwords match.  Here is an (untested!) example of a function you could write
and pass to `userdb` via the `strategies` configuration parameter:

```javascript
var myStrategies = function( app, verifyPassword ) {
  var FacebookStrategy = require( 'passport-facebook' );
  passport.use("facebook", new FacebookStrategy({
    clientID: FACEBOOK_APP_ID,  // app.config.facebook.appId
    clientSecret: FACEBOOK_APP_SECRET,  // app.config.facebook.appSecret
    callbackURL: "http://localhost:3000/auth/facebook/callback"  // app.config.facebook.callbackUrl
  },
  function(accessToken, refreshToken, profile, cb) {
    userdb.searchForUsers({ facebookId: profile.id }, function (err, users) {
      return cb(err, (users.length==1 ? users[0] : null));
    });
  }
  ));
}
```

On the client side, if the user wants to authenticate using facebook, then send a header called "realm"
with the value set to "facebook" (or whatever you called the strategy).

**NOTE** in this example, you'll need to update the user database schema to add a "facebookId" column.

### Database

The default persistent store used by this library is [Knex](http://knexjs.org/), which is a nice NodeJS
library to interface with MySQL.  This database driver is called "knex".  To use this built in driver, you
need to specify the connection properties.  This will depend on your environment, but here is a simple
example:

```javascript
"database": {
  "driver": "knex",
  "options": {
    "client": "mysql",
    "connection": {
      "host": "XXXX.us-east-1.rds.amazonaws.com",
      "user": "admin",
      "password": "secret",
      "database": "mydb"
    }
  }
}
```

This driver is located here: ./database-drivers/knex.js.  There is a knex.sql located there that you may use
to initialize the database schema required by this driver.

It is possible to develop other drivers for this library.  To create a new driver called "mongo", create a new
file under ./database-drivers called "mongo" and set the database parameters to use this driver and pass the
options it needs to connect to your persistent store.  Look at knex.js and implement the same routines you
see in there:  findUserById(), findUserByName(), saveUser(), searchForUsers(), searchForUsersQ(), verifyPasswordToken(),
findOrCreateUser(), findOrCreateRole(), addRoleToUser(), getOldPasswords(), rememberPassword().

### Transformers

It is possible to supply a function called a "transformer" which will take a user strucutre from the database
and return a user strucutre suitable for sending to the client.  By default no transformation is done on the
user structure.  There is (currently) one built in transformer called "stormpath".  If you set the `transformer`
parameter to "stormpath" the user structure will be transformed into something that the Stormpath React client-side
view library expects.  Or, you may set it to a function that takes a user structure as input and should return
the user structure that will be sent to the client.  Use this to migrate from an older user management library
(like Stormpath) to this library.

### Endpoints

### Password Policy

By default, passwords do not expire.  If you want to support expiring passwords, you must first set `config.endpoints.expired.enabled` to true.
If this is set to true, then `passwordsExpireInSeconds` is checked against the user database column called `password_updated_on`, which is always
set whenever a user changes their password.  If `now() - user.password_updated_on > passwordsExpireInSeconds`, then a property called `password_expired`
is set to true on the user structure being returned from /login and /me.  This can be used by the UX to redirect the user to a password change form
after successfully logging in with their old password.  No other enforcement is performed.  Even through the password is known to have expired, it
will not be changed until the user changes it.  And to change it, the user must be able to log in.  The UX should not let the user go anywhere in
the app until they change their password.  When the /expired endpoint is called, the password will be changed and the user logged out, so that on the
UX side, the user must re-login with their new password.

When a password is being changed using the /expired endpoint, the new password can be checked for uniquesness over the last (configurable) number of
passwords employed by the user.  This is controlled with the config parameter `passwordsCantMatch`.  If that parameter is set to zero, then the user
can repeat any past password.  If it is set to a number like 3, then the new password must not match any of the last three passwords used by that user.

If `config.passwordPolicy.enabled` is set to true, then new passwords will be checked against the policy and an error thrown if the password
does not meet the policy requirements.  You can specify rules for the length of the password and the number of uppercase, lowercase and special characters
required.  It should be noted however that in most cases, the UX will want to implement the policy so it can be shown to the user before they make
an attempt.  In this case, you might not want to enable policy checking in this library.  If your policy code is located in the UX, you might want to
update it it in only one place.

When a user is logging in, if the canfing parameter `disableAccountAfterFailedLoginAttempts` is set to a non zero value, than that many failed login
attempts in a row will cause the account to be "locked" and the user will not be able to log in with any password until the account is unlocked.
The parameter `reenableLockedAccountsAfterSeconds` can be set to a number of seconds an account should remain locked after being locked.  Some script
or process (like manage-user.js) can use this parameter to unlock locked accounts.

By default sessions to not expire.  By setting the parameter `sessionsExpireInSeconds` to a number of seconds, that number will be used to program
maxAge of the session cookie used for session management.  Sessions will then expire after than number of seconds of inactivity.

### SMTP

This library can send emails to people when various events occur (see below).  To use this facility you need to have an account with
an SMTP provider and set the SMTP parameters in your userdb config.  See `defaults.yml` under `smtp`.

### Email

There are a number of points in the user "workflow" where emails could be sent to a user.  To use this
feature, you must specify an SMTP server and its connection parameters (see above).  Then you can enable and
configure the emails you would like sent to your users.  There are five possible emails, which you can see in
defaults.yml, under the `email` parameter:

#### accountVerification

If enabled (and if you call userdb.newUserWorkflow() when creating a new user account), this email would be sent to the
new user asking them to verify their email address.  See [New User Workflow](#new-user-workflow) for details.
This email requires the endpoint that will be used to construct the link in the email that the user clicks on to
verify their account.

#### accountVerificationSuccessful

If enabled, a user will get this email once they've successfully verified their email address.

#### accountWelcome

If enabled, a user will receive this email after they've successfully verified their email address.

#### forgotPassword

If enabled, when a user asks to reset their password, or a system admin resets a user's password, this
email will be sent to the user with a link to an endpoint to specify a new password.  See [Password Reset Workflow](#password-reset-workflow)
for details.  This email requires the endpoint that will be used to construct the link in the email that the user clicks on to
specify their new password.

#### passwordResetSuccessful

If enabled, this email is sent to the user after that have successfully specified a new password after a password reset
sequence.

In all cases, you can specify a `subject`, a `format` and a `template` for these various emails.  If you want to use
your own templates, place place them under ./email-templates.  If you want to send HTML emails, change the format to "html"
and create appropriate templates.  The templates are processed wi the EJS templating engine.  See the existing text templates
for the variables you can use in your own templates.

### Misc

Setting `debugEndpoints` to `true` will install a middleware function that will print information about
incoming HTTP requests before they hit the `userdb` endpoints.  You may find this to be useful for debugging
your client-side UX code.

You can set `logger` to your application's central logger if you employ one.  If this is not set, then
`userdb` will use [winston](https://github.com/winstonjs/winston) internally, with its default console
transport.  If you do supply a logger, it must comply with a winston-like api.  That is, it should have
`.info()`, `.debug()`, `.error()` methods which can take a variable number of arguments, including objects.

## New User Workflow

## Password Reset Workflow

## UserDB API

### userdb.initialize( app, options )

This should be called once to initialize the library.  The `app` parameter may be {}, in which case none
of the passport stuff or the endpoints are installed.  This is a useful way to use this library in stand
alone scripts to adding users, etc.  The `options` parameter has been described above.  This function
retuns a middleware function (which presently does nothing), so in a node express application you should:

    app.use( userdb.initialize( app, options ) );

### userdb.authenticated( req, res, next )

Middleware function to be used on routes that are protected and require an authenticated user to access.
The incoming req.headers.realm is used to pick a passport strategy to use.  If this header does not
exist, then "local" is used as the strategy.

### userdb.authorized( roles, all )

Middleware function to be used on routes that should be restricted to users with particular roles.  The
`roles` parameter is an array of role names.  By default the user must have one of the roles specified,
but if `all` is true, then the user must have all the roles specified.  If the user does not meet
the criterion, then a 403 is sent back to the client.  This middleware function should follw the
authenticated() function in a route.

### userdb.findUserById( id, cb )

### userdb.findUserByName( usernameOrEmail, cb )

### userdb.saveUser( params, cb )

### userdb.searchForUsers( query, cb )

### userdb.searchForUsersQ( q, cb )

### userdb.createPasswordHash( cleartextPassword, cb )

### userdb.verifyPassword( user, clearTextPassword, cb )

### userdb.findOrCreateUser( user, password, cb )

### userdb.findOrCreateRole( role, cb )

### userdb.addRoleToUser( role, user, cb )

### userdb.newUserWorkflow( user, cb )

### userdb.verifyAccount( sptoken, cb )

### userdb.resetPassword( user, cb )

### userdb.unlockUser( user, cb )

### userdb.unlockUsers( cb )

## Account Verification Flow in a SPA Using react-stormpath

In an application where users cannot self register, what I want to see happen is:

1.  An admin adds a new user.  Email is sent to the user asking them to verify their email address by clicking on a link in the email.
2.  The user clicks on this link.  The act of clicking on it verifies the account, and takes the user to a welcome screen, where:
3.  The user sees their profile information and can change it, and must enter a password and "submit".
4.  The user is then directed into the app without having to log in through the login screen.

To get this behavior in a SPA, you must play a couple of tricks in the main application.  By default the `/verify` endpoint is
not enabled in userdb, and you should leave it that way because we will implement our own.  Then you should configure the email
endpoint for the verification email:

```javascript
"email": {
  "accountVerification": {
    "enabled": true,
    "endpoint": "https://your-app.com/welcome"
  }
}
```

When the user clicks on this link in the email, a GET will go to /welcome.  But we won't have a GET handler for /welcome!  We will
have a client-side route for /welcome however.  All GETs (that are not consumed by userdb) will simply cause index.html to be delivered to
the browser to bootstrsp the SPA.  The client-side route for /welcome will display a welcome form.  This form will immediately perform
a POST to a /welcome endpoint we **will** implement, which will use userdb to validate the account.  If there is an error, the user will be
notified and the welcome form disabled.  If the verification goes through, the user can now fill in the welcome form and POST it to another
endpoint we will implement called /welcomed, which will save their profile and log them in, and direct them to the apps initial screen.

Here's how the backend server code would look like to implement this senerio.

```javascript
  ...
  // install the userdb endpoints
  app.use( app.lib.userdb.initialize( app, udbOptions ) );

  // send all GETs that are not ajax calls index.html, no matter what.  This
  // is how a SPA normally deals with browser history (react-router is a good example)
  app.get('*', function (req, res, next) {
    if ( req.xhr ) return next();
    res.sendFile(path.join(__dirname, '/static/index.html'));
  });

  // All POSTs come here, and Ajax initiated GETs too.

  // This is called when the /welcome link is clicked on in an email.  The UI posts to
  // this endpoint which verifies the token and returns the user account info for this
  // token.  The user info is used to pre-populate the welcome form, to allow the user
  // to change their profile, and to enter a new password.  This POST must include the
  // sptoken that came with the GET to /welcome (the SPA will see this).
  app.post( '/welcome', function( req, res, cb ) {
    var sptoken = req.body.sptoken;
    userdb.verifyAccount( sptoken, function( err, user ) {
      if ( err ) return cb( err );
      res.jsonp( user );
    });
  });

  // The submit button on the welcome form does this POST.  
  // When this POST returns back to the client, the client will
  // POST to /login with the user's email and password and then
  // redirect to the apps home page.
  app.post( '/welcomed', function( req, res, cb ) {
    var givenName = req.body.givenName;
    var surname = req.body.surname;
    var email = req.body.email;
    var password = req.body.password;

    app.lib.userdb.searchForUsers({ email: email }, function( err, accounts ) {
      if ( err ) return cb( err );
      if ( ! accounts.length ) return cb( new Error( 'Cannot find user' ) );
      var user = { id: accounts[0].id || require( 'path' ).basename( user.href ) };
      user.givenName = givenName;
      user.surname = surname;
      app.lib.userdb.createPasswordHash( password, function( err, hash ) {
        if ( err ) return cb( err );
        user.password = hash;
        app.lib.userdb.saveUser( user, function( err ) {
          if ( err ) return cb( err );
          res.jsonp( accounts[0] );
        });
      });
    });
  });

  ...
```



