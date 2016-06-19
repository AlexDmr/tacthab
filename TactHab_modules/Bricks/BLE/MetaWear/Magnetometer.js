var defs = require( "../BrickMetaWear_defs.js" );

module.exports = function(proto) {
	// TEST : https://github.com/mbientlab/Metawear-CppAPI/blob/master/test/testmagnetometer_bmm150.py
// https://github.com/mbientlab/Metawear-CppAPI/blob/master/src/metawear/core/cpp/datainterpreter.h
// MblMwDataSignal : https://github.com/mbientlab/Metawear-CppAPI/blob/master/src/metawear/core/cpp/datasignal_private.h
// MblMwDataSignal	( const ResponseHeader& header
//					, MblMwMetaWearBoard *owner, DataInterpreter interpreter
//					, uint8_t n_channels
//					, uint8_t channel_size
//					, uint8_t is_signed
//					, uint8_t offset
//					);
// MblMwDataSignal(BMM150_MAG_DATA_RESPONSE_HEADER, board, DataInterpreter::BMM150_B_FIELD, 3, 2, 1, 0);

// Conclusion :
// Receive 3x2 bytes (3 channel, 2 byte each), values are signed

//____________________________________________________________________________________________________
// Specific methods : ACCELEROMETER
//____________________________________________________________________________________________________
var eventName = 'ble_' + defs.modules.MAGNETOMETER + '_' + defs.MagnetometerBmm150Register.MAG_DATA;
proto.initMagnetometer 	= function() {
	var brick 		= this;
	// this.config 	= {};
	this.on	( eventName
			, function(data) {
				var x = data.readInt16LE(2) 
				  , y = data.readInt16LE(4) 
				  , z = data.readInt16LE(6) 
				  ;
				// console.log( "magnetometerChange", {x:x, y:y, z:z} );
				brick.emit("magnetometerChange", {x:x, y:y, z:z});
				}
			)
}

//____________________________________________________________________________________________________
var buffer_startMagnetometer		= new Buffer(3);
	buffer_startMagnetometer[0] 	= defs.modules.MAGNETOMETER;
	buffer_startMagnetometer[1] 	= defs.MagnetometerBmm150Register.POWER_MODE;
	buffer_startMagnetometer[2] 	= 1;
proto.startMagnetometer 	= function() {
	console.log( "BrickMetaWear::startMagnetometer" );
	return this.writeCharacteristic(defs.COMMAND_UUID, buffer_startMagnetometer);
}

//____________________________________________________________________________________________________
var buffer_stopMagnetometer			= new Buffer(3);
	buffer_stopMagnetometer[0] 		= defs.modules.MAGNETOMETER;
	buffer_stopMagnetometer[1] 		= defs.MagnetometerBmm150Register.POWER_MODE;
	buffer_stopMagnetometer[2] 		= 0;
proto.stopMagnetometer 	= function() {
	console.log( "BrickMetaWear::stopMagnetometer" );
	return this.writeCharacteristic(defs.COMMAND_UUID, buffer_stopMagnetometer);
}

//____________________________________________________________________________________________________
var buffer_enableMagnetometer		= new Buffer(4);
	buffer_enableMagnetometer[0] 	= defs.modules.MAGNETOMETER;
	buffer_enableMagnetometer[1] 	= defs.MagnetometerBmm150Register.DATA_INTERRUPT_ENABLE;
	buffer_enableMagnetometer[2] 	= 1;
	buffer_enableMagnetometer[3] 	= 0;
proto.enableMagnetometer	= function() {
	var self = this;
	console.log( "BrickMetaWear::enableMagnetometer" );
	return self.startMagnetometer().then( function() {
	return self.writeCharacteristic(defs.COMMAND_UUID, buffer_enableMagnetometer);}).then( function() {
	return self.notifyMagnetometer();
	});
}

//____________________________________________________________________________________________________
var buffer_disableMagnetometer		= new Buffer(4);
	buffer_disableMagnetometer[0] 	= defs.modules.MAGNETOMETER;
	buffer_disableMagnetometer[1] 	= defs.MagnetometerBmm150Register.DATA_INTERRUPT_ENABLE;
	buffer_disableMagnetometer[2] 	= 1;
	buffer_disableMagnetometer[3] 	= 0;
proto.disableMagnetometer	= function() {
	var self = this;
	console.log( "BrickMetaWear::disableMagnetometer" );
	return self.writeCharacteristic(defs.COMMAND_UUID, buffer_disableMagnetometer).then( function() {
	return self.unnotifyMagnetometer();
	});
}

//____________________________________________________________________________________________________
proto.presetMagnetometer	= function( preset ) {
	var self = this;
	var buffer_rep	= new Buffer(4) ,
		buffer_rate	= new Buffer(3) ;

	buffer_rep [0]	= defs.modules.MAGNETOMETER;
	buffer_rep [1]	= defs.MagnetometerBmm150Register.DATA_REPETITIONS;
	buffer_rep [2]	= preset.rep_xy;
	buffer_rep [3]	= preset.rep_z;
	// this.writeCharacteristic(defs.COMMAND_UUID, buffer_rep);

	buffer_rate[0]	= defs.modules.MAGNETOMETER;
	buffer_rate[1]	= defs.MagnetometerBmm150Register.DATA_RATE;
	buffer_rate[2]	= preset.data_rate;


	return self.writeCharacteristic(defs.COMMAND_UUID, buffer_rep).then( function() {
	return self.writeCharacteristic(defs.COMMAND_UUID, buffer_rate); });
}

//____________________________________________________________________________________________________
var buffer_notifyMagnetometer		= new Buffer(3);
	buffer_notifyMagnetometer[0] 	= defs.modules.MAGNETOMETER;
	buffer_notifyMagnetometer[1] 	= defs.MagnetometerBmm150Register.MAG_DATA;
	buffer_notifyMagnetometer[2] 	= 1;
proto.notifyMagnetometer	= function() {
	console.log( "notifyMagnetometer" );
	return this.writeCharacteristic(defs.COMMAND_UUID, buffer_notifyMagnetometer).then( function() {
		//
	});
}

//____________________________________________________________________________________________________
var buffer_unnotifyMagnetometer		= new Buffer(3);
	buffer_unnotifyMagnetometer[0] 	= defs.modules.MAGNETOMETER;
	buffer_unnotifyMagnetometer[1] 	= defs.MagnetometerBmm150Register.MAG_DATA;
	buffer_unnotifyMagnetometer[2] 	= 0;
proto.unnotifyMagnetometer	= function() {
	console.log( "unnotifyMagnetometer" );
	return this.writeCharacteristic(defs.COMMAND_UUID, buffer_unnotifyMagnetometer);
}

//____________________________________________________________________________________________________
proto.setMagnetometerPeriod = function(P) {
	console.log( "setMagnetometerPeriod", P, defs.MblMwMagBmm150PowerPreset[P] );

	if( defs.MblMwMagBmm150PowerPreset[P] ) {
		return this.presetMagnetometer( defs.MblMwMagBmm150PowerPreset[P] );
	} else {
		return Promise.resolve( {period: P, error: "Unknown preset for magnetometer"} );
	}
}


};
