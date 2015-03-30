define( [ '../Brick.js'
		]
	  , function(Brick) {
// Define
function lightSensor_01() {
	Brick.apply(this, []);
	this.types.push( 'lightSensor_01' );
	return this;
}

lightSensor_01.prototype = new Brick();
	lightSensor_01.prototype.unreference();
lightSensor_01.prototype.constructor		= lightSensor_01;
lightSensor_01.prototype.getTypeName		= function() {return "lightSensor_01";}

lightSensor_01.prototype.dispose			= function() {
	 Brick.prototype.dispose.apply(this, []);
	}
	
lightSensor_01.prototype.serialize		= function() {
	 var json = Brick.prototype.serialize.apply(this, []);
	 return json;
	}

lightSensor_01.prototype.getDescription = function() {
	 var json = Brick.prototype.getDescription.apply(this, []);
	 return json;
	}

return lightSensor_01;
});