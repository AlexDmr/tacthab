define	( [ './BrickOpenHAB_item.js' ]
		, function(BrickOpenHAB_item) {

var BrickOpenHAB_Number = function(Brick) {
	BrickOpenHAB_item.apply(this, []);
	return this;
}

BrickOpenHAB_Number.prototype = Object.create( BrickOpenHAB_item.prototype );
BrickOpenHAB_Number.prototype.constructor	= BrickOpenHAB_Number;
BrickOpenHAB_Number.prototype.getTypeName 	= function() {return "BrickOpenHAB_Number";}
var types = BrickOpenHAB_item.prototype.getTypes();
types.push( BrickOpenHAB_Number.prototype.getTypeName() );
BrickOpenHAB_Number.prototype.getTypes		= function() {return types;}

BrickOpenHAB_Number.prototype.registerType(BrickOpenHAB_Number.prototype.getTypeName(), BrickOpenHAB_Number.prototype);

BrickOpenHAB_item.prototype.update	= function(topic, message) {
	
	BrickOpenHAB_item.prototype.update.apply(this, [topic, message]);
	return this;
}

return BrickOpenHAB_Number;
});