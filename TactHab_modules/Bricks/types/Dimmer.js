define	( [ './BrickOpenHAB_item.js' ]
		, function(BrickOpenHAB_item) {

var BrickOpenHAB_Dimmer = function(Brick) {
	BrickOpenHAB_item.apply(this, []);
	return this;
}

BrickOpenHAB_Dimmer.prototype = Object.create( BrickOpenHAB_item.prototype );
BrickOpenHAB_Dimmer.prototype.constructor	= BrickOpenHAB_Dimmer;
BrickOpenHAB_Dimmer.prototype.getTypeName 	= function() {return "BrickOpenHAB_Dimmer";}
var types = BrickOpenHAB_item.prototype.getTypes();
types.push( BrickOpenHAB_Dimmer.prototype.getTypeName() );
BrickOpenHAB_Dimmer.prototype.getTypes		= function() {return types;}

BrickOpenHAB_Dimmer.prototype.registerType(BrickOpenHAB_Dimmer.prototype.getTypeName(), BrickOpenHAB_Dimmer.prototype);

BrickOpenHAB_item.prototype.update	= function(topic, message) {
	
	BrickOpenHAB_item.prototype.update.apply(this, [topic, message]);
	return this;
}

return BrickOpenHAB_Dimmer;
});