var BrickOpenHAB_item = require( './BrickOpenHAB_item.js' )

var BrickOpenHAB_Dimmer = function() {
	BrickOpenHAB_item.apply(this, []);
	return this;
}

BrickOpenHAB_Dimmer.prototype = Object.create( BrickOpenHAB_item.prototype );
BrickOpenHAB_Dimmer.prototype.constructor	= BrickOpenHAB_Dimmer;
BrickOpenHAB_Dimmer.prototype.getTypeName 	= function() {return "BrickOpenHAB_Dimmer";}
var types = BrickOpenHAB_item.prototype.getTypes();
types.push	( BrickOpenHAB_Dimmer.prototype.getTypeName()
			, BrickOpenHAB_item.types.OnOff
			, BrickOpenHAB_item.types.IncreaseDecrease
			, BrickOpenHAB_item.types.Percent
			);
BrickOpenHAB_Dimmer.prototype.getTypes		= function() {return types;}

BrickOpenHAB_Dimmer.prototype.registerType(BrickOpenHAB_Dimmer.prototype.getTypeName(), BrickOpenHAB_Dimmer.prototype);

BrickOpenHAB_Dimmer.prototype.update	= function(topic, operation, message) {
	BrickOpenHAB_item.prototype.update.apply(this, [topic, operation, message]);
	if(typeof message === "string") {message = parseInt(message);}
	this.state = message;
	this.emit( "state", {value: message} );
	return this;
}

BrickOpenHAB_Dimmer.prototype.setValue	= function(value) {
	this.sendCommand(""+value);
	return value;
}

module.exports = BrickOpenHAB_Dimmer;

