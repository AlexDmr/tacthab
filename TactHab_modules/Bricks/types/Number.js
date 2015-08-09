var BrickOpenHAB_item = require( './BrickOpenHAB_item.js' )

var BrickOpenHAB_Number = function() {
	BrickOpenHAB_item.apply(this, []);
	return this;
}

BrickOpenHAB_Number.prototype = Object.create( BrickOpenHAB_item.prototype );
BrickOpenHAB_Number.prototype.constructor	= BrickOpenHAB_Number;
BrickOpenHAB_Number.prototype.getTypeName 	= function() {return "BrickOpenHAB_Number";}
var types = BrickOpenHAB_item.prototype.getTypes();
types.push	( BrickOpenHAB_Number.prototype.getTypeName()
			, BrickOpenHAB_item.types.Decimal
			);
BrickOpenHAB_Number.prototype.getTypes		= function() {return types;}

BrickOpenHAB_Number.prototype.registerType(BrickOpenHAB_Number.prototype.getTypeName(), BrickOpenHAB_Number.prototype);

BrickOpenHAB_Number.prototype.update	= function(topic, operation, message) {
	BrickOpenHAB_item.prototype.update.apply(this, [topic, operation, message]);
	return this;
}

module.exports = BrickOpenHAB_Number;
