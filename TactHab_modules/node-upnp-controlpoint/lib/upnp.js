// var url     = require("url");
var http    = require("http");
var dgram   = require("dgram");
var util    = require("util");
var events  = require("events");

// HTTP parser
// const HTTP_PARSER_REQUEST	= process.binding('http_parser').HTTPParser.REQUEST;
// const HTTP_PARSER_RESPONSE	= process.binding('http_parser').HTTPParser.RESPONSE;

// SSDP
const SSDP_PORT = 1900;
const BROADCAST_ADDR = "239.255.255.250";
const SSDP_MSEARCH   = "M-SEARCH * HTTP/1.1\r\nHost:"+BROADCAST_ADDR+":"+SSDP_PORT+"\r\nST:%st\r\nMan:\"ssdp:discover\"\r\nMX:3\r\n\r\n";
// const SSDP_ALIVE = 'ssdp:alive';
// const SSDP_BYEBYE = 'ssdp:byebye';
// const SSDP_UPDATE = 'ssdp:update';
const SSDP_ALL = 'ssdp:all';

// Map SSDP notification sub type to emitted events 
const UPNP_NTS_EVENTS = {
  'ssdp:alive'  : 'DeviceAvailable',
  'ssdp:byebye' : 'DeviceUnavailable',
  'ssdp:update' : 'DeviceUpdate'
};

//some const strings - dont change
// const GW_ST    = "urn:schemas-upnp-org:device:InternetGatewayDevice:1";
const WANIP = "urn:schemas-upnp-org:service:WANIPConnection:1";
// const OK    = "HTTP/1.1 200 OK";
const SOAP_ENV_PRE = "<?xml version=\"1.0\"?>\n<s:Envelope xmlns:s=\"http://schemas.xmlsoap.org/soap/envelope/\" s:encodingStyle=\"http://schemas.xmlsoap.org/soap/encoding/\"><s:Body>";
const SOAP_ENV_POST = "</s:Body></s:Envelope>";


var debug;
if (process.env.NODE_DEBUG && /upnp/.test(process.env.NODE_DEBUG)) {
  debug = function(x) { console.error('UPNP: %s', x); };

} else {
  debug = function() { };
}



//____________________________________________________________________________________________________
//____________________________________________________________________________________________________
//____________________________________________________________________________________________________
function Gateway(port, host, path) {
  this.port = port;
  this.host = host;
  this.path = path;
}

// Retrieves the values of the current connection type and allowable connection types.
Gateway.prototype.GetConnectionTypeInfo = function(callback) {
  this._getSOAPResponse(
    "<u:GetConnectionTypeInfo xmlns:u=\"" + WANIP + "\">\
    </u:GetConnectionTypeInfo>",
    "GetConnectionTypeInfo",
    function(err, response) {
      if (err) return callback(err);
      var rtn = {};
      try {
        rtn.NewConnectionType = this._getArgFromXml(response.body, "NewConnectionType", true);
        rtn.NewPossibleConnectionTypes = this._getArgFromXml(response.body, "NewPossibleConnectionTypes", true);
      } catch(e) {
        return callback(e);
      }
      callback.apply(null, this._objToArgs(rtn));
    }
  );
};

Gateway.prototype.GetExternalIPAddress = function(callback) {
  this._getSOAPResponse(
    "<u:GetExternalIPAddress xmlns:u=\"" + WANIP + "\">\
    </u:GetExternalIPAddress>",
    "GetExternalIPAddress",
    function(err, response) {
      if (err) return callback(err);
      var rtn = {};
      try {
        rtn.NewExternalIPAddress = this._getArgFromXml(response.body, "NewExternalIPAddress", true);
      } catch(e) {
        return callback(e);
      }
      callback.apply(null, this._objToArgs(rtn));
    }
  );
};

Gateway.prototype.AddPortMapping = function(protocol, extPort, intPort, host, description, callback) {
  this._getSOAPResponse(
    "<u:AddPortMapping \
    xmlns:u=\""+WANIP+"\">\
    <NewRemoteHost></NewRemoteHost>\
    <NewExternalPort>"+extPort+"</NewExternalPort>\
    <NewProtocol>"+protocol+"</NewProtocol>\
    <NewInternalPort>"+intPort+"</NewInternalPort>\
    <NewInternalClient>"+host+"</NewInternalClient>\
    <NewEnabled>1</NewEnabled>\
    <NewPortMappingDescription>"+description+"</NewPortMappingDescription>\
    <NewLeaseDuration>0</NewLeaseDuration>\
    </u:AddPortMapping>",
    "AddPortMapping",
    function(err/*, response*/) {
      if (err) return callback(err);
    }
  );
};

Gateway.prototype._getSOAPResponse = function(soap, func, callback) {
  var self = this;
  var s = new Buffer(SOAP_ENV_PRE+soap+SOAP_ENV_POST, "utf8");
  var client = http.createClient(this.port, this.host);
  var request = client.request("POST", this.path, {
    "Host"           : this.host + (this.port != 80 ? ":" + this.port : ""),
    "SOAPACTION"     : '"' + WANIP + '#' + func + '"',
    "Content-Type"   : "text/xml",
    "Content-Length" : s.length
  });
  request.addListener('error', function(error) {
    callback.call(self, error);
  });
  request.addListener('response', function(response) {
    if (response.statusCode === 402) {
      return callback.call(self, new Error("Invalid Args"));
    } else if (response.statusCode === 501) {
      return callback.call(self, new Error("Action Failed"));      
    }
    response.body = "";
    response.setEncoding("utf8");
    response.addListener('data', function(chunk) { response.body += chunk });
    response.addListener('end', function() {
      callback.call(self, null, response);
    });
  });
  request.end(s);
};

// Formats an Object of named arguments, and returns an Array of return
// values that can be used with "callback.apply()".
Gateway.prototype._objToArgs = function(obj) {
  var wrapper;
  var rtn = [null];
  for (var i in obj) {
    if (!wrapper) {
      wrapper = new (obj[i].constructor)(obj[i]);
      wrapper[i] = obj[i];
      rtn.push(wrapper);
    } else {
      wrapper[i] = obj[i];
      rtn.push(obj[i]);
    }
  }
  return rtn;
};

Gateway.prototype._getArgFromXml = function(xml, arg, required) {
  var match = xml.match(new RegExp("<"+arg+">(.+?)<\/"+arg+">"));
  if (match) {
    return match[1];
  } else if (required) {
    throw new Error("Invalid XML: Argument '"+arg+"' not given.");
  }
};


//____________________________________________________________________________________________________
//____________________________________________________________________________________________________
// UPnP CONTROL POINT
//____________________________________________________________________________________________________
//____________________________________________________________________________________________________
var netInterfaces = require( "./netInterfaces.js" ).netInterfaces;
function ControlPoint() {
  var self = this;
  events.EventEmitter.call(this);
  this.server = dgram.createSocket({ type: 'udp4', reuseAddr: true });
  this.server.on('message', function(msg, rinfo) {self.onRequestMessage(msg, rinfo);});
  //XXX this._initParsers();
  this.P_membership = new Promise( function(resolve/*, reject*/) {
	  self.server.bind( SSDP_PORT
					  , function () {
                            netInterfaces.forEach( function(interface) {
                                console.log( "Multicast on ", BROADCAST_ADDR, interface.address);
                                self.server.addMembership(BROADCAST_ADDR, interface.address);
                            }); //fixed issue #2
							self.server.setMulticastLoopback(true);
	            			self.server.setBroadcast		(true);
							// self.server.setMulticastTTL(128);
							console.log('UDP4 server addMembership ' + BROADCAST_ADDR);
							// self.search('upnp:rootdevice');
							resolve(self);
						   }
					  );
	});
}
util.inherits(ControlPoint, events.EventEmitter);
exports.ControlPoint = ControlPoint;

/**
 * Message handler for HTTPU request.
 */
function pipoParseHTTP_header(str) {
	var lines = str.split("\r\n"), i, attributes = {}, pos;
	for(i=1; i<lines.length; i++) {
		 pos = lines[i].indexOf(':');
		 if(pos >= 0) {
			 attributes[ lines[i].slice(0, pos).toLowerCase().trim() ] = lines[i].slice(pos+1).trim();
			} else {break;}
		}
	var A = lines[0].split(' ');
	return { method		: A[0] || ''
		   , status		: A[2] || ''
		   , statusCode	: parseInt(A[1])
		   , firstLine	: A
		   , headers	: attributes
		   };
}

var Map_UDN_Timer = {};

ControlPoint.prototype.onRequestMessage = function(msg/*, rinfo*/) {
	var str = msg.toString('utf8');
	var res = pipoParseHTTP_header(str);
	// console.log("ControlPoint::onRequestMessage", "\n\t", res.method, ":", rinfo);
	// console.log(res);
	switch(res.method.toUpperCase()) {
		 case 'NOTIFY':
			var event = UPNP_NTS_EVENTS[res.headers.nts.toLowerCase()];
			if (event) {this.emit(event, res.headers);} else {console.log("NOTIFY", res.headers.nts);}
		 break;
		 default:
			// console.log("onRequestMessage", res.method);
		}
};

/**
 * Message handler for HTTPU response.
 */
ControlPoint.prototype.onResponseMessage = function(msg/*, rinfo*/){
	var str = msg.toString('utf8');	
	var res = pipoParseHTTP_header(str);
	// console.log("ControlPoint::onResponseMessage", "\n\tinf:", rinfo, "\n\t", res);
	if (res.statusCode === 200) {
		 debug('RESPONSE ST=' + res.headers.st + ' USN=' + res.headers.usn);
		 this.emit('DeviceFound', res.headers);
		}
};

/**
 * Send an SSDP search request.
 * 
 * Listen for the <code>DeviceFound</code> event to catch found devices or services.
 * 
 * @param String st
 *  The search target for the request (optional, defaults to "ssdp:all"). 
 */
ControlPoint.prototype.search = function(st, targetAddress) {
	if (typeof st !== 'string') {st = SSDP_ALL;}
	var client	= dgram.createSocket( { type: 'udp4' } ),
		self	= this,
		message = new Buffer(SSDP_MSEARCH.replace('%st', st), "ascii");
	this.P_membership.then( function() {
		netInterfaces.forEach( function(interface) {
            self.createDgramClientForNetInterface(interface, message);
        });
	});
  // MX is set to 3, wait for 1 additional sec. before closing the client
};


ControlPoint.prototype.createDgramClientForNetInterface = function(interface, message) {
    var client = dgram.createSocket({type: 'udp4'})
        , self = this;
    client.on('message', function (msg, rinfo) {
        self.onResponseMessage(msg, rinfo);
    });
    client.bind( {address: interface.address}, function() {
        console.log("SSDP request message at IP", interface.address);
        client.send(message, 0, message.length, SSDP_PORT, BROADCAST_ADDR);
        setTimeout	( function() {
            client.close();
            console.log( "close multicast UDP client at IP", interface.address);
        }, 4000);
    });

    return client;
};

/**
 * Terminates this ControlPoint.
 */
ControlPoint.prototype.close = function() {
  this.server.close();
  // http.parsers.free(this.requestParser);
  // http.parsers.free(this.responseParser);
};

