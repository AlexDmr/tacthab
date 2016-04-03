var BrickFhem = require( './BrickFhem.js' );

// Define
function BrickFhem_EnO_switch(id, FhemBridge, listEntry) {
	BrickFhem.apply(this, [id, FhemBridge, listEntry]);
	this.buttons = {};
	return this;
}

BrickFhem_EnO_switch.prototype = Object.create(BrickFhem.prototype );
BrickFhem_EnO_switch.prototype.constructor	= BrickFhem_EnO_switch;
BrickFhem_EnO_switch.prototype.getTypeName	= function() {return "BrickFhem_EnO_switch";}
BrickFhem_EnO_switch.prototype.getTypes		= function() {var L=BrickFhem.prototype.getTypes(); L.push(BrickFhem_EnO_switch.prototype.getTypeName()); return L;}

BrickFhem_EnO_switch.prototype.registerType(BrickFhem_EnO_switch.prototype.getTypeName(), BrickFhem_EnO_switch.prototype);

BrickFhem_EnO_switch.prototype.dispose			= function() {
	BrickFhem.prototype.dispose.apply(this, []);
}

BrickFhem_EnO_switch.prototype.init				= function(FhemBridge, listEntry) {
	BrickFhem.prototype.init.apply(this, [FhemBridge, listEntry]);
}

BrickFhem_EnO_switch.prototype.isPressed			= function() {
	return this.buttons.state;
}

BrickFhem_EnO_switch.prototype.extractData		= function(data) {
	this.buttons.state = data.changed.buttons === 'pressed';
	var json  = { time		: new Date().getTime()
				, pressed	: this.buttons.state === 'pressed'
				};
	if(data.changed.STATE) {json.state = data.changed.STATE;}
	return json;
}

BrickFhem_EnO_switch.prototype.update			= function(data) {
	console.log("BrickFhem_EnO_switch", this.brickId, "update");
	var json = this.extractData(data);
	this.emit('update', json);
}

module.exports = BrickFhem_EnO_switch;
