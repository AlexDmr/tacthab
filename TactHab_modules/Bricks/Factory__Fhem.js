/*
var BrickUPnP		= require( './BrickUPnP.js' )
  , BrickUPnPFactory= require( './BrickUPnPFactory.js' )
  , websocket		= require( 'websocket' )
  , fs				= require( 'fs-extra' )
  ;
  
var WebSocketClient = websocket.client	
	
var BrickFhem = function() {
	 // var self = this;
	 BrickUPnP.prototype.constructor.apply(this, []);
	 return this;
	}

BrickFhem.prototype = Object.create( BrickUPnP.prototype ); //new BrickUPnP(); BrickFhem.prototype.unreference();
BrickFhem.prototype.constructor = BrickFhem;
BrickFhem.prototype.getTypeName = function() {return "BrickFhem";}
BrickFhem.prototype.getTypes		= function() {var L=BrickUPnP.prototype.getTypes(); L.push(BrickFhem.prototype.getTypeName()); return L;}

BrickFhem.prototype.sendCommand	= function(cmd) {
	 // console.log("sending to Fhem:", cmd);
	 this.connection.send( JSON.stringify( { type		: 'command'
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
	 var firstTime = true;
	 this.ws_client.on( 'connect'
			  , function(connection) {
					 var listArg = "room=EnOcean:FILTER=TYPE=EnOcean";
					 // Connected to Fhem
					 console.log('BrickFhem::init Client connected to Fhem');
					 clearInterval( self.reconnectTimer );
					 connection.on('close', function() {
						 console.log('BrickFhem: Fhem disconnected, retry!');
						 self.reconnectTimer =
						 setInterval( function() {console.log("\tlet's retry"); 
												  firstTime = false;
												  self.init(device);
												  console.log("\t...");
												 }
									, 5000 );
						});
					 connection.on('message', function(e) {
						 try {
							 if(e.type !== 'utf8') {console.error("!!! BrickFhem::onmessage ERROR type is not utf8 but", e.type); return;}
							 var msg = JSON.parse(e.utf8Data), brick;
							 switch(msg.type) {
								 case 'event'		:
									// console.log("\t////Fhem => event\t\t:", msg.payload);
									brick = BrickUPnP.prototype.getBrickFromId(msg.payload.name);
									if(brick && brick.update) {brick.update( msg.payload );}
								 break;
								 case 'listentry'	:
									console.log("\t////Fhem => listentry\t:", msg.payload.name, msg.payload.attributes.subType);
									// Create related brick
									if(msg.payload.arg === listArg) {	// EnOcean
										 var subType	= msg.payload.attributes.subType
										   , fileName	= './TactHab_modules/Bricks/Fhem/' + subType + '.js';
										 console.log("\trequire", fileName);
										 fs.exists( fileName
												  , function(exists) {
														 var EnO_Brick, brick2;
														 if(exists) {
															 EnO_Brick = require(fileName);
															 console.log(msg.type, '=>', EnO_Brick?'FOUND':'NOT FOUND');
															 brick2 = new EnO_Brick(self, msg.payload);
															 brick2.changeIdTo( msg.payload.name );
															} else {console.error("BrickFhem::init", fileName, "does not exist!!!!");}
														}
												  );
										} else {console.error("listentry for", msg.payload.arg);}
								 break;
								 case 'getreply'	:
									// console.log("\t////Fhem => reply\t\t:", msg.payload);
								 break;
								 case 'commandreply':
									// console.log("\t////Fhem => cmd\t\t\t:", msg.payload);
								 break;
								 default			:
									console.error("\tUnknown Fhem message type", msg.type);
								}
							} catch(err) {console.error("!!! BrickFhem::onmessage ERROR:", err);}//, "from\n", e);}
						});
					 self.connection = connection;
					 self.sendCommand( { command	: 'subscribe'
									   , arg		: 'BrickFhemTActHab'
									   , type		: '.*'
									   , name		: '.*'
									   , changed	: '.*'
									   }
									 );
					 if(firstTime) {
						 self.sendCommand( { command	: 'list'
										   , arg		: listArg
										   }
										 );
						}
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
module.exports = Factory__Fhem;
*/