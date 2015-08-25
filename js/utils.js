var io = require(//'../node_modules/socket.io/lib/client.js'
				//'../../socket.io/socket.io' 
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
		var xhr = new XMLHttpRequest();
		if(typeof params === 'function') {
			 params = {onload: params};
			}
		params = params || {};
		/*xhr.onload*/ xhr.onloadend = params.onload || null;
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
					, method	: method
					, params	: JSON.stringify( params )
					};
		 if(cb) {
			 call.callId = callId++;
			}
		 // console.log( "Calling", call);
		 utils.io.emit	( 'call', call
						, function(data){
							 // console.log("Call", call.callId, " returns", data);
							 if(cb) {cb(data);}
							}
						);
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

