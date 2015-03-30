define( [ '../Brick.js'
		]
	  , function(Brick) {
// Define
function contact() {
	Brick.apply(this, []);
	this.types.push( 'contact' );
	return this;
}

contact.prototype = new Brick();
	contact.prototype.unreference();
contact.prototype.constructor		= contact;
contact.prototype.getTypeName		= function() {return "contact";}

contact.prototype.dispose			= function() {
	 Brick.prototype.dispose.apply(this, []);
	}
	
contact.prototype.serialize		= function() {
	 var json = Brick.prototype.serialize.apply(this, []);
	 return json;
	}

contact.prototype.getDescription = function() {
	 var json = Brick.prototype.getDescription.apply(this, []);
	 return json;
	}

return contact;
});
