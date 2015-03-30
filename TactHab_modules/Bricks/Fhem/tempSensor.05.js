define( [ '../Brick.js'
		]
	  , function(Brick) {
// Define
function tempSensor_05() {
	Brick.apply(this, []);
	this.types.push( 'tempSensor_05' );
	return this;
}

tempSensor_05.prototype = new Brick();
	tempSensor_05.prototype.unreference();
tempSensor_05.prototype.constructor		= tempSensor_05;
tempSensor_05.prototype.getTypeName		= function() {return "tempSensor_05";}

tempSensor_05.prototype.dispose			= function() {
	 Brick.prototype.dispose.apply(this, []);
	}
	
tempSensor_05.prototype.serialize		= function() {
	 var json = Brick.prototype.serialize.apply(this, []);
	 return json;
	}

tempSensor_05.prototype.getDescription = function() {
	 var json = Brick.prototype.getDescription.apply(this, []);
	 return json;
	}

return tempSensor_05;
});
