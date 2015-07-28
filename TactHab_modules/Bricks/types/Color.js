define	( [ './BrickOpenHAB_item.js' ]
		, function(BrickOpenHAB_item) {

var BrickOpenHAB_Color = function(Brick) {
	BrickOpenHAB_item.apply(this, []);
	return this;
}

BrickOpenHAB_Color.prototype = Object.create( BrickOpenHAB_item.prototype );
BrickOpenHAB_Color.prototype.constructor	= BrickOpenHAB_Color;
BrickOpenHAB_Color.prototype.getTypeName 	= function() {return "BrickOpenHAB_Color";}
var types = BrickOpenHAB_item.prototype.getTypes();
types.push( BrickOpenHAB_Color.prototype.getTypeName() );
BrickOpenHAB_Color.prototype.getTypes		= function() {return types;}

BrickOpenHAB_Color.prototype.registerType(BrickOpenHAB_Color.prototype.getTypeName(), BrickOpenHAB_Color.prototype);

BrickOpenHAB_item.prototype.update	= function(topic, message) {
	
	BrickOpenHAB_item.prototype.update.apply(this, [topic, message]);
	return this;
}

return BrickOpenHAB_Color;
});