class Utils {

  makeRequest( url, data ) {
    return $.ajax({
      url: url,
      type: 'POST',
      processData: false, // to send json
      contentType: 'application/json',
      dataType: 'json', // get json back from server
      data: JSON.stringify( data )
    });
  }

  responseErrorText( err ) {
    if ( ! err ) return 'This is not an error';
    if ( err.message ) return err.message;
    if ( err.responseJSON && err.responseJSON.message ) return err.responseJSON.message;
    return err.responseText || err.statusText;
  }

  user( u ) {
    return {
      has: function( role ) {
	if ( ! ( u.roles && u.roles.length ) ) return false;
	return ( u.roles.findIndex( function( r ) { return r.name==role } ) >= 0 ? true : false );
      }
    };
  }

  handleError( err ) {
    console.error( err );
  }
  
}

export default new Utils();
