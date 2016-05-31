var typeName = "SWITCH_BINARY";

function factory(prototype) {
	var SWITCH_BINARY = Object.create( prototype );

	SWITCH_BINARY.getTypeName		= function() {return typeName;}
	SWITCH_BINARY.getTypes			= function() {
		var L = prototype.getTypes(); 
		L.push( SWITCH_BINARY.getTypeName() ); 
		return L;
	}
	SWITCH_BINARY.init				= function(FhemBridge, listEntry) {
		prototype.init.apply(this, [FhemBridge, listEntry]);
		this.fhem.SWITCH_BINARY = listEntry.readings.reportedState.value;
		this.logEvents( "SWITCH_BINARY"	);
		return this;
	}
	SWITCH_BINARY.extractData		= function(data) {
		var json = prototype.extractData.apply(this, [data] );
		if(data.changed.reportedState) {
			this.fhem.SWITCH_BINARY = json.SWITCH_BINARY = data.changed.reportedState;
			this.log("SWITCH_BINARY", json.SWITCH_BINARY, json.lastUpdate);
		}
		return 	json;
	}
	return SWITCH_BINARY;
}

module.exports = {
	factory		: factory,
	typeName 	: typeName
};
