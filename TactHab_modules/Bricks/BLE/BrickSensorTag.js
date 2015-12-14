var BrickBLE	= require( './BrickBLE.js' )
  ;
  
  
var BrickSensorTag = function(id, peripheral, sensorTag) {
	var self = this;

	BrickBLE.apply(this, [id, peripheral]);
	this.peripheral	= peripheral;
	this.sensorTag 	= sensorTag;

	// Accelerometer
	sensorTag.on('accelerometerChange', function(x, y, z) {
		//console.log("accelerometerChange", id, x, y, z);
		self.emit("accelerometerChange", {x:4*x, y:4*y, z:4*z});
	});

}

BrickSensorTag.prototype = Object.create(BrickBLE.prototype); // new Brick(); BrickUPnP.prototype.unreference();
BrickSensorTag.prototype.constructor	= BrickSensorTag;
BrickSensorTag.prototype.getTypeName	= function() {return "BrickSensorTag";}
BrickSensorTag.prototype.getTypes		= function() {var L=BrickBLE.prototype.getTypes(); 
													  L.push(BrickSensorTag.prototype.getTypeName()); 
													  return L;}
BrickSensorTag.prototype.registerType('BrickSensorTag', BrickSensorTag.prototype);


/*-----------------------------------------------------------------------------------------------------
 * Device informations
*/
BrickSensorTag.prototype.readDeviceName = function() {
	var self = this;
	return new Promise(function(resolve, reject) {
		self.sensorTag.readDeviceName(function(error, deviceName) {
			if(error) {reject(error);} else {resolve(deviceName);}
		});
	});
}

BrickSensorTag.prototype.readSystemId = function() {
	var self = this;
	return new Promise(function(resolve, reject) {
		self.sensorTag.readSystemId(function(error, systemId) {
			if(error) {reject(error);} else {resolve(systemId);}
		});
	});
}

BrickSensorTag.prototype.readSerialNumber = function() {
	var self = this;
	return new Promise(function(resolve, reject) {
		self.sensorTag.readSerialNumber(function(error, serialNumber) {
			if(error) {reject(error);} else {resolve(serialNumber);}
		});
	});
}

BrickSensorTag.prototype.readFirmwareRevision = function() {
	var self = this;
	return new Promise(function(resolve, reject) {
		self.sensorTag.readFirmwareRevision(function(error, firmwareRevision) {
			if(error) {reject(error);} else {resolve(firmwareRevision);}
		});
	});
}

BrickSensorTag.prototype.readHardwareRevision = function() {
	var self = this;
	return new Promise(function(resolve, reject) {
		self.sensorTag.readHardwareRevision(function(error, hardwareRevision) {
			if(error) {reject(error);} else {resolve(hardwareRevision);}
		});
	});
}

BrickSensorTag.prototype.readSoftwareRevision = function() {
	var self = this;
	return new Promise(function(resolve, reject) {
		self.sensorTag.readSoftwareRevision(function(error, softwareRevision) {
			if(error) {reject(error);} else {resolve(softwareRevision);}
		});
	});
}

BrickSensorTag.prototype.readManufacturerName = function() {
	var self = this;
	return new Promise(function(resolve, reject) {
		self.sensorTag.readManufacturerName(function(error, manufacturerName) {
			if(error) {reject(error);} else {resolve(manufacturerName);}
		});
	});
}

/*-----------------------------------------------------------------------------------------------------
 * Accelerometer
*/
BrickSensorTag.prototype.enableAccelerometer = function() {
	var self = this;
	console.log("Enabling accelerometer of sensorTag...");
	return new Promise(function(resolve, reject) {
		self.sensorTag.enableAccelerometer(function(error) {
			console.log("sensorTag Accelerometer enabled =>", error);
			if(error) {reject(error);} else {resolve(self);}
		});
	});
}

BrickSensorTag.prototype.disableAccelerometer = function() {
	var self = this;
	return new Promise(function(resolve, reject) {
		self.sensorTag.disableAccelerometer(function(error) {
			if(error) {reject(error);} else {resolve(self);}
		});
	});
}

BrickSensorTag.prototype.setAccelerometerPeriod = function(ms) {
	var self = this;
	switch(this.sensorTag.type.toLowerCase()) {
		case "cc2650": // CC2650: period 100 - 2550 ms, default period is 1000 ms
			ms = ms || 1000;
			ms = Math.max(100, Math.min(ms, 2550))
		break; 
		case "cc2540": // CC2540: period 1 - 2550 ms, default period is 2000 ms
			ms = ms || 2000;
			ms = Math.max(1, Math.min(ms, 2550))
		break;
		default:
			console.error("Unknown sensorTag type", this.sensorTag.type);
	}
	return new Promise(function(resolve, reject) {
		self.sensorTag.setAccelerometerPeriod(ms, function(error) {
			if(error) {reject(error);} else {resolve(self);}
		});
	});
}

BrickSensorTag.prototype.readAccelerometer = function() {
	var self = this;
	return new Promise(function(resolve, reject) {
		self.sensorTag.readAccelerometer(function(error, x, y, z) {
			if(error) {reject(error);} else {resolve({x:x, y:y, z:z});}
		});
	});
}

BrickSensorTag.prototype.notifyAccelerometer = function() {
	var self = this;
	return new Promise(function(resolve, reject) {
		self.sensorTag.notifyAccelerometer(function(error) {
			if(error) {reject(error);} else {resolve(self);}
		});
	});
}

BrickSensorTag.prototype.unnotifyAccelerometer = function() {
	var self = this;
	return new Promise(function(resolve, reject) {
		self.sensorTag.unnotifyAccelerometer(function(error) {
			if(error) {reject(error);} else {resolve(self);}
		});
	});
}






module.exports = BrickSensorTag;
