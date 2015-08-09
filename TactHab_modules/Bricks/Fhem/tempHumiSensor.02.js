var BrickFhem = require('./BrickFhem.js');

// Define
function tempHumiSensor_02(FhemBridge, listEntry) {
	BrickFhem.apply(this, [FhemBridge, listEntry]);
	this.TempHumi = {};
	return this;
}

tempHumiSensor_02.prototype = Object.create(BrickFhem.prototype ); //new BrickFhem(); tempHumiSensor_02.prototype.unreference();
	tempHumiSensor_02.prototype.types.push( 'tempHumiSensor_02' );
tempHumiSensor_02.prototype.constructor		= tempHumiSensor_02;
tempHumiSensor_02.prototype.getTypeName		= function() {return "tempHumiSensor_02";}

tempHumiSensor_02.prototype.dispose			= function() {
	 BrickFhem.prototype.dispose.apply(this, []);
	}
	
tempHumiSensor_02.prototype.extractData		= function(data) {
	 this.TempHumi = { temperature	: parseFloat( data.changed.temperature )
					 , humidity		: parseFloat( data.changed.humidity )
					 };
	 var json  = { time			: new Date().getTime()
				 , temperature	: this.TempHumi.temperature
				 , humidity		: this.TempHumi.humidity
				 };
	 return json;
	}

tempHumiSensor_02.prototype.update			= function(data) {
		 var json = this.extractData(data);
		 this.emit('update', json);
		}

module.exports = tempHumiSensor_02;

