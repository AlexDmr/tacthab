define( [ './BrickUPnP.js'
		, './BrickUPnPFactory.js'
		, '../UpnpServer/UpnpServer.js'
		, '../webServer/webServer.js'
		, './BrickUPnP_MediaServer.js'
		]
	  , function( BrickUPnP, BrickUPnPFactory
				, UpnpServer, webServer
				, BrickUPnP_MediaServer ) {
	var xmldom		= require( 'xmldom' );
	var xmldomparser= new xmldom.DOMParser();

	var BrickUPnP_MediaRenderer = function() {
		 BrickUPnP.prototype.constructor.apply(this, []);
		 this.MediasStates = {};
		 return this;
		}
	BrickUPnP_MediaRenderer.prototype = new BrickUPnP();
	BrickUPnP_MediaRenderer.prototype.constructor = BrickUPnP_MediaRenderer;
	BrickUPnP_MediaRenderer.prototype.getTypeName = function() {return "BrickUPnP_MediaRenderer";}

	BrickUPnP_MediaRenderer.prototype.getMediasStates	= function() {
		 return this.MediasStates;
		}
	BrickUPnP_MediaRenderer.prototype.loadMedia	= function(uri, cb) {
		 var service = this.UPnP.device.services['urn:upnp-org:serviceId:AVTransport'];
		 service.callAction	( 'SetAVTransportURI'
							, { InstanceID			: 0
							  , CurrentURI			: uri
							  , CurrentURIMetaData	: ''
							  }
							, function(err, buffer) {
								 console.log(this.brickId, "BrickUPnP_MediaRenderer::loadMedia", err || buffer);
								 if(cb) cb(err || buffer);
								}
							);
		}
	BrickUPnP_MediaRenderer.prototype.Play		= function(cb) {
		 var service = this.UPnP.device.services['urn:upnp-org:serviceId:AVTransport'];
		 service.callAction	( 'Play'
							, { InstanceID		: 0
							  , Speed			: '1'
							  }
							, function(err, buffer) {
								 console.log(this.brickId, "BrickUPnP_MediaRenderer::Play", err || buffer);
								 if(cb) cb(err || buffer);
								}
							);
		}
	BrickUPnP_MediaRenderer.prototype.Pause		= function(cb) {
		 var service = this.UPnP.device.services['urn:upnp-org:serviceId:AVTransport'];
		 service.callAction	( 'Pause'
							, { InstanceID		: 0
							  }
							, function(err, buffer) {
								 console.log(this.brickId, "BrickUPnP_MediaRenderer::Pause", err || buffer);
								 if(cb) cb(err || buffer);
								}
							);
		}
	BrickUPnP_MediaRenderer.prototype.Stop		= function() {
		 var service = this.UPnP.device.services['urn:upnp-org:serviceId:AVTransport'];
		 service.callAction	( 'Stop'
							, { InstanceID		: 0
							  }
							, function(err, buffer) {
								 console.log(this.brickId, "BrickUPnP_MediaRenderer::Stop", err || buffer);
								 if(cb) cb(err || buffer);
								}
							);
		}
	BrickUPnP_MediaRenderer.prototype.GetVolume	= function(callback) {
		 var service = this.UPnP.device.services['urn:upnp-org:serviceId:RenderingControl'];
		 service.callAction	( 'GetVolume'
							, { InstanceID		: 0
							  , Channel			: "Master"
							  }
							, function(err, buffer) {
								 console.log(this.brickId, "BrickUPnP_MediaRenderer::GetVolume", err || buffer);
								 if(callback) {
									 callback(err, buffer);
									}
								}
							);
		}
	BrickUPnP_MediaRenderer.prototype.SetVolume	= function(volume) {
		 volume = Math.min(100, Math.max(0, Math.round(volume)));
		 var service = this.UPnP.device.services['urn:upnp-org:serviceId:RenderingControl'];
		 service.callAction	( 'SetVolume'
							, { InstanceID		: 0
							  , Channel			: "Master"
							  , DesiredVolume	: volume
							  }
							, function(err, buffer) {
								 console.log(this.brickId, "BrickUPnP_MediaRenderer::SetVolume", err || buffer);
								 if(cb) cb(err || buffer);
								}
							);
		}
	BrickUPnP_MediaRenderer.prototype.goToTime	= function(time) {
		 
		}
	BrickUPnP_MediaRenderer.prototype.init		= function(device) {
		 var self = this;
		 BrickUPnP.prototype.init.apply(this, [device]);
		 console.log("New MediaRenderer", this.brickId, device.friendlyName);
		 return this;
		}

	// UPnP events
	BrickUPnP_MediaRenderer.prototype.UPnPEvent	= function(event, service) {
		 delete this.currentInstanceID;
		 return BrickUPnP.prototype.UPnPEvent.apply(this, [event, service]);
		}
		
	BrickUPnP_MediaRenderer.prototype.UpdateEvent	= function(eventNode, service) {
		 // To be implemented
		 console.log("\t", this.brickId, service.serviceType, "<" + eventNode.tagName + ">");
		 switch(eventNode.tagName) {
			 case 'InstanceID'					:
				var val = eventNode.getAttribute('val');
				this.currentInstanceID = val;
				if(typeof this.MediasStates[val] === 'undefined') {this.MediasStates[val] = {};}
				for(var i=0; i<eventNode.childNodes.length; i++) {
					 this.UpdateEvent( eventNode.childNodes.item(i), service );
					}
				break;
			 case 'LastChange':
				var doc = xmldomparser.parseFromString(eventNode.textContent, 'text/xml');
				// console.log( "doc.documentElement:", doc.documentElement.childNodes.length);
				for(var i=0; i<doc.documentElement.childNodes.length; i++) {
					 this.UpdateEvent( doc.documentElement.childNodes.item(i), service );
					}
			 break;
			 case 'SourceProtocolInfo'		:
			 case 'SinkProtocolInfo'		:
			 case 'CurrentConnectionIDs'	:
				var content = eventNode.textContent;
				if (typeof this.MediasStates[service.serviceType] === 'undefined') {
					 this.MediasStates[service.serviceType] = {};
					}
				this.MediasStates[service.serviceType][eventNode.tagName] = content;
				webServer.emit	( "eventForBrick_" + this.brickId
								, { serviceType	: service.serviceType
								  , attribut	: eventNode.tagName
								  , value		: content
								  }
								);
			 break;
			 default:
				 if(eventNode.hasAttribute('val')) {
					 var val = eventNode.getAttribute('val');
					 this.MediasStates[this.currentInstanceID || 0][eventNode.tagName] = val;
					 webServer.emit	( "eventForBrick_" + this.brickId
									, { serviceType	: this.currentInstanceID
									  , attribut	: eventNode.tagName
									  , value		: val
									  }
									);
					} else {console.error('Event that has no val attribute :', eventNode.tagName);
						   }
				//console.log('BrickUPnP_MediaRenderer::UpdateEvent('+eventNode.tagName+') has to be implemented : ');
			}
		 // console.log("\t</", eventNode.tagName, ">");
		 return this;
		}

	
	// Links to the MediaServers
	BrickUPnP_MediaRenderer.prototype.getMediaServersIds = function() {
		 var L_Bricks = BrickUPnP_MediaServer.getBricks()
		   , L_Ids    = [];
		 for(var i=0; i<L_Bricks.length; i++) {
			 var MS = L_Bricks[i];
			 L_Ids.push( {id: MS.brickId, name: MS.UPnP.friendlyName} );
			}
		 return L_Ids;
		}
	
	// ------------------------- Factory -------------------------
	var Factory__BrickUPnP_MediaRenderer = new BrickUPnPFactory(
													  'Factory__BrickUPnP_MediaRenderer'
													, BrickUPnP_MediaRenderer
													, function(device) {
														 return device.deviceType.indexOf("urn:schemas-upnp-org:device:MediaRenderer:") === 0;
														}
													);
	Factory__BrickUPnP_MediaRenderer.setFactoryMediaServer = function(fact) {
		 this.FactoryMediaServer = fact;
		}
	return Factory__BrickUPnP_MediaRenderer;
});