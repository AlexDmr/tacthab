var utils				= require( "../../js/utils.js" )
  ;
  
require( "./upnp.css" );

// Do a AJAX call
console.log("Accessing server to get context.");

utils.initIO(window.location.origin + "/m2m");
utils.io.on	( "brickAppears"
			, function(json) {console.log("brickAppears:", json);
							  // getDescription
							  var req =
							  utils.XHR	( 'POST', '/getDescription'
										, {brickId: json.brickId}
										);
							  req.then	( function(xhr) {
											 console.log(json.brickId, " => ", JSON.parse(xhr.response) );
											}
										);
							 }
			);
utils.io.on	( "brickDisappears"
			, function(json) {console.log("brickDisappears:", json);
							 }
			);


var getContext = utils.XHR( 'GET', '/getContext');
getContext.then	( function(response) {
					 var json = JSON.parse( response.responseText )
					 console.log(json);
					}
				, function(err) {console.error(err);}
				);
	