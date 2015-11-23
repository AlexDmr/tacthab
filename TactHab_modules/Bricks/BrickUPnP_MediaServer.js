var BrickUPnP		= require( './BrickUPnP.js' )
  // , UpnpServer		= require( '../UpnpServer/UpnpServer.js' )
  , BrickUPnPFactory= require( './BrickUPnPFactory.js' )
  // , webServer		= require( '../webServer/webServer.js' )
  ;

var BrickUPnP_MediaServer = function(id) {
	 BrickUPnP.apply(this, [id]);
	 this.ServerStates = {};
	 return this;
	}
BrickUPnP_MediaServer.prototype = Object.create( BrickUPnP.prototype ); //new BrickUPnP(); BrickUPnP_MediaServer.prototype.unreference();
BrickUPnP_MediaServer.prototype.constructor = BrickUPnP_MediaServer;
BrickUPnP_MediaServer.prototype.getTypeName = function() {return "BrickUPnP_MediaServer";}
BrickUPnP_MediaServer.prototype.registerType('BrickUPnP_MediaServer', BrickUPnP_MediaServer.prototype);
BrickUPnP_MediaServer.prototype.getTypes		= function() {var L=BrickUPnP.prototype.getTypes(); L.push(BrickUPnP_MediaServer.prototype.getTypeName()); return L;}

BrickUPnP_MediaServer.prototype.getMetaData	= function(ObjectID, callback) {
	 var service = this.UPnP.device.services['urn:upnp-org:serviceId:ContentDirectory'];
	 service.callAction	( 'Browse'
						, { ObjectID		: ObjectID
						  , BrowseFlag		: 'BrowseMetadata'
						  , Filter			: '*'
						  , StartingIndex	: 0
						  , RequestedCount	: 0
						  , SortCriteria	: ''
						  }
						, function(err, buffer) {
							 // console.log('BrickUPnP_MediaServer::getMetaData', err || buffer);
							 callback(err || buffer);
							}
						);
	 return undefined;
	}
BrickUPnP_MediaServer.prototype.Browse	= function(ObjectID, callback) {
	 var service = this.UPnP.device.services['urn:upnp-org:serviceId:ContentDirectory'];
	 service.callAction	( 'Browse'
						, { ObjectID		: ObjectID
						  , BrowseFlag		: 'BrowseDirectChildren'
						  , Filter			: '*'
						  , StartingIndex	: 0
						  , RequestedCount	: 0
						  , SortCriteria	: ''
						  }
						, function(err, buffer) {
							 if(err) {console.error("Error:", err);}
							 callback(err || buffer);
							}
						);
	 return undefined;
	}
BrickUPnP_MediaServer.prototype.init		= function(device) {
	 // var self = this;
	 BrickUPnP.prototype.init.apply(this, [device]);
	 return this;
	}

// UPnP events
BrickUPnP_MediaServer.prototype.UPnPEvent	= function(event, service) {
	 delete this.currentInstanceID;
	 // console.log( event );
	 return BrickUPnP.prototype.UPnPEvent.apply(this, [event, service]);
	}
	
BrickUPnP_MediaServer.prototype.getServerStates	= function() {
	 return this.ServerStates;
	}
BrickUPnP_MediaServer.prototype.UpdateEvent	= function(eventNode, service) {
	 switch(eventNode.tagName) {
		 case 'AuthorizationGrantedUpdateID'	:
		 case 'AuthorizationDeniedUpdateID'		:
		 case 'ValidationSucceededUpdateID'		:
		 case 'SourceProtocolInfo'				:
		 case 'SinkProtocolInfo'				:
		 case 'CurrentConnectionIDs'			:
		 case 'ValidationRevokedUpdateID'		:
		 case 'ContainerUpdateIDs'				:
		 case 'SystemUpdateID'					:
			// console.log("\t", this.brickId, service.serviceType, "<" + eventNode.tagName + ">");
			var content = eventNode.textContent;
			if (typeof this.ServerStates[service.serviceType] === 'undefined') {
				 this.ServerStates[service.serviceType] = {};
				}
			this.ServerStates[service.serviceType][eventNode.tagName] = content;
			this.emit		( "eventUPnP"
							, { serviceType	: service.serviceType
							  , attribut	: eventNode.tagName
							  , value		: content
							  }
							);
			// webServer.emit	( "eventForBrick_" + this.brickId
							// , { serviceType	: service.serviceType
							  // , attribut	: eventNode.tagName
							  // , value		: content
							  // }
							// );
		 break;
		 default:
			console.error( "BrickUPnP_MediaServer: Unknown event type", eventNode.tagName);
		}
	 return this;
	}


// ------------------------- Factory -------------------------
var Factory__BrickUPnP_MediaServer = new BrickUPnPFactory(
												  'Factory__BrickUPnP_MediaServer'
												, BrickUPnP_MediaServer
												, function(device) {
													 // console.log("Is this a MediaServer?");
													 return device.deviceType.indexOf("urn:schemas-upnp-org:device:MediaServer:") === 0;
													}
												); 
module.exports = Factory__BrickUPnP_MediaServer;
