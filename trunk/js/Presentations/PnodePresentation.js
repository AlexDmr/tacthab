define	( [ './protoPresentation.js'
		  , '../DragDrop.js'
		  ]
		, function(protoPresentation, DragDrop) {
var L_Pnodes = {};

var PnodePresentation = function() {
	// console.log(this);
	protoPresentation.prototype.constructor.apply(this, []);
	this.state	= null;
	this.html	= {};
	return this;
}

PnodePresentation.prototype = new protoPresentation();
PnodePresentation.prototype.className = 'PnodePresentation';

PnodePresentation.prototype.init = function(PnodeID, parent, children) {
	protoPresentation.prototype.init.apply(this, [parent, children]);
	this.PnodeID = PnodeID;
	if(this.PnodeID) L_Pnodes[this.PnodeID] = this;
	return this;
}
PnodePresentation.prototype.getPnode = function(id) {
	return L_Pnodes[id];
}

PnodePresentation.prototype.serialize	= function() {
	// JSON format
	var json = { className	: this.className
			   , PnodeID	: this.PnodeID
			   , children	: []
			   }
	for(var i=0; i<this.children.length; i++) {
		 json.children.push( this.children[i].serialize() );
		}
	return json;
}
PnodePresentation.prototype.unserialize	= function(json, PresoUtils) {
	this.PnodeID = json.PnodeID;
	if(this.PnodeID) L_Pnodes[this.PnodeID] = this;
	this.Render();
	for(var i in json.children) {
		 this.appendChild( PresoUtils.unserialize(json.children[i]), PresoUtils );
		}
	return this;
}

PnodePresentation.prototype.setState	= function(prev, next) {
	if(this.root) {
		 this.state = next;
		 this.root.classList.remove(prev);
		 this.root.classList.add   (next);
		}
}
PnodePresentation.prototype.Render		= function() {
	var self = this;
	var root = protoPresentation.prototype.Render.apply(this, []);
	root.classList.add('Pnode');
	if(this.state) {root.classList.add(this.state);}
	if(!this.divDescription) {
		 this.divDescription = document.createElement('div');
			root.appendChild( this.divDescription );
			this.divDescription.classList.add('description');
		}
	return root;
}

PnodePresentation.prototype.deletePrimitives = function() {
	protoPresentation.prototype.deletePrimitives.apply(this, []);
	if(this.divDescription) {
		 if(this.divDescription.parentNode) {this.divDescription.parentNode.removeChild( this.divDescription );}
		 delete this.divDescription;
		 this.divDescription = null;
		}
	return this;
}

// Return the constructor
return PnodePresentation;
});
