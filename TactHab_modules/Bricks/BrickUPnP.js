var Brick		= require( './Brick.js' )
  // , UpnpServer	= require( '../UpnpServer/UpnpServer.js' )
  ;
  
var xmldom		= require( 'xmldom' );
var xmldomparser= new xmldom.DOMParser();
// var xml2js		= require('xml2js');

var BrickUPnP = function(id) {
	 Brick.apply(this, [id]);
	 //console.log( "BrickUPnP", this.brickId);
	 this.subscriptions	= [];
	 this.UPnP			= {};
	 this.UPnP_states	= {};
	 return this;
	}
BrickUPnP.prototype = Object.create(Brick.prototype); // new Brick(); BrickUPnP.prototype.unreference();
BrickUPnP.prototype.constructor		= BrickUPnP;
BrickUPnP.prototype.getTypeName		= function() {return "BrickUPnP";}
BrickUPnP.prototype.getTypes		= function() {var L=Brick.prototype.getTypes(); L.push(BrickUPnP.prototype.getTypeName()); return L;}
BrickUPnP.prototype.registerType('BrickUPnP', BrickUPnP.prototype);


BrickUPnP.prototype.dispose			= function() {
	 for(var i=0; i<this.subscriptions.length; i++) {
		 console.log("\tclearTimeout", i);
		 clearTimeout( this.subscriptions[i].timer );
		}
	 Brick.prototype.dispose.apply(this, []);
	}
BrickUPnP.prototype.UPnP_call		= function() {
	 console.error( "BrickUPnP.prototype.UPnP_call : To be implemented");
	}
BrickUPnP.prototype.getDescription	= function() {
	 var json = Brick.prototype.getDescription.apply(this, []);
	 json.name = this.UPnP.friendlyName;
	 if(this.UPnP.icons[0]) {
		 var url = this.UPnP.icons[0].url[0];
		 if(url[0] !== '/') {url = '/' + url;}
		 json.iconURL = 'http://' + this.UPnP.device.host + ':' + this.UPnP.device.port + url;
		}
	 return json;
	}
	
function CB_stateChange(brick, device) {
	return function(event) {
		 try {brick.UPnPEvent(event.textXML, this);
			 } catch(err) {console.error("ERROR calling UPnPEvent on", device.friendlyName, ":", err);}
		}
	}
function CB_newSubscription(brick) {
	return function(data) {
				 var pos = brick.subscriptions.indexOf( data.old );
				 if(pos >= 0) {brick.subscriptions.splice(pos, 1);}
				 brick.subscriptions.push( data.new );
				 console.log("\tBrickUPnP: Registering the new subscription for", this.id);
				}
}
function CB_service(brick, service) {
	return function(err, data) {
				 if(err) {
					 console.error('BrickUPnP', brick.brickId, "received:", "\n\terr :", err, "\n\tdata :", data);
					} else {//console.log('subscription done for', brick.brickId, service.serviceType);
							brick.subscriptions.push( data ); // data is a subscription in the sense of upnp-service.js library
						   }
				 };
}
BrickUPnP.prototype.init	 		= function(device) {
	 var self = this;
	 Brick.prototype.init.apply(this, [device]);
	 this.UPnP.device		= device;
	 this.UPnP.uuid			= device.uuid;
	 this.UPnP.udn			= device.udn;
	 this.UPnP.deviceType	= device.deviceType;
	 this.UPnP.friendlyName	= device.friendlyName;
	 this.UPnP.host			= device.host;
	 this.UPnP.port			= device.port;
	 this.UPnP.icons		= [];
	 
	 if(device.desc.iconList && device.desc.iconList.icon) {this.UPnP.icons = device.desc.iconList.icon;}
	 
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
		 service.on	( "stateChange"		, CB_stateChange(self, device));
		 service.on	( 'newSubscription'	, CB_newSubscription(self));
		 service.subscribe	( CB_service(self, service) );
		}
	 return this;
	}
BrickUPnP.prototype.UpdateEvent		= function(eventNode, service) {}
BrickUPnP.prototype.UpdateFromEvent	= function(eventNode, service) {
	 var L = eventNode.getElementsByTagName('e:property');
	 for(var i=0; i<L.length; i++) {
		 var pos;
		 if(L.item(i).childNodes.length > 1) {pos = 1;} else {pos = 0;}
		 try {this.UpdateEvent( L.item(i).childNodes[pos], service );
			 } catch(err) {console.error("ERROR updating UPnP event: ", err, L.item(i).childNodes[pos].tagName);}
		}
	 return L.length;
	}
BrickUPnP.prototype.UPnPEvent		= function(event, service) {
	 // var self = this;
	 // console.log("New event for", self.brickId, service.serviceType);
	 var doc = null, error;
	 try {
		 doc = xmldomparser.parseFromString(event, 'text/xml');
		} catch(err) {error = err; console.error("ERROR while parsing event:", err);}
	 if(doc) {
		 // console.log("Event parsed succesfully");
		 // for(var i in event) {console.log(i);}
		 if(this.UpdateFromEvent(doc.documentElement, service) === 0) {
			 console.error("Event without any e:property ?\n", event);
			}
		} else {console.error('document get an error:', event, error);}
	}
BrickUPnP.prototype.serialize		= function() {
	 var json = Brick.prototype.serialize.apply(this, []);
	 json.brickId	= this.brickId;
	 json.classe	= 'BrickUPnP';
	 return json;
	}

module.exports = BrickUPnP;
