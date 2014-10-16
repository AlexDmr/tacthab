define( [ './Brick.js'
		, '../UpnpServer/UpnpServer.js'
		]
	  , function(Brick, UpnpServer) {
	var BrickUPnP = function() {
		 Brick.prototype.constructor.apply(this, []);
		 this.UPnP = {};
		 return this;
		}
	BrickUPnP.prototype = new Brick();
	BrickUPnP.prototype.constructor = BrickUPnP;
	
	BrickUPnP.prototype.init		= function(device) {
		 this.device = device;
		}
	BrickUPnP.prototype.serialize	= function() {
		 var json = Brick.prototype.serialize.apply(this, []);
		 return json;
		}
	BrickUPnP.prototype.UPnP_call = function() {
		 console.error( "BrickUPnP.prototype.UPnP_call : To be implemented");
		}
	BrickUPnP.prototype.init	  = function(device) {
		 Brick.prototype.init.apply(this, [device]);
		 this.UPnP.device		= device;
		 this.UPnP.uuid			= device.uuid;
		 this.UPnP.udn			= device.udn;
		 this.UPnP.deviceType	= device.deviceType;
		 this.UPnP.friendlyName	= device.friendlyName;
		 this.UPnP.host			= device.host;
		 this.UPnP.port			= device.port;
		 return this;
		}
	return BrickUPnP;
});