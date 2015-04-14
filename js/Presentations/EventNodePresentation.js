define	( [ './PnodePresentation.js'
		  , '../DragDrop.js'
		  , '../utils.js'
		  ]
		, function(PnodePresentation, DragDrop, utils) {
// Desfining EventNodePresentation
var EventNodePresentation = function() {
	PnodePresentation.prototype.constructor.apply(this, []);
	return this;
}

EventNodePresentation.prototype = new PnodePresentation();
EventNodePresentation.prototype.className = 'EventNode';

EventNodePresentation.prototype.init = function(PnodeID, parent, children) {
	PnodePresentation.prototype.init.apply(this, [PnodeID, parent, children]);
	return this;
}

EventNodePresentation.prototype.serialize = function() {
	var json = PnodePresentation.prototype.serialize.apply(this, []);
	json.subType = 'EventNodePresentation';
	if(this.implicitVariableId) {json.implicitVariableId = this.implicitVariableId;}
	return json;
}

EventNodePresentation.prototype.unserialize	= function(json, PresoUtils) {
	// var self = this;
	PnodePresentation.prototype.unserialize.apply(this, [json, PresoUtils]);
	if(json.implicitVariableId) {this.implicitVariableId = json.implicitVariableId;}
	return this;
}

EventNodePresentation.prototype.Render	= function() {
	var self = this;
	var root = PnodePresentation.prototype.Render.apply(this, []);
	root.classList.add('EventNode');
	root.classList.remove('Pnode');
	if(typeof this.html.bt === 'undefined') {
		this.divDescription.innerHTML = ''; //'EventNode:' + this.PnodeID ;
		this.html.bt = document.createElement('button');
			this.html.bt.addEventListener	( 'click'
								, function() {
									 console.log('trigger', self);
									 utils.io.emit( 'call', { objectId	: self.PnodeID
															, method	: 'triggerEvent'
															, params	: JSON.stringify([])
															} );
									}
								, false );
			this.html.bt.innerText = 'TRIGGER';
			this.divDescription.appendChild( this.html.bt );
		}
	return root;
}

// Return the constructor
return EventNodePresentation;
});
