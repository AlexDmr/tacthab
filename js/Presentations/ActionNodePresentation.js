define	( [ './PnodePresentation.js'
		  , '../DragDrop.js'
		  ]
		, function(PnodePresentation, DragDrop) {

var ActionNodePresentation = function() {
	// console.log(this);
	PnodePresentation.prototype.constructor.apply(this, []);
	return this;
}

ActionNodePresentation.prototype = new PnodePresentation();
ActionNodePresentation.prototype.className = 'ActionNode';

ActionNodePresentation.prototype.init = function(PnodeID, parent, children) {
	PnodePresentation.prototype.init.apply(this, [PnodeID, parent, children]);
	this.action			= { method		: ''
						  , params		: []
						  };
	this.html			= {};
	return this;
}
ActionNodePresentation.prototype.serialize	= function() {
	var json = PnodePresentation.prototype.serialize.apply(this, []);
	// Describe action here
	json.subType	= 'ActionNode';
	json.ActionNode = { method		: this.action.method
					  , params		: this.action.params
					  };
	return json;
}
ActionNodePresentation.prototype.unserialize	= function(json, PresoUtils) {
	// Describe action here
	PnodePresentation.prototype.unserialize.apply(this, [json, PresoUtils]);
	this.action.method		= json.ActionNode.method;
	this.action.params		= json.ActionNode.params;
	return this;
}

ActionNodePresentation.prototype.primitivePlug	= function(c) {
	 // console.log("Primitive plug ", this.root, " ->", c.root);
	 this.Render();
	 var P = this.html.divSelector
		, N = c.Render();
	 if(N.parentElement === null) {
		 P.innerHTML = '';
		 P.appendChild( N );
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
		 this.html.divSelector = document.createElement('span');
			this.html.divSelector.classList.add('selector');
			this.html.divSelector.innerHTML = "Drop medias here";
			this.dropZoneSelectorId = DragDrop.newDropZone( this.html.divSelector
								, { acceptedClasse	: 'SelectorNode'
								  , CSSwhenAccepted	: 'possible2drop'
								  , CSSwhenOver		: 'ready2drop'
								  , ondrop			: function(evt, draggedNode, infoObj) {
										 var Pnode = new infoObj.constructor().init	( undefined	// PnodeID
																					, undefined	// parent
																					, undefined	// children
																					, infoObj
																					);
										 self.appendChild( Pnode );
										}
								  }
								);
			this.divDescription.appendChild( this.html.divSelector );
		} 
	return root;
}

// Return the constructor
return ActionNodePresentation;
});
