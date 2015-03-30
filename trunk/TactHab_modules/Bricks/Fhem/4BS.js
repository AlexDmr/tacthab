define( [ '../Brick.js'
		]
	  , function(Brick) {
// Define
function EnO_4BS() {
	Brick.apply(this, []);
	this.types.push( 'EnO_4BS' );
	return this;
}

EnO_4BS.prototype = new Brick();
	EnO_4BS.prototype.unreference();
EnO_4BS.prototype.constructor		= EnO_4BS;
EnO_4BS.prototype.getTypeName		= function() {return "EnO_4BS";}

EnO_4BS.prototype.dispose			= function() {
	 Brick.prototype.dispose.apply(this, []);
	}
	
EnO_4BS.prototype.serialize		= function() {
	 var json = Brick.prototype.serialize.apply(this, []);
	 return json;
	}

EnO_4BS.prototype.getDescription = function() {
	 var json = Brick.prototype.getDescription.apply(this, []);
	 return json;
	}

return EnO_4BS;
});
