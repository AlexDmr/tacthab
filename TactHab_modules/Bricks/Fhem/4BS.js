var BrickFhem = require( './BrickFhem.js' );

// Define
function EnO_4BS(FhemBridge, listEntry) {
	BrickFhem.apply(this, [FhemBridge, listEntry]);
	this.data = [];
	return this;
}

EnO_4BS.prototype = Object.create(BrickFhem.prototype ); //new BrickFhem(); EnO_4BS.prototype.unreference();
EnO_4BS.prototype.constructor		= EnO_4BS;
EnO_4BS.prototype.getTypeName		= function() {return "EnO_4BS";}
EnO_4BS.prototype.getTypes		= function() {var L=BrickFhem.prototype.getTypes(); L.push(EnO_4BS.prototype.getTypeName()); return L;}

EnO_4BS.prototype.dispose			= function() {
	 delete this.data;
	 BrickFhem.prototype.dispose.apply(this, []);
	}

EnO_4BS.prototype.extractData		= function(data) {
	 console.log("EnO_4BS::extractData", data);
	 return {};
	}

EnO_4BS.prototype.update			= function(data) {
		 var json = this.extractData(data);
		 this.emit('update', json);
		}
		
module.exports = EnO_4BS;
