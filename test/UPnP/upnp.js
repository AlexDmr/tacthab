var utils				= require( "../../js/utils.js" )
  ;
  
require( "./upnp.css" );


console.log("Accessing server to get context.");
var getContext = utils.XHR( 'GET', '/getContext');
getContext.then	( function(response) {
					 var json = JSON.parse( response.responseText )
					 console.log(json);
					}
				, function(err) {console.error(err);}
				);
// Subscribing to appearing/disappearing events
utils.initIO(window.location.origin + "/m2m");
utils.io.on	( "brickAppears"
			, function(json) {console.log("brickAppears:", json);
							 }
			);
utils.io.on	( "brickDisappears"
			, function(json) {console.log("brickDisappears:", json);
							 }
			);

