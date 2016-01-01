var defs = require( "../BrickMetaWear_defs.js" );

module.exports = function(proto) {

//____________________________________________________________________________________________________
proto.initLED = function() {
	// var brick       = this;
	this.config     = {};
}

//____________________________________________________________________________________________________
proto.startLED = function(autoplay) {
	var buf = new Buffer(3);
	buf[0]  = defs.modules.LED;
	buf[1]  = defs.LED.LED_PLAY;
	buf[2]  = 1 + autoplay?1:0;
	return this.writeCharacteristic(defs.COMMAND_UUID, buf);
}

//____________________________________________________________________________________________________
proto.stopLED = function(clear) {
	var buf = new Buffer(3);
	buf[0]  = defs.modules.LED;
	buf[1]  = defs.LED.LED_STOP;
	buf[2]  = clear?1:0;
	return this.writeCharacteristic(defs.COMMAND_UUID, buf);
}

//____________________________________________________________________________________________________
var buffer_pause = new Buffer(3);
buffer_pause[0]  = defs.modules.LED;
buffer_pause[1]  = defs.LED.LED_PLAY;
buffer_pause[2]  = 0;
proto.pause = function() {
	return this.writeCharacteristic(defs.COMMAND_UUID, buffer_pause);
}

//____________________________________________________________________________________________________
/*
typedef struct {
    uint16_t rise_time_ms;              ///< Transition time from low to high state, in milliseconds
    uint16_t high_time_ms;              ///< Length of time the pulse spends in the high state, in milliseconds
    uint16_t fall_time_ms;              ///< Transition time from high to low state, in milliseconds
    uint16_t pulse_duration_ms;         ///< Length of time for one pulse, in milliseconds
    uint8_t high_intensity;             ///< Intensity when the pulse is in a high state, between [0, 31]
    uint8_t low_intensity;              ///< Intensity when the pulse is in a low state, between [0, 31]
    uint8_t repeat_count;               ///< Number of repetitions
} MblMwLedPattern;
*/
proto.pattern = function(color, high, low, nbTimes, msRise, msHigh, msFall, msTotal) {
	var buf = new Buffer(17);
	buf[0] = defs.modules.LED;
	buf[1] = defs.LED.LED_CONFIG;
	buf[2] = color;
	buf[3] = 2;
	buf[4] = high;
	buf[5] = low;
	var L = [msRise, msHigh, msFall, msTotal];
	for(var i=0; i<L.length; i++) {
		L[6+2*i] 	= (L[i] >> 8) & 0xFF;
		L[6+2*i+1] 	= L[i]        & 0xFF;
	}
	buf[16] = nbTimes;
	return this.writeCharacteristic(defs.COMMAND_UUID, buf);
}

} // End of module