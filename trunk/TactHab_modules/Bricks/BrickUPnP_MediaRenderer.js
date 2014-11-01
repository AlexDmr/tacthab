define( [ './BrickUPnP.js'
		, '../UpnpServer/UpnpServer.js'
		, './BrickUPnPFactory.js'
		]
	  , function(BrickUPnP, UpnpServer, BrickUPnPFactory) {
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
	BrickUPnP_MediaRenderer.prototype.loadMedia	= function(uri) {
	
		}
	BrickUPnP_MediaRenderer.prototype.play		= function() {
	
		}
	BrickUPnP_MediaRenderer.prototype.pause		= function() {
	
		}
	BrickUPnP_MediaRenderer.prototype.stop		= function() {
	
		}
	BrickUPnP_MediaRenderer.prototype.setVolume	= function(volume) {
	
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
			 break;
			 default:
				 if(eventNode.hasAttribute('val')) {
					 var val = eventNode.getAttribute('val');
					 this.MediasStates[this.currentInstanceID || 0][eventNode.tagName] = val;
					} else {console.error('Event that has no val attribute :', eventNode.tagName);
						   }
				//console.log('BrickUPnP_MediaRenderer::UpdateEvent('+eventNode.tagName+') has to be implemented : ');
			}
		 // console.log("\t</", eventNode.tagName, ">");
		 return this;
		}

	
	// ------------------------- Factory -------------------------
	var Factory__BrickUPnP_MediaRenderer = new BrickUPnPFactory(
													  'Factory__BrickUPnP_MediaRenderer'
													, BrickUPnP_MediaRenderer
													, function(device) {
														 return device.deviceType.indexOf("urn:schemas-upnp-org:device:MediaRenderer:") === 0;
														}
													);
	return Factory__BrickUPnP_MediaRenderer;
});