var defs = require( "../BrickMetaWear_defs.js" );
const FSR_SCALE = {
	0x3								: 16384,
	0x5								:  8192,
	0x8								:  4096,
	0xc								:  2048
};

module.exports = function(proto) {
//____________________________________________________________________________________________________
// Specific methods : ACCELEROMETER
//____________________________________________________________________________________________________
var eventName = 'ble_' + defs.modules.ACCELEROMETER_OPCODE + '_' + defs.AccelerometerBmi160Register.DATA_INTERRUPT;
proto.initAccelerometer 	= function() {
	var brick 		= this;
	this.config 	= {};
	this.on	( eventName
			, function(data) {
				var x = data.readInt16LE(2) / brick.accelerometer_scale
				  , y = data.readInt16LE(4) / brick.accelerometer_scale
				  , z = data.readInt16LE(6) / brick.accelerometer_scale
				  ;
				// console.log( "accelerometerChange", {x:x, y:y, z:z} );
				brick.emit("accelerometerChange", {x:x, y:y, z:z});
				}
			)
}

//____________________________________________________________________________________________________
var buffer_startAccelerometer		= new Buffer(3);
	buffer_startAccelerometer[0] 	= defs.modules.ACCELEROMETER_OPCODE;
	buffer_startAccelerometer[1] 	= defs.AccelerometerBmi160Register.POWER_MODE;
	buffer_startAccelerometer[2] 	= 1;
proto.startAccelerometer 	= function() {
	console.log( "BrickMetaWear::startAccelerometer" );
	return this.writeCharacteristic(defs.COMMAND_UUID, buffer_startAccelerometer);
}

/*
struct AccBmi160Config
    uint8_t acc_odr:4;		// 4 bits for output data rate
    uint8_t acc_bwp:3; 		// 3 bits for
    uint8_t acc_us:1; 		// 1 bit  for 
    uint8_t acc_range:4;	// 4 bits for range
    uint8_t :4;
*/
//____________________________________________________________________________________________________
proto.enableAccelerometer	= function( config ) {
	var brick = this;
	config 					= config 			|| {};
	this.config.acc_odr		= config.acc_odr	|| this.config.acc_odr 	|| defs.MblMwAccBmi160Odr.MBL_MW_ACC_BMI160_ODR_12_5HZ;
	this.config.acc_bwp		= config.acc_bwp	|| this.config.acc_bwp 	|| 2;
	this.config.acc_us		= config.acc_us		|| this.config.acc_us 	|| 0;
	this.config.acc_range	= config.acc_range	|| this.config.acc_range|| defs.MblMwAccBmi160Range.MBL_MW_ACC_BMI160_FSR_2G;

	this.config.acc_odr 	= Math.min	( defs.MblMwAccBmi160Odr.MBL_MW_ACC_BMI160_ODR_100HZ
										, Math.max	( this.config.acc_odr
													, defs.MblMwAccBmi160Odr.MBL_MW_ACC_BMI160_ODR_12_5HZ
													)
										);

	console.log( this.config.acc_range, " =>", FSR_SCALE[ this.config.acc_range ] );
	this.accelerometer_scale = FSR_SCALE[ this.config.acc_range ];

	console.log( "BrickMetaWear::enableAccelerometer" );
    var buffer = new Buffer(4); // Configure accelerometer?
    buffer[0] = defs.modules.ACCELEROMETER_OPCODE;
    buffer[1] = defs.AccelerometerBmi160Register.DATA_CONFIG;
    buffer[2] = this.config.acc_odr | (this.config.acc_bwp << 4) | (this.config.acc_us << 7)
    buffer[3] = this.config.acc_range;
    
    return 	brick.writeCharacteristic(defs.COMMAND_UUID, buffer);
}

//____________________________________________________________________________________________________
var buffer_disableAccelerometer 	= new Buffer(3);
	buffer_disableAccelerometer[0] 	= defs.modules.ACCELEROMETER_OPCODE;
	buffer_disableAccelerometer[1] 	= defs.AccelerometerBmi160Register.POWER_MODE;
	buffer_disableAccelerometer[2] 	= 0;
proto.disableAccelerometer	= function() {
	console.log( "BrickMetaWear::disableAccelerometer" );
	return this.writeCharacteristic(defs.COMMAND_UUID, buffer_disableAccelerometer);
}

//____________________________________________________________________________________________________
var buffer_notifyAccelerometer 		= new Buffer(4);
	buffer_notifyAccelerometer[0]	= defs.modules.ACCELEROMETER_OPCODE;
	buffer_notifyAccelerometer[1]	= defs.AccelerometerBmi160Register.DATA_INTERRUPT_ENABLE;
	buffer_notifyAccelerometer[2]	= 0x1;
	buffer_notifyAccelerometer[3]	= 0x0;
var buffer_subscribeAcc				= new Buffer(3);
	buffer_subscribeAcc[0] 			= defs.modules.ACCELEROMETER_OPCODE;
	buffer_subscribeAcc[1] 			= defs.AccelerometerBmi160Register.DATA_INTERRUPT;
	buffer_subscribeAcc[2] 			= 1;
proto.notifyAccelerometer 	= function() { //enableAxisSampling
	console.log( "BrickMetaWear::notifyAccelerometer" );
	var brick 	= this;
	return 	brick.writeCharacteristic(defs.COMMAND_UUID, buffer_notifyAccelerometer).then( function() {
			brick.startAccelerometer(					  ).then( function() {
			brick.writeCharacteristic(defs.COMMAND_UUID, buffer_subscribeAcc);			
			})  });
}

//____________________________________________________________________________________________________
var buffer_unnotifyAccelerometer 	= new Buffer(4);
	buffer_unnotifyAccelerometer[0]	= defs.modules.ACCELEROMETER_OPCODE;
	buffer_unnotifyAccelerometer[1]	= defs.AccelerometerBmi160Register.DATA_INTERRUPT_ENABLE;
	buffer_unnotifyAccelerometer[2]	= 0x0;
	buffer_unnotifyAccelerometer[3]	= 0x1;
proto.unnotifyAccelerometer = function() { //disableAxisSampling
	console.log( "BrickMetaWear::unnotifyAccelerometer" );
	return this.writeCharacteristic(defs.COMMAND_UUID, buffer_unnotifyAccelerometer);
}

//____________________________________________________________________________________________________
proto.setAccelerometerPeriod = function(ms) {
	console.log( "BrickMetaWear::setAccelerometerPeriod" );
	return Promise.resolve(ms);
}

//____________________________________________________________________________________________________
proto.readAccelerometer 	= function() {
	console.log( "BrickMetaWear::readAccelerometer" );
	return Promise.resolve({});
}
};
