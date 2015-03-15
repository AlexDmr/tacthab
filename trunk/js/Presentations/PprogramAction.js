define	( [ './PnodePresentation.js'
		  , './ActionNodePresentation.js'
		  , '../DragDrop.js'
		  ]
		, function(PnodePresentation, ActionNodePresentation, DragDrop) {

function PprogramAction() {
	ActionNodePresentation.apply(this, []);
	return this;
}

PprogramAction.prototype = new PprogramAction();
PprogramAction.prototype.className = 'ActionNode';

PprogramAction.prototype.serialize	= function() {
	var json = PnodePresentation.prototype.serialize.apply(this, []);
	// Describe action here
	json.subType	= 'ActionNode';
	json.ActionNode = { method		: this.action.method
					  , params		: this.action.params
					  };
	return json;
}
PprogramAction.prototype.unserialize	= function(json, PresoUtils) {
	// Describe action here
	PnodePresentation.prototype.unserialize.apply(this, [json, PresoUtils]);
	this.action.method		= json.ActionNode.method;
	this.action.params		= json.ActionNode.params;
	return this;
}

PprogramAction.prototype.Render	= function() {

}

return PprogramAction;
}