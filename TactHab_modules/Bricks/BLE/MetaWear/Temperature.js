var defs = require( "../BrickMetaWear_defs.js" );
// MblMwDataSignal	( const ResponseHeader& header
//					, MblMwMetaWearBoard *owner, DataInterpreter interpreter
//					, uint8_t n_channels
//					, uint8_t channel_size
//					, uint8_t is_signed
//					, uint8_t offset
//					);

// Temperature is 16 bits signed
// MblMwDataSignal(header, board, DataInterpreter::TEMPERATURE, 1, 2, 1, 0)

// EMPERATURE_RESPONSE_HEADER(MBL_MW_MODULE_TEMPERATURE, READ_REGISTER(ORDINAL(MultiChannelTempRegister::TEMPERATURE)));

// https://github.com/mbientlab/Metawear-CppAPI/blob/master/src/metawear/sensor/cpp/multichanneltemperature.cpp
// https://github.com/mbientlab/Metawear-CppAPI/blob/master/src/metawear/sensor/cpp/multichanneltemperature_register.h
function temp_to_firmware(value) {
    return value / 8;
}

const eventTEMPERATURE = 'ble_' + defs.modules.TEMPERATURE + '_' + (0x80 | defs.MultiChannelTempRegister.TEMPERATURE);

module.exports = function(proto) {

proto.initTemperature = function() {
	var brick = this;
	this.on	( eventTEMPERATURE
			, function(data) {
				var temperature = temp_to_firmware( data.readInt16LE(2) );
				// console.log( "temperatureChange", {temperature: temperature}, data );
				brick.emit("temperatureChange", {temperature: temperature});
				}
			);
	this.temperature = {
		delay		: 2000,
		timer		: null,
		sensor		: 0,
		buffer_read	: new Buffer(3)
	}
	this.temperature.buffer_read[0] = defs.modules.TEMPERATURE;
	this.temperature.buffer_read[1] = 0x80 | defs.MultiChannelTempRegister.TEMPERATURE;
	this.temperature.buffer_read[2] = 0;
}


//____________________________________________________________________________________________________
//____________________________________________________________________________________________________
//____________________________________________________________________________________________________
var buffer_start = new Buffer(3);
buffer_start[0] = defs.modules.TEMPERATURE;
buffer_start[1] = defs.MultiChannelTempRegister.TEMPERATURE;
buffer_start[2] = 1;
var buffer_stop = new Buffer(3);
buffer_stop[0] = defs.modules.TEMPERATURE;
buffer_stop[1] = defs.MultiChannelTempRegister.TEMPERATURE;
buffer_stop[2] = 0;

proto.notifyTemperature		= function() {
	return Promise.resolve(true);
}

proto.setTemperaturePeriod	= function(delay, sensor) {
	var brick = this;
	clearInterval( this.temperature.timer );
	this.temperature.delay	= delay		|| this.temperature.delay;
	this.temperature.sensor	= sensor 	|| this.temperature.sensor;
	this.temperature.buffer_read[2] 	=  this.temperature.sensor;
	this.temperature.timer 	= setInterval( function() {
		brick.writeCharacteristic(defs.COMMAND_UUID, brick.temperature.buffer_read);
	}, this.temperature.delay);
	return Promise.resolve( {delay: this.temperature.delay, sensor: this.temperature.sensor });
}

proto.enableTemperature		= function() {
	return this.writeCharacteristic(defs.COMMAND_UUID, buffer_start);
}

proto.disableTemperature	= function() {
	clearInterval( this.temperature.timer );
	return Promise.resolve();
}


} // End of module.exports