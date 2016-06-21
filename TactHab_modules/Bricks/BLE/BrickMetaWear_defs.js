/*
    Information from : 
        - https://mbientlab.com/cppdocs/latest/
        - https://github.com/mbientlab/Metawear-CppAPI/tree/master/src/metawear/sensor
        - 
*/

// MblMwDataSignal	( const ResponseHeader& header
//					, MblMwMetaWearBoard *owner, DataInterpreter interpreter
//					, uint8_t n_channels
//					, uint8_t channel_size
//					, uint8_t is_signed
//					, uint8_t offset
//					);

const BASE_URI      = '326a#id#85cb9195d9dd464cfbbae75a'
    , SERVICE_UUID  = BASE_URI.replace('#id#', '9000')
    , COMMAND_UUID  = BASE_URI.replace('#id#', '9001')
    , NOTIFY_UUID   = BASE_URI.replace('#id#', '9006')
    ;

// https://github.com/mbientlab/Metawear-CppAPI/blob/master/src/metawear/core/module.h
const modules = {
    SWITCH                          : 0x01,
    LED                             : 0x02,
    ACCELEROMETER_OPCODE            : 0x03,
    TEMPERATURE                     : 0x04,
    GPIO                            : 0x05,
    NEO_PIXEL                       : 0x06,
    IBEACON                         : 0x07,
    HAPTIC                          : 0x08,
    DATA_PROCESSOR                  : 0x09,
    EVENT                           : 0x0a,
    LOGGING                         : 0x0b,
    TIMER                           : 0x0c,
    I2C                             : 0x0d,
    // break
    MACRO                           : 0x0f,
    GSR                             : 0x10,
    SETTINGS                        : 0x11,
    BAROMETER                       : 0x12,
    GYRO							: 0x13,
    AMBIENT_LIGHT					: 0x14,
    MAGNETOMETER					: 0x15,
	HUMIDITY						: 0x16,
	COLOR_DETECTOR					: 0x17,
	PROXIMITY						: 0x18,
    // break
    DEBUG                           : 0xfe
};

/*-----------------------------------------------------------------------------------------------------------------
  Temperature -----------------------------------------------------------------------------------------------------
  https://github.com/mbientlab/Metawear-CppAPI/blob/master/src/metawear/sensor/cpp/multichanneltemperature_register.h
*/
const MultiChannelTempRegister 		= {
    TEMPERATURE 									: 1,
    MODE 											: 2
};

const TemperatureChannel			= {
	NRF_DIE											: 0,
	ON_BOARD_THERMISTOR								: 1,
	EXT_THERMISTOR									: 2,
	BMP_280											: 3
};

/*-----------------------------------------------------------------------------------------------------------------
  BOSCH BMP280 barometer + temperature-----------------------------------------------------------------------------
*/
// https://github.com/mbientlab/Metawear-CppAPI/blob/master/src/metawear/sensor/barometer_bosch.h

const BarometerBmp280Register 		= {
    PRESSURE 										: 1,
    ALTITUDE 										: 2,
    CONFIG 											: 3,
    CYCLIC 											: 4
};


// Supported oversampling modes on the Bosch barometers
const MblMwBaroBoschOversampling	= {
    MBL_MW_BARO_BOSCH_OVERSAMPLE_SKIP 				: 0,
    MBL_MW_BARO_BOSCH_OVERSAMPLE_ULTRA_LOW_POWER	: 1,
    MBL_MW_BARO_BOSCH_OVERSAMPLE_LOW_POWER 			: 2,
    MBL_MW_BARO_BOSCH_OVERSAMPLE_STANDARD 			: 3,
    MBL_MW_BARO_BOSCH_OVERSAMPLE_HIGH 				: 4,
    MBL_MW_BARO_BOSCH_OVERSAMPLE_ULTRA_HIGH 		: 5
};

// Supported filter modes on the Bosch barometers
const MblMwBaroBoschIirFilter 		= {
    MBL_MW_BARO_BOSCH_IIR_FILTER_OFF 				: 0,
    MBL_MW_BARO_BOSCH_IIR_FILTER_AVG_2 				: 1,
    MBL_MW_BARO_BOSCH_IIR_FILTER_AVG_4 				: 2,
    MBL_MW_BARO_BOSCH_IIR_FILTER_AVG_8 				: 3, 
    MBL_MW_BARO_BOSCH_IIR_FILTER_AVG_16 			: 4
} ;

// Supported stand by times on the BMP280 barometer
const MblMwBaroBmp280StandbyTime 	= {
    MBL_MW_BARO_BMP280_STANDBY_TIME_0_5MS			: 0,
    MBL_MW_BARO_BMP280_STANDBY_TIME_62_5MS			: 1,
    MBL_MW_BARO_BMP280_STANDBY_TIME_125MS			: 2,
    MBL_MW_BARO_BMP280_STANDBY_TIME_250MS			: 3,
    MBL_MW_BARO_BMP280_STANDBY_TIME_500MS			: 4,
    MBL_MW_BARO_BMP280_STANDBY_TIME_1000MS			: 5,
    MBL_MW_BARO_BMP280_STANDBY_TIME_2000MS			: 6,
    MBL_MW_BARO_BMP280_STANDBY_TIME_4000MS			: 7
};

// Supported stand by times on the BME280 barometer
const MblMwBaroBme280StandbyTime 	= {
    MBL_MW_BARO_BME280_STANDBY_TIME_0_5MS			: 0,
    MBL_MW_BARO_BME280_STANDBY_TIME_62_5MS			: 1,
    MBL_MW_BARO_BME280_STANDBY_TIME_125MS			: 2,
    MBL_MW_BARO_BME280_STANDBY_TIME_250MS			: 3,
    MBL_MW_BARO_BME280_STANDBY_TIME_500MS			: 4,
    MBL_MW_BARO_BME280_STANDBY_TIME_1000MS			: 5,
    MBL_MW_BARO_BME280_STANDBY_TIME_10MS			: 6,
    MBL_MW_BARO_BME280_STANDBY_TIME_20MS			: 7
};


/*-----------------------------------------------------------------------------------------------------------------
  Magnetometer BMM150 ---------------------------------------------------------------------------------------------
*/
//https://github.com/mbientlab/Metawear-CppAPI/blob/master/src/metawear/sensor/cpp/magnetometer_bmm150.cpp
const MblMwMagBmm150PowerPreset	=	{
	MWL_MW_MAG_BMM_150_PP_LOW_POWER			: {index: 0, data_rate: 0, rep_xy:  1, rep_z:  2},
    MWL_MW_MAG_BMM_150_PP_REGULAR			: {index: 1, data_rate: 0, rep_xy:  4, rep_z: 14},
    MWL_MW_MAG_BMM_150_PP_ENHANCED_REGULAR	: {index: 2, data_rate: 0, rep_xy:  7, rep_z: 26},
    MWL_MW_MAG_BMM_150_PP_HIGH_ACCURACY		: {index: 3, data_rate: 5, rep_xy: 23, rep_z: 82}
};
//https://github.com/mbientlab/Metawear-CppAPI/blob/master/src/metawear/sensor/cpp/magnetometer_bmm150_register.h
const MagnetometerBmm150Register =	{
    POWER_MODE 								: 1,
    DATA_INTERRUPT_ENABLE					: 2,
    DATA_RATE								: 3,
    DATA_REPETITIONS						: 4,
    MAG_DATA								: 5
};

const DataInterpreter 			=	{
    INT32 								: 0x00,
    UINT32								: 0x01,
    TEMPERATURE							: 0x02,
    BOSCH_PRESSURE						: 0x03,
    BOSCH_ALTITUDE						: 0x04,
    BMI160_ROTATION						: 0x05,
    BMI160_ROTATION_SINGLE_AXIS			: 0x06,
    BOSCH_ACCELERATION					: 0x07,
    BOSCH_ACCELERATION_SINGLE_AXIS		: 0x08,
    MMA8452Q_ACCELERATION				: 0x09,
    MMA8452Q_ACCELERATION_SINGLE_AXIS	: 0x0a,
    BYTE_ARRAY							: 0x0b,
    BMM150_B_FIELD						: 0x0c,
    BMM150_B_FIELD_SINGLE_AXIS			: 0x0d,
    SETTINGS_BATTERY_STATE				: 0x0e,
    TCS34725_COLOR_ADC					: 0x0f,
    BME280_HUMIDITY						: 0x10
};



/*-----------------------------------------------------------------------------------------------------------------
  Accelerometer BMI160 ---------------------------------------------------------------------------------------------
  https://github.com/mbientlab/Metawear-CppAPI/blob/master/src/metawear/sensor/cpp/accelerometer_bosch.cpp
*/
const AccelerometerBmi160Register = {
    POWER_MODE 	                    : 1,
    DATA_INTERRUPT_ENABLE           : 2,
    DATA_CONFIG                     : 3,
    DATA_INTERRUPT 			        : 4,
    DATA_INTERRUPT_CONFIG 			: 5
};

const MblMwAccBmi160Range = { // 0x3, 0x5, 0x8, 0xc
    MBL_MW_ACC_BMI160_FSR_2G		: 0x3, 	///< +/- 2g
    MBL_MW_ACC_BMI160_FSR_4G		: 0x5,	///< +/- 4g
    MBL_MW_ACC_BMI160_FSR_8G		: 0x8,	///< +/- 8g
    MBL_MW_ACC_BMI160_FSR_16G		: 0xc	///< +/- 16g
} ;


/**
 * Available ouput data rates on the BMI160 accelerometer
 */
const MblMwAccBmi160Odr = {
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

const AmbientLightLtr329Register = {
    ENABLE                          : 1,
    CONFIG                          : 2,
    OUTPUT                          : 3
};

const GyroBmi160Register = {
    POWER_MODE 						: 1,
    DATA_INTERRUPT_ENABLE 			: 2,
    CONFIG 							: 3,
    DATA 							: 5
};

const SwitchRegister = {
    STATE 							: 1
};

const MblMwGyroBmi160Odr = {
    MBL_MW_GYRO_BMI160_ODR_25HZ 	: 0x06,
    MBL_MW_GYRO_BMI160_ODR_50HZ 	: 0x07,
    MBL_MW_GYRO_BMI160_ODR_100HZ 	: 0x08,
    MBL_MW_GYRO_BMI160_ODR_200HZ 	: 0x09,
    MBL_MW_GYRO_BMI160_ODR_400HZ 	: 0x0a,
    MBL_MW_GYRO_BMI160_ODR_800HZ 	: 0x0b,
    MBL_MW_GYRO_BMI160_ODR_1600HZ 	: 0x0c,
    MBL_MW_GYRO_BMI160_ODR_3200HZ 	: 0x0d
};

const LED = {
	LED_PLAY 						: 1, 
	LED_STOP 						: 2, 
	LED_CONFIG 						: 3,
	MBL_MW_LED_COLOR_GREEN 			: 0,
    MBL_MW_LED_COLOR_RED 			: 1,
    MBL_MW_LED_COLOR_BLUE			: 2
};

/**
 * Available degrees per second ranges on the BMI160 gyro
 */
const MblMwGyroBmi160Range = {
    MBL_MW_GYRO_BMI160_FSR_2000DPS 	: 0x00,      ///< +/-2000 degrees per second
    MBL_MW_GYRO_BMI160_FSR_1000DPS 	: 0x01,      ///< +/-1000 degrees per second
    MBL_MW_GYRO_BMI160_FSR_500DPS 	: 0x02,      ///< +/-500 degrees per second
    MBL_MW_GYRO_BMI160_FSR_250DPS	: 0x03,      ///< +/-250 degrees per second
    MBL_MW_GYRO_BMI160_FSR_125DPS	: 0x04       ///< +/-125 degrees per second
};


module.exports = {
	DataInterpreter 			: DataInterpreter,
    // Modules
    BASE_URI                    : BASE_URI,
    SERVICE_UUID                : SERVICE_UUID,
    COMMAND_UUID                : COMMAND_UUID,
    NOTIFY_UUID                 : NOTIFY_UUID,
    modules                     : modules,
    // Accelerometer BMI160
    MblMwAccBmi160Range         : MblMwAccBmi160Range,
    AccelerometerBmi160Register : AccelerometerBmi160Register,
    MblMwAccBmi160Odr           : MblMwAccBmi160Odr,
    // Gyroscope BMI160
    GyroBmi160Register			: GyroBmi160Register,
    MblMwGyroBmi160Odr 			: MblMwGyroBmi160Odr,
    MblMwGyroBmi160Range		: MblMwGyroBmi160Range,
    // Switch/Button
    SwitchRegister				: SwitchRegister,
    // Ambiant light
    AmbientLightLtr329Register	: AmbientLightLtr329Register,
    // LED
    LED 						: LED,
    // Magnetometer
    MblMwMagBmm150PowerPreset	: MblMwMagBmm150PowerPreset,
	MagnetometerBmm150Register 	: MagnetometerBmm150Register,
	// Barometer
	BarometerBmp280Register		: BarometerBmp280Register,
	MblMwBaroBoschOversampling	: MblMwBaroBoschOversampling,
	MblMwBaroBoschIirFilter 	: MblMwBaroBoschIirFilter,
	MblMwBaroBmp280StandbyTime 	: MblMwBaroBmp280StandbyTime,
	MblMwBaroBme280StandbyTime 	: MblMwBaroBme280StandbyTime,
	// Temperature
	MultiChannelTempRegister 	: MultiChannelTempRegister,
	TemperatureChannel			: TemperatureChannel,

    // Information
    informations                : "MetaWear modules, translated from C++ API, tested for model R only."
};
