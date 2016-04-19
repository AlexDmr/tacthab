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
		this.fhem.signalAtt		= Object.keys(listEntry.internals).filter( function(att) {return /ReceivingQuality$/.test(att);} )[0]
		this.fhem.signalQuelity	= listEntry.internals[ this.fhem.signalAtt ];
		this.fhem.lastUpdate	= Date.now()
		} else {this.fhem.name	= undefined;}
	this.fhem.bridge= FhemBridge;
	return this;
}

BrickFhem.prototype.serialize		= function() {
	var json = Brick.prototype.serialize.apply(this, []);
	json.fhem = this.fhem;
	return json;
}

BrickFhem.prototype.getDescription	= function() {
	var json = Brick.prototype.getDescription.apply(this, []);
	json.fhem = this.fhem;
	return json;
}

BrickFhem.prototype.sendCommand		= function(cmd) {
	this.fhem.bridge.sendCommand( cmd );
}

BrickFhem.prototype.extractData		= function(/*data*/) {
	return 	{ lastUpdate	: this.fhem.lastUpdate = Date.now() 
			};
}

BrickFhem.prototype.update			= function(data) {
	var json = this.extractData(data);
	this.emit('update', json);
}

BrickFhem.prototype.getESA			= function() {
		return	{ events	: [ 'update' ]
				, states	: []
				, actions	: []
				};
	}

module.exports = BrickFhem;
