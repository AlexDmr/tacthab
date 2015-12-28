var BrickBLE	= require( './BrickBLE.js' )
  ;
  
  
var BrickSensorTag = function(id, sensorTag) {
	var self = this;

	BrickBLE.apply(this, [id, sensorTag]);
	
	this.peripheral		=
	this.sensorTag 		= sensorTag;
	//this.isConnected	= true;
	//this.emit("connected", {value: true});

	// Accelerometer
	sensorTag.on('accelerometerChange', function(x, y, z) {
		//console.log("accelerometerChange", id, x, y, z);
		self.emit("accelerometerChange", {x:x, y:y, z:z});
	});
	sensorTag.on('gyroscopeChange', function(x, y, z) {
		self.emit("gyroscopeChange", {x:x, y:y, z:z});
	});
	sensorTag.on('magnetometerChange', function(x, y, z) {
		self.emit("magnetometerChange", {x:x, y:y, z:z});
	});
	sensorTag.on('irTemperatureChange', function(objectTemperature, ambientTemperature) {
		self.emit("irTemperatureChange", {objectTemperature:objectTemperature, ambientTemperature:ambientTemperature});
	});
	sensorTag.on('humidityChange', function(temperature, humidity) {
		self.emit("humidityChange", {temperature:temperature, humidity:humidity});
	});
	sensorTag.on('barometricPressureChange', function(pressure) {
		self.emit("barometricPressureChange", {pressure:pressure});
	});
	sensorTag.on('luxometerChange', function(lux) {
		self.emit("luxometerChange", {lux:lux});
	});
	sensorTag.on('simpleKeyChange', function(left, right, reedRelay) {
		self.emit("luxometerChange", {left:left, right:right, reedRelay:reedRelay});
	});
}

BrickSensorTag.prototype = Object.create(BrickBLE.prototype); // new Brick(); BrickUPnP.prototype.unreference();
BrickSensorTag.prototype.constructor	= BrickSensorTag;
BrickSensorTag.prototype.getTypeName	= function() {return "BrickSensorTag";}
BrickSensorTag.prototype.getTypes		= function() {var L=BrickBLE.prototype.getTypes(); 
													  L.push(BrickSensorTag.prototype.getTypeName()); 
													  return L;}
BrickSensorTag.prototype.registerType('BrickSensorTag', BrickSensorTag.prototype);


BrickSensorTag.prototype.connect 		= function() {
	var brick = this;
	var sensorTag = this.sensorTag;
	return new Promise( function(resolve, reject) {
		sensorTag.connectAndSetUp( function(error) {
			if(error) {console.error("sensorTag connectAndSetUp error", error); return;}
			sensorTag.readDeviceName( function(error, deviceName) {
				if(error) {reject(error); return;}
				brick.isConnected = true;
				resolve( brick.getDescription() );
			}); // sensorTag.readDeviceName
		}); // sensorTag.connectAndSetUp
	}); // Promise
}

BrickSensorTag.prototype.connectAndSetUp	= function() {
	var brick = this;
	var sensorTag = this.sensorTag;
	sensorTag.connectAndSetUp( function(error) {
		if(error) {console.error("sensorTag connectAndSetUp error", error); return;}
		sensorTag.readDeviceName( function(error, deviceName) {
			if(error) {console.error(error); return;}
			brick.emit("updateDescription", brick.getDescription());
		});
	});
}


function generatePromise_mtd(mtdName, mtdParams, cbParams) {
	var i;
	var str = ""; //proto.slice();
	// str += "." + mtdName + " = function(";
	// for(i=0; i<mtdParams.length; i++) {str+=mtdParams[i]; if(i !== mtdParams.length-1) {str+=", ";}}
	// str += ") {\n";
	str += "\tvar self = this;\n"
	str += "\treturn new Promise(function(resolve, reject) {\n"
	str += "\t\tself.sensorTag." + mtdName + "(";
		for(i=0; i<mtdParams.length; i++) {str += mtdParams[i] + ", ";}
		str += "function(error";
		for(i=0; i<cbParams.length; i++) {str+= ", " + cbParams[i];}
		str+=") {\n"
	str += "\t\t\tif(error) {reject(error);} else {resolve( {"
		for(i=0; i<cbParams.length; i++) {str+=cbParams[i] + ":" + cbParams[i]; if(i !== cbParams.length-1) {str+=", ";}}
		str += "} );}\n";
	str +=	"\t\t});\n"
	str +=	"\t});\n"
	//str +=	"});";
	//console.log(str);
	return str;
}

var L_mtd = [
	{name: "readDeviceName"			, params:[]			, cb_params:["deviceName"]},
	{name: "readSystemId"			, params:[]			, cb_params:["systemId"]},
	{name: "readSerialNumber"		, params:[]			, cb_params:["serialNumber"]},
	{name: "readFirmwareRevision"	, params:[]			, cb_params:["firmwareRevision"]},
	{name: "readHardwareRevision"	, params:[]			, cb_params:["hardwareRevision"]},
	{name: "readSoftwareRevision"	, params:[]			, cb_params:["softwareRevision"]},
	{name: "readSoftwareRevision"	, params:[]			, cb_params:["manufacturerName"]},
	// IR temperature
	{name: "enableIrTemperature"	, params:[]			, cb_params:[]},
	{name: "disableIrTemperature"	, params:[]			, cb_params:[]},
	{name: "setIrTemperaturePeriod"	, params:["period"]	, cb_params:[]},
	{name: "readIrTemperature"		, params:[]			, cb_params:["objectTemperature", "ambientTemperature"]},
	{name: "notifyIrTemperature"	, params:[]			, cb_params:[]},
	{name: "unnotifyIrTemperature"	, params:[]			, cb_params:[]},
	// Accelerometer
	{name: "enableAccelerometer"	, params:[]			, cb_params:[]},
	{name: "disableAccelerometer"	, params:[]			, cb_params:[]},
	{name: "setAccelerometerPeriod"	, params:["ms"]		, cb_params:[]},
	{name: "readAccelerometer"		, params:[]			, cb_params:["x", "y", "z"]},
	{name: "notifyAccelerometer"	, params:[]			, cb_params:[]},
	{name: "unnotifyAccelerometer"	, params:[]			, cb_params:[]},
	// Humidity Sensor
	{name: "enableHumidity"			, params:[]			, cb_params:[]},
	{name: "disableHumidity"		, params:[]			, cb_params:[]},
	{name: "setHumidityPeriod"		, params:["ms"]		, cb_params:[]},
	{name: "readHumidity"			, params:[]			, cb_params:["temperature", "humidity"]},
	{name: "notifyHumidity"			, params:[]			, cb_params:[]},
	{name: "unnotifyHumidity"		, params:[]			, cb_params:[]},
	// Magnetometer
	{name: "enableMagnetometer"		, params:[]			, cb_params:[]},
	{name: "disableMagnetometer"	, params:[]			, cb_params:[]},
	{name: "setMagnetometerPeriod"	, params:["ms"]		, cb_params:[]},
	{name: "readMagnetometer"		, params:[]			, cb_params:["x", "y", "z"]},
	{name: "notifyMagnetometer"		, params:[]			, cb_params:[]},
	{name: "unnotifyMagnetometer"	, params:[]			, cb_params:[]},
	// Barometric Pressure Sensor
	{name: "enableBarometricPressure", params:[]		, cb_params:[]},
	{name: "disableBarometricPressure", params:[]		, cb_params:[]},
	{name: "setBarometricPressurePeriod", params:["ms"]	, cb_params:[]},
	{name: "readBarometricPressure", params:[]			, cb_params:["pressure"]},
	{name: "notifyBarometricPressure", params:[]		, cb_params:[]},
	{name: "unnotifyBarometricPressure", params:[]		, cb_params:[]},
	// Gyroscope
	{name: "enableGyroscope"		, params:[]			, cb_params:[]},
	{name: "disableGyroscope"		, params:[]			, cb_params:[]},
	{name: "setGyroscopePeriod"		, params:["ms"]		, cb_params:[]},
	{name: "readGyroscope"			, params:[]			, cb_params:["x", "y", "z"]},
	{name: "notifyGyroscope"		, params:[]			, cb_params:[]},
	{name: "unnotifyGyroscope"		, params:[]			, cb_params:[]},
	// IO (CC2650 only)
	{name: "readIoData"				, params:[]			, cb_params:["value"]},
	{name: "writeIoData"			, params:["value"]	, cb_params:[]},
	{name: "readIoConfig"			, params:[]			, cb_params:["value"]},
	{name: "writeIoConfig"			, params:["value"]	, cb_params:[]},
	// Luxometer (CC2650 only)
	{name: "enableLuxometer"		, params:[]			, cb_params:[]},
	{name: "disableLuxometer"		, params:[]			, cb_params:[]},
	{name: "setLuxometerPeriod"		, params:["ms"]		, cb_params:[]},
	{name: "readLuxometer"			, params:[]			, cb_params:["lux"]},
	{name: "notifyLuxometer"		, params:[]			, cb_params:[]},
	{name: "unnotifyLuxometer"		, params:[]			, cb_params:[]},
	// Simple Key
	{name: "notifySimpleKey", params:[], cb_params:[]},
	{name: "unnotifySimpleKey", params:[], cb_params:[]}
];

var i, mtd;
for(var i=0; i<L_mtd.length; i++) {
	mtd = L_mtd[i];
	//console.log("Generating method", mtd);
	BrickSensorTag.prototype[mtd.name] = new Function( mtd.params
													 , generatePromise_mtd(mtd.name, mtd.params, mtd.cb_params)
													 );
}

module.exports = BrickSensorTag;
