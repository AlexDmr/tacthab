var BrickBLE	= require( './BrickBLE.js' )
  ;

const BASE_URI 		= '326a#id#85cb9195d9dd464cfbbae75a'
	// , SERVICE_UUID 	= BASE_URI.replace('#id#', '9000')
    , COMMAND_UUID 	= BASE_URI.replace('#id#', '9001')
    , NOTIFY_UUID  	= BASE_URI.replace('#id#', '9006')
    ;

const ACCELEROMETER_OPCODE 			= 0x03;

/*const POWER_MODE 					= 0x1
	, DATA_INTERRUPT_ENABLE 		= 0x2
	, DATA_CONFIG 					= 0x3
	, DATA_INTERRUPT 				= 0x4
	, DATA_INTERRUPT_CONFIG 		= 0x5
	, LOW_HIGH_G_CONFIG 			= 0x7
	;*/

var MblMwAccBmi160Range = { // 0x3, 0x5, 0x8, 0xc
    MBL_MW_ACC_BMI160_FSR_2G		: 0x3, 	///< +/- 2g
    MBL_MW_ACC_BMI160_FSR_4G		: 0x5,	///< +/- 4g
    MBL_MW_ACC_BMI160_FSR_8G		: 0x8,	///< +/- 8g
    MBL_MW_ACC_BMI160_FSR_16G		: 0xc	///< +/- 16g
} ;

var AccelerometerBmi160Register = {
    POWER_MODE 				: 1,
    DATA_INTERRUPT_ENABLE	: 2,
    DATA_CONFIG 			: 3,
    DATA_INTERRUPT 			: 4,
    DATA_INTERRUPT_CONFIG	: 5
};
/**
 * Available ouput data rates on the BMI160 accelerometer
 */
var MblMwAccBmi160Odr = {
    MBL_MW_ACC_BMI160_ODR_0_78125HZ	: 1,
    MBL_MW_ACC_BMI160_ODR_1_5625HZ	: 2,
    MBL_MW_ACC_BMI160_ODR_3_125HZ	: 3,
    MBL_MW_ACC_BMI160_ODR_6_25HZ 	: 4,
    MBL_MW_ACC_BMI160_ODR_12_5HZ 	: 5,
    MBL_MW_ACC_BMI160_ODR_25HZ 		: 6,
    MBL_MW_ACC_BMI160_ODR_50HZ 		: 7,
    MBL_MW_ACC_BMI160_ODR_100HZ 	: 8,
    MBL_MW_ACC_BMI160_ODR_200HZ 	: 9,
    MBL_MW_ACC_BMI160_ODR_400HZ 	: 10,
    MBL_MW_ACC_BMI160_ODR_800HZ 	: 11,
    MBL_MW_ACC_BMI160_ODR_1600HZ 	: 12
};


//____________________________________________________________________________________________________
// 
//____________________________________________________________________________________________________
var BrickMetaWear 	= function(id, peripheral) {
	BrickBLE.apply(this, [id, peripheral]);
	console.log( "Creation of a BrickMetaWear", this.name);
	this.on(NOTIFY_UUID, function(data) {
		console.log("MetaWear notification:", data);
	})

}

BrickMetaWear.is 	= function(peripheral) {
  var localName = peripheral.advertisement?peripheral.advertisement.localName:"";

  return (localName === 'Metawear') 
  	  || (localName === 'MetaWear');
}

BrickMetaWear.prototype = Object.create(BrickBLE.prototype); // new Brick(); BrickUPnP.prototype.unreference();
BrickMetaWear.prototype.constructor	= BrickMetaWear;
BrickMetaWear.prototype.getTypeName	= function() {return "BrickMetaWear";}
BrickMetaWear.prototype.getTypes	= function() {var L=BrickBLE.prototype.getTypes(); 
												  L.push(BrickMetaWear.prototype.getTypeName()); 
												  return L;}
BrickMetaWear.prototype.registerType('BrickMetaWear', BrickMetaWear.prototype);

//____________________________________________________________________________________________________
// Connection
//____________________________________________________________________________________________________
BrickMetaWear.prototype.connect 		= function() {
	var brick = this;
	return BrickBLE.prototype.connect.apply(this, []).then( function() {
		brick.notifyCharacteristic(NOTIFY_UUID, true);
	})
}

BrickMetaWear.prototype.disconnect	= function() {
	return this.notifyCharacteristic(NOTIFY_UUID, false).then( function() {
				BrickBLE.prototype.disconnect.apply(this, [])
			});
}


//____________________________________________________________________________________________________
// Specific methods : ACCELEROMETER
//____________________________________________________________________________________________________
BrickMetaWear.prototype.startAccelerometer 		= function() {
	console.log( "BrickMetaWear::startAccelerometer" );
	var buffer = new Buffer(3);
    buffer[0] = ACCELEROMETER_OPCODE;
    buffer[1] = AccelerometerBmi160Register.POWER_MODE;
    buffer[2] = 0x1;
	return this.writeCharacteristic(COMMAND_UUID, buffer);
}

/*struct AccBmi160Config
    uint8_t acc_odr:4;		// 4 bits for output data rate
    uint8_t acc_bwp:3; 		// 3 bits for
    uint8_t acc_us:1; 		// 1 bit  for 
    uint8_t acc_range:4;	// 4 bits for range
    uint8_t :4;
*/
BrickMetaWear.prototype.enableAccelerometer		= function( config ) {
	var brick = this;
	config 			= config 			|| {};
	config.acc_odr	= config.acc_odr	|| MblMwAccBmi160Odr.MBL_MW_ACC_BMI160_ODR_25HZ;
	config.acc_bwp	= config.acc_bwp	|| 2;
	config.acc_us	= config.acc_us		|| 0;
	config.acc_range= config.acc_range	|| MblMwAccBmi160Range.MBL_MW_ACC_BMI160_FSR_2G;

	console.log( "BrickMetaWear::enableAccelerometer" );
    var buffer = new Buffer(4); // Configure accelerometer?
    buffer[0] = ACCELEROMETER_OPCODE;
    buffer[1] = AccelerometerBmi160Register.DATA_CONFIG;
    buffer[2] = config.acc_range
    buffer[3] = config.acc_odr | (config.acc_bwp << 4) | (config.acc_us << 7)
    /*buffer[2] = 0x7;
    buffer[3] = 0x30;
    buffer[4] = 0x81;
    buffer[5] = 0x0b;
    buffer[6] = 0xc0;*/
    
    return 	brick.writeCharacteristic(COMMAND_UUID, buffer);
}

BrickMetaWear.prototype.disableAccelerometer	= function() {
	console.log( "BrickMetaWear::disableAccelerometer" );
	var buffer = new Buffer(3);
	buffer[0] = ACCELEROMETER_OPCODE;
	buffer[1] = AccelerometerBmi160Register.POWER_MODE;
	buffer[2] = 0x0;
	return this.writeCharacteristic(COMMAND_UUID, buffer);
}

BrickMetaWear.prototype.notifyAccelerometer 	= function() { //enableAxisSampling
	console.log( "BrickMetaWear::notifyAccelerometer" );
	var buffer 	= new Buffer(4)
	  , brick 	= this;
	buffer[0] = ACCELEROMETER_OPCODE;
	buffer[1] = AccelerometerBmi160Register.DATA_INTERRUPT_ENABLE;
	buffer[2] = 0x1;
	buffer[3] = 0x0;
	return 	brick.writeCharacteristic(COMMAND_UUID, buffer).then( function() {
			brick.startAccelerometer(					  ).then( function() {
			var bufferSubscribe = new Buffer(3);
			bufferSubscribe[0] = ACCELEROMETER_OPCODE;
			bufferSubscribe[1] = AccelerometerBmi160Register.DATA_INTERRUPT;
			bufferSubscribe[2] = 1;
			brick.writeCharacteristic(COMMAND_UUID, bufferSubscribe);			
			})  });

}

BrickMetaWear.prototype.unnotifyAccelerometer 	= function() { //disableAxisSampling
	console.log( "BrickMetaWear::unnotifyAccelerometer" );
	var buffer = new Buffer(4);
	buffer[0] = ACCELEROMETER_OPCODE;
	buffer[1] = AccelerometerBmi160Register.DATA_INTERRUPT_ENABLE;
	buffer[2] = 0x1;
	buffer[3] = 0x0;
	return this.writeCharacteristic(COMMAND_UUID, buffer);
}

BrickMetaWear.prototype.setAccelerometerPeriod 	= function(ms) {
	console.log( "BrickMetaWear::setAccelerometerPeriod" );
	return Promise.resolve(ms);
}

BrickMetaWear.prototype.readAccelerometer 		= function() {
	console.log( "BrickMetaWear::readAccelerometer" );
	return Promise.resolve({});
}

//____________________________________________________________________________________________________
// Exports
//____________________________________________________________________________________________________
module.exports = BrickMetaWear;