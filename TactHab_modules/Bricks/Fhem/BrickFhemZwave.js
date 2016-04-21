var BrickFhem	= require( "./BrickFhem.js" )
  , fs			= require( "fs-extra" )
  ;

// subtypes
var subtypes = {}, mod;
var dirZWave = __dirname + "/ZWave";
var reJS	= new RegExp( '\.js$' );
fs.readdir(dirZWave, function(err, files) {
	if(err) {
		console.error( "Error reading directory /Fhem", err);
	} else {
		// console.log( "Files in /Fhem", files);
		files.forEach( function(f) {
			if( reJS.test(f) ) {
				// console.log( "Fhem require", f);
				mod = require(dirZWave + "/" + f);
				if(mod.typeName) {
					subtypes[ mod.typeName ] = mod;
				}
			}
			});
	}
});




// Define
function BrickFhemZwave(id, FhemBridge, listEntry) {
	var brick = this, proto;
	BrickFhem.apply(this, [id, FhemBridge, listEntry]);
	if(listEntry && listEntry.attributes) {
		console.log( "BrickFhemZwave", listEntry.attributes.classes);
		listEntry.attributes.classes.split(' ').forEach( function(type) {
			if( subtypes[type] ) {
				proto = subtypes[type].factory( Object.getPrototypeOf(brick) );
				Object.setPrototypeOf(brick, proto);
				
			}
		});
	}
	this.init(FhemBridge, listEntry);
	return this;
}

BrickFhemZwave.prototype 				= Object.create(BrickFhem.prototype );
BrickFhemZwave.prototype.constructor	= BrickFhemZwave;
BrickFhemZwave.prototype.getTypeName	= function() {return "BrickFhemZwave";}
BrickFhemZwave.prototype.getTypes		= function() {
	var L = BrickFhem.prototype.getTypes(); 
	L.push( BrickFhemZwave.prototype.getTypeName() ); 
	return L;
}

BrickFhemZwave.prototype.registerType(BrickFhemZwave.prototype.getTypeName(), BrickFhemZwave.prototype);

BrickFhemZwave.prototype.dispose		= function() {
	BrickFhem.prototype.dispose.apply(this, []);
}

BrickFhemZwave.prototype.init			= function(FhemBridge, listEntry) {
	BrickFhem.prototype.init.apply(this, [FhemBridge, listEntry]);
	// console.log( "BrickFhemZwave::init", this );
	return this;
}

/*BrickFhemZwave.prototype.serialize		= function() {
	var json = BrickFhem.prototype.serialize.apply(this, []);
	
	return json;
}

BrickFhemZwave.prototype.getDescription	= function() {
	var json = BrickFhem.prototype.getDescription.apply(this, []);
	return json;
}*/

BrickFhemZwave.prototype.extractData	= function(data) {
	var json = BrickFhem.prototype.extractData.apply(this, [data] );
	return 	json;
}


module.exports = BrickFhemZwave;
