var BrickFhem = require( './BrickFhem.js' );

// Define
function lightSensor_01(FhemBridge, listEntry) {
	BrickFhem.apply(this, [FhemBridge, listEntry]);
	this.types.push( 'lightSensor_01' );
	this.lightSensor = {};
	return this;
}

lightSensor_01.prototype = Object.create(BrickFhem.prototype ); //new BrickFhem(); lightSensor_01.prototype.unreference();
lightSensor_01.prototype.constructor		= lightSensor_01;
lightSensor_01.prototype.getTypeName		= function() {return "lightSensor_01";}
lightSensor_01.prototype.getTypes		= function() {var L=BrickFhem.prototype.getTypes(); L.push(lightSensor_01.prototype.getTypeName()); return L;}

lightSensor_01.prototype.dispose			= function() {
	 BrickFhem.prototype.dispose.apply(this, []);
	}
	
lightSensor_01.prototype.extractData		= function(data) {
	 this.lightSensor.brightness = parseFloat( data.changed.brightness );
	 var json  = { time			: new Date().getTime()
				 , brightness	: this.lightSensor.brightness
				 };
	 return json;
	}

lightSensor_01.prototype.update			= function(data) {
		 var json = this.extractData(data);
		 this.emit('update', json);
		}

module.exports = lightSensor_01;
