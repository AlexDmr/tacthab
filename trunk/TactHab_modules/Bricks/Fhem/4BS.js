define( [ './BrickFhem.js'
		]
	  , function(BrickFhem) {
// Define
function EnO_4BS(FhemBridge, listEntry) {
	BrickFhem.apply(this, [FhemBridge, listEntry]);
	this.types.push( 'EnO_4BS' );
	this.data = [];
	return this;
}

EnO_4BS.prototype = new BrickFhem();
	EnO_4BS.prototype.unreference();
EnO_4BS.prototype.constructor		= EnO_4BS;
EnO_4BS.prototype.getTypeName		= function() {return "EnO_4BS";}

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
		
return EnO_4BS;
});
