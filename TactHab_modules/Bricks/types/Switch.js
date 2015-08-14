var BrickOpenHAB_item = require( './BrickOpenHAB_item.js' )

var BrickOpenHAB_Switch = function() {
	BrickOpenHAB_item.apply(this, []);
	this.state = 'UNKNOWN';
	return this;
}

BrickOpenHAB_Switch.prototype = Object.create( BrickOpenHAB_item.prototype );
BrickOpenHAB_Switch.prototype.constructor	= BrickOpenHAB_Switch;
BrickOpenHAB_Switch.prototype.getTypeName 	= function() {return "BrickOpenHAB_Switch";}
var types = BrickOpenHAB_item.prototype.getTypes();
types.push	( BrickOpenHAB_Switch.prototype.getTypeName()
			, BrickOpenHAB_item.types.OnOff
			);
BrickOpenHAB_Switch.prototype.getTypes		= function() {return types;}

BrickOpenHAB_Switch.prototype.registerType(BrickOpenHAB_Switch.prototype.getTypeName(), BrickOpenHAB_Switch.prototype);

BrickOpenHAB_Switch.prototype.getState	= function() {return this.state;}
BrickOpenHAB_Switch.prototype.update	= function(topic, operation, message) {
	BrickOpenHAB_item.prototype.update.apply(this, [topic, operation, message]);
	switch(message) {
		 case 'ON' :
		 case 'OFF':
			this.state = message;
			this.emit("state", {value: this.state});
		 break;
		 default: console.error("BrickOpenHAB_Switch::update Unknown message", message);
		}
	return this;
}

BrickOpenHAB_Switch.prototype.Do_On			= function() {this.sendCommand("ON");}
BrickOpenHAB_Switch.prototype.Do_Off		= function() {this.sendCommand("OFF");}


module.exports = BrickOpenHAB_Switch;
