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
	
BrickFhem_contact.prototype.extractData		= function(data) {
	 console.log("BrickFhem_contact::extractData", data);
	 return {};
	}

BrickFhem_contact.prototype.update			= function(data) {
		 var json = this.extractData(data);
		 this.emit('update', json);
		}


module.exports = BrickFhem_contact;
