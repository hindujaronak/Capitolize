var os = require( 'os' );
var fs = require( 'fs' );
var path = require( 'path' );
var _ = require( 'lodash' );

// Also requires: shortid, xlsx, csv-parse

module.exports = function( app ) {

  function normalizeMimetype( filename, mimetype ) {
    if ( ! mimetype ) {
      // guess, passsed on file extension
      var ext = path.extname( filename );
      if ( ext == '.csv' ) return 'text/csv';
      if ( ext == '.xlsx' ) return 'application/xlsx';
      return 'unknown (' + ext + ')';
    }
    else {
      var mimes4format = {
	csv: [
          'text/csv',
          'application/csv',
          'text/comma-separated-values',
          'application/excel',
          'application/vnd.ms-excel',
          'application/vnd.msexcel',
          'text/plain',
          'text/anytext',
          'application/txt',
          'application/octet-stream',
	],
	xlsx: [
          'application/xlsx',
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          'application/vnd.openxmlformats-officedocument.spreadsheetml.template',
          'application/vnd.ms-excel.sheet.macroEnabled.12',
          'application/vnd.ms-excel.template.macroEnabled.12',
          'application/vnd.ms-excel.addin.macroEnabled.12',
          'application/vnd.ms-excel.sheet.binary.macroEnabled.12',
	],
      };
      var found = null;
      [ 'csv', 'xlsx' ].forEach( function( format ) {
        if ( found ) return;
        if ( ! mimes4format[ format ] ) return;
        if ( _.indexOf( mimes4format[ format ], mimetype ) < 0 ) return null;
        found = mimes4format[ format ][0];
      });
      return found || 'unknown (' + mimetype + ')';
    }
  }

  // cb( err, row ): row==null when no more data
  function process( filename, mimetype, cb ) {
    // assume the file exists on the disk.
    var realMimetype = normalizeMimetype( filename, mimetype );
    if ( realMimetype == 'application/xlsx' ) {
      // convert it into csv
      var shortid = require( 'shortid' );
      var csvFilename = path.join( os.tmpdir(), shortid.generate() );
      fs.readFile( filename, 'binary', function( err, buffer ) {
	if ( err ) return cb( err );
	try {
	  var XLSX = require( 'xlsx' );
          var workbook = XLSX.read( buffer, {type:"binary"} );
          var sheet_name_list = workbook.SheetNames;
          var csv = XLSX.utils.sheet_to_csv( workbook.Sheets[sheet_name_list[0]] );
	  fs.writeFile( csvFilename, csv, function( err ) {
	    if ( err ) return cb( err );
	    processCSV( csvFilename, cb );
	  });
	} catch( err ) {
	  app.log.error( err );
	  return cb( new Error( 'XXCould not convert an xlsx to a csv: ' + err.message ) );
	}
      });
    }
    else if ( realMimetype == 'text/csv' ) {
      processCSV( filename, cb );
    }
    else {
      cb( new Error( 'Unsupported mimetype: ' + realMimetype ) );
    }
  }

  // filename can be a string
  function processCSV( filename, cb ) {
    var parser = require( 'csv-parse' );
    var csv = parser();
    csv.on( 'readable', function() {
      var record;
      while( record = csv.read() ) {
	cb( null, record );
      }
    });
    csv.on( 'error', function( err ) {
      cb( err );
    });
    csv.on( 'finish', function() {
      var isFile = fs.existsSync( filename );
      if ( isFile ) {
	fs.unlinkSync( filename );
      }
      cb( null, null );
    });
    var isFile = fs.existsSync( filename );
    if ( isFile ) {
      fs.createReadStream( filename ).pipe( csv );
    }
    else {
      csv.write( filename );
      csv.end();
    }
  }

  return {
    process: process,
    processCSV: processCSV,
  };
};

