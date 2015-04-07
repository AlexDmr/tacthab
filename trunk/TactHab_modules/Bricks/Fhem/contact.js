define( [ './BrickFhem.js'
		]
	  , function(BrickFhem) {
// Define
function contact(FhemBridge, listEntry) {
	BrickFhem.apply(this, [FhemBridge, listEntry]);
	this.types.push( 'contact' );
	return this;
}

contact.prototype = new BrickFhem();
	contact.prototype.unreference();
contact.prototype.constructor		= contact;
contact.prototype.getTypeName		= function() {return "contact";}

contact.prototype.dispose			= function() {
	 BrickFhem.prototype.dispose.apply(this, []);
	}
	
contact.prototype.extractData		= function(data) {
	 console.log("contact::extractData", data);
	 return {};
	}

contact.prototype.update			= function(data) {
		 var json = this.extractData(data);
		 this.emit('update', json);
		}


return contact;
});