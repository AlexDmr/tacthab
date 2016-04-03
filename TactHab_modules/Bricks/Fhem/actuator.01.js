var BrickFhem = require( './BrickFhem.js' );

// Define
function BrickFhem_actuator_01(id, FhemBridge, listEntry) {
	this.actuator = { intervalEval	: 3000
					};
	BrickFhem.apply(this, [id, FhemBridge, listEntry]);
	this.timer = null;
	return this;
}

BrickFhem_actuator_01.prototype = Object.create(BrickFhem.prototype ); 
BrickFhem_actuator_01.prototype.constructor		= BrickFhem_actuator_01;
BrickFhem_actuator_01.prototype.getTypeName		= function() {return "BrickFhem_actuator_01";}
BrickFhem_actuator_01.prototype.getTypes		= function() {var L=BrickFhem.prototype.getTypes(); L.push(BrickFhem_actuator_01.prototype.getTypeName()); return L;}

BrickFhem_actuator_01.prototype.registerType(BrickFhem_actuator_01.prototype.getTypeName(), BrickFhem_actuator_01.prototype);

BrickFhem_actuator_01.prototype.dispose			= function() {
	BrickFhem.prototype.dispose.apply(this, []);
}

BrickFhem_actuator_01.prototype.init				= function(FhemBridge, listEntry) {
	var self = this;
	BrickFhem.prototype.init.apply(this, [FhemBridge, listEntry]);
	clearInterval( this.timer );
	this.timer = setInterval( function() {
								 FhemBridge.sendCommand(
									{command : "get " + self.fhem.name + " measurement input energy"}
									);
								}
							, this.actuator.intervalEval
							);
}

BrickFhem_actuator_01.prototype.extractData		= function(data) {
	console.log("BrickFhem_actuator_01::extractData", data);
	return {};
}

BrickFhem_actuator_01.prototype.update			= function(data) {
	var json = this.extractData(data);
	this.emit('update', json);
}

module.exports = BrickFhem_actuator_01;
