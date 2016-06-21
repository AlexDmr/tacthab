var defs = require( "../BrickMetaWear_defs.js" );

// const BMP280_STANDBY_VALUES             = [0.5, 62.5, 125., 250., 500., 1000., 2000., 4000.];
// const BME280_STANDBY_VALUES             = [0.5, 62.5, 125., 250., 500., 1000., 10.  , 20.  ];
const MBL_MW_MODULE_BARO_TYPE_BMP280    = 0;            ///< Constant identifying the BMP280 barometer module type
// const MBL_MW_MODULE_BARO_TYPE_BME280    = 1;            ///< Constant identifying the BME280 barometer module type

function bosch_baro_to_firmware(value) {
    return value / 256;
}

// MblMwDataSignal	( const ResponseHeader& header
//					, MblMwMetaWearBoard *owner, DataInterpreter interpreter
//					, uint8_t n_channels
//					, uint8_t channel_size
//					, uint8_t is_signed
//					, uint8_t offset
//					);

// PRESSURE and ALTITUDE are 32bits non signed

module.exports = function(proto) {

proto.initBarometer = function() {
	var brick = this;
	const eventPRESSURE = 'ble_' + defs.modules.BAROMETER + '_' + defs.BarometerBmp280Register.PRESSURE;
	this.on	( eventPRESSURE
			, function(data) {
				var pressure = bosch_baro_to_firmware( data.readUInt32LE(2) );
				brick.emit("pressureChange", {pressure: pressure});
				}
			)
	const eventALTITUDE = 'ble_' + defs.modules.BAROMETER + '_' + defs.BarometerBmp280Register.ALTITUDE;
	this.on	( eventALTITUDE
			, function(data) {
				var altitude = bosch_baro_to_firmware( data.readInt32LE(2) );
				brick.emit("altitudeChange", {altitude: altitude});
				}
			)

	this.barometer = {
		type						: MBL_MW_MODULE_BARO_TYPE_BMP280,
		pressure_oversampling		: defs.MblMwBaroBoschOversampling.MBL_MW_BARO_BOSCH_OVERSAMPLE_STANDARD,
		temperature_oversampling 	: defs.MblMwBaroBoschOversampling.MBL_MW_BARO_BOSCH_OVERSAMPLE_ULTRA_LOW_POWER,
		iir_filter 					: defs.MblMwBaroBoschIirFilter.MBL_MW_BARO_BOSCH_IIR_FILTER_OFF,
		standby_time_index			: 2
	};
}

//____________________________________________________________________________________________________
/* struct BoschBaroConfig {
    uint8_t:2;
    uint8_t pressure_oversampling:3;
    uint8_t temperature_oversampling:3;
    uint8_t:2;
    uint8_t iir_filter:3;
    uint8_t standby_time:3;
};*/
proto.mbl_mw_baro_bosch_write_config	= function(config) {
	this.barometer.pressure_oversampling	= config.pressure_oversampling 		|| this.barometer.pressure_oversampling		;
	this.barometer.temperature_oversampling	= config.temperature_oversampling	|| this.barometer.temperature_oversampling 	;
	this.barometer.iir_filter 				= config.iir_filter 				|| this.barometer.iir_filter 				;
	this.barometer.standby_time_index 		= config.standby_time_index 		|| this.barometer.standby_time_index 				;

    var buffer_config = new Buffer(4);
    buffer_config[0] = defs.modules.BAROMETER;
    buffer_config[1] = defs.BarometerBmp280Register.CONFIG;
    buffer_config[2] = (this.barometer.pressure_oversampling << 2) | (this.barometer.temperature_oversampling << 5);
    buffer_config[3] = (this.barometer.iir_filter 			 << 2) | (this.barometer.standby_time_index 	  << 5);

    return this.writeCharacteristic(defs.COMMAND_UUID, buffer_config);
}

//____________________________________________________________________________________________________
var buffer_start = new Buffer(4);
buffer_start[0] = defs.modules.BAROMETER;
buffer_start[1] = defs.BarometerBmp280Register.CYCLIC;
buffer_start[2] = 1;
buffer_start[3] = 1;
proto.mbl_mw_baro_bosch_start	= function() {
    console.log( "mbl_mw_baro_bosch_start" )
    return this.writeCharacteristic(defs.COMMAND_UUID, buffer_start);
    
}

//____________________________________________________________________________________________________
var buffer_stop = new Buffer(4);
buffer_stop[0] = defs.modules.BAROMETER;
buffer_stop[1] = defs.BarometerBmp280Register.CYCLIC;
buffer_stop[2] = 0;
buffer_stop[3] = 0;
proto.mbl_mw_baro_bosch_stop 	= function() {
    console.log( "mbl_mw_baro_bosch_stop" )
    return this.writeCharacteristic(defs.COMMAND_UUID, buffer_stop); 
}

//____________________________________________________________________________________________________
//____________________________________________________________________________________________________
//____________________________________________________________________________________________________
var buffer_pressure = new Buffer(3);
buffer_pressure[0] = defs.modules.BAROMETER;
buffer_pressure[1] = defs.BarometerBmp280Register.PRESSURE;
buffer_pressure[2] = 1;
var buffer_altitude = new Buffer(3);
buffer_altitude[0] = defs.modules.BAROMETER;
buffer_altitude[1] = defs.BarometerBmp280Register.ALTITUDE;
buffer_altitude[2] = 1;
proto.notifyBarometer		= function() {
	var self = this;
	return self.writeCharacteristic(defs.COMMAND_UUID, buffer_pressure).then( function() {
	return self.writeCharacteristic(defs.COMMAND_UUID, buffer_altitude) });
}

proto.setBarometerPeriod	= function(config) {
	return this.mbl_mw_baro_bosch_write_config(config);
}

proto.enableBarometer		= function() {
	return this.mbl_mw_baro_bosch_start();
}

proto.disableBarometer		= function() {
	return this.mbl_mw_baro_bosch_stop();
}


} // End of module.exports