var Brick		= require( '../Brick.js' )
  , AlxEvents	= require( '../../../js/AlxEvents.js' )
  ;
	  
// Define
function BrickFhem(FhemBridge, listEntry) {
	Brick.apply(this, []);
	this.init(FhemBridge, listEntry);
	return this;
}

BrickFhem.prototype = Object.create(Brick.prototype ); //new Brick(); BrickFhem.prototype.unreference();
BrickFhem.prototype.constructor		= BrickFhem;
BrickFhem.prototype.getTypeName		= function() {return "BrickFhem";}
BrickFhem.prototype.getTypes		= function() {var L=Brick.prototype.getTypes(); L.push(BrickFhem.prototype.getTypeName()); return L;}

AlxEvents(BrickFhem);	// Add events handling

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
		} else {this.fhem.name = undefined;}
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

BrickFhem.prototype.update			= function(data) {
	console.error("-_-_-_- BrickFhem::update should be implemented and specialized...");
	return {};
}

BrickFhem.prototype.getESA			= function() {
		return { events	: [ 'update' ]
			   , states	: []
			   , actions: []
			   };
	}

module.exports = BrickFhem;
