var util 			= require('util'),
	EventEmitter	= require('events').EventEmitter,
	http 			= require("http"),
	url 			= require("url"),
	// xml2js = require('xml2js'),
	xmldom 			= require("xmldom"),
	request 		= require( "request" );

var xmlSerializer	= new xmldom.XMLSerializer();
var domParser		= new xmldom.DOMParser();
function byteLength(str) {
	// returns the byte length of an utf8 string
	var s = str.length;
	for (var i=str.length-1; i>=0; i--) {
		 var code = str.charCodeAt(i);
		 if (code > 0x7f && code <= 0x7ff) s++;
			else if (code > 0x7ff && code <= 0xffff) s+=2;
		 if (code >= 0xDC00 && code <= 0xDFFF) i--; //trail surrogate
		}
	return s;
}

var TRACE = true;
var DETAIL = false;


/* ---------------------------------------------------------------------------------- */
const SOAP_ENV_PRE = "<?xml version=\"1.0\" encoding=\"utf-8\"?>\n<s:Envelope \
s:encodingStyle=\"http://schemas.xmlsoap.org/soap/encoding/\" \
xmlns:s=\"http://schemas.xmlsoap.org/soap/envelope/\" \>\n<s:Body>\n";

const SOAP_ENV_POST = "</s:Body>\n</s:Envelope>";


/* XXX DEBUG
var UpnpAction = function(desc) {
	this.name = desc.name;
	this.arguments = {};
}
*/

//____________________________________________________________________________________________________
/**
 * A subscription
 */
//____________________________________________________________________________________________________
var Subscription = function(service, sid, timeout) {
	var self = this;
	this.service = service;
	this.sid = sid;		// subscrioption id
	this.timeout = timeout;	// timeout in seconds
	
	this.timer = setTimeout(function() { 
		self._resubscribe();
	}, (this.timeout*1000)-30000);
}

Subscription.prototype._resubscribe = function() {
	var self = this;
	this.service._resubscribe(this.sid, function(err, buf) {
		if (typeof err !== 'undefined' && err !== null && err !== '') {
			console.error("ERROR:  problem re-subscribing: " + err + "\n" + buf);
			// remove from eventhandler
			self.service.device.controlPoint.eventHandler.removeSubscription(self);
			clearTimeout(self.timer);
			
			// TODO maybe try a new subscription ???
			self.service.subscribe( function(err, buf) {
										 if(err) {
											 console.error("Cancel all hope for", self.service.serviceType, self.service.device.friendlyName);
											} else {//console.log("New subscription done for", self.service.serviceType, self.service.device.friendlyName);
												    self.service.emit('newSubscription', {"old": self, "new": buf});
												   }
										}
								  );
		}
		else {
			// cool
            // console.log("Resubscription done for", self.service.serviceType, self.service.device.friendlyName);
			self.timer = setTimeout(function() { 
				self._resubscribe();
			}, (self.timeout*1000)-5000);
		}
	});
}

Subscription.prototype.unsubscribe = function() {
	clearTimeout(this.timer);
	this.service.unsubscribe(this.sid);
}

Subscription.prototype.handleEvent = function(event) {
	if (TRACE && DETAIL) {
		console.log("subscription event: " + JSON.stringify(event));
	}
	try {this.service.emit("stateChange", event);
		} catch(err) {console.error("ERROR when calling service.emit for UPnP event:", err);}
}


//____________________________________________________________________________________________________
/**
 * A UPnP service.
 *
 * device: the device offering the service
 * desc: an object containing details of the service.
 */
//____________________________________________________________________________________________________
var UpnpService = function(device, desc) {
    EventEmitter.call(this);

	if (TRACE && DETAIL) {
		console.log("creating service object for: " + JSON.stringify(desc)); 
	}

	this.device = device;

	this.serviceType = desc.serviceType[0];
	this.serviceId   = desc.serviceId[0];
	this.controlUrl  = desc.controlURL[0]; if(this.controlUrl.indexOf('/') !== 0) {this.controlUrl = '/' + this.controlUrl;}
	this.eventSubUrl = desc.eventSubURL[0];
	this.scpdUrl     = desc.SCPDURL[0];

	// actions that can be performed on this service
	this.actions = {};

	// variables that represent state on this service.
	this.stateVariables = {};

	var u = url.parse(device.location);
	this.host = u.hostname;
	this.port = u.port;
	
	this.subscriptionTimeout = 300; // 60;
}

util.inherits(UpnpService, EventEmitter);

/**
 * Call an action on a service.
 * args is a java object of name, value pairs. e.g. { BinaryState : v }
 */
UpnpService.prototype.callAction = function(actionName, args, callback) {
	if (TRACE && DETAIL) {
		console.log("calling action : " + actionName + " " + JSON.stringify(args));
	}
	/*
	var argXml = "";
	for (name in args) {
		argXml += "<" + name + ">" + args[name] + "</" + name + ">"; 
	}
	var content =  "<u:" + actionName + " xmlns:u=\""+this.serviceType+"\">" + argXml + "</u:" + actionName + ">";
	*/
	// DEBUG XXX
		var str =  "<u:" + actionName + " xmlns:u=\""+this.serviceType+"\"></u:" + actionName + ">";
		var doc = domParser.parseFromString( str );
		for (var name in args) {
			 var node = doc.createElement(name);
			 node.appendChild( doc.createTextNode(args[name]) );
			 doc.documentElement.appendChild( node );
			}
		// console.log("<DEBUG>\n", new xmldom.XMLSerializer().serializeToString( doc ), "\n</DEBUG>");
	// XXX
	
	
	
	// var s = [SOAP_ENV_PRE, content, SOAP_ENV_POST].join("");
	var s = [SOAP_ENV_PRE, xmlSerializer.serializeToString( doc ), SOAP_ENV_POST].join("");
	// console.log(s.length, '/', byteLength(s));
	// console.log(s);
	
	var options = {
	  	host    : this.host,
	  	port    : this.port,
	  	path    : this.controlUrl,
	  	method  : "POST"
	}
	if (TRACE && DETAIL) {
		console.log("sending SOAP request " + JSON.stringify(options) + "\n" + s);
	}

	options.headers = {
		"host"           : this.host + ":" + this.port,
		"SOAPACTION"     : "\"" + this.serviceType + "#" + actionName + "\"",
		'CONTENT-TYPE'   : 'text/xml; charset="utf-8"',
		"Content-Length" : byteLength(s)//s.length,
	};
	// console.log("_____________________\n\nCall", actionName, byteLength(s), '/', s.length, "\noptions:", options, "\nheaders:", options.headers, "\n", s, "\n\n_____________________");

	var req = http.request(options, function(res) {
		var buf = "";
		res.on('data', function (chunk) { buf += chunk });
		res.on('end', function () { 
			if (res.statusCode !== 200) {
			  callback(new Error("Invalid SOAP action, code:" + res.statusCode + "\n" + buf), buf);
			}
			else {
				callback(null, buf)
			}
		});
	});
	req.on('error', function(e) {
		  console.error('problem with callAction: ', e.message);
		});
	req.end(s);
}

var reURL = /^(https?):\/\/([\w|\.|\d]*)\:?(\d+)\/(.*)$/i;

var netInterfaces = require( "./netInterfaces.js" ).netInterfaces ;

UpnpService.prototype.subscribe = function(callback/*, nbTry*/) {
	var self = this;
	var IP = "127.0.0.1";

	var path, host = this.host, port = this.port;
	if(this.eventSubUrl.indexOf('/') !== 0) {
		 if(this.eventSubUrl.indexOf('http') !== 0) {
			 path = '/'; path += this.eventSubUrl;
			} else {var reRes = reURL.exec( this.eventSubUrl );
					host	= reRes[2];
					port	= reRes[3];
					path	= reRes[4];
				   }
		} else {path = this.eventSubUrl;}

	var hostArray = host.split( "." );
	var interface = netInterfaces.filter( function(netInterface) {
		var adresseArray = netInterface.address.split( "." );
		return adresseArray[0] === hostArray[0]
		    && adresseArray[1] === hostArray[1]
		    && adresseArray[2] === hostArray[2] ;
	})[0] || netInterfaces.filter( function(netInterface) {
            var adresseArray = netInterface.address.split( "." );
            return adresseArray[0] === hostArray[0]
                && adresseArray[1] === hostArray[1];
        })[0];
	if(interface) {
		IP = interface.address;
		// console.log( "Right IP address to use is", IP );
	}


	var callbackUrl = "http://" + IP + ":" + this.device.controlPoint.eventHandler.serverPort + "/listener";
	//console.log("Subscribe with;\n\t-host:", host, "\n\t-callbackUrl:", callbackUrl);
	var url = 'http://' + host + ':' + port + path;
	var options = {
	  	method	: "SUBSCRIBE",
	  	url		: url,
	  	headers	: {
			"HOST"    			: host + ":" + port,
			"CALLBACK" 			: "<" + callbackUrl + ">",
			"NT"      			: "upnp:event",
			"TIMEOUT"			: "Second-" + this.subscriptionTimeout,
			"USER-AGENT"		: "TActHab/1 UPnP/1.1 nodejsUPnP/1",
			"Content-Length"	: 0
		}
	};
	// console.log( "subscribing to", url, "with", options );
	request( options, function(err, response/*, body*/) {
		if(err) {
			console.error( "Error subscribing to", options, "\n=> ERROR:", err);
		} else {
			// console.log( "Subscribe =>", response.statusCode, body );
			if( response.statusCode === 200) {
				// console.log( "response.headers", response.headers );
				var sid 			= response.headers.sid;
				var timeout 		= parseInt( response.headers.timeout.slice(response.headers.timeout.indexOf('-')+1) );
				var subscription 	= new Subscription(self, sid, timeout);
				self.device.controlPoint.eventHandler.addSubscription(subscription);

				if(callback) {callback(null, subscription);}
			}
		}
	})
}

UpnpService.prototype.XXX_subscribe = function(callback, nbTry) {
	if(typeof nbTry === "undefined") {nbTry = 3;}
	var self = this;
	// TODO determine IP address for service to callback on.
	var callbackUrl = "http://" + this.device.localAddress + ":" + this.device.controlPoint.eventHandler.serverPort + "/listener";
	
	var path, host = this.host, port = this.port;
	if(this.eventSubUrl.indexOf('/') !== 0) {
		 if(this.eventSubUrl.indexOf('http') !== 0) {
			 path = '/'; path += this.eventSubUrl;
			} else {var reRes = reURL.exec( this.eventSubUrl );
					host	= reRes[2];
					port	= reRes[3];
					path	= reRes[4];
					// return;
				   }
		} else {path = this.eventSubUrl;}
		
	var options = {
	  	method  : "SUBSCRIBE",
	  	host    : host,
	  	port    : port,
	  	path    : path
		};
	options.headers = {
		"HOST"    			: host + ":" + port,
		"CALLBACK" 			: "<" + callbackUrl + ">",
		"NT"      			: "upnp:event",
		"TIMEOUT"			: "Second-" + this.subscriptionTimeout,
		"USER-AGENT"		: "TActHab/1 UPnP/1.1 nodejsUPnP/1",
		"Content-Length"	: 0
	};
	
	if (TRACE && DETAIL) {
		console.log("subscribing: " + JSON.stringify(options));
	}
	// console.log( "\n______________________________________\nsubscribe to:\n\tpath : ", path, "\n\t  cb : ", callbackUrl);
	var req = http.request(options, function(res) {
		var buf = "";
		res.on('data', function (chunk) { buf += chunk });
		res.on('end', function () {
			if (res.statusCode !== 200) {
			  if(res.statusCode === 405) {
				 console.error( options );
				 // console.error( options.headers );
				}
			  //callback(new Error("Problem with subscription on " + service.serviceId + " status HTTP " + res.statusCode), buf);
			  console.error( "Problem with subscription on device", self.device.friendlyName, "service", self.serviceId, " status HTTP ", res.statusCode, buf);
			  if(nbTry) {
				 console.error( "Retry in ", 2*(4-nbTry), "seconds" );
				 setTimeout	( function() {self.subscribe(callback, nbTry-1);}
							, 2000 * (4-nbTry) 
							);
				} else	{console.error( JSON.stringify(options) );
						 callback(new Error("Problem with subscription on " + self.serviceId + " status HTTP " + res.statusCode), buf);
						}
			}
			else {
				if (TRACE && DETAIL) {
					 console.log("got subscription response: " + JSON.stringify(res.headers.sid));
					}
				console.log("upnp-service, subscribe ok with", res.headers);
				var sid = res.headers.sid;
				var timeout = parseInt( res.headers.timeout.slice(res.headers.timeout.indexOf('-')+1) );
				var subscription = new Subscription(self, sid, Math.min(self.subscriptionTimeout, timeout));
				self.device.controlPoint.eventHandler.addSubscription(subscription);

				if(callback) callback(null, subscription)
			} 
		});
	});
	req.on('error', function(e) {
		  console.error('problem with subscribe: ', e.message);
		});
	req.end();
}

/**
 * 
 */
UpnpService.prototype._resubscribe = function(sid, callback) {
	var self = this;
	var path, host = this.host, port = this.port;
	if(this.eventSubUrl.indexOf('/') !== 0) {
		 if(this.eventSubUrl.indexOf('http') !== 0) {
			 path = '/'; path += this.eventSubUrl;
			} else {var reRes = reURL.exec( this.eventSubUrl );
					host	= reRes[2];
					port	= reRes[3];
					path	= reRes[4];
					// return;
				   }
		} else {path = this.eventSubUrl;}

	var options = {
	  	method  : "SUBSCRIBE",
	  	host    : host, 
	  	port    : port,
	  	path    : path 
	}
	options.headers = {
		"HOST"		: host + ":" + port,
		"SID"		: sid,
		"TIMEOUT"	: "Second-" + this.subscriptionTimeout
	};
	
	// console.log( "Re-subscribe to", path, sid, this.subscriptionTimeout);
	var req = http.request(options, function(res) {
		var buf = "";
		res.on('data', function (chunk) { buf += chunk });
		res.on('end', function () { 
			if (res.statusCode < 200 || res.statusCode >= 300) {
				console.error("Problem with re-subscription on " + sid + " : " + buf, "\n----->", self.serviceType, self.device.friendlyName);
				if(callback) callback("Error with status"+res.statusCode, buf);
			}
			else {
				if(res.statusCode !== 200) {console.log("OK with status", res.statusCode, "for",  self.device.friendlyName + " : " + self.serviceId);}
				if (TRACE && DETAIL) {
					 console.log("re-subscription success: " + self.device.udn + " : " + self.serviceId);
					}
				// console.log('success with _resubscribe: ', JSON.stringify( options ));
				if(callback) callback(null, buf);
			} 
		});
	});
	req.on('error', function(e) {
		  console.error('---------> problem with _resubscribe: ', e.message, "\noption:", JSON.stringify( options ));
		  if(callback) callback("Error with status" + e.message, null);
		});
	req.end("");
}

/**
 * 
 */
UpnpService.prototype.unsubscribe = function(sid, callback) {
	var self = this;
	var options = {
	  	method  : "UNSUBSCRIBE",
	  	host    : this.host,
	  	port    : this.port,
	  	path    : this.eventSubUrl
	}
	options.headers = {
		"host"     : this.host + ":" + this.port,
		"sid"      : sid
	};

	var req = http.request(options, function(res) {
		var buf = "";
		res.on('data', function (chunk) { buf += chunk });
		res.on('end', function () { 
			if (res.statusCode !== 200) {
				if (callback && typeof(callback) === "function") {
					callback(new Error("Problem with unsubscription on " + self.serviceId), buf);
				}
			}
			else {
				if (TRACE && DETAIL) {console.log("unsubscribe success: " + buf);}
				if (callback && typeof(callback) === "function") {
					callback(null, buf);
				}
			} 
		});
	});
	req.on('error', function(e) {
		  console.error('problem with unsubscribe: ', e.message);
		});
	req.end("");
}

/**
 * 
 */
UpnpService.prototype._getServiceDesc = function(callback) {
	var self = this;
	var options = {
		host : this.host,
		port : this.port,
		path : this.scpdUrl
	}
	options.headers = {
		"host"  : this.host + ":" + this.port
	};
	var req = http.request(options, function(res) {
		var buf = "";
		res.on('data', function (chunk) { buf += chunk });
		res.on('end', function () { 
			if (res.statusCode !== 200) {
				callback(new Error("Problem with getting basic event service desc " + self.serviceId), buf);
			}
			else {
				// TODO handle actions and state variables
				callback(null, buf);
			} 
		});
	});
	req.on('error', function(e) {
		  console.error('problem with _getServiceDesc: ', e.message);
		});
	req.end("");
}



exports.UpnpService = UpnpService;



