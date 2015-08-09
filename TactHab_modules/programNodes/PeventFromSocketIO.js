var Pevent		= require( './Pevent.js' )
  , webServer	= require( '../webServer/webServer.js' )
  , op			= require( '../../js/operators.js' )
  ;
		  
// Deal with socket subscription
// var D_events = {};
function registerSocketIO_CB  (topic, re, CB) {
	webServer.registerSocketIO_CB  (topic, re, CB);
}

function unregisterSocketIO_CB(topic, re, CB) {
	webServer.unregisterSocketIO_CB(topic, re, CB);
}
		 
var PeventFromSocketIO = function() {
	Pevent.prototype.constructor.apply(this, []);
	return this;
}

// API for starting, stopping the instruction
PeventFromSocketIO.prototype = Object.create( Pevent.prototype ); //new Pevent();
PeventFromSocketIO.prototype.constructor	= PeventFromSocketIO;
PeventFromSocketIO.prototype.className		= 'PeventFromSocketIO';
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
	unregisterSocketIO_CB(this.event.topic, this.event.isRegExp, this.triggerEventCB);
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
				 , isRegExp	: this.event.isRegExp
				 }

	return json;
}

PeventFromSocketIO.prototype.unserialize	= function(json, Putils) {
	// console.log("PeventFromSocketIO::unserialize", json);
	Pevent.prototype.unserialize.apply(this, [json, Putils]);
	this.subType = json.subType;
	// Describe event here
	if(this.event.topic && this.event.topic !== '') {
		 unregisterSocketIO_CB(this.event.topic, this.event.isRegExp, this.triggerEventCB);
		}
	this.event.topic	= json.event.topic;
	this.event.isRegExp	= json.event.isRegExp;
	if(this.event.topic && this.event.topic !== '') {
		 registerSocketIO_CB  (this.event.topic, this.event.isRegExp, this.triggerEventCB);
		}
	this.event.filters = json.event.filters;
	
	return this;
}

PeventFromSocketIO.prototype.triggerEvent = function(event) {
	console.log("PeventFromSocketIO::triggerEvent", event);
	var res = Pevent.prototype.triggerEvent.apply(this, [event]);
	return res;
}

module.exports = PeventFromSocketIO;


