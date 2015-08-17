var BrickOpenHAB_item = require( './BrickOpenHAB_item.js' )

var BrickOpenHAB_Contact = function() {
	BrickOpenHAB_item.apply(this, []);
	return this;
}

BrickOpenHAB_Contact.prototype = Object.create( BrickOpenHAB_item.prototype );
BrickOpenHAB_Contact.prototype.constructor	= BrickOpenHAB_Contact;
BrickOpenHAB_Contact.prototype.getTypeName 	= function() {return "BrickOpenHAB_Contact";}
var types = BrickOpenHAB_item.prototype.getTypes();
types.push	( BrickOpenHAB_Contact.prototype.getTypeName()
			, BrickOpenHAB_item.types.OpenClosed
			);
BrickOpenHAB_Contact.prototype.getTypes		= function() {return types;}

BrickOpenHAB_Contact.prototype.registerType(BrickOpenHAB_Contact.prototype.getTypeName(), BrickOpenHAB_Contact.prototype);

BrickOpenHAB_Contact.prototype.update	= function(topic, operation, message) {
	BrickOpenHAB_item.prototype.update.apply(this, [topic, operation, message]);
	switch(message) {
		 case 'OPEN'  :
		 case 'CLOSED':
			this.state = message;
			this.emit("state", {value: this.state});
		 break;
		 default: console.error("BrickOpenHAB_Contact::update Unknown message", message);
		}
	return this;
}

BrickOpenHAB_Contact.prototype.Do_Open		= function() {this.sendCommand("OPEN"  ); return true;}
BrickOpenHAB_Contact.prototype.Do_Close		= function() {this.sendCommand("CLOSED"); return true;}

module.exports = BrickOpenHAB_Contact;
