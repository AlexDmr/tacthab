define	( [ '../../socket.io/socket.io'
		  ]
		, function(io) {
var callId = 0;
var utils = {
	XHR : function(method, ad, params) {
		// method	: GET or POST
		// ad		: adress of the ressource to be loaded
		// params : An object containing two possible parameters.
		//		- onload	: a function taking no argument, response will be contains in object this.
		//		- variables : an object containing a set of attribute<->value
		//		- form 		: a reference to a HTML form node
		var xhr = new XMLHttpRequest();
		params = params || {};
		xhr.onload = params.onload || null;
		xhr.open(method, ad, true);
		if(params.form || params.variables) {
			 var F = new FormData( params.form );
			 for(var i in params.variables) {
				 F.append(i, params.variables[i]);
				}
			 xhr.send( F );
			} else {xhr.send();}
	}
	, io	: io()
	, call	: function(objectId, method, params, cb) {
		 var call =	{ objectId	: objectId
					, method		: method
					, params		: JSON.stringify( params )
					};
		 if(cb) {
			 call.callId = callId++;
			}
		 console.log( "Calling", call);
		 utils.io.emit	( 'call', call
						, function(data){
							 // console.log("Call", call.callId, " returns", data);
							 cb(data);
							}
						);
		}
};

return utils;
});
