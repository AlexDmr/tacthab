define( [ './Brick.js'
		, './BrickUPnP.js'
		, './BrickUPnPFactory.js'
		, '../webServer/webServer.js'
		, 'request'
		, 'mqtt'
		, '../../js/AlxEvents.js'
		]
	  , function(Brick, BrickUPnP, BrickUPnPFactory, webServer, request, mqtt, AlxEvent) {

//__________________________________________________________________________________________________________
//__________________________________________________________________________________________________________
//__________________________________________________________________________________________________________
var BrickOpenHAB_item = function() {
	Brick.apply(this, []);
	this.types.push( 'BrickOpenHAB_item' );
	return this;
}

BrickOpenHAB_item.prototype = new Brick(); BrickOpenHAB_item.prototype.unreference();
BrickOpenHAB_item.prototype.constructor = BrickOpenHAB_item;
BrickOpenHAB_item.prototype.getTypeName = function() {return "BrickOpenHAB_item";}

AlxEvent(BrickOpenHAB_item);	// Managing events

BrickOpenHAB_item.prototype.dispose	= function() {
	if(this.client) {this.client.close();}
	Brick.prototype.dispose.apply(this, []);
	return this;
}

BrickOpenHAB_item.prototype.init	= function(device) {
	Brick.prototype.init.apply(this, [device]);
	this.name = device.name;
	return this;
}

BrickOpenHAB_item.prototype.getESA	= function() {
		return { events	: [ 'update' ]
			   , states	: []
			   , actions: []
			   };
	}

BrickOpenHAB_item.prototype.update	= function(topic, message) {
	this.emit('update', {topic:topic, message:message});
	return this;
}

//__________________________________________________________________________________________________________
//__________________________________________________________________________________________________________
//__________________________________________________________________________________________________________
var BrickOpenHAB = function() {
	 // var self = this;
	 BrickUPnP.prototype.constructor.apply(this, []);
	 this.types.push( 'BrickOpenHAB' );
	 return this;
	}

BrickOpenHAB.prototype = new BrickUPnP(); BrickOpenHAB.prototype.unreference();
BrickOpenHAB.prototype.constructor = BrickOpenHAB;
BrickOpenHAB.prototype.getTypeName = function() {return "BrickOpenHAB";}

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
	// var name = JSON.parse(item).name;
	console.log("--- openHAB item:", item.name);
	var brick = new BrickOpenHAB_item().changeIdTo( this.getIdFromName(item.name) ).init(item);
}
	
BrickOpenHAB.prototype.init = function(device) {
	var self = this;
	BrickUPnP.prototype.init.apply(this, [device]);
	// Connect to MQTT
	var MQTT_broker = { servers			: [ { host: device.mqtt.host, port: device.mqtt.port }
										  , { host: '192.168.1.58', port: 1883 }
										  , { host: '192.168.1.14', port: 1883 }
										  ]
					  ,	protocolId		: 'MQIsdp'
					  ,	protocolVersion	: 3
					  };//'tcp://' + device.host + ':1883';
	console.log("MQTT::broker trying to connect to", MQTT_broker);
	var client  = mqtt.connect( null, MQTT_broker );
	this.client = client;
	client.on( 'connect'
			  , function () {
					 console.log("MQTT::connect connected to the broker");
					 client.publish('/TActHab/newClient', 'new TActHab client launched');
					 client.subscribe( '/openHAB/out/#' );
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
					 var name, prefix, brick;
					 // What is the topic about ?
					 console.log("MQTT::message topic is", topic);
					 prefix = "/openHAB/out/command/";
					 if(topic.lastIndexOf(prefix, 0) === 0) {
						 name = topic.slice(prefix.length);
						} else {prefix = "/openHAB/out/state/";
								if(topic.lastIndexOf(prefix, 0) === 0) {
									 name = topic.slice(prefix.length);
									}
							   }
					 if(name && (brick = Brick.prototype.getBrickFromId(self.getIdFromName(name))) ) {
						 // message is Buffer 
						 var msg   = message.toString();
						 brick.update(topic, msg);
						}
					}
			  );

	// Retrieve description
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
				} else {console.error("Error accessing to OpenHAB", error);
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