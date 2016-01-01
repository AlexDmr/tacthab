var defs = require( "../BrickMetaWear_defs.js" );
const FSR_SCALE = [16.4, 32.8, 65.6, 131.2, 262.4];

const eventName = 'ble_' + defs.modules.GYRO + '_' + defs.GyroBmi160Register.DATA;

module.exports = function(proto) {
//____________________________________________________________________________________________________
// Specific methods : GYROSCOPE
//____________________________________________________________________________________________________
proto.initGyroscope 	= function() {
	var brick 		= this;
	this.config 	= {};
	this.on	( eventName
			, function(data) {
				var x = data.readInt16LE(2) / brick.gyroscope_scale
				  , y = data.readInt16LE(4) / brick.gyroscope_scale
				  , z = data.readInt16LE(6) / brick.gyroscope_scale
				  ;
				brick.emit("gyroscopeChange", {x:x, y:y, z:z});
				}
			)
}


//____________________________________________________________________________________________________
var buffer_startGyroscope 		= new Buffer(3);
    buffer_startGyroscope[0] 	= defs.modules.GYRO;
    buffer_startGyroscope[1] 	= defs.GyroBmi160Register.POWER_MODE;
    buffer_startGyroscope[2] 	= 0x1;
proto.startGyroscope 	= function() {
	console.log( "BrickMetaWear::startGyroscope" );
	return this.writeCharacteristic(defs.COMMAND_UUID, buffer_startGyroscope);
}

//____________________________________________________________________________________________________
/*
struct GyroBmi160Config
    uint8_t gyr_odr 	:4;
    uint8_t gyr_bwp 	:2;
    uint8_t 			:2;
    uint8_t gyr_range 	:3;
    uint8_t  			:5;
*/
proto.enableGyroscope	= function( config ) {
	var brick = this;
	config 					= config 			|| {};
	this.config.gyr_odr		= config.gyr_odr	|| this.config.gyr_odr 	|| defs.MblMwGyroBmi160Odr.MBL_MW_GYRO_BMI160_ODR_50HZ;
	this.config.gyr_bwp		= config.gyr_bwp	|| this.config.gyr_bwp 	|| 2;
	this.config.gyr_range	= config.gyr_range	|| this.config.gyr_range|| defs.MblMwGyroBmi160Range.MBL_MW_GYRO_BMI160_FSR_2000DPS;

	this.gyroscope_scale = FSR_SCALE[ this.config.gyr_range ];

	console.log( "BrickMetaWear::enableGyroscope" );
    var buffer = new Buffer(4); // Configure gyroscope
    buffer[0] = defs.modules.GYRO;
    buffer[1] = defs.GyroBmi160Register.CONFIG;
    buffer[2] = this.config.gyr_odr | (this.config.gyr_bwp << 4) 
    buffer[3] = this.config.gyr_range;
    
    return 	brick.writeCharacteristic(defs.COMMAND_UUID, buffer);
}

//____________________________________________________________________________________________________
var buffer_disableGyroscope 	= new Buffer(3);
	buffer_disableGyroscope[0] 	= defs.modules.GYRO;
	buffer_disableGyroscope[1] 	= defs.GyroBmi160Register.POWER_MODE;
	buffer_disableGyroscope[2] 	= 0;
proto.disableGyroscope	= function() {
	console.log( "BrickMetaWear::disableGyroscope" );
	return this.writeCharacteristic(defs.COMMAND_UUID, buffer_disableGyroscope);
}

//____________________________________________________________________________________________________
var buffer_notifyGyroscope 		= new Buffer(4);
	buffer_notifyGyroscope[0]	= defs.modules.GYRO;
	buffer_notifyGyroscope[1]	= defs.GyroBmi160Register.DATA_INTERRUPT_ENABLE;
	buffer_notifyGyroscope[2]	= 1;
	buffer_notifyGyroscope[3]	= 0;
var bufferSubscribe				= new Buffer(3);
	bufferSubscribe[0] 			= defs.modules.GYRO;
	bufferSubscribe[1] 			= defs.GyroBmi160Register.DATA;
	bufferSubscribe[2] 			= 1;
proto.notifyGyroscope 	= function() { //enableAxisSampling
	console.log( "BrickMetaWear::notifyGyroscope" );
	var brick 	= this;
	return 	brick.writeCharacteristic(defs.COMMAND_UUID, buffer_notifyGyroscope ).then( function() {
			brick.startGyroscope 	 (					 						).then( function() {
			brick.writeCharacteristic(defs.COMMAND_UUID, bufferSubscribe 		);			
			})  });

}

//____________________________________________________________________________________________________
var buffer_unnotifyGyroscope 	= new Buffer(4);
	buffer_unnotifyGyroscope[0]	= defs.modules.GYRO;
	buffer_unnotifyGyroscope[1]	= defs.GyroBmi160Register.DATA_INTERRUPT_ENABLE;
	buffer_unnotifyGyroscope[2]	= 0;
	buffer_unnotifyGyroscope[3]	= 1;
proto.unnotifyGyroscope = function() { //disableAxisSampling
	console.log( "BrickMetaWear::unnotifyGyroscope" );
	return this.writeCharacteristic(defs.COMMAND_UUID, buffer_unnotifyGyroscope);
}

//____________________________________________________________________________________________________
proto.setGyroscopePeriod = function(ms) {
	console.log( "BrickMetaWear::setGyroscopePeriod" );
	return Promise.resolve(ms);
}

//____________________________________________________________________________________________________
proto.readGyroscope 	= function() {
	console.log( "BrickMetaWear::readGyroscope" );
	return Promise.resolve({});
}

};
