var Brick		= require( '../Brick.js' )
  , AlxEvents	= require( '../../../js/AlxEvents.js' )
  ;
	  
// Define
function BrickFhem(id, FhemBridge, listEntry) {
	Brick.apply(this, [id]);
	this.init(FhemBridge, listEntry);
	return this;
}

BrickFhem.prototype = Object.create(Brick.prototype );
BrickFhem.prototype.constructor		= BrickFhem;
BrickFhem.prototype.getTypeName		= function() {return "BrickFhem";}
BrickFhem.prototype.getTypes		= function() {var L=Brick.prototype.getTypes(); L.push(BrickFhem.prototype.getTypeName()); return L;}

AlxEvents(BrickFhem);	// Add events handling

BrickFhem.prototype.registerType(BrickFhem.prototype.getTypeName(), BrickFhem.prototype);

BrickFhem.prototype.dispose			= function() {
	Brick.prototype.dispose.apply(this, []);
}

BrickFhem.prototype.init			= function(FhemBridge, listEntry) {
	this.fhem = {};
	this.data = [];
	if(typeof listEntry !== 'undefined') {
		this.name				= listEntry.name;
		this.fhem.name			= listEntry.name;
		this.fhem.attributes	= listEntry.attributes;
		} else {this.fhem.name	= undefined;}
	this.fhem.bridge= FhemBridge;
}

BrickFhem.prototype.serialize		= function() {
	var json = Brick.prototype.serialize.apply(this, []);
	return json;
}

BrickFhem.prototype.getDescription = function() {
	var json = Brick.prototype.getDescription.apply(this, []);
	return json;
}

BrickFhem.prototype.sendCommand	= function(cmd) {
	this.fhem.bridge.sendCommand( cmd );
}

BrickFhem.prototype.update			= function(data) {
	console.error("-_-_-_- BrickFhem::update should be implemented and specialized...", data);
	return {};
}

/*BrickFhem.prototype.log				= function(name, value, ms) {
	console.log( this, "log", name, value, ms);
	return Brick.prototype.log.apply(this, [name, value, ms]);
}*/

BrickFhem.prototype.getESA			= function() {
		return	{ events	: [ 'update' ]
				, states	: []
				, actions	: []
				};
	}

module.exports = BrickFhem;
