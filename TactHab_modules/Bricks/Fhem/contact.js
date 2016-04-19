var BrickFhem = require( './BrickFhem.js' );

// Define
function BrickFhem_contact(id, FhemBridge, listEntry) {
	BrickFhem.apply(this, [id, FhemBridge, listEntry]);
	return this;
}

BrickFhem_contact.prototype = Object.create(BrickFhem.prototype );
BrickFhem_contact.prototype.constructor		= BrickFhem_contact;
BrickFhem_contact.prototype.getTypeName		= function() {return "BrickFhem_contact";}
BrickFhem_contact.prototype.getTypes		= function() {var L=BrickFhem.prototype.getTypes(); L.push(BrickFhem_contact.prototype.getTypeName()); return L;}

BrickFhem_contact.prototype.registerType(BrickFhem_contact.prototype.getTypeName(), BrickFhem_contact.prototype);

BrickFhem_contact.prototype.dispose			= function() {
	BrickFhem.prototype.dispose.apply(this, []);
}
	
BrickFhem_contact.prototype.init			= function(FhemBridge, listEntry) {
	BrickFhem.prototype.init.apply(this, [FhemBridge, listEntry]);
	this.fhem.isOpen = listEntry.internals.STATE === 'open';
}

BrickFhem_contact.prototype.extractData		= function(event) {
	var json = BrickFhem.prototype.extractData.apply(this, [event]);
	if(event.changed.state) {
		this.fhem.isOpen = json.isOpen = (event.changed.state === 'open');
	}
	return json;
}




module.exports = BrickFhem_contact;
