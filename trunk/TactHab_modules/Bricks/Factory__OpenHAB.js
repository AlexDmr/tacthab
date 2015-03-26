define( [ './BrickUPnP.js'
		, './BrickUPnPFactory.js'
		, 'websocket'
		, '../webServer/webServer.js'
		, 'request'
		]
	  , function(BrickUPnP, BrickUPnPFactory, websocket, webServer, request) {
	
var WebSocketClient = websocket.client	
	
	var BrickOpenHAB = function() {
		 // var self = this;
		 BrickUPnP.prototype.constructor.apply(this, []);
		 
		 return this;
		}

	BrickOpenHAB.prototype = new BrickUPnP(); BrickOpenHAB.prototype.unreference();
	BrickOpenHAB.prototype.constructor = BrickOpenHAB;
	BrickOpenHAB.prototype.getTypeName = function() {return "BrickOpenHAB";}

	BrickOpenHAB.prototype.sendCommand	= function(connection, cmd) {
		 connection.send( JSON.stringify( { type		: 'command'
										  , payload	: cmd
										  }
										)
						);
		}
	
	BrickOpenHAB.prototype.init = function(device) {
		 var self = this;
		 BrickUPnP.prototype.init.apply(this, [device]);
		 // Retrieve description
		 request( 'http://' + device.host + ':' + device.port + '/rest/items?type=json'
				, function (error, response, body) {
				  if (!error) {
					 console.log("OpenHAB items:\n", body);
					 var items = JSON.parse(body);
					} else {console.error("Error accessing to OpenHAB:", response.statusCode, ':', error);
						   }
				});
		 return this;
		}
		
	//---------------------------------------------------------------------------------------
	var Factory__OpenHAB = new BrickUPnPFactory( 'Factory__OpenHAB'
											, BrickOpenHAB
											, function(device) {
												 // console.log("Is this Fhem?");
												 return device.friendlyName === 'OpenHAB';
												}
											); 
	return Factory__OpenHAB;
});