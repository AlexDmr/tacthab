define	( [ './PnodePresentation.js'
		  , '../DragDrop.js'
		  ]
		, function(PnodePresentation, DragDrop) {

var WhenNodePresentation = function() {
	PnodePresentation.prototype.constructor.apply(this, []);
	this.childEvent		= null;
	this.childReaction	= null;
	return this;
}

WhenNodePresentation.prototype = new PnodePresentation();
WhenNodePresentation.prototype.className = 'WhenNode';

WhenNodePresentation.prototype.serialize	= function() {
	var json = PnodePresentation.prototype.serialize.apply(this, []);
	json.childEvent		= this.children.indexOf( this.childEvent	);
	json.childReaction	= this.children.indexOf( this.childReaction );
	return json;
}
WhenNodePresentation.prototype.unserialize	= function(json, PresoUtils) {
	this.childEvent		= json.childEvent;
	this.childReaction	= json.childReaction;
	PnodePresentation.prototype.unserialize.apply(this, [json, PresoUtils]);
	return this;
}
WhenNodePresentation.prototype.init = function(PnodeID, parent, children) {
	PnodePresentation.prototype.init.apply(this, [parent, children]);
	this.PnodeID = PnodeID;
	return this;
}

WhenNodePresentation.prototype.Render	= function() {
	var self = this;
	var root = PnodePresentation.prototype.Render.apply(this, []);
	root.classList.add('ActionNode');
	this.divDescription.innerHTML = 'WhenNode:' + this.PnodeID ;
	if(!this.divChildren) {
		 this.divChildren = document.createElement('div');
			root.appendChild( this.divChildren );
			this.divChildren.classList.add('children');
		 // Event part
		 this.divEvent		= document.createElement('div');
		 self.divEvent.innerText = 'Event here';
		 this.divChildren.appendChild(this.divEvent);
			this.dropZoneEventId = DragDrop.newDropZone( self.divEvent
								, { acceptedClasse	: 'EventNode'
								  , CSSwhenAccepted	: 'possible2drop'
								  , CSSwhenOver		: 'ready2drop'
								  , ondrop			: function(evt, draggedNode, infoObj) {
										 var Pnode = new infoObj.constructor().init( '' );
										 self.childEvent = self.children.length;
										 self.divEvent.innerText = '';
										 self.appendChild( Pnode );
										 DragDrop.deleteDropZone( self.dropZoneEventId );
										}
								  }
								);
		 // Reaction part
		 this.divReaction	= document.createElement('div');
		 self.divReaction.innerText = 'Reaction here';
		 this.divChildren.appendChild(this.divReaction);
			this.dropZoneReactionId = DragDrop.newDropZone( this.divReaction
								, { acceptedClasse	: 'Pnode'
								  , CSSwhenAccepted	: 'possible2drop'
								  , CSSwhenOver		: 'ready2drop'
								  , ondrop			: function(evt, draggedNode, infoObj) {
										 var Pnode = new infoObj.constructor().init( '' );
										 self.childReaction = self.children.length;
										 self.divReaction.innerText = '';
										 self.appendChild( Pnode );
										 DragDrop.deleteDropZone( self.dropZoneReactionId );
										}
								  }
								);
		}
	return root;
}
WhenNodePresentation.prototype.deletePrimitives = function() {
	var self = this;
	PnodePresentation.prototype.deletePrimitives.apply(this, []);
	if(this.divChildren) {
		 if(this.divChildren.parentNode) {this.divChildren.parentNode.removeChild( this.divChildren );}
		 delete this.divChildren;
		 this.divChildren = this.divEvent = this.divReaction = null;
		 DragDrop.deleteDropZone( self.dropZoneEventId );
		 DragDrop.deleteDropZone( self.dropZoneReactionId );
		}
	return this;
}

WhenNodePresentation.prototype.serialize	= function() {
	var json = PnodePresentation.prototype.serialize.apply(this, []);
	json.childEvent		= this.childEvent;
	json.childReaction	= this.childReaction;
	return json;
}
WhenNodePresentation.prototype.unserialize	= function(json, PresoUtils) {
	this.childEvent    = json.childEvent	;
	this.childReaction = json.childReaction	;
	var json = PnodePresentation.prototype.unserialize.apply(this, [json, PresoUtils]);
	return json;
}

// XXX
WhenNodePresentation.prototype.removeChild = function(c) {
	if(c === this.childReaction) {this.childReaction	= null;}
	if(c === this.childEvent	) {this.childEvent		= null;}
	return PnodePresentation.prototype.removeChild.apply(this, [c]);
}
WhenNodePresentation.prototype.primitivePlug	= function(c) {
	var P, pos = this.children.indexOf(c);
	if(pos === -1) {
		 throw 'WhenNodePresentation::primitivePlug error, this is not a childthat we are trying to plug';
		 return
		}
	if(pos === this.childReaction) {P = this.divReaction; this.divReaction.innerText = ''}
	if(pos === this.childEvent	 ) {P = this.divEvent	; this.divEvent.innerText	 = '';}
	if(!P) {
		 throw 'WhenNodePresentation::primitivePlug error, children not indexed as an event or a reaction';
		 return;
		}
	var N = c.Render();
	if(N.parentElement === null) {P.appendChild(N);}
}

// Return the constructor
return WhenNodePresentation;
});
