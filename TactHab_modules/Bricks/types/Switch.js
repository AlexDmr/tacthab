define	( [ './BrickOpenHAB_item.js' ]
		, function(BrickOpenHAB_item) {

var BrickOpenHAB_Switch = function(Brick) {
	BrickOpenHAB_item.apply(this, []);
	return this;
}

BrickOpenHAB_Switch.prototype = Object.create( BrickOpenHAB_item.prototype );
BrickOpenHAB_Switch.prototype.constructor	= BrickOpenHAB_Switch;
BrickOpenHAB_Switch.prototype.getTypeName 	= function() {return "BrickOpenHAB_Switch";}
var types = BrickOpenHAB_item.prototype.getTypes();
types.push( BrickOpenHAB_Switch.prototype.getTypeName() );
BrickOpenHAB_Switch.prototype.getTypes		= function() {return types;}

BrickOpenHAB_Switch.prototype.registerType(BrickOpenHAB_Switch.prototype.getTypeName(), BrickOpenHAB_Switch.prototype);

BrickOpenHAB_item.prototype.update	= function(topic, message) {
	
	BrickOpenHAB_item.prototype.update.apply(this, [topic, message]);
	return this;
}

return BrickOpenHAB_Switch;
});