define	( [ './BrickOpenHAB_item.js' ]
		, function(BrickOpenHAB_item) {

var BrickOpenHAB_RollerShutter = function() {
	BrickOpenHAB_item.apply(this, []);
	return this;
}

BrickOpenHAB_RollerShutter.prototype = Object.create( BrickOpenHAB_item.prototype );
BrickOpenHAB_RollerShutter.prototype.constructor	= BrickOpenHAB_RollerShutter;
BrickOpenHAB_RollerShutter.prototype.getTypeName 	= function() {return "BrickOpenHAB_RollerShutter";}
var types = BrickOpenHAB_item.prototype.getTypes();
types.push( BrickOpenHAB_RollerShutter.prototype.getTypeName() );
BrickOpenHAB_RollerShutter.prototype.getTypes		= function() {return types;}

BrickOpenHAB_RollerShutter.prototype.registerType(BrickOpenHAB_RollerShutter.prototype.getTypeName(), BrickOpenHAB_RollerShutter.prototype);

BrickOpenHAB_item.prototype.update	= function(topic, message) {
	
	BrickOpenHAB_item.prototype.update.apply(this, [topic, message]);
	return this;
}

return BrickOpenHAB_RollerShutter;
});