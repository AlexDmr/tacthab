define( [ './BrickUPnP.js'
		, './BrickUPnPFactory.js'
		, 'websocket'
		]
	  , function(BrickUPnP, BrickUPnPFactory, websocket) {
	
var WebSocketClient = websocket.client	
	
	var BrickFhem = function() {
		 // var self = this;
		 BrickUPnP.prototype.constructor.apply(this, []);
		 
		 return this;
		}

	BrickFhem.prototype = new BrickUPnP(); BrickFhem.prototype.unreference();
	BrickFhem.prototype.constructor = BrickFhem;
	BrickFhem.prototype.getTypeName = function() {return "BrickFhem";}

	BrickFhem.prototype.sendCommand	= function(connection, cmd) {
		 connection.send( JSON.stringify( { type		: 'command'
										  , payload	: cmd
										  }
										)
						);
		}
	BrickFhem.prototype.init = function(device) {
		 var self = this;
		 BrickUPnP.prototype.init.apply(this, [device]);
		 // XXX Establish a websocket connexion with the server and retrieve everything
		 var address = 'ws://' + device.host + ':8080';
		 this.ws_client = new WebSocketClient();
		 this.ws_client.on( 'connect'
				  , function(connection) {
						 // Connected to Fhem
						 console.log('BrickFhem::init Client connected to Fhem');
						 connection.on('close', function() {
							 console.log('BrickFhem: Fhem disconnected, retry?');
							});
						 connection.on('message', function(e) {
							 try {
								 if(e.type !== 'utf8') {console.error("!!! BrickFhem::onmessage ERROR type is not utf8 but", e.type); return;}
								 var msg = JSON.parse(e.utf8Data);
								 switch(msg.type) {
									 case 'event'		:
										console.log("\t////Fhem => event\t\t:", msg.payload);
									 break;
									 case 'listentry'	:
										console.log("\t////Fhem => listentry\t:", msg.payload.name);
									 break;
									 case 'getreply'	:
										console.log("\t////Fhem => reply\t\t:", msg.payload);
									 break;
									 case 'commandreply':
										console.log("\t////Fhem => cmd\t\t\t:", msg.payload);
									 break;
									 default			:
										console.error("\tUnknown Fhem message type", msg.type);
									}
								} catch(err) {console.error("!!! BrickFhem::onmessage ERROR:", err, "from\n", e);}
							});
						 self.sendCommand( connection
										 , { command	: 'subscribe'
										   , arg		: 'BrickFhemTActHab'
										   , type		: '.*'
										   , name		: '.*'
										   , changed	: '.*'
										   }
										 );
						 self.sendCommand( connection
										 , { command	: 'list'
										   , arg		: 'EnO_.*'
										   }
										 );
						}
					);
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