define( [ '../Brick.js'
		]
	  , function(Brick) {
// Define
function actuator_01() {
	Brick.apply(this, []);
	this.types.push( 'actuator_01' );
	return this;
}

actuator_01.prototype = new Brick();
	actuator_01.prototype.unreference();
actuator_01.prototype.constructor		= actuator_01;
actuator_01.prototype.getTypeName		= function() {return "actuator_01";}

actuator_01.prototype.dispose			= function() {
	 Brick.prototype.dispose.apply(this, []);
	}
	
actuator_01.prototype.serialize		= function() {
	 var json = Brick.prototype.serialize.apply(this, []);
	 return json;
	}

actuator_01.prototype.getDescription = function() {
	 var json = Brick.prototype.getDescription.apply(this, []);
	 return json;
	}

return actuator_01;
});
