define( [ './BrickFhem.js'
		]
	  , function(BrickFhem) {
// Define
function actuator_01(FhemBridge, listEntry) {
	this.actuator = { intervalEval	: 3000
					};
	BrickFhem.apply(this, [FhemBridge, listEntry]);
	this.types.push( 'actuator_01' );
	this.data = [];
	this.timer = null;
	return this;
}

actuator_01.prototype = new BrickFhem();
	actuator_01.prototype.unreference();
actuator_01.prototype.constructor		= actuator_01;
actuator_01.prototype.getTypeName		= function() {return "actuator_01";}

actuator_01.prototype.dispose			= function() {
	BrickFhem.prototype.dispose.apply(this, []);
}

actuator_01.prototype.init				= function(FhemBridge, listEntry) {
	var self = this;
	BrickFhem.prototype.init.apply(this, [FhemBridge, listEntry]);
	clearInterval( this.timer );
	this.timer = setInterval( function() {
								 FhemBridge.sendCommand(
									{ command	: "get"
									, device	: self.fhem.name
									, property	: "measurement input energy"
									});
								}
							, this.actuator.intervalEval
							);
}

actuator_01.prototype.extractData		= function(data) {
	// console.log("actuator_01::extractData", data);
	return {};
}

actuator_01.prototype.update			= function(data) {
	var json = this.extractData(data);
	this.emit('update', json);
}

return actuator_01;
});
