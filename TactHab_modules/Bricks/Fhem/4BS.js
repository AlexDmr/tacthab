var BrickFhem = require( './BrickFhem.js' );

// Define
function BrickFhem_EnO_4BS(id, FhemBridge, listEntry) {
	BrickFhem.apply(this, [id, FhemBridge, listEntry]);
	return this;
}

BrickFhem_EnO_4BS.prototype = Object.create(BrickFhem.prototype );
BrickFhem_EnO_4BS.prototype.constructor		= BrickFhem_EnO_4BS;
BrickFhem_EnO_4BS.prototype.getTypeName		= function() {return "BrickFhem_EnO_4BS";}
BrickFhem_EnO_4BS.prototype.getTypes		= function() {var L=BrickFhem.prototype.getTypes(); L.push(BrickFhem_EnO_4BS.prototype.getTypeName()); return L;}

BrickFhem_EnO_4BS.prototype.registerType(BrickFhem_EnO_4BS.prototype.getTypeName(), BrickFhem_EnO_4BS.prototype);

BrickFhem_EnO_4BS.prototype.dispose			= function() {
	BrickFhem.prototype.dispose.apply(this, []);
}

BrickFhem_EnO_4BS.prototype.extractData		= function(data) {
	console.log("BrickFhem_EnO_4BS::extractData", data);
	return {};
}

BrickFhem_EnO_4BS.prototype.update			= function(data) {
	var json = this.extractData(data);
	this.emit('update', json);
}
		
module.exports = BrickFhem_EnO_4BS;
