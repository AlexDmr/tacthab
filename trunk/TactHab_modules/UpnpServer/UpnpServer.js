define	( [ ]
		, function() { //(fs, express, bodyParser, xmldom, multer) {
var UpnpControlPoint = require('node-upnp-controlpoint').UpnpControlPoint;

var UpnpServer = {
	  controlpoint		: new UpnpControlPoint()
	, D_devices			: {}
	, init				: function() {
		 var self = this;
		 self.controlpoint.on( "device"
							 , function(device) {self.DeviceDetected(device);}
							 );
		 self.controlpoint.on( "device-lost"
							 , function(udn   ) {self.DeviceRemoved(udn);}
							 );
		 self.controlpoint.search();
		}
	, DeviceDetected	: function(device) {
		 var uuid = device.uuid
		   , udn  = device.udn
		   , type = device.deviceType
		   , name = device.friendlyName
		   , host = device.host
		   , port = device.port;
		 console.log("New device detected:", "\n\tuuid:", uuid, "\n\ttype:", type, "\n\tname:", name, "\n\thost:", host, "\n\tport:", port);
		 this.D_devices[uuid] = device;
		}
	, DeviceRemoved		: function(uuid) {
		 console.log("Device removed:\n\tudn:", uuid);
		 if(this.D_devices[uuid]) {
			 console.log("\ttype:", this.D_devices[uuid].deviceType);
			 console.log("\tname:", this.D_devices[uuid].friendlyName);
			 delete this.D_devices[uuid];
			}
		}
};

return UpnpServer;
});