define	( [ './PnodePresentation.js'
		  , '../DragDrop.js'
		  ]
		, function(PnodePresentation, DragDrop) {

var WhenNodePresentation = function() {
	PnodePresentation.prototype.constructor.apply(this, []);
	this.when = { childEvent	: null
				, childReaction	: null
				};
	return this;
}

WhenNodePresentation.prototype = new PnodePresentation();
WhenNodePresentation.prototype.className = 'WhenNode';

WhenNodePresentation.prototype.serialize	= function() {
	var json = PnodePresentation.prototype.serialize.apply(this, []);
	json.when = {};
	if(this.when.childEvent   ) {json.when.childEvent		= this.when.childEvent.serialize   ();}
	if(this.when.childReaction) {json.when.childReaction	= this.when.childReaction.serialize();}
	json.subType		= 'WhenNodePresentation';
	return json;
}
WhenNodePresentation.prototype.unserialize	= function(json, PresoUtils) {
	PnodePresentation.prototype.unserialize.apply(this, [json, PresoUtils]);
	if(json.when.childEvent   ) {this.when.childEvent		= PresoUtils.unserialize(json.when.childEvent   ); this.appendChild(this.when.childEvent	 );}
	if(json.when.childReaction) {this.when.childReaction	= PresoUtils.unserialize(json.when.childReaction); this.appendChild(this.when.childReaction);}
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
		 self.divEvent.innerText = ' Drop event here ';
		 this.divChildren.appendChild(this.divEvent);
			this.dropZoneEventId = DragDrop.newDropZone( self.divEvent
								, { acceptedClasse	: 'EventNode'
								  , CSSwhenAccepted	: 'possible2drop'
								  , CSSwhenOver		: 'ready2drop'
								  , ondrop			: function(evt, draggedNode, infoObj) {
										 self.when.childEvent = new infoObj.constructor(infoObj).init( '' );
										 self.divEvent.innerText = '';
										 self.appendChild(  self.when.childEvent );
										 // DragDrop.deleteDropZone( self.dropZoneEventId );
										}
								  }
								);
		 // Reaction part
		 this.divReaction	= document.createElement('div');
		 self.divReaction.innerText = 'Reaction here';
		 this.divChildren.appendChild(this.divReaction);
			this.dropZoneReactionId = DragDrop.newDropZone( this.divReaction
								, { acceptedClasse	: [['Pnode', 'instruction']]
								  , CSSwhenAccepted	: 'possible2drop'
								  , CSSwhenOver		: 'ready2drop'
								  , ondrop			: function(evt, draggedNode, infoObj) {
										 self.when.childReaction = new infoObj.constructor(infoObj).init( '' );
										 self.divReaction.innerText = '';
										 self.appendChild( self.when.childReaction );
										 // DragDrop.deleteDropZone( self.dropZoneReactionId );
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
		 DragDrop.deleteDropZone( self.dropZoneEventId    );
		 DragDrop.deleteDropZone( self.dropZoneReactionId );
		}
	return this;
}

WhenNodePresentation.prototype.primitivePlug	= function(c) {
	if(c && c === this.when.childEvent   ) {this.divEvent.innerText	  = '';
										    this.divEvent.appendChild( c.Render() );
										   }
	if(c && c === this.when.childReaction) {this.divReaction.innerText = '';
										    this.divReaction.appendChild( c.Render() );
										   }
}

// Return the constructor
return WhenNodePresentation;
});
