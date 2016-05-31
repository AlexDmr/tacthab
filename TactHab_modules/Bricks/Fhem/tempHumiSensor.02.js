var BrickFhem = require('./BrickFhem.js');

// Define
function BrickFhem_tempHumiSensor_02(id, FhemBridge, listEntry) {
	BrickFhem.apply(this, [id, FhemBridge, listEntry]);
	this.logEvents( "temperature"	);
	this.logEvents( "humidity"		);
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

BrickFhem_tempHumiSensor_02.prototype.init				= function(FhemBridge, listEntry) {
	BrickFhem.prototype.init.apply(this, [FhemBridge, listEntry]);
	if(listEntry) {
		// T: 13.0 H: 55 B: ok
		var L = listEntry.internals.STATE.split( ' ' );

		this.fhem.temperature	= parseFloat( L[1] );
		this.fhem.humidity		= parseFloat( L[3] );
	}
	
	return this;
}
	
BrickFhem_tempHumiSensor_02.prototype.extractData		= function(event) {
	var json = BrickFhem.prototype.extractData.apply(this, [event]);
	if(event.changed.temperature) {
		this.fhem.temperature 	= json.temperature 	= parseFloat( event.changed.temperature );
		this.log("temperature", json.temperature, json.lastUpdate);
	}
	if(event.changed.humidity) {
		this.fhem.humidity 		= json.humidity		= parseFloat( event.changed.humidity );
		this.log("humidity", json.humidity, json.lastUpdate);
	}
	return json;
}

module.exports = BrickFhem_tempHumiSensor_02;
