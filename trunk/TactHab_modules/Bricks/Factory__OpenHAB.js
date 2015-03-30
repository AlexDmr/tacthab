define( [ './BrickUPnP.js'
		, './BrickUPnPFactory.js'
		, 'websocket'
		, '../webServer/webServer.js'
		, 'request'
		]
	  , function(BrickUPnP, BrickUPnPFactory, websocket, webServer, request) {
	
var WebSocketClient = websocket.client;
	
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
		 request( groupItem.link + '?type=json'
				, function (error, response, body) {
					  if (!error) {
						 var json = JSON.parse(body);
						 groupItem.members = json.members;
						} else {console.error("Error accessing to group", groupItem.name, "\n\t", response.statusCode, ':', error);
							   }
					}
				);
		}
	BrickOpenHAB.prototype.processItem	= function(item) {
		var self	= this
		  , client	= new WebSocketClient()
		  , uuid	= self.getUniqueTrackingId();
		client.on( 'connect'
				 , function(connection) {
						console.log('WebSocket Client Connected for', item.name);
						connection.on( 'error'
									 , function(error) {
											 console.log("Connection Error for", item.name, "\n\t", error);
											}
									 );
						connection.on( 'close'
									 , function() {
											 console.log('Connection Closed for', item.name);
											}
									 );
						connection.on( 'message'
									 , function(message) {
											 console.log("message related to", item.name);
											 if (message.type === 'utf8') {
												 console.log("Received: '" + message.utf8Data + "'");
												}
											}
									 );
						}
				 );
		client.on( 'connectFailed'
				 , function(error) {
						 console.log('Connect Error to ', item.name, "\n\t", error);
						}
				 );
		client.connect( item.link + '?type=json'
					  , 'json'//'websocket'
					  , null	// origin
					  , { 'Accept'						: 'application/json' // 'application/xml' 
						, 'X-Atmosphere-Transport'		: 'websocket'
						, 'X-Atmosphere-tracking-id'	: uuid
						}		// headers
					  , null	//	requestOptions
					  );
		
		}

	var uniqueTrackingId = 0;
	BrickOpenHAB.prototype.getUniqueTrackingId = function() {
		 return uniqueTrackingId++;
		}
	BrickOpenHAB.prototype.init = function(device) {
		 var self = this;
		 BrickUPnP.prototype.init.apply(this, [device]);
		 // Retrieve description
		 request( 'http://' + device.host + ':' + device.port + '/rest/items?type=json'
				, function (error, response, body) {
				  if (!error) {
					 var json = JSON.parse( body ), type, item;
					 self.devices = {};
					 for(var i=0; i<json.item.length; i++) {
						 type = json.item[i].type;
						 if(typeof self.devices[type] === 'undefined') {self.devices[type] = [];}
						 self.devices[type].push( json.item[i] );
						 item = self.devices[type][self.devices[type].length-1];
						 if(type === 'GroupItem') {
							 self.processGroupItem( item );
							} else {// Subscribe to events
									// self.processItem( item );
								   } // Heating_GF_Living
						}
					 self.processItem(  { "type"		: "SwitchItem"
										, "name"		: "Heating_GF_Living"
										, "state"		: "OFF"
										, "link"		: "http://localhost:8080/rest/items/Heating_GF_Living"
										}
									 );
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