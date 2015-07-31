define( [ './Brick.js'
		, './BrickUPnP.js'
		, './BrickUPnPFactory.js'
		, '../webServer/webServer.js'
		, 'request'
		, 'mqtt'
		, '../../js/AlxEvents.js'
		, './types/Color.js'
		, './types/Contact.js'
		, './types/DateTime.js'
		, './types/Dimmer.js'
		, './types/Number.js'
		, './types/RollerShutter.js'
		, './types/String.js'
		, './types/Switch.js'
		]
	  , function( Brick, BrickUPnP, BrickUPnPFactory, webServer, request, mqtt, AlxEvent
				, Brick_Color
				, Brick_Contact
				, Brick_DateTime
				, Brick_Dimmer
				, Brick_Number
				, Brick_RollerShutter
				, Brick_String
				, Brick_Switch
				) {

var openHab_types = { 'Color'			: Brick_Color
					, 'Contact'			: Brick_Contact
					, 'DateTime'		: Brick_DateTime
					, 'Dimmer'			: Brick_Dimmer
					, 'Number'			: Brick_Number
					, 'RollerShutter'	: Brick_RollerShutter
					, 'String'			: Brick_String
					, 'Switch'			: Brick_Switch
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
	 return this;
	}

BrickOpenHAB.prototype = new BrickUPnP(); BrickOpenHAB.prototype.unreference();
BrickOpenHAB.prototype.constructor = BrickOpenHAB;
BrickOpenHAB.prototype.getTypeName = function() {return "BrickOpenHAB";}
BrickOpenHAB.prototype.getTypes		= function() {var L=Brick.prototype.getTypes(); L.push(BrickOpenHAB.prototype.getTypeName()); return L;}

BrickOpenHAB.prototype.sendCommand	= function(cmd) {
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
	return name; //this.brickId + '_item_' + name;
}

BrickOpenHAB.prototype.processItem	= function(item) {
	var self	= this;
	// item:
	//	- type
	//	- name
	//	- state
	//	- link
	// var brick = new BrickOpenHAB_item().changeIdTo( this.getIdFromName(item.name) ).init(item);
	var constr = openHab_types[item.type];
	if(constr) {
		 console.log("--- openHAB item:", item.type, item.name);
		 var brick = new constr().changeIdTo( this.getIdFromName(item.name) ).init(item);
		} else {console.log("!!! openHAB unsupported item:", item.type);}
}
	
BrickOpenHAB.prototype.init = function(device) {
	var self = this;
	BrickUPnP.prototype.init.apply(this, [device]);
	// Connect to MQTT
	if( device.mqtt ) {
		var MQTT_broker = { servers			: [ { host: device.mqtt.host, port: device.mqtt.port }
											  ]
						  ,	protocolId		: 'MQIsdp'
						  ,	protocolVersion	: 3
						  };
		console.log("MQTT::broker trying to connect to", MQTT_broker);
		var client  = mqtt.connect( null, MQTT_broker );
		this.client = client;
		client.on( 'connect'
				  , function () {
						 console.log("MQTT::connect connected to the broker");
						 client.publish('/TActHab/newClient', 'new TActHab client launched');
						 client.subscribe( '#' );
						}
				  );

		client.on( 'close'
				 , function() {console.error("MQTT::close");}
				 );

		client.on( 'offline'
				 , function() {console.error("MQTT::offline");}
				 );
				 
		client.on( 'error'
				 , function(err) {console.error("MQTT::error", err);}
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
							} 
						 if(name && (brick = Brick.prototype.getBrickFromId(self.getIdFromName(name))) ) {
							 // message is Buffer 
							 var msg   = message.toString();
							 brick.update(operation, msg);
							}
						}
				  );
		} // if device.mqtt

	// Retrieve description
	var P = new Promise	( function(resolve, reject) {
							request	( 'http://' + device.host + ':' + device.port + '/rest/items?type=json'
									, function (error, response, body) {
									  if (!error) {
										 var json = JSON.parse( body ), type, item;
										 self.devices = {};
										 json = json.item || [];
										 console.log("\n____________________________\nBrickOpenHAB::init", json.length, "items");
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
	
return Factory__OpenHAB;
});