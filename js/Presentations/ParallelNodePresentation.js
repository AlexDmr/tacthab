define	( [ './PnodeNChildPresentation.js'
		  ]
		, function(PnodeNChildPresentation) {

var ParallelNodePresentation = function() {
	PnodeNChildPresentation.prototype.constructor.apply(this, []);
	return this;
}

ParallelNodePresentation.prototype = new PnodeNChildPresentation();
ParallelNodePresentation.prototype.className = 'ParallelNode';

ParallelNodePresentation.prototype.init = function(PnodeID, parent, children) {
	PnodeNChildPresentation.prototype.init.apply(this, [PnodeID, parent, children]);
	return this;
}

ParallelNodePresentation.prototype.Render	= function() {
	var self = this;
	var root = PnodeNChildPresentation.prototype.Render.apply(this, []);
	root.classList.add('ParallelNode')
	this.divDescription.innerText = 'ParallelNode ' + this.PnodeID + ' (presentation ' + this.uid + ')' ;
	return root;
}

// Return the constructor
return ParallelNodePresentation;
});
