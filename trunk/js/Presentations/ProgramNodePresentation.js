define	( [ './PnodeNChildPresentation.js'
		  , '../DragDrop.js'
		  ]
		, function(PnodeNChildPresentation, DragDrop) {

var ProgramNodePresentation = function() {
	// console.log(this);
	PnodeNChildPresentation.prototype.constructor.apply(this, []);
	return this;
}

ProgramNodePresentation.prototype = new PnodeNChildPresentation();
ProgramNodePresentation.prototype.className = 'ProgramNode';

ProgramNodePresentation.prototype.init = function(PnodeID, parent, children) {
	PnodeNChildPresentation.prototype.init.apply(this, [parent, children]);
	this.PnodeID = PnodeID;
	return this;
}

ProgramNodePresentation.prototype.Render	= function() {
	var self = this;
	var root = PnodeNChildPresentation.prototype.Render.apply(this, []);
	root.classList.add('ProgramNode')
	this.divDescription.innerText = 'ProgramNode ' + this.PnodeID + ' (presentation ' + this.uid + ')' ;
	return root;
}

// Return the constructor
return ProgramNodePresentation;
});
