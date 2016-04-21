var BrickFhem = require( './BrickFhem.js' );

// Define
function BrickFhem_lightSensor_01(id, FhemBridge, listEntry) {
	BrickFhem.apply(this, [id, FhemBridge, listEntry]);
}

BrickFhem_lightSensor_01.prototype = Object.create(BrickFhem.prototype );
BrickFhem_lightSensor_01.prototype.constructor	= BrickFhem_lightSensor_01;
BrickFhem_lightSensor_01.prototype.getTypeName	= function() {return "BrickFhem_lightSensor_01";}
BrickFhem_lightSensor_01.prototype.getTypes		= function() {
	var L = BrickFhem.prototype.getTypes();
	L.push(BrickFhem_lightSensor_01.prototype.getTypeName()); 
	return L;
}

BrickFhem_lightSensor_01.prototype.registerType(BrickFhem_lightSensor_01.prototype.getTypeName(), BrickFhem_lightSensor_01.prototype);

BrickFhem_lightSensor_01.prototype.dispose			= function() {
	BrickFhem.prototype.dispose.apply(this, []);
}

BrickFhem_lightSensor_01.prototype.init				= function(FhemBridge, listEntry) {
	BrickFhem.prototype.init.apply(this, [FhemBridge, listEntry]);
	this.fhem.brightness = parseFloat( listEntry.internals.STATE );
	return this;
}

BrickFhem_lightSensor_01.prototype.extractData		= function(data) {
	var json  = BrickFhem.prototype.extractData.apply(this, [data]);
	if( data.changed.brightness ) {
	 	this.fhem.brightness = json.brightness = parseFloat( data.changed.brightness );
	}
	return json;
}

module.exports = BrickFhem_lightSensor_01;


