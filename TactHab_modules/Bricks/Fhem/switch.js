var BrickFhem = require( './BrickFhem.js' );

// Define
function BrickFhem_EnO_switch(id, FhemBridge, listEntry) {
	BrickFhem.apply(this, [id, FhemBridge, listEntry]);
	this.fhem.buttons = {
		pressed	: false,
		state	: []
	};
	this.logEvents( "state" );
	return this;
}

BrickFhem_EnO_switch.prototype = Object.create(BrickFhem.prototype );
BrickFhem_EnO_switch.prototype.constructor		= BrickFhem_EnO_switch;
BrickFhem_EnO_switch.prototype.getTypeName		= function() {return "BrickFhem_EnO_switch";}
BrickFhem_EnO_switch.prototype.getTypes			= function() {var L=BrickFhem.prototype.getTypes(); L.push(BrickFhem_EnO_switch.prototype.getTypeName()); return L;}

BrickFhem_EnO_switch.prototype.registerType(BrickFhem_EnO_switch.prototype.getTypeName(), BrickFhem_EnO_switch.prototype);

BrickFhem_EnO_switch.prototype.dispose			= function() {
	BrickFhem.prototype.dispose.apply(this, []);
}

BrickFhem_EnO_switch.prototype.init				= function(FhemBridge, listEntry) {
	BrickFhem.prototype.init.apply(this, [FhemBridge, listEntry]);
	this.fhem.buttons.pressed = listEntry.internals.STATE === "pressed";
}

BrickFhem_EnO_switch.prototype.isPressed		= function() {
	return this.fhem.buttons.pressed;
}

BrickFhem_EnO_switch.prototype.extractData		= function(data) {
	var json = BrickFhem.prototype.extractData.apply(this, [data]);
	if(data.changed.buttons) {	// pressed or not
		this.fhem.buttons.pressed = json.pressed = (data.changed.buttons === "pressed");
		if( json.pressed === false ) {this.fhem.buttons.state.length = 0;}
	}
	if(data.changed.STATE) {	// List of pressed buttons
		this.fhem.buttons.state = json.state = data.changed.STATE.split(",");
	}
	this.log("pressed", json.pressed, json.lastUpdate);
	return json;
}

/*BrickFhem_EnO_switch.prototype.getDescription	= function() {
	var json = BrickFhem.prototype.getDescription.apply(this, []);
	return json;
}*/

module.exports = BrickFhem_EnO_switch;
