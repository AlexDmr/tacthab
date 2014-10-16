define( [ './BrickUPnP.js'
		, '../UpnpServer/UpnpServer.js'
		, './BrickUPnPFactory.js'
		]
	  , function(BrickUPnP, UpnpServer, BrickUPnPFactory) {
	var BrickUPnP_MediaRenderer = function() {
		 BrickUPnP.prototype.constructor.apply(this, []);
		 return this;
		}
	BrickUPnP_MediaRenderer.prototype = new BrickUPnP();
	BrickUPnP_MediaRenderer.prototype.constructor = BrickUPnP_MediaRenderer;

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
		 BrickUPnP.prototype.init.apply(this, [device]);
		 // Subscribe to events
		 for(var s in device.services) {
			 console.log( device.services[s].serviceType );
			}
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