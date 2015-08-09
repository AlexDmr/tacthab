var BrickOpenHAB_item = require( './BrickOpenHAB_item.js' )

var BrickOpenHAB_DateTime = function() {
	BrickOpenHAB_item.apply(this, []);
	return this;
}

BrickOpenHAB_DateTime.prototype = Object.create( BrickOpenHAB_item.prototype );
BrickOpenHAB_DateTime.prototype.constructor	= BrickOpenHAB_DateTime;
BrickOpenHAB_DateTime.prototype.getTypeName 	= function() {return "BrickOpenHAB_DateTime";}
var types = BrickOpenHAB_item.prototype.getTypes();
types.push	( BrickOpenHAB_DateTime.prototype.getTypeName() );
BrickOpenHAB_DateTime.prototype.getTypes		= function() {return types;}

BrickOpenHAB_DateTime.prototype.registerType(BrickOpenHAB_DateTime.prototype.getTypeName(), BrickOpenHAB_DateTime.prototype);

BrickOpenHAB_DateTime.prototype.update	= function(topic, operation, message) {
	BrickOpenHAB_item.prototype.update.apply(this, [topic, operation, message]);
	return this;
}

module.exports = BrickOpenHAB_DateTime;
