define( [ './BrickFhem.js'
		, '../standards/lightSensor.js'
		]
	  , function(BrickFhem, lightSensor) {
// Define
function lightSensor_01(FhemBridge, listEntry) {
	BrickFhem.apply(this, [FhemBridge, listEntry]);
	this.types.push( 'lightSensor_01' );
	this.lightSensor = {};
	return this;
}

lightSensor_01.prototype = new BrickFhem();
	lightSensor_01.prototype.unreference();
	lightSensor.apply(lightSensor_01.prototype, []);
lightSensor_01.prototype.constructor		= lightSensor_01;
lightSensor_01.prototype.getTypeName		= function() {return "lightSensor_01";}

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

return lightSensor_01;
});