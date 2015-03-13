define( [ './Pevent.js'
		, '../webServer/webServer.js'
	    ]
	  , function(Pevent, webServer) {
		  
// Deal with socket subscription
// var D_events = {};
function registerSocketIO_CB  (topic, CB) {
	webServer.registerSocketIO_CB  (topic, CB);
}

function unregisterSocketIO_CB(topic, CB) {
	console.log("unregisterSocketIO_CB", topic, CB);
	webServer.unregisterSocketIO_CB(topic, CB);
}

// Definition of a PeventFromSocketIO
var PeventFromSocketIO = function(parent, children) {
	 var self = this;
	 Pevent.prototype.constructor.apply(this, [parent, children]);
	 this.event = {topic:''};
	 this.triggerEventCB = function(data) {self.triggerEvent({event: self.event.topic, descr: data});}

	 return this;
	}

// API for starting, stopping the instruction
PeventFromSocketIO.prototype = new Pevent();
PeventFromSocketIO.prototype.className	= 'PeventFromSocketIO';
PeventFromSocketIO.prototype.appendClass(PeventFromSocketIO);

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
				 }

	return json;
}

PeventFromSocketIO.prototype.unserialize	= function(json, Putils) {
	Pevent.prototype.unserialize.apply(this, [json, Putils]);
	this.subType = json.subType;
	// Describe event here
	if(this.event.topic && this.event.topic !== '')
		unregisterSocketIO_CB(this.event.topic, this.triggerEventCB);
	this.event.topic	= json.event.topic;
	if(this.event.topic && this.event.topic !== '')
		registerSocketIO_CB  (this.event.topic, this.triggerEventCB);
	return this;
}

PeventFromSocketIO.prototype.triggerEvent = function(event) {
	console.log("PeventFromSocketIO::triggerEvent", event);
	var res = Pevent.prototype.triggerEvent.apply(this, [event]);
	return res;
}

return PeventFromSocketIO;
});
