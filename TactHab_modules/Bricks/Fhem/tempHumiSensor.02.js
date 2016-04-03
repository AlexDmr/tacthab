var BrickFhem = require('./BrickFhem.js');

// Define
function BrickFhem_tempHumiSensor_02(id, FhemBridge, listEntry) {
	BrickFhem.apply(this, [id, FhemBridge, listEntry]);
	this.TempHumi = {};
	return this;
}

BrickFhem_tempHumiSensor_02.prototype = Object.create(BrickFhem.prototype );
BrickFhem_tempHumiSensor_02.prototype.constructor	= BrickFhem_tempHumiSensor_02;
BrickFhem_tempHumiSensor_02.prototype.getTypeName	= function() {return "BrickFhem_tempHumiSensor_02";}
BrickFhem_tempHumiSensor_02.prototype.getTypes		= function() {
	var L=BrickFhem.prototype.getTypes();
	L.push(BrickFhem_tempHumiSensor_02.prototype.getTypeName());
	return L;
}

BrickFhem_tempHumiSensor_02.prototype.registerType(BrickFhem_tempHumiSensor_02.prototype.getTypeName(), BrickFhem_tempHumiSensor_02.prototype);

BrickFhem_tempHumiSensor_02.prototype.dispose			= function() {
	BrickFhem.prototype.dispose.apply(this, []);
}
	
BrickFhem_tempHumiSensor_02.prototype.extractData		= function(data) {
	this.TempHumi = { temperature	: parseFloat( data.changed.temperature )
					, humidity		: parseFloat( data.changed.humidity )
					};
	var json  = 	{ time			: new Date().getTime()
					, temperature	: this.TempHumi.temperature
					, humidity		: this.TempHumi.humidity
					};
	return json;
}

BrickFhem_tempHumiSensor_02.prototype.update			= function(data) {
	var json = this.extractData(data);
	this.emit('update', json);
}

module.exports = BrickFhem_tempHumiSensor_02;
