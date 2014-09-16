define	( [ '/socket.io/socket.io.js'
		  ]
		, function(io) {
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
		xhr.open(method, ad);
		if(params.form || params.variables) {
			 var F = new FormData( params.form );
			 for(var i in params.variables) {
				 F.append(i, params.variables[i]);
				}
			 xhr.send( F );
			} else {xhr.send();}
	}
	, io : io()
};

return utils;
});
