
var UpnpControlPoint = require('node-upnp-controlpoint').UpnpControlPoint;

var UpnpServer = {
	  controlpoint		: new UpnpControlPoint()
	, D_devices			: {}
	, D_CB				: {}
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
		   // , udn  = device.udn
		   , type = device.deviceType
		   , name = device.friendlyName
		   , host = device.host
		   , port = device.port;
		 console.log("New device detected:", "\n\tuuid:", uuid, "\n\ttype:", type, "\n\tname:", name, "\n\thost:", host, "\n\tport:", port);
		 this.D_devices[uuid] = device;
		 this.CallBack('add', device);
		}
	, DeviceRemoved		: function(uuid) {
		 // console.log("Device removed:\n\tudn:", uuid);
		 if(this.D_devices[uuid]) {
			 // console.log("\ttype:", this.D_devices[uuid].deviceType);
			 // console.log("\tname:", this.D_devices[uuid].friendlyName);
			 console.log("--- Removing", uuid, "---");
			 this.CallBack('sub', this.D_devices[uuid]);
			 delete this.D_devices[uuid];
			}
		}
	, Subscribe			: function(id, CB) {
		 this.D_CB[id] = {id:id, CB:CB};
		}
	, UnSubscribe		: function(id) {
		 delete this.D_CB[id];
		}
	, CallBack			: function(type, device) {
		 var D = {}, i;
		 for(i in this.D_CB) {D[i] = this.D_CB[i];}
		 for(i in D) {D[i].CB(type, device);}
		}
};

module.exports = UpnpServer;
