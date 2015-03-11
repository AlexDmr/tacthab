define	( [ './EventNodePresentation.js'
		  , '../DragDrop.js'
		  , '../utils.js'
		  ]
		, function(EventNodePresentation, DragDrop, utils) {

// linking CSS
var css = document.createElement('link');
	css.setAttribute('rel' , 'stylesheet');
	css.setAttribute('href', 'js/Presentations/HTML_templates/PeventFromSocketIOPresentation.css');
	document.body.appendChild(css);
	
var htmlTemplate = 'NOT LOADED YET';
utils.XHR( 'GET', 'js/Presentations/HTML_templates/PeventFromSocketIOPresentation.html'
		 , function() {htmlTemplate = this.responseText;}
		 );
	
// Defining PeventFromSocketIOPresentation
var PeventFromSocketIOPresentation = function() {
	EventNodePresentation.prototype.constructor.apply(this, []);
	this.event = {topic: ''};
	return this;
}

PeventFromSocketIOPresentation.prototype = new EventNodePresentation();
PeventFromSocketIOPresentation.prototype.className = 'PeventFromSocketIO';

PeventFromSocketIOPresentation.prototype.serialize	= function() {
	var json = EventNodePresentation.prototype.serialize.apply(this, []);
	json.subType = 'PeventFromSocketIOPresentation';
	json.event = {topic: this.event.topic};
	return json;
}

PeventFromSocketIOPresentation.prototype.unserialize	= function(json, PresoUtils) {
	EventNodePresentation.prototype.unserialize.apply(this, [json, PresoUtils]);
	this.event = json.event;
	if(this.html.eventTopic) {this.html.eventTopic.setAttribute('value', this.event.topic);}
	return this;
}
	
PeventFromSocketIOPresentation.prototype.Render	= function() {
	var self = this;
	var root = EventNodePresentation.prototype.Render.apply(this, []);
	root.classList.add('PeventFromSocketIOPresentation');
	// Describe the event to be observed on socketIO
	this.divDescription.innerHTML = htmlTemplate;
	this.html.eventTopic	= this.divDescription.querySelector("input.receive.topic");
	this.html.eventTopic.onkeyup = function() {self.event.topic = self.html.eventTopic.value;};
	this.html.eventTopic.setAttribute('value', this.event.topic);
	
	return root;
}

// Return the constructor
return PeventFromSocketIOPresentation;
});
