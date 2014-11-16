define( [ './Brick.js'
		, '../UpnpServer/UpnpServer.js'
		]
	  , function(Brick, UpnpServer) {
	var xmldom		= require( 'xmldom' );
	var xmldomparser= new xmldom.DOMParser();
	// var xml2js		= require('xml2js');
	
	var BrickUPnP = function() {
		 Brick.prototype.constructor.apply(this, []);
		 this.UPnP			= {};
		 this.UPnP_states	= {};
		 return this;
		}
	BrickUPnP.prototype = new Brick();
	BrickUPnP.prototype.constructor = BrickUPnP;
	BrickUPnP.prototype.getTypeName = function() {return "BrickUPnP";}
	
	BrickUPnP.prototype.serialize	= function() {
		 var json = Brick.prototype.serialize.apply(this, []);
		 return json;
		}
	BrickUPnP.prototype.UPnP_call = function() {
		 console.error( "BrickUPnP.prototype.UPnP_call : To be implemented");
		}
	BrickUPnP.prototype.init	  = function(device) {
		 var self = this;
		 Brick.prototype.init.apply(this, [device]);
		 this.UPnP.device		= device;
		 this.UPnP.uuid			= device.uuid;
		 this.UPnP.udn			= device.udn;
		 this.UPnP.deviceType	= device.deviceType;
		 this.UPnP.friendlyName	= device.friendlyName;
		 this.UPnP.host			= device.host;
		 this.UPnP.port			= device.port;
		 
		 // Parse the rawData
		 try {this.docDescription = xmldomparser.parseFromString( device.rawData );
			  this.L_icons = this.docDescription.getElementsByTagName('icon');
			 } catch(err)	{console.error("Error paring raw data description for device ", device.friendlyName, ":", JSON.stringify(err));
							}
		 
		 // Subscribe to events
		 for(var s in device.services) {
			 var service = device.services[s];
			 // console.log( service.serviceType );
			 self.UPnP_states[service.serviceType] = {};
			 service.on("stateChange", function(event) {
				 self.UPnPEvent(event.textXML, this);
				});
			 service.subscribe	(function(service) {return function(err, data) {
									 if(err) {
										 console.log('BrickUPnP', self.brickId, "received:", "\n\terr :", err, "\n\tdata :", data);
										} else {console.log('subscription done for', self.brickId, service.serviceType);}
									 };
									}(service)
								);
			}
		 return this;
		}
	BrickUPnP.prototype.UpdateEvent		= function(eventNode, service) {}
	BrickUPnP.prototype.UpdateFromEvent	= function(eventNode, service) {
		 var L = eventNode.getElementsByTagName('e:property');
		 // console.log("There are", L.length, "events");
		 for(var i=0; i<L.length; i++) {
			 // console.log("\tevent", i, "has", L.item(i).childNodes.length, "childs");
			 var pos;
			 if(L.item(i).childNodes.length > 1) {pos = 1;} else {pos = 0;}
			 this.UpdateEvent( L.item(i).childNodes[pos], service );
			}
		 /*if(eventNode.childNodes.length === 0) {
			 this.UpdateEvent(eventNode);
			} else	{for(var i=0; i<eventNode.childNodes.length; i++) {
						 if(eventNode.tagName !== 'Event') this.UpdateEvent(eventNode);
						 this.UpdateFromEvent(eventNode.childNodes.item(i));
						}
					}*/
		 return L.length;
		}
	BrickUPnP.prototype.UPnPEvent	= function(event, service) {
		 var self = this;
		 // console.log("New event for", self.brickId, ":", event, "\n\tfor service:", service.serviceType);
		 var doc = null, error;
		 try {
			 doc = xmldomparser.parseFromString(event, 'text/xml');
			} catch(err) {error = err;}
		 if(doc) {
			 // console.log("Event parsed succesfully");
			 // for(var i in event) {console.log(i);}
			 if(this.UpdateFromEvent(doc.documentElement, service) === 0) {
				 console.log("Event without any e:property ?\n", event);
				}
			} else {console.error('document get an error:', event, error);}
		}
		
	
	
	return BrickUPnP;
});