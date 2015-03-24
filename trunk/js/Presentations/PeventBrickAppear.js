define	( [ './EventNodePresentation.js'
		  , '../DragDrop.js'
		  , '../utils.js'
		  ]
		, function(EventNodePresentation, DragDrop, utils) {

var PeventBrickPresentation = function() {
	EventNodePresentation.prototype.constructor.apply(this, []);
	this.event = {};
	return this;
}

PeventBrickPresentation.prototype = new EventNodePresentation();
PeventBrickPresentation.prototype.className = 'PeventBrick';

PeventBrickPresentation.prototype.serialize = function() {
	 var json = EventNodePresentation.prototype.serialize.apply(this, []);
	 json.subType = 'PeventBrickPresentation';
	 json.eventNode  = 	{ targets	: ['ProtoBrick']
						, parameters: this.event.parameters
						, eventName	: this.event.eventName
						}
	 return json;
	}

PeventBrickPresentation.prototype.unserialize	= function(json, PresoUtils) {
	// Describe action here
	PnodePresentation.prototype.unserialize.apply(this, [json, PresoUtils]);
	this.event.parameters	= json.eventNode.parameters;
	this.event.eventName	= json.eventNode.eventName;
	return this;
}

PeventBrickPresentation.prototype.Render	= function() {
	var self = this;
	var root = EventNodePresentation.prototype.Render.apply(this, []);
	root.classList.add('PeventBrickPresentation');
	if(typeof this.html.actionName === 'undefined') {
		 this.html.actionName = document.createElement('span');
			this.html.actionName.classList.add( 'targetObjectId' );
			this.html.actionName.innerHTML = "Object : ";
			this.divDescription.appendChild( this.html.actionName );
		 this.html.selectTargetObjectId = document.createElement('select');
			this.html.selectTargetObjectId.classList.add('targetObjectId');
			this.html.selectTargetObjectId.onchange = function() {self.action.objectId = parseInt(this.value); console.log(this.value);}
			this.divDescription.appendChild( this.html.selectTargetObjectId );
		 this.html.eventName = document.createElement('span');
			this.html.eventName.classList.add( 'eventName' );
			this.html.eventName.innerHTML = " on event : ";
			this.divDescription.appendChild( this.html.eventName );
		 this.html.selectEvent = document.createElement('select');
			this.html.selectEvent.classList.add('selectEvent');
			this.html.selectEvent.onchange = function() {self.action.objectId = parseInt(this.value); console.log(this.value);}
			this.divDescription.appendChild( this.html.selectEvent );
		} 
	
	return root;
}

// Return the constructor
return PeventBrickPresentation;
});
