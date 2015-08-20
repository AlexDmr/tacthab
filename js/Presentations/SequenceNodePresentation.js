var PnodeNChildPresentation	= require( './PnodeNChildPresentation.js' );

var SequenceNodePresentation = function() {
	PnodeNChildPresentation.prototype.constructor.apply(this, []);
	return this;
}

SequenceNodePresentation.prototype = Object.create( PnodeNChildPresentation.prototype ); // new PnodeNChildPresentation();
SequenceNodePresentation.prototype.constructor	= SequenceNodePresentation;
SequenceNodePresentation.prototype.className	= 'SequenceNode';

SequenceNodePresentation.prototype.init = function(PnodeID, parent, children) {
	PnodeNChildPresentation.prototype.init.apply(this, [PnodeID, parent, children]);
	return this;
}
SequenceNodePresentation.prototype.serialize = function() {
	 var json = PnodeNChildPresentation.prototype.serialize.apply(this, []);
	 json.subType = 'SequenceNodePresentation';
	 return json;
	}
SequenceNodePresentation.prototype.Render	= function() {
	// var self = this;
	var root = PnodeNChildPresentation.prototype.Render.apply(this, []);
	root.classList.add('SequenceNode')
	// this.divDescription.innerText = 'SequenceNode ' + this.PnodeID + ' (presentation ' + this.uid + ')' ;
	return root;
}
// Return the constructor
module.exports = SequenceNodePresentation;
