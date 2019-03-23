/*
   Stream rows (an array) from csv or xlsx being uploaded to a web service.

   Requires: csv-parse, xlsx-stream-reader
   
   Recommended usage:

   var streamer = require( './streaming-spreadsheet-processor' )( app );
   streamer.setOptions({
     csv: {
       relax_column_count: true,
     },
   });

   app.post( '/upload', function( req, res, next ) {
     var busboy = new Busboy({ headers: req.headers });
     busboy.on('file', function(fieldname, file, filename, encoding, mimetype) {
       streamer.process( file, filename, mimetype, function( err, row ) {
         if ( err ) {
           console.error( err );
           if ( ! res.headersSent ) res.status( 400 ).send( err.message );
         }
         else if ( ! row ) {
           console.log( 'DONE WITH DATA' );
           if ( ! res.headersSent ) res.status( 200 ).send( 'OK' );
         }
         else {
           console.log( row );
           // process row ... recommend aync.queue() to maintain order
         }
       });
     });
     busboy.on('field', function(fieldname, val, fieldnameTruncated, valTruncated) {
       // FIELDS/FILES PROCESSING ORDER IS IN THE ORDER OF THE DOM ELEMENTS
       // IF FORM FIELDS AFFECT FILE PROCESSING, THEY MUST BE DEFINED IN THE DOM FIRST!
       console.log('Field [' + fieldname + ']: value:', val);
     });
     busboy.on('finish', function() {
       // THIS WILL BE CALLED BEFORE THE SS HAS FINISHED PROCESSING
       console.log('Done parsing form!');
     });
     req.pipe(busboy);
   });
*/
var path = require( 'path' );

module.exports = function( app ) {
  var ss_opts = {
    csv: {},
    xlsx: {skip_first_row: true }
  };

  function setOptions( opts ) {
    ss_opts = Object.assign( {}, ss_opts, opts );
  }
  
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
        if ( mimes4format[ format ].indexOf( mimetype ) < 0 ) return null;
        found = mimes4format[ format ][0];
      });
      return found || 'unknown (' + mimetype + ')';
    }
  }

  // cb( err, row ): row==null when no more data
  function process( readableStream, filename, mimetype, cb ) {
    var realMimetype = normalizeMimetype( filename, mimetype );
    if ( realMimetype == 'application/xlsx' )
      processXLSX( readableStream, cb );
    else
      processCSV( readableStream, cb );
  }

  function processXLSX( rs, cb ) {
    var XlsxStreamReader = require("xlsx-stream-reader");
    var workBookReader = new XlsxStreamReader();

    workBookReader.on('error', function (err) {
      cb( err );
    });

    workBookReader.on('worksheet', function (workSheetReader) {
      if (workSheetReader.id > 1){
        // we only want first sheet 
        workSheetReader.skip();
        return; 
      }
      workSheetReader.on('row', function (row) {
	//console.log( JSON.stringify( row, null, 2 ) );
        if ( ss_opts.xlsx.skip_first_row && (row.attributes.r == 1)) return;
        // do something with row 1 like save as column names 
        //}else{
        // second param to forEach colNum is very important as 
        // null columns are not defined in the array, ie sparse array
	var r = [];
        row.values.forEach(function(rowVal, colNum){
	  r[ colNum - 1 ] = rowVal;
        });
	cb( null, r );
        //}
      });
      workSheetReader.on('end', function () {
      });
      
      // call process after registering handlers 
      workSheetReader.process();
    });

    workBookReader.on('end', function () {
      cb( null, null );
    });
    
    rs.pipe( workBookReader );
  }

  function processCSV( rs, cb ) {
    var parser = require( 'csv-parse' );
    var csv = parser( ss_opts.csv );
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
      cb( null, null );
    });
    rs.pipe( csv );
  }

  return {
    setOptions: setOptions,
    process: process,
    processXLSX: processXLSX,
    processCSV: processCSV,
  };
};


