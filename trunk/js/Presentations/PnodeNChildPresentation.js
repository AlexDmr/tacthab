define	( [ './PnodePresentation.js'
		  , '../DragDrop.js'
		  ]
		, function(PnodePresentation, DragDrop) {

var PnodeNChildPresentation = function() {
	// console.log(this);
	PnodePresentation.prototype.constructor.apply(this, []);
	return this;
}

PnodeNChildPresentation.prototype = new PnodePresentation();
PnodeNChildPresentation.prototype.className = 'PnodeNChildPresentation';

PnodeNChildPresentation.prototype.init = function(PnodeID, parent, children) {
	PnodePresentation.prototype.init.apply(this, [PnodeID, parent, children]);
	return this;
}

PnodeNChildPresentation.prototype.Render	= function() {
	var self = this;
	var root = PnodePresentation.prototype.Render.apply(this, []);
	root.classList.add('Pnode');
	this.divDescription.innerText = 'PnodeNChild ' + this.PnodeID + ' (presentation ' + this.uid + ')' ;
	if(!this.divChildren) {
		this.divChildren = document.createElement('div');
			root.appendChild( this.divChildren );
			this.divChildren.classList.add('children');
			this.divChildrenTxt = document.createElement('div');
			this.divChildrenTxt.innerText = 'Insert a Pnode here';
			this.divChildren.appendChild( this.divChildrenTxt );
			this.dropZoneId = DragDrop.newDropZone( this.divChildrenTxt
								, { acceptedClasse	: ['Pnode', 'instruction']
								  , CSSwhenAccepted	: 'possible2drop'
								  , CSSwhenOver		: 'ready2drop'
								  , ondrop			: function(evt, draggedNode, infoObj) {
										 var Pnode = new infoObj.constructor().init( '' );
										 self.appendChild( Pnode );
										}
								  }
								);
		}
	return root;
}

PnodeNChildPresentation.prototype.deletePrimitives = function() {
	PnodePresentation.prototype.deletePrimitives.apply(this, []);
	if(this.divChildren) {
		 DragDrop.deleteDropZone( this.dropZoneId );
		 if(this.divChildren.parentNode) {this.divChildren.parentNode.removeChild( this.divChildren );}
		 this.divChildren = this.divChildrenTxt = this.dropZoneId = null;
		}
	return this;
}

PnodeNChildPresentation.prototype.primitivePlug	= function(c) {
	 // console.log("Primitive plug ", this.root, " ->", c.root);
	 this.Render();
	 var P = this.divChildren,
		 N = c.Render();
	 if(N.parentElement === null) {P.insertBefore(N, this.divChildrenTxt);}
	return this;
}

// Return the constructor
return PnodeNChildPresentation;
});
