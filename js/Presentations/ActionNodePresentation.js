define	( [ './PnodePresentation.js'
		  , '../DragDrop.js'
		  ]
		, function(PnodePresentation, DragDrop) {

var ActionNodePresentation = function() {
	// console.log(this);
	PnodePresentation.prototype.constructor.apply(this, []);
	this.action			= {};
	this.action.objectId= '';
	this.action.method	= '';
	this.action.params	= [];
	this.html			= {};
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
	json.subType	= 'ActionNode';
	json.ActionNode = { objectId	: this.action.objectId
					  , method		: this.action.method
					  , params		: this.action.params
					  };
	return json;
}
ActionNodePresentation.prototype.unserialize	= function(json, PresoUtils) {
	// Describe action here
	PnodePresentation.prototype.unserialize.apply(this, [json, PresoUtils]);
	this.action.objectId	= json.ActionNode.objectId;
	this.action.method		= json.ActionNode.method;
	this.action.params		= json.ActionNode.params;
	if(this.html.select) {
		 this.html.select.value = this.action.objectId;
		}
	return this;
}

ActionNodePresentation.prototype.Render	= function() {
	var self = this;
	var root = PnodePresentation.prototype.Render.apply(this, []);
	root.classList.add('ActionNode');
	if(typeof this.html.actionName === 'undefined') {
		 this.html.actionName = document.createElement('span');
			this.html.actionName.classList.add( 'actionName' );
			this.html.actionName.innerHTML = "ACTION";
			this.divDescription.appendChild( this.html.actionName );
		 this.html.select = document.createElement('select');
			this.html.select.classList.add('objectId');
			this.html.select.onchange = function() {self.action.objectId = parseInt(this.value); console.log(this.value);}
			this.divDescription.appendChild( this.html.select );
		} 
	return root;
}

// Return the constructor
return ActionNodePresentation;
});
