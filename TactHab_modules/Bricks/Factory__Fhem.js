var Brick		= require( './Brick.js' )
  , websocket	= require( 'websocket' )
  , fs			= require( 'fs-extra' )
  , upath		= require("upath")
  ;
  
var WebSocketClient = websocket.client	
var fhemDir = upath.normalizeSafe( __dirname );

var dirFhem = __dirname + "/Fhem";
var reJS	= new RegExp( '\.js$' );
fs.readdir(dirFhem, function(err, files) {
	if(err) {
		console.error( "Error reading directory /Fhem", err);
	} else {
		console.log( "Files in /Fhem", files);
		files.forEach( function(f) {
			if( reJS.test(f) ) {
				console.log( "Fhem require", f);
				require(dirFhem + "/" + f);
			}
			});
	}
});



var FhemBridge = function(host, port) {
	// var self = this;
	Brick.apply(this, []);
	this.config = {host: undefined, port: undefined};
	this.bricks	= [];
	if(host && port) {
	 	this.init(host, port);
	}
	return this;
}

FhemBridge.prototype = Object.create( Brick.prototype ); 
FhemBridge.prototype.constructor = FhemBridge;
FhemBridge.prototype.getTypeName = function() {return "FhemBridge";}
FhemBridge.prototype.getTypes	= function() {
	var L = Brick.prototype.getTypes(); 
	L.push(FhemBridge.prototype.getTypeName()); 
	return L;
}

FhemBridge.prototype.sendCommand	= function(cmd) {
	this.connection.send( JSON.stringify( { type	: 'command'
										  , payload	: cmd
										  }
										)
						 );
}
FhemBridge.prototype.getDescription	= function() {
	var i, json = Brick.prototype.getDescription();
	json.config = this.config;
	json.bricks	= [];
	for(i=0; i<this.bricks.length; i++) {
		json.bricks.push( this.bricks[i].getDescription() )
	}
	return json;
}

FhemBridge.prototype.init 	= function(host, port) {
	 var self = this;
	 this.config.host 	= host;
	 this.config.port 	= port;
	 // Brick.prototype.init.apply(this, []);
	 // XXX Establish a websocket connexion with the server and retrieve everything
	 var address = 'ws://' + host + ':' + port;
	 this.ws_client = new WebSocketClient();
	 var firstTime = true;
	 this.ws_client.on( 'connect'
			  , function(connection) {
					 var listArg = "room=EnOcean:FILTER=TYPE=EnOcean";
					 // Connected to Fhem
					 console.log('FhemBridge::init Client connected to Fhem');
					 clearInterval( self.reconnectTimer );
					 connection.on('close', function() {
						 console.log('FhemBridge: Fhem disconnected, retry!');
						 self.reconnectTimer =
						 setInterval( function() {console.log("\tlet's retry"); 
												  firstTime = false;
												  self.init(host, port);
												  console.log("\t...");
												 }
									, 5000 );
						});
					 connection.on('message', function(e) {
						 try {
							 if(e.type !== 'utf8') {console.error("!!! FhemBridge::onmessage ERROR type is not utf8 but", e.type); return;}
							 var msg = JSON.parse(e.utf8Data), brick;
							 switch(msg.type) {
								 case 'event'		:
									// console.log("\t////Fhem => event\t\t:", msg.payload);
									brick = Brick.prototype.getBrickFromId(msg.payload.name);
									if(brick && brick.update) {brick.update( msg.payload );}
								 break;
								 case 'listentry'	:
									// console.log("\t////Fhem => listentry\t:", msg.payload.name, msg.payload.attributes.subType);
									// Create related brick
									if(msg.payload.arg === listArg) {	// EnOcean
										 var subType	= msg.payload.attributes.subType
										   , fileName	= fhemDir + '/Fhem/' + subType + '.js';
										 console.log("\trequire", fileName);
										 fs.exists( fileName
												  , function(exists) {
														 var EnO_Brick, brick2;
														 if(exists) {
															 try {
															 	EnO_Brick = require(fileName);
																console.log(msg.type, '=>', EnO_Brick?'FOUND':'NOT FOUND');
																brick2 = new EnO_Brick(msg.payload.name, self, msg.payload);
																console.log( "FHEM", EnO_Brick, brick2);
																self.bricks.push( brick2 );
																} catch(errLoad) {console.error("Error processing", fileName, "\n", errLoad, "\n____________________________________________");}
															} else {console.error("FhemBridge::init", fileName, "does not exist!!!!");}
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
							} catch(err) {console.error("!!! FhemBridge::onmessage ERROR:", err);}//, "from\n", e);}
						});
					 self.connection = connection;
					 self.sendCommand( { command	: 'subscribe'
									   , arg		: 'FhemBridge'
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
	 console.log( "connect FHEM @", address);
	 this.ws_client.connect(address, ['json']);
	 
	 return this;
	}
	
//---------------------------------------------------------------------------------------
module.exports = FhemBridge;
