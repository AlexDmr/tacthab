var BrickOpenHAB_item = require( './BrickOpenHAB_item.js' )

var BrickOpenHAB_String = function() {
	BrickOpenHAB_item.apply(this, []);
	this.state = "";
	return this;
}

BrickOpenHAB_String.prototype = Object.create( BrickOpenHAB_item.prototype );
BrickOpenHAB_String.prototype.constructor	= BrickOpenHAB_String;
BrickOpenHAB_String.prototype.getTypeName 	= function() {return "BrickOpenHAB_String";}
var types = BrickOpenHAB_item.prototype.getTypes();
types.push	( BrickOpenHAB_String.prototype.getTypeName() 
			, BrickOpenHAB_item.types.String
			);
BrickOpenHAB_String.prototype.getTypes		= function() {return types;}

BrickOpenHAB_String.prototype.registerType(BrickOpenHAB_String.prototype.getTypeName(), BrickOpenHAB_String.prototype);

BrickOpenHAB_String.prototype.update	= function(topic, operation, message) {
	BrickOpenHAB_item.prototype.update.apply(this, [topic, operation, message]);
	this.state = message;
	this.emit("state", {value: this.state});
	return this;
}

BrickOpenHAB_String.prototype.setString	= function(str) {this.sendCommand(str); return true;}

module.exports = BrickOpenHAB_String;
