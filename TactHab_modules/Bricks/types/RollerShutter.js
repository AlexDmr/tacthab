var BrickOpenHAB_item = require( './BrickOpenHAB_item.js' )

var BrickOpenHAB_RollerShutter = function() {
	BrickOpenHAB_item.apply(this, []);
	this.infos = {command: ''};
	return this;
}

BrickOpenHAB_RollerShutter.prototype = Object.create( BrickOpenHAB_item.prototype );
BrickOpenHAB_RollerShutter.prototype.constructor	= BrickOpenHAB_RollerShutter;
BrickOpenHAB_RollerShutter.prototype.getTypeName 	= function() {return "BrickOpenHAB_RollerShutter";}
var types = BrickOpenHAB_item.prototype.getTypes();
types.push	( BrickOpenHAB_RollerShutter.prototype.getTypeName()
			, BrickOpenHAB_item.types.UpDown
			, BrickOpenHAB_item.types.StopMove
			, BrickOpenHAB_item.types.Percent
			);
BrickOpenHAB_RollerShutter.prototype.getTypes		= function() {return types;}

BrickOpenHAB_RollerShutter.prototype.registerType(BrickOpenHAB_RollerShutter.prototype.getTypeName(), BrickOpenHAB_RollerShutter.prototype);

BrickOpenHAB_RollerShutter.prototype.update	= function(topic, operation, message) {
	BrickOpenHAB_item.prototype.update.apply(this, [topic, operation, message]);
	this.infos[ operation ] = message;
	return this;
}

module.exports = BrickOpenHAB_RollerShutter;
