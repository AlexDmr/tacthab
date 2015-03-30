define( [ '../Brick.js'
		]
	  , function(Brick) {
// Define
function tempHumiSensor_02() {
	Brick.apply(this, []);
	return this;
}

tempHumiSensor_02.prototype = new Brick();
	tempHumiSensor_02.prototype.unreference();
	tempHumiSensor_02.prototype.types.push( 'tempHumiSensor_02' );
tempHumiSensor_02.prototype.constructor		= tempHumiSensor_02;
tempHumiSensor_02.prototype.getTypeName		= function() {return "tempHumiSensor_02";}

tempHumiSensor_02.prototype.dispose			= function() {
	 Brick.prototype.dispose.apply(this, []);
	}
	
tempHumiSensor_02.prototype.serialize		= function() {
	 var json = Brick.prototype.serialize.apply(this, []);
	 return json;
	}

tempHumiSensor_02.prototype.getDescription = function() {
	 var json = Brick.prototype.getDescription.apply(this, []);
	 return json;
	}

return tempHumiSensor_02;
});
