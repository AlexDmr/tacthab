var io = require(//'../node_modules/socket.io/lib/client.js'
				// '../node_modules/socket.io/node_modules/socket.io-client/socket.io.js'
				'socket.io-client'
				);

var callId = 0;
var utils = {
	XHR : function(method, ad, params) {
		// method	: GET or POST
		// ad		: adress of the ressource to be loaded
		// params : An object containing two possible parameters.
		//		- onload	: a function taking no argument, response will be contains in object this.
		//		- variables : an object containing a set of attribute<->value
		//		- form 		: a reference to a HTML form node
		return new Promise	( function(resolve, reject) {
								var xhr = new XMLHttpRequest();
								if(typeof params === 'function') {
									 params = {onload: params};
									}
								if( typeof params === "object" 
									&& !params.onload 
									&& !params.form 
									&& !params.variables) {params = { variables : params };}
								params = params || {};
								xhr.onloadend = function() {
													 if(params.onload) {params.onload.call(this);}
													 if	( this.status >= 400) {reject(this);} else {resolve(this);}
													}
								xhr.open(method, ad, true);
								console.log(method, ad, params);
								if(params.form || params.variables) {
									 var F = new FormData( params.form );
									 for(var i in params.variables) {
										 F.append(i, params.variables[i]);
										}
									 xhr.send( F );
									} else {xhr.send();}
								}
							);
	}
	, initIO: function() {
		 this.io = this.io || io.apply(null, arguments);
		}
	// , io	: io()
	, call	: function(objectId, method, params, cb) {
		 var call =	{ objectId	: objectId
					, method	: method
					, params	: JSON.stringify( params )
					};
		 if(cb) {
			 call.callId = callId++;
			}
		 // console.log( "Calling", call);
		 return new Promise	( function(resolve, reject) {
			 utils.io.emit	( 'call', call
							, function(data){
								 // console.log("Call", call.callId, " returns", data);
								 if(cb) {cb(data);}
								 resolve(data);
								}
							);
			});
		}
	, getUrlEncodedParameters	: function(a) {
		 if(typeof a === 'string') {
			 a = a.split('&');
			}
		 if (a === "") {return {};}
		 var b = {};
		 for (var i = 0; i < a.length; ++i) {
			var p=a[i].split('=', 2);
			if (p.length === 1) {
				 b[ decodeURIComponent(p[0]) ] = "";
				} else {b[ decodeURIComponent(p[0]) ] = decodeURIComponent(p[1].replace(/\+/g, " "));
					   }
			}
		 return b;
		}
	, HCI : { makeEditable	: function(node) {
				node.ondblclick = function(evt) {
									 // Turns text content into an input
									 var input = document.createElement('input');
									 input.value = node.innerHTML;
									 this.innerHTML = ""; this.appendChild( input );
									 input.focus();
									 input.ondblclick = function(e) {
										 var name = this.value;
										 // console.log(name);
										 node.innerHTML = ""; node.appendChild( document.createTextNode( name ) );
										 e.stopPropagation();
										}
									 input.onkeypress = function(e) {
										 if (e.which === 13) {input.ondblclick(e);}
										};
									 evt.stopPropagation();
									 evt.preventDefault();
									}

				}
			}
};

module.exports = utils;

