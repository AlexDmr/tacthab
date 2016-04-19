var BrickFhem = require( './BrickFhem.js' );

// Define
function BrickFhem_tempSensor_05(id, FhemBridge, listEntry) {
	BrickFhem.apply(this, [id, FhemBridge, listEntry]);
	// console.log( "new BrickFhem_tempSensor_05", id);
	this.logEvents( "temperature" );
	return this;
}

BrickFhem_tempSensor_05.prototype = Object.create(BrickFhem.prototype );
BrickFhem_tempSensor_05.prototype.constructor		= BrickFhem_tempSensor_05;
BrickFhem_tempSensor_05.prototype.getTypeName		= function() {return "BrickFhem_tempSensor_05";}
var L = BrickFhem.prototype.getTypes(); 
L.push(BrickFhem_tempSensor_05.prototype.getTypeName()); 
BrickFhem_tempSensor_05.prototype.getTypes			= function() {return L;}

BrickFhem_tempSensor_05.prototype.registerType(BrickFhem_tempSensor_05.prototype.getTypeName(), BrickFhem_tempSensor_05.prototype);

BrickFhem_tempSensor_05.prototype.dispose			= function() {
	BrickFhem.prototype.dispose.apply(this, []);
}

BrickFhem_tempSensor_05.prototype.init				= function(FhemBridge, listEntry) {
	BrickFhem.prototype.init.apply(this, [FhemBridge, listEntry]);
	this.fhem.temperature = parseFloat( listEntry.internals.STATE );
	console.log( "new temperature sensor at", this.fhem.temperature );
}

BrickFhem_tempSensor_05.prototype.extractData		= function(event) {
	var json = BrickFhem.prototype.extractData.apply(this, [event]);
	if(event.changed.temperature) {
		this.fhem.temperature = json.temperature = parseFloat( event.changed.temperature );
		// this.log("temperature", json.temperature, json.lastUpdate);
	}
	return json;
}


/*BrickFhem_tempSensor_05.prototype.getDescription	= function() {
	var json = BrickFhem.prototype.getDescription.apply(this, []);
	return json;
}*/


module.exports = BrickFhem_tempSensor_05;
