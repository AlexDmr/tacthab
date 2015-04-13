define( [ './Pevent.js'
		, '../webServer/webServer.js'
		, '../../js/operators.js'
	    ]
	  , function(Pevent, webServer, op) {
		  
// Deal with socket subscription
// var D_events = {};
function registerSocketIO_CB  (topic, CB) {
	webServer.registerSocketIO_CB  (topic, CB);
}

function unregisterSocketIO_CB(topic, CB) {
	// console.log("unregisterSocketIO_CB", topic, CB);
	webServer.unregisterSocketIO_CB(topic, CB);
}
		 
var PeventFromSocketIO = function() {
	 Pevent.prototype.constructor.apply(this, []);
	 return this;
	}

// API for starting, stopping the instruction
PeventFromSocketIO.prototype = new Pevent();
PeventFromSocketIO.prototype.className	= 'PeventFromSocketIO';
PeventFromSocketIO.prototype.appendClass(PeventFromSocketIO);

PeventFromSocketIO.prototype.init		= function(parent, children) {
	var self = this;
	Pevent.prototype.init.apply(this, [parent, children]);
	this.event = {topic:'', filters:[]};
	this.triggerEventCB = function(data) {
		 // Apply filters
		 var filters = self.event.filters
		   , filter;
		 for(var i=0; i<filters.length; i++) {
			 filter = filters[i];
			 if( typeof data[ filter.attribute ] === 'undefined') {console.log("skipping socketIO event cause attribute", filter.attribute, "is not present");
																   return;}
			 if( !op[filter.operator]( data[ filter.attribute ]
									 , filter.value
									 ) 
			   ) { console.log("Skipping socketIO event cause it is not true that", filter.attribute, filter.operator, filter.value, "as", filter.attribute, "equal", data[ filter.attribute ]);
				   return;}
			}
		  self.triggerEvent({event: self.event.topic, descr: data});
		 }
	return this;
}

PeventFromSocketIO.prototype.dispose	= function() {
	unregisterSocketIO_CB(this.event.topic, this.triggerEventCB);
	this.triggerEventCB = null;
	Pevent.prototype.dispose.apply(this, []);
	return this;
}

var classes = [];
classes.push(PeventFromSocketIO.prototype.className);
PeventFromSocketIO.prototype.getClasses	= function() {return classes;};

PeventFromSocketIO.prototype.serialize		= function() {
	var json = Pevent.prototype.serialize.apply(this, []);
	json.subType = this.subType;
	// Describe event here
	json.event = { topic	: this.event.topic
				 , filters	: this.event.filters
				 }

	return json;
}

PeventFromSocketIO.prototype.unserialize	= function(json, Putils) {
	// console.log("PeventFromSocketIO::unserialize", json);
	Pevent.prototype.unserialize.apply(this, [json, Putils]);
	this.subType = json.subType;
	// Describe event here
	if(this.event.topic && this.event.topic !== '')
		unregisterSocketIO_CB(this.event.topic, this.triggerEventCB);
	this.event.topic	= json.event.topic;
	if(this.event.topic && this.event.topic !== '')
		registerSocketIO_CB  (this.event.topic, this.triggerEventCB);
	this.event.filters = json.event.filters;
	
	return this;
}

PeventFromSocketIO.prototype.triggerEvent = function(event) {
	console.log("PeventFromSocketIO::triggerEvent", event);
	var res = Pevent.prototype.triggerEvent.apply(this, [event]);
	return res;
}

return PeventFromSocketIO;
});

