var Brick			= require( './Brick.js' )
  , websocket		= require( 'websocket' )
  , fs				= require( 'fs-extra' )
  , upath			= require( 'upath')
  , BrickFhemZwave	= require( './Fhem/BrickFhemZwave.js' )
  ;
  
var WebSocketClient = websocket.client	;
var fhemDir = upath.normalizeSafe( __dirname );

var dirFhem = __dirname + "/Fhem";
var reJS	= new RegExp( '\.js$' );
fs.readdir(dirFhem, function(err, files) {
	if(err) {
		console.error( "Error reading directory /Fhem", err);
	} else {
		// console.log( "Files in /Fhem", files);
		files.forEach( function(f) {
			if( reJS.test(f) ) {
				// console.log( "Fhem require", f);
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
	this.connected = false;
	if(host && port) {
	 	this.init(host, port);
	}
	return this;
}

FhemBridge.prototype = Object.create( Brick.prototype ); 
FhemBridge.prototype.constructor = FhemBridge;

FhemBridge.prototype.dispose	= function() {
	Brick.prototype.dispose.apply(this, []);
	if(this.ws_client) {
		
		this.ws_client = null;
	}
}

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
FhemBridge.prototype.setConnected	= function(b) {
	this.emit( "update", {connected: this.connected = b} );
}
FhemBridge.prototype.getDescription	= function() {
	var i, json = Brick.prototype.getDescription.apply(this, []);
	json.config 	= this.config;
	json.connected	= this.connected;	
	json.bricks		= [];
	for(i=0; i<this.bricks.length; i++) {
		json.bricks.push( this.bricks[i].brickId )
	}
	return json;
}

FhemBridge.prototype.disconnect	= function() {
	if(this.ws_client) {this.ws_client.close();}
}

FhemBridge.prototype.init 	= function(host, port) {
	 var self = this;
	 this.config.host 	= host;
	 this.config.port 	= port;
	 // Brick.prototype.init.apply(this, []);
	 // XXX Establish a websocket connexion with the server and retrieve everything
	 var address = 'ws://' + host + ':' + port;
	 console.log( "connect FHEM @", address);
	 this.ws_client = new WebSocketClient() //address, ['json']);
	 var firstTime = true;
	 this.ws_client.on( 'connect'
			  , function(connection) {
					 var listArg = ".*"; //"room=EnOcean:FILTER=TYPE=EnOcean";
					 // Connected to Fhem
					 console.log('FhemBridge::init Client connected to Fhem');
					 clearInterval( self.reconnectTimer );
					 self.setConnected(true);
					 connection.on('close', function() {
						 console.log('FhemBridge: Fhem disconnected, retry!');
						 self.reconnectTimer =
						 setInterval( function() {console.log("\tlet's retry"); 
												  firstTime = false;
												  self.setConnected( false );
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
									if(brick && brick.update) {
										brick.update( msg.payload );
									}// else {console.error("Fhem event unrelated to any brick", msg);}
								 break;
								 case 'listentry'	:
									// console.log("\t////Fhem => listentry\t:", msg);
									// Create related brick
									self.processListEntry( msg );
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
	 this.ws_client.connect(address, ['json']);
	 
	 return this;
	}

var brickConstructors = {};
function getBrickConstructor(fileName) {
	return new Promise( function(resolve, reject) {
		if( brickConstructors[fileName] ) {
			resolve( brickConstructors[fileName] );
		} else {fs.exists( fileName
						 , function(exists) {
								if(exists) {
									try {brickConstructors[fileName] = require(fileName);
										 resolve( brickConstructors[fileName] );
										 console.log( "required", fileName );
										} catch(errLoad) {reject("Error processing", fileName, "\n", errLoad, "\n____________________________________________");}
									} else {reject("FhemBridge::init", fileName, "does not exist!!!!");}
								}
						  );
		}
	});
}
FhemBridge.prototype.processListEntry	= function(msg) {
	var type 		= msg.payload.internals.TYPE
	  , fileName, subType, brick
	  , self = this;
	switch( type ) {
		case 'EnOcean'	:
			subType		= msg.payload.attributes.subType
			fileName 	= fhemDir + '/Fhem/' + subType + '.js';
			getBrickConstructor(fileName).then( function(brickConstructor) {
				brick 	= new brickConstructor(msg.payload.name, self, msg.payload);
				self.bricks.push( brick );
			}, function(err) {console.error( "ERROR loading EnOcean", fileName, "\n", err);} );
		break;
		case 'ZWave'	:
			// console.error( "Must implement Zwave Fhem adapter" );
			// console.log( msg );
			// classes = msg.payload.attributes.classes.split(' ');
			brick = new BrickFhemZwave(msg.payload.internals.NAME, this, msg.payload);
			this.bricks.push( brick );
		break;

	}
	if(brick) {
		this.emit( "update", {bricks: this.bricks});
	}
}
	
//---------------------------------------------------------------------------------------
module.exports = FhemBridge;
