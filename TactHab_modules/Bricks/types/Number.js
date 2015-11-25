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

BrickOpenHAB_Number.prototype.init			= function(device) {
	BrickOpenHAB_item.prototype.init.apply(this, [device]);
	this.state = parseFloat( device.state );
	return this;
}

BrickOpenHAB_Number.prototype.update	= function(topic, operation, message) {
	console.log( "BrickOpenHAB_Number::update", topic, operation, message );
	BrickOpenHAB_item.prototype.update.apply(this, [topic, operation, message]);
	this.state = parseFloat( message );
	this.emit("state", {value: this.state});
	return this;
}

BrickOpenHAB_Number.prototype.setNumber	= function(num) {this.sendCommand(""+num); return true;}

module.exports = BrickOpenHAB_Number;
