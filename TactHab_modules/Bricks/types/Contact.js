define	( [ './BrickOpenHAB_item.js' ]
		, function(BrickOpenHAB_item) {

var BrickOpenHAB_Contact = function(Brick) {
	BrickOpenHAB_item.apply(this, []);
	return this;
}

BrickOpenHAB_Contact.prototype = Object.create( BrickOpenHAB_item.prototype );
BrickOpenHAB_Contact.prototype.constructor	= BrickOpenHAB_Contact;
BrickOpenHAB_Contact.prototype.getTypeName 	= function() {return "BrickOpenHAB_Contact";}
var types = BrickOpenHAB_item.prototype.getTypes();
types.push( BrickOpenHAB_Contact.prototype.getTypeName() );
BrickOpenHAB_Contact.prototype.getTypes		= function() {return types;}

BrickOpenHAB_Contact.prototype.registerType(BrickOpenHAB_Contact.prototype.getTypeName(), BrickOpenHAB_Contact.prototype);

BrickOpenHAB_item.prototype.update	= function(topic, message) {
	
	BrickOpenHAB_item.prototype.update.apply(this, [topic, message]);
	return this;
}

return BrickOpenHAB_Contact;
});