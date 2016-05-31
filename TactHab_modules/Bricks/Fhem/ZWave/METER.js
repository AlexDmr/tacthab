var typeName = "METER";

function factory(prototype) {
	var METER = Object.create( prototype );

	METER.getTypeName		= function() {return typeName;}
	METER.getTypes			= function() {
		var L = prototype.getTypes(); 
		L.push( METER.getTypeName() ); 
		return L;
	}
	METER.init				= function(FhemBridge, listEntry) {
		prototype.init.apply(this, [FhemBridge, listEntry]);
		this.logEvents( "power"	);
		if( listEntry.readings.power ) {
			this.fhem.power = parseInt( listEntry.readings.power.value );
		}
		return this;
	}
	METER.extractData		= function(data) {
		var json = prototype.extractData.apply(this, [data] );
		if(data.changed.power) {
			this.fhem.power = json.power = parseInt( data.changed.power );
			this.log("power", json.power, json.lastUpdate);
		}
		return 	json;
	}

	return METER;
}

module.exports = {
	factory		: factory,
	typeName 	: typeName
};
