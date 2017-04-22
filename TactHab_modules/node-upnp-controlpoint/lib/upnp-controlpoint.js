// var upnp = require("upnp-client"),
var upnp			= require("./upnp"),
	util			= require('util'),
	EventEmitter	= require('events').EventEmitter,
	http			= require("http"),
	// Url				= require("url"),
	xml2js			= require('xml2js'),
	UpnpDevice		= require("./upnp-device").UpnpDevice,
	// ipPackage		= require('ip'),
	request			= require('request')
	;
	
var TRACE = false;
var DETAIL = false;
var TLS_SSL;



//____________________________________________________________________________________________________
/* ----------------------------------- utility functions ------------------------------------- */
//____________________________________________________________________________________________________

if (typeof String.prototype.startsWith != 'function') {
  // see below for better implementation!
  String.prototype.startsWith = function (str){
    return this.indexOf(str) === 0;
  };
}

function getUUID(usn) {
	var udn = usn;
	if(udn) {
        var s = usn.split("::");
        if (s.length > 0) {
            udn = s[0];
        }

        if (udn.startsWith("uuid:")) {
            udn = udn.substring(5);
        }
    }
	return udn;
}


//____________________________________________________________________________________________________
//____________________________________________________________________________________________________
//____________________________________________________________________________________________________
var EventHandler = function() {
	var self = this;

	this.serverPort = 6767;
	this.responseCount = 1;		// not sure if this is supposed to be per-subscription
	this.server = http.createServer(function(req, res) {
		self._serviceCallbackHandler(req, res);
	});

	this.server.listen(this.serverPort);
	
	this.subscriptions = {};
};

EventHandler.prototype.addSubscription = function(subscription) {
	this.subscriptions[subscription.sid] = subscription;
};

EventHandler.prototype.removeSubscription = function(sid) {
	delete this.subscriptions[sid];
};

/**
 "host":"192.168.0.122:6767","content-type":"text/xml","content-length":"140","nt":"upnp:event","nts":"upnp:propchange","sid":"uuid:7edd52ba-1dd2-11b2-8d34-bb2eba00fd46","seq":"0"
 
 * @param {Object} req
 * @param {Object} res
 */
EventHandler.prototype._serviceCallbackHandler = function(req, res) {
	// console.log("got request: " + JSON.stringify(req.headers));

	var self = this;
	var reqContent = "";	
	req.on("data", function(buf) {
		reqContent += buf;
	});
	req.on("end", function EventReceived(nbTimes) {
		if(typeof nbTimes === 'undefined') {nbTimes = 3}
		if(nbTimes === 0)  {console.log("stop retrying for", req.headers.sid);
							return;}
		// console.log("\n------------------------------------\n------------callback content: " + reqContent);
		try {//console.log("_serviceCallbackHandler");
			var sid = req.headers.sid;
			var subscription = self.subscriptions[sid];
			if (subscription) {
				 // console.log( "\tsubscription" );
				 if (TRACE && DETAIL) {
					console.log("event for", req.headers.host ,"sid " + sid, 'with seq', req.headers.seq, 'and length', req.headers['content-length']);
				 }
				// acknowledge the event notification					
				 res.writeHead	( 200
				 				// , { "Extended-Response" : self.responseCount + " ; comment=\"Notification Acknowledged\"" }
				 				);
				 res.end("");
				 self.responseCount++;
				 // console.log( "\tsubscription.handleEvent", subscription.handleEvent);
				 subscription.handleEvent( {textXML : reqContent} );
				} else {
						if(nbTimes > 1) {
							 // console.log("\tretrying in 1 second ("+nbTimes+" times left)...");
							 setTimeout	( (function(nbTimes) {
											 return function() {EventReceived(nbTimes);}
											})(nbTimes - 1)
										, 1000);
							} // else {console.error("\n_____________________________\nNo one listening aborting after 3 trials...", req.headers);}
					   }
		}
		catch (ex) {
			if (ex.toString().startsWith("Error: Text data outside of root node.")) {
				// ignore
			}
			else {
				 console.error("exception: ", ex);
			}
		}
	});
};


//____________________________________________________________________________________________________
// Some debug... ________________________________
// var network	= require('network');
// console.log("IP¨adress :", ipPackage.address());
// network.get_active_interface( function(err, obj) {console.log('get_active_interface:', obj || err);} );
// network.get_interfaces_list ( function(err, obj) {console.log('get_interfaces_list :', obj || err);} );
// ______________________________________________


//____________________________________________________________________________________________________
//____________________________________________________________________________________________________
//____________________________________________________________________________________________________
var UpnpControlPoint = function( TLS_SSL_json ) {
	TLS_SSL = TLS_SSL_json;
	
    EventEmitter.call(this);
    
	var self = this;

	this.devices = {};	// a map of udn to device object

	this.ssdp = new upnp.ControlPoint();	// create a client instance

	/**
	 * Device found

	NT: Notification Type
		upnp:rootdevice 
			Sent once for root device. 
		uuid:device-UUID
			Sent once for each device, root or embedded, where device-UUID is specified by the UPnP vendor. See 
			section 1.1.4, “UUID format and RECOMMENDED generation algorithms” for the MANDATORY UUID format. 
		urn:schemas-upnp-org:device:deviceType:ver
			Sent once for each device, root or embedded, where deviceType and ver are defined by UPnP Forum working 
			committee, and ver specifies the version of the device type. 
		urn:schemas-upnp-org:service:serviceType:ver
			Sent once for each service where serviceType and ver are defined by UPnP Forum working committee and ver
			specifies the version of the service type. 
		urn:domain-name:device:deviceType:ver
			Sent once for each device, root or embedded, where domain-name is a Vendor Domain Name, deviceType and ver
			are defined by the UPnP vendor, and ver specifies the version of the device type. Period characters in the Vendor 
			Domain Name MUST be replaced with hyphens in accordance with RFC 2141. 
		urn:domain-name:service:serviceType:ver
			Sent once for each service where domain-name is a Vendor Domain Name, serviceType and ver are defined by 
			UPnP vendor, and ver specifies the version of the service type. Period characters in the Vendor Domain Name 
			MUST be replaced with hyphens in accordance with RFC 2141. 
	 */
	this.ssdp.on("DeviceFound", function(device) {
		var udn = getUUID(device.usn || device.udn);
        if(!udn) {return;}
		if (TRACE) {console.log("DeviceFound: " + udn);}
		if (self.devices[udn]) {	
			return self.ssdp.emit("DeviceAvailable", device); // already got this device
		}
		self.devices[udn] = "holding";
		self._getDeviceDetails(udn, device.location, function(deviceObj) {
			self.devices[udn] = deviceObj;
			self.emit("device", deviceObj);
            return self.ssdp.emit("DeviceAvailable", device);
		});
	});
	
	/**
	 * Device alive
	 */
	var RE = /= *([0-9]*)$/;
	this.ssdp.on("DeviceAvailable", function(device) {
		var udn = getUUID(device.usn || device.udn), timeCacheControl = 1800*1000, keys = Object.keys(device);
		if(!udn) {return;}
		for(var i=0; i<keys; i++) {
			if( keys[i].toLowerCase() === "cache-control") {
                var resRE = RE.exec(device[ keys[i] ]);
                if(resRE) {
                    timeCacheControl = Math.max( 300, parseInt( resRE[1] )*1000 );
				}
				break;
			}
		}

        //console.log( "DeviceAvailable:", device );
		if (self.devices[udn]) {
            if(self.devices[udn].liveCB) {clearTimeout( self.devices[udn].liveCB );}
            // console.log( "Heartbeat (", RE.exec(device["cache-control"])[1], " seconds) for:", device.location );
            self.devices[udn].liveCB = setTimeout(
                function() {self.ssdp.emit("DeviceUnavailable", device);},
                timeCacheControl
            );
		} else {
            self.devices[udn] = "holding";
            self._getDeviceDetails(udn, device.location, function (deviceObj) {
                if(self.devices[udn] && self.devices[udn].liveCB) {clearTimeout( self.devices[udn].liveCB );}
                self.devices[udn] = deviceObj;
                // console.log("Heartbeat (", RE.exec(device["cache-control"])[1], " seconds) for:", device.location);
                self.devices[udn].liveCB = setTimeout(
                    function () {self.ssdp.emit("DeviceUnavailable", device)},
                    timeCacheControl
                );
                self.emit("device", deviceObj);
            });
        }
	});
	
	/**
	 * Device left the building
	 */
	this.ssdp.on("DeviceUnavailable", function(dev) {
		var udn = getUUID(dev.usn || dev.udn);
        if(!udn) {return;}
			
		if (TRACE) {
			console.log("DeviceUnavailable");
			console.log('\t' + JSON.stringify(dev));
		}
        // console.log( "Heartbeat missing (", RE.exec(dev["cache-control"])[1], " seconds) for:", dev );
		self.emit("device-lost", udn);

		if(self.devices[udn] && self.devices[udn].liveCB) {
			clearTimeout( self.devices[udn].liveCB );
		}
		delete self.devices[udn];
	});
	
	/**
	 * Device has been updated
	 */
	this.ssdp.on("DeviceUpdate", function(device) {
		// var udn = getUUID(device.usn);
			
		if (TRACE) {
			console.log("DeviceUpdate");
			console.log('\t' + JSON.stringify(device));
		}
		
		//self.devices[udn] = device;
	
		// TODO update device object
	});

	// for handling incoming events from subscribed services
	this.eventHandler = new EventHandler();
};

util.inherits(UpnpControlPoint, EventEmitter);


UpnpControlPoint.prototype.search = function(s) {
	var self = this;
	s = s || 'upnp:rootdevice'; //'ssdp:all';
	self.ssdp.search(s);
};

/**
 * Query the device for details.
 * 
 * @param {Object} deviceUrl
 */	
UpnpControlPoint.prototype._getDeviceDetails = function(udn, location, callback) {
	var self = this;
	var localAddress = /*ipPackage.address();*/"127.0.0.1";		// will determine which local address is used to talk with the device.
	if (TRACE) {
		console.log("getting device details from " + location);
	}
	// var options = Url.parse(location);
	// console.log("getting device details from ", location);
	var objRequest = {uri: location};
	if( TLS_SSL && location.indexOf("https://") === 0) {
		objRequest.cert				= TLS_SSL.cert		;
		objRequest.key				= TLS_SSL.key		;
		objRequest.securityOptions	= 'SSL_OP_NO_SSLv3'	;
	}
	request(objRequest, function(error, response, body) {
		if (!error && response.statusCode == 200) {
			xml2js.parseString(body, function(err, result) {
                if (err || !result || !result.root) {
                    console.log("problem getting device details: no result.root");
                    return;
                }

				var desc = result.root.device[0];
				if (TRACE) {
					console.log(desc.deviceType + " : " + desc.friendlyName + " : " + location);
				}
				var device = new UpnpDevice(self, udn, location, desc, localAddress, body);
				callback(device);
			});
		} // else {console.error(response?response.statusCode:"no response"/*, error*/);}
	});
	
	/*
	var req = http.request(options, function(res) {
		//res.setEncoding('utf8');
		var resData = "";
		res.on('data', function (chunk) {
			resData += chunk;
		});
		res.on('end', function () {
			if (res.statusCode != 200) {
				console.log("problem getting device details: " + res.statusCode + " : " + resData);
				return;
			}
			xml2js.parseString(resData, function(err, result) {
                if (!result.root) {
                    console.log("problem getting device details: no result.root");
                    return;
                }

				var desc = result.root.device[0];
				if (TRACE) {
					console.log(desc.deviceType + " : " + desc.friendlyName + " : " + location);
				}
				var device = new UpnpDevice(self, udn, location, desc, localAddress, resData);
				callback(device);
			});
		});
	});
	// req.on('socket', function(socket) {
		// localAddress = socket.address().address;	// the local address used to communicate with the device. Used to determine callback URL. 
	// });
	req.on('error', function(e) {
		console.log('problem with request: ' + e.message);
	});
	req.end();
	*/
};


/* ---------------------------------------------------------------------------------- */
/*
	headers:
 {
 	"host":"192.168.0.122:6767",
 	"content-type":"text/xml",
 	"content-length":"132",
 	"nt":"upnp:event",
 	"nts":"upnp:propchange",
 	"sid":"uuid:4af70162-1dd2-11b2-8f95-86a98a724376",		// subscription ID
 	"seq":"2"
 }
 
	content:
	<e:propertyset xmlns:e="urn:schemas-upnp-org:event-1-0">
		<e:property>
			<BinaryState>1</BinaryState>
		</e:property>
	</e:propertyset>
 */



exports.UpnpControlPoint = UpnpControlPoint;


