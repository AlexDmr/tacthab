define	( [ './PnodePresentation.js'
		  , '../DragDrop.js'
		  ]
		, function(PnodePresentation, DragDrop) {

var ActionNodePresentation = function() {
	// console.log(this);
	PnodePresentation.prototype.constructor.apply(this, []);
	return this;
}

ActionNodePresentation.prototype = new PnodePresentation();
ActionNodePresentation.prototype.className = 'ActionNode';

ActionNodePresentation.prototype.init = function(PnodeID, parent, children) {
	PnodePresentation.prototype.init.apply(this, [parent, children]);
	this.PnodeID = PnodeID;
	return this;
}
ActionNodePresentation.prototype.serialize	= function() {
	var json = PnodePresentation.prototype.serialize.apply(this, []);
	// Describe action here
	return json;
}
ActionNodePresentation.prototype.unserialize	= function(json, PresoUtils) {
	// Describe action here
	PnodePresentation.prototype.unserialize.apply(this, [json, PresoUtils]);
	return this;
}

ActionNodePresentation.prototype.Render	= function() {
	var self = this;
	var root = PnodePresentation.prototype.Render.apply(this, []);
	root.classList.add('ActionNode');
	this.divDescription.innerHTML = 'ActionNode:' + this.PnodeID + ':->log <input type="text"></input>' ;
	return root;
}

// Return the constructor
return ActionNodePresentation;
});
