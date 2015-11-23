/*eslint no-wrap-func: 0 */

var Brick				= require( './Brick.js' )
  , BrickUPnP			= require( './BrickUPnP.js' )
  , BrickUPnPFactory	= require( './BrickUPnPFactory.js' )
  // , webServer			= require( '../webServer/webServer.js' )
  , request				= require( 'request' )
  , mqtt				= require( 'mqtt' )
  , fs					= require( 'fs-extra' )
  // , AlxEvent			= require( '../../js/AlxEvents.js' )
  , Brick_Color			= require( './types/Color.js' )
  , Brick_Contact		= require( './types/Contact.js' )
  , Brick_DateTime		= require( './types/DateTime.js' )
  , Brick_Dimmer		= require( './types/Dimmer.js' )
  , Brick_Number		= require( './types/Number.js' )
  , Brick_RollerShutter	= require( './types/RollerShutter.js' )
  , Brick_String		= require( './types/String.js' )
  , Brick_Switch		= require( './types/Switch.js' )
  , webServer			= require( '../webServer/webServer.js' )
  ;


var openHab_types = { 'Color'				: Brick_Color
					, 'Contact'				: Brick_Contact
					, 'DateTime'			: Brick_DateTime
					, 'Dimmer'				: Brick_Dimmer
					, 'Number'				: Brick_Number
					, 'RollerShutter'		: Brick_RollerShutter
					, 'String'				: Brick_String
					, 'Switch'				: Brick_Switch
					, 'ColorItem'			: Brick_Color
					, 'ContactItem'			: Brick_Contact
					, 'DateTimeItem'		: Brick_DateTime
					, 'DimmerItem'			: Brick_Dimmer
					, 'NumberItem'			: Brick_Number
					, 'RollerShutterItem'	: Brick_RollerShutter
					, 'RollershutterItem'	: Brick_RollerShutter
					, 'StringItem'			: Brick_String
					, 'SwitchItem'			: Brick_Switch
					};


//__________________________________________________________________________________________________________
//__________________________________________________________________________________________________________
//__________________________________________________________________________________________________________
var BrickOpenHAB = function() {
	 // var self = this;
	 BrickUPnP.prototype.constructor.apply(this, []);
	 this.config	= {mqtt: null};
	 this.state		= "none";
	 this.doEmit	= false;
	 this.name		= "OpenHab"
	 return this;
	}

BrickOpenHAB.prototype = Object.create(BrickUPnP.prototype); //new BrickUPnP(); BrickOpenHAB.prototype.unreference();
BrickOpenHAB.prototype.constructor = BrickOpenHAB;
BrickOpenHAB.prototype.getTypeName = function() {return "BrickOpenHAB";}
BrickOpenHAB.prototype.getTypes		= function() {var L=Brick.prototype.getTypes(); L.push(BrickOpenHAB.prototype.getTypeName()); return L;}

BrickOpenHAB.prototype.getDescription	= function() {
	 var json	= BrickUPnP.prototype.getDescription.apply(this, []);
	 json.name	= this.UPnP.friendlyName || "OpenHab";
	 json.config= { mqtt	: this.config.mqtt
				  , host	: this.openHabServer.host
				  , port	: this.openHabServer.port
				  };
	 return json;
	}

BrickOpenHAB.prototype.doEmit		= function(bool) {
	if(typeof bool === "undefined") {return this.doEmit;} else {this.doEmit = bool; return this;}
}

BrickOpenHAB.prototype.setState		= function(state) {
	this.state	= state;
	if(this.doEmit) {webServer.emit( "openHab_state", {id: this.brickId, state: state} );}
}

BrickOpenHAB.prototype.sendCommand	= function(brick, message) {
	var topic;
	if(this.config) {
		 topic = "/" + this.config.mqtt.prefix + "/in/" + brick.name + "/command";
		 console.log("MQTT send", topic, message);
		 this.publish(topic, message);
		}
	return this;
}

BrickOpenHAB.prototype.publish		= function(topic, message) {
	 if(this.client) {
		 this.client.publish(topic, message);
		}
	 return this;
	}

BrickOpenHAB.prototype.processGroupItem = function(groupItem) {
	request	( groupItem.link + "?type=json"
			, function (error, response, body) {
				  if (!error) {
					 var json = JSON.parse(body);
					 groupItem.members = json.members;
					} else {console.error("Error accessing to group", groupItem.name, "\n\t", response.statusCode, ':', error);
						   }
				}
			);
}

BrickOpenHAB.prototype.getIdFromName= function(name) {
	return name;
}

BrickOpenHAB.prototype.processItem	= function(item) {
	// var self	= this;
	// item:
	//	- type
	//	- name
	//	- state
	//	- link
	// var brick = new BrickOpenHAB_item().changeIdTo( this.getIdFromName(item.name) ).init(item);
	var constr = openHab_types[item.type];
	if(constr) {
		 //console.log("--- openHAB item:", item.type, item.name);
		 /*var brick =*/ new constr().changeIdTo( this.getIdFromName(item.name) ).init(item).setFactory(this);
		} else {console.log("!!! openHAB unsupported item:", item.type);}
}
	
BrickOpenHAB.prototype.init = function(device) {
	var self = this, logMQTT = false, logFileName;
	BrickUPnP.prototype.init.apply(this, [device]);
	// console.log( "BrickOpenHAB::init", device );
	this.openHabServer	= {host: device.host, port: device.port};
	
	// Connect to MQTT
	if( device.mqtt ) {
		this.config.mqtt	= device.mqtt;
		logMQTT				= device.mqtt.logMQTT;
		logFileName			= device.mqtt.logPath + "/MQTT " + device.mqtt.prefix + " ___ " + (new Date()).getTime() + ".log";
		if(logMQTT) {console.log("Logging MQTT into", logFileName);}
		var MQTT_broker = { servers			: [ { host: device.mqtt.host, port: device.mqtt.port }
											  ]
						  ,	protocolId		: 'MQIsdp'
						  ,	protocolVersion	: 3
						  };
		// console.log("MQTT::broker trying to connect to", MQTT_broker);
		var client  = mqtt.connect( null, MQTT_broker );
		this.client = client;
		client.on( 'connect'
				  , function () {
						 console.log("MQTT::connect connected to the broker");
						 client.publish('/TActHab/newClient', 'new TActHab client launched');
						 client.subscribe( '#' );
						 self.setState( "connected" );
						}
				  );

		client.on( 'close'
				 , function() {console.error("MQTT::close");
							   self.setState( "closed" );
							  }
				 );

		client.on( 'offline'
				 , function() {console.error("MQTT::offline");
							   self.setState( "offline" );
							  }
				 );
				 
		client.on( 'error'
				 , function(err) {console.error("MQTT::error", err);
								  self.setState( "error" );
								 }
				 );
				 
		client.on( 'message'
				  , function (topic, message) {
						 var name, operation, prefix, brick, subtopic;
						 // What is the topic about ?
						 console.log("MQTT::message topic is", topic, message.toString());
						 prefix = "/" + device.mqtt.prefix + "/out/";
						 if(topic.lastIndexOf(prefix, 0) === 0) {
							 subtopic	= topic.slice(prefix.length).split( '/' );
							 name		= subtopic[0];
							 operation	= subtopic[1];
							 if(logMQTT) {
								 fs.appendFile	( logFileName
												, new Date().getTime() + " " 
																	   + JSON.stringify( { topic	: topic
																						 , name		: name
																						 , operation: operation
																						 , message	: message.toString()
																						 }
																					   )
																	   + "\n"
												)
								}
							} 
						 if(name && (brick = Brick.prototype.getBrickFromId(self.getIdFromName(name))) ) {
							 // message is Buffer 
							 console.log(name, operation)
							 var msg   = message.toString();
							 brick.update(topic, operation, msg);
							 if(this.doEmit) {webServer.emit( "openHab_update", {topic:topic, operation:operation, message:msg} );}
							}
						}
				  );
		} // if device.mqtt

	// Retrieve description
	var P = new Promise	( function(resolve, reject) {
							var adress = 'http://' + device.host + ':' + device.port + '/rest/items?type=json';
							console.log( "openHab request", adress );
							request	( adress
									, function (error, response, body) {
										  // console.log( "GET => ", error );
										  if (!error) {
											 var json = JSON.parse( body ), type, item;
											 self.devices = {};
											 json = json.item || [];
											 // console.log("\n____________________________\nBrickOpenHAB::init", json.length, "items");
											 for(var i=0; i<json.length; i++) {
												 type = json[i].type;
												 if(typeof self.devices[type] === 'undefined') {self.devices[type] = [];}
												 self.devices[type].push( json[i] );
												 item = self.devices[type][self.devices[type].length-1];
												 if(type === 'GroupItem') {
													 self.processGroupItem( item );
													} else {// Subscribe to events
															self.processItem( item );
														   } // Heating_GF_Living
												}
											 // console.log( "Success accessing to OpenHab", self.devices );
											 resolve( self.devices );
											} else {console.error("Error accessing to OpenHAB", error);
													reject( "Error accessing to OpenHAB" + error);
												   }
									});
							}
						); // Promise
	return P;
}

//---------------------------------------------------------------------------------------
var Factory__OpenHAB = new BrickUPnPFactory( 'Factory__OpenHAB'
										, BrickOpenHAB
										, function(device) {
											 // console.log("Is this Fhem?");
											 return device.friendlyName === 'OpenHAB';
											}
										); 
	
module.exports = Factory__OpenHAB;
