define	( [ './BrickOpenHAB_item.js' ]
		, function(BrickOpenHAB_item) {

var BrickOpenHAB_String = function(Brick) {
	BrickOpenHAB_item.apply(this, []);
	return this;
}

BrickOpenHAB_String.prototype = Object.create( BrickOpenHAB_item.prototype );
BrickOpenHAB_String.prototype.constructor	= BrickOpenHAB_String;
BrickOpenHAB_String.prototype.getTypeName 	= function() {return "BrickOpenHAB_String";}
var types = BrickOpenHAB_item.prototype.getTypes();
types.push( BrickOpenHAB_String.prototype.getTypeName() );
BrickOpenHAB_String.prototype.getTypes		= function() {return types;}

BrickOpenHAB_String.prototype.registerType(BrickOpenHAB_String.prototype.getTypeName(), BrickOpenHAB_String.prototype);

BrickOpenHAB_item.prototype.update	= function(topic, message) {
	
	BrickOpenHAB_item.prototype.update.apply(this, [topic, message]);
	return this;
}

return BrickOpenHAB_String;
});