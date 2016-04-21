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
		this.fhem.SWITCH_BINARY = listEntry.readings.state.value;
		return this;
	}
	SWITCH_BINARY.extractData		= function(data) {
		var json = prototype.extractData.apply(this, [data] );
		switch(data.changed.STATE) {
			case "on"	: 
			case "off"	: 
				this.fhem.SWITCH_BINARY = json.SWITCH_BINARY = data.changed.STATE;
			break;
		}
		return 	json;
	}

	return SWITCH_BINARY;
}

module.exports = {
	factory		: factory,
	typeName 	: typeName
};
