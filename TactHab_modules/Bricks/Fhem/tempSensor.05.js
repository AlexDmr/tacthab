var BrickFhem = require( './BrickFhem.js' );

// Define
function BrickFhem_tempSensor_05(id, FhemBridge, listEntry) {
	BrickFhem.apply(this, [id, FhemBridge, listEntry]);
	this.temperature = undefined;
	this.logEvents( "temperature" );
	return this;
}

BrickFhem_tempSensor_05.prototype = Object.create(BrickFhem.prototype );
BrickFhem_tempSensor_05.prototype.constructor		= BrickFhem_tempSensor_05;
BrickFhem_tempSensor_05.prototype.getTypeName		= function() {return "BrickFhem_tempSensor_05";}
BrickFhem_tempSensor_05.prototype.getTypes			= function() {
	var L = BrickFhem.prototype.getTypes(); 
	L.push(BrickFhem_tempSensor_05.prototype.getTypeName()); 
	return L;
}

BrickFhem_tempSensor_05.prototype.registerType(BrickFhem_tempSensor_05.prototype.getTypeName(), BrickFhem_tempSensor_05.prototype);

BrickFhem_tempSensor_05.prototype.dispose			= function() {
	BrickFhem.prototype.dispose.apply(this, []);
}

BrickFhem_tempSensor_05.prototype.init				= function(FhemBridge, listEntry) {
	BrickFhem.prototype.init.apply(this, [FhemBridge, listEntry]);
}

BrickFhem_tempSensor_05.prototype.extractData		= function(data) {
	this.temperature = parseFloat( data.changed.temperature );
	var json  = 	{ time			: Date.now()
					, temperature	: this.temperature
					};
	this.log("temperature", this.temperature, json.time);
	return json;
}

BrickFhem_tempSensor_05.prototype.update			= function(data) {
	var json = this.extractData(data);
	this.emit('update', json);
}

BrickFhem_tempSensor_05.prototype.getDescription	= function() {
	var json = BrickFhem.prototype.getDescription.apply(this, []);
	json.state = {
		temperature	: this.temperature
	}
	return json;
}


module.exports = BrickFhem_tempSensor_05;