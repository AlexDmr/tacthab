const BASE_URI      = '326a#id#85cb9195d9dd464cfbbae75a'
    , SERVICE_UUID  = BASE_URI.replace('#id#', '9000')
    , COMMAND_UUID  = BASE_URI.replace('#id#', '9001')
    , NOTIFY_UUID   = BASE_URI.replace('#id#', '9006')
    ;

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
    GYRO                            : 0x13,
    AMBIENT_LIGHT                   : 0x14,
    // break
    DEBUG                           : 0xfe
};

const MblMwAccBmi160Range = { // 0x3, 0x5, 0x8, 0xc
    MBL_MW_ACC_BMI160_FSR_2G		: 0x3, 	///< +/- 2g
    MBL_MW_ACC_BMI160_FSR_4G		: 0x5,	///< +/- 4g
    MBL_MW_ACC_BMI160_FSR_8G		: 0x8,	///< +/- 8g
    MBL_MW_ACC_BMI160_FSR_16G		: 0xc	///< +/- 16g
} ;

const AccelerometerBmi160Register = {
    POWER_MODE 	                    : 1,
    DATA_INTERRUPT_ENABLE           : 2,
    DATA_CONFIG                     : 3,
    DATA_INTERRUPT 			        : 4,
    DATA_INTERRUPT_CONFIG 			: 5
};

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

const BarometerBmp280Register = {
    PRESSURE 						: 1,
    ALTITUDE 						: 2,
    CONFIG 							: 3,
    CYCLIC 							: 4
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
    // Barometer
    BarometerBmp280Register		: BarometerBmp280Register,
    // LED
    LED 						: LED,

    // Information
    informations                : "MetaWear modules, translated from C++ API, tested for model R only."
};
