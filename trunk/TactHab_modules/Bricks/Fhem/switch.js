define( [ '../Brick.js'
		]
	  , function(Brick) {
// Define
function EnO_switch() {
	Brick.apply(this, []);
	this.types.push( 'EnO_switch' );
	return this;
}

EnO_switch.prototype = new Brick();
	EnO_switch.prototype.unreference();
EnO_switch.prototype.constructor		= EnO_switch;
EnO_switch.prototype.getTypeName		= function() {return "EnO_switch";}

EnO_switch.prototype.dispose			= function() {
	 Brick.prototype.dispose.apply(this, []);
	}
	
EnO_switch.prototype.serialize		= function() {
	 var json = Brick.prototype.serialize.apply(this, []);
	 return json;
	}

EnO_switch.prototype.getDescription = function() {
	 var json = Brick.prototype.getDescription.apply(this, []);
	 return json;
	}

return EnO_switch;
});
