var BrickFhem = require( "./BrickFhem.js" )
  ;
	  
// Define
function BrickFhemZwave(id, FhemBridge, listEntry) {
	BrickFhem.apply(this, [id, FhemBridge, listEntry]);
	if(listEntry && listEntry.attributes) {
		console.log( "BrickFhemZwave", listEntry.attributes.classes);
	}
	// this.init(FhemBridge, listEntry);
	return this;
}

BrickFhemZwave.prototype 				= Object.create(BrickFhem.prototype );
BrickFhemZwave.prototype.constructor	= BrickFhemZwave;
BrickFhemZwave.prototype.getTypeName	= function() {return "BrickFhemZwave";}
var L = BrickFhem.prototype.getTypes(); 
L.push(BrickFhemZwave.prototype.getTypeName()); 
BrickFhemZwave.prototype.getTypes		= function() {return L;}

BrickFhemZwave.prototype.registerType(BrickFhemZwave.prototype.getTypeName(), BrickFhemZwave.prototype);

BrickFhemZwave.prototype.dispose		= function() {
	BrickFhem.prototype.dispose.apply(this, []);
}

BrickFhemZwave.prototype.init			= function(FhemBridge, listEntry) {
	BrickFhem.prototype.init.apply(this, [FhemBridge, listEntry]);
	// console.log( "BrickFhemZwave::init", this );
	return this;
}

BrickFhemZwave.prototype.serialize		= function() {
	var json = BrickFhem.prototype.serialize.apply(this, []);
	json.fhem = this.fhem;
	return json;
}

BrickFhemZwave.prototype.getDescription	= function() {
	var json = BrickFhem.prototype.getDescription.apply(this, []);
	return json;
}

BrickFhemZwave.prototype.extractData	= function(data) {
	var json = BrickFhem.prototype.extractData.apply(this, [data] );
	return 	json;
}

module.exports = BrickFhemZwave;
