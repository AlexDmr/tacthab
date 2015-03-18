define( [ './BrickUPnP.js'
		, 'websocket'
		]
	  , function(BrickUPnP, websocket) {
	
var WebSocketClient = websocket.client	
	
	var BrickFhem = function() {
		 var self = this;
		 BrickUPnP.prototype.constructor.apply(this, []);
		 
		 return this;
		}

	BrickFhem.prototype = new BrickUPnP(); BrickFhem.prototype.unreference();
	BrickFhem.prototype.constructor = BrickFhem;
	BrickFhem.prototype.getTypeName = function() {return "BrickFhem";}

	BrickFhem.prototype.init = function(device) {
		 BrickUPnP.prototype.init.apply(this, []);
		 // XXX Establish a websocket connexion with the server and retrieve everything
		 var address = 'ws://' + device.host + ':8080';
		 this.ws_client = new WebSocketClient();
		 client.on( 'connect'
				  , function(connection) {
						 // Connected to Fhem
						 console.log('BrickFhem::init Client Connectedconnected to Fhem');
						 connection.on('close', function() {
								console.log('BrickFhem: Fhem disconnected, retry?');
							});
						 
						}
		 this.ws_client.connect(address, ['json']);
		 
		 return this;
		}
		
	//---------------------------------------------------------------------------------------
	var Factory__Fhem = new BrickUPnPFactory( 'Factory__Fhem'
											, BrickFhem
											, function(device) {
												 // console.log("Is this Fhem?");
												 return device.friendlyName === 'FhemTActHab';
												}
											); 
	return Factory__Fhem;
});