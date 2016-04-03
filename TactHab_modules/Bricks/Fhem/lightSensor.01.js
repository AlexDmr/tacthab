var BrickFhem = require( './BrickFhem.js' );

// Define
function BrickFhem_lightSensor_01(id, FhemBridge, listEntry) {
	BrickFhem.apply(this, [id, FhemBridge, listEntry]);
	this.lightSensor = {};
	return this;
}

BrickFhem_lightSensor_01.prototype = Object.create(BrickFhem.prototype );
BrickFhem_lightSensor_01.prototype.constructor	= BrickFhem_lightSensor_01;
BrickFhem_lightSensor_01.prototype.getTypeName	= function() {return "BrickFhem_lightSensor_01";}
BrickFhem_lightSensor_01.prototype.getTypes		= function() {var L=BrickFhem.prototype.getTypes(); L.push(BrickFhem_lightSensor_01.prototype.getTypeName()); return L;}

BrickFhem_lightSensor_01.prototype.registerType(BrickFhem_lightSensor_01.prototype.getTypeName(), BrickFhem_lightSensor_01.prototype);

BrickFhem_lightSensor_01.prototype.dispose			= function() {
	 BrickFhem.prototype.dispose.apply(this, []);
	}
	
BrickFhem_lightSensor_01.prototype.extractData		= function(data) {
	 this.lightSensor.brightness = parseFloat( data.changed.brightness );
	 var json  = { time			: new Date().getTime()
				 , brightness	: this.lightSensor.brightness
				 };
	 return json;
	}

BrickFhem_lightSensor_01.prototype.update			= function(data) {
		 var json = this.extractData(data);
		 this.emit('update', json);
		}

module.exports = BrickFhem_lightSensor_01;
