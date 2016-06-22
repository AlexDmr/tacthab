var defs = require( "../BrickMetaWear_defs.js" );
// MblMwDataSignal  ( const ResponseHeader& header
//                  , MblMwMetaWearBoard *owner, DataInterpreter interpreter
//                  , uint8_t n_channels
//                  , uint8_t channel_size
//                  , uint8_t is_signed
//                  , uint8_t offset
//                  );

// Luminosity is 32 bits unsigned
// MblMwDataSignal(LTR329_ILLUMINANCE_RESPONSE_HEADER, board, DataInterpreter::UINT32, 1, 4, 0, 0);

// EMPERATURE_RESPONSE_HEADER(MBL_MW_MODULE_TEMPERATURE, READ_REGISTER(ORDINAL(MultiChannelTempRegister::TEMPERATURE)));

// https://github.com/mbientlab/Metawear-CppAPI/blob/master/src/metawear/sensor/cpp/multichanneltemperature.cpp
// https://github.com/mbientlab/Metawear-CppAPI/blob/master/src/metawear/sensor/cpp/multichanneltemperature_register.h
const eventLUMINOMETER = 'ble_' + defs.modules.AMBIENT_LIGHT + '_' + defs.AmbientLightLtr329Register.OUTPUT;

module.exports = function(proto) {

proto.initLuminometer = function() {
    var brick = this;
    this.on ( eventLUMINOMETER
            , function(data) {
            	console.log( "Luminometer callback with", data);
                var luminosity = data.readUInt32LE(2);
                brick.emit("luminometerChange", {luminosity: luminosity});
                }
            );
    this.luminometer = {
        als_gain				: defs.MblMwAlsLtr329Gain.MBL_MW_ALS_LTR329_GAIN_1X,
        als_measurement_rate 	: defs.MblMwAlsLtr329MeasurementRate.MBL_MW_ALS_LTR329_RATE_500MS,
        als_integration_time 	: defs.MblMwAlsLtr329IntegrationTime.MBL_MW_ALS_LTR329_TIME_100MS
    }
}

/* struct Ltr329Config {
    uint8_t:2;
    uint8_t als_gain:3;
    uint8_t:3;
    uint8_t als_measurement_rate:3;
    uint8_t als_integration_time:3;
    uint8_t:2;
};*/
proto.mbl_mw_als_ltr329_write_config = function( config ) {
	config = config || {};
	this.luminometer.als_gain 				= config.als_gain 				|| this.luminometer.als_gain;
	this.luminometer.als_measurement_rate 	= config.als_measurement_rate 	|| this.luminometer.als_measurement_rate;
	this.luminometer.als_integration_time 	= config.als_integration_time 	|| this.luminometer.als_integration_time;

	var buffer = new Buffer(4);
	buffer[0] = defs.modules.AMBIENT_LIGHT;
	buffer[1] = defs.AmbientLightLtr329Register.CONFIG;
	buffer[2] = this.luminometer.als_gain << 2;
	buffer[3] = this.luminometer.als_measurement_rate | (this.luminometer.als_integration_time << 3) ;
	return this.writeCharacteristic(defs.COMMAND_UUID, buffer);
}

var buffer_start = new Buffer(3);
	buffer_start[0] = defs.modules.AMBIENT_LIGHT;
	buffer_start[1] = defs.AmbientLightLtr329Register.ENABLE;
	buffer_start[2] = 1;
proto.mbl_mw_als_ltr329_start 	= function() {
	return this.writeCharacteristic(defs.COMMAND_UUID, buffer_start);
}

var buffer_stop = new Buffer(3);
	buffer_stop[0] = defs.modules.AMBIENT_LIGHT;
	buffer_stop[1] = defs.AmbientLightLtr329Register.ENABLE;
	buffer_stop[2] = 0;
proto.mbl_mw_als_ltr329_stop 	= function() {
	return this.writeCharacteristic(defs.COMMAND_UUID, buffer_stop);
}

//____________________________________________________________________________________________________
//____________________________________________________________________________________________________
//____________________________________________________________________________________________________
var buffer_notify = new Buffer(3);
buffer_notify[0] = defs.modules.AMBIENT_LIGHT;
buffer_notify[1] = defs.AmbientLightLtr329Register.OUTPUT;
buffer_notify[2] = 0x1;
proto.notifyLuminometer     = function() {
    return this.writeCharacteristic(defs.COMMAND_UUID, buffer_notify);
}

proto.setLuminometerPeriod  = function( config ) {
	return this.mbl_mw_als_ltr329_write_config(config);
}

proto.enableLuminometer     = function() {
    return this.mbl_mw_als_ltr329_start();
}

proto.disableLuminometer    = function() {
    return this.mbl_mw_als_ltr329_stop();
}


} // End of module.exports

