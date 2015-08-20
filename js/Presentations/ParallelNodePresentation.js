var PnodeNChildPresentation = require( './PnodeNChildPresentation.js' );

var ParallelNodePresentation = function() {
	PnodeNChildPresentation.prototype.constructor.apply(this, []);
	return this;
}

ParallelNodePresentation.prototype = Object.create( PnodeNChildPresentation.prototype ); // new PnodeNChildPresentation();
ParallelNodePresentation.prototype.constructor	= ParallelNodePresentation;
ParallelNodePresentation.prototype.className	= 'ParallelNode';

ParallelNodePresentation.prototype.init = function(PnodeID, parent, children) {
	PnodeNChildPresentation.prototype.init.apply(this, [PnodeID, parent, children]);
	return this;
}

ParallelNodePresentation.prototype.serialize = function() {
	 var json = PnodeNChildPresentation.prototype.serialize.apply(this, []);
	 json.subType = 'ParallelNodePresentation';
	 return json;
	}
ParallelNodePresentation.prototype.Render	= function() {
	// var self = this;
	var root = PnodeNChildPresentation.prototype.Render.apply(this, []);
	root.classList.add('ParallelNode');
	root.classList.add('ParallelNodePresentation');
	// this.divDescription.innerText = 'ParallelNode ' + this.PnodeID + ' (presentation ' + this.uid + ')' ;
	return root;
}

// Return the constructor
module.exports = ParallelNodePresentation;

