define	( [ './PnodePresentation.js'
		  , '../DragDrop.js'
		  ]
		, function(PnodePresentation, DragDrop) {

var Var_DefinitionPresentation = function() {
	// console.log(this);
	PnodePresentation.prototype.constructor.apply(this, []);
	this.varDef			= { id	: null
						  , val	: null
						  };
	this.html			= {};
	return this;
}

Var_DefinitionPresentation.prototype = new PnodePresentation();
Var_DefinitionPresentation.prototype.className = 'PvariableDeclaration';

Var_DefinitionPresentation.prototype.init = function(PnodeID, parent, children) {
	PnodePresentation.prototype.init.apply(this, [parent, children]);
	this.PnodeID = PnodeID;
	return this;
}
Var_DefinitionPresentation.prototype.serialize	= function() {
	var json = PnodePresentation.prototype.serialize.apply(this, []);
	// Describe action here
	json.subType	= 'Var_DefinitionPresentation';
	json.varDef = { id	: this.varDef.id
				  , val	: this.varDef.val
				  };
	return json;
}
Var_DefinitionPresentation.prototype.unserialize	= function(json, PresoUtils) {
	// Describe action here
	PnodePresentation.prototype.unserialize.apply(this, [json, PresoUtils]);
	this.varDef.id	= json.varDef.id;
	this.varDef.val	= json.varDef.val;
	if(this.html.inputId) {
		 this.html.inputId.value = this.varDef.id;
		}
	return this;
}

Var_DefinitionPresentation.prototype.primitivePlug	= function(c) {
	 // console.log("Primitive plug ", this.root, " ->", c.root);
	 this.Render();
	 var P = this.html.selector,
		 N = c.Render();
	 if(N.parentElement === null) {
			 P.innerHTML = '';
			 P.appendChild( N );
			}
	return this;
}

Var_DefinitionPresentation.prototype.Render	= function() {
	var self = this;
	var root = PnodePresentation.prototype.Render.apply(this, []);
	root.classList.add('DefinitionNode');
	if(typeof this.html.inputId === 'undefined') {
		 this.html.labelId = document.createElement('span');
			this.html.labelId.classList.add( 'varId' );
			this.html.labelId.innerHTML = "Define variable ";
			this.divDescription.appendChild( this.html.labelId );
		 this.html.inputId = document.createElement('input');
			this.html.inputId.classList.add( 'varId' );
			this.html.inputId.innerHTML = "ACTION";
			this.html.inputId.onkeyup = function() {self.varDef.id = self.html.inputId.value;};
			this.divDescription.appendChild( this.html.inputId );
		 this.html.as = document.createElement('span');
			this.html.as.classList.add('as');
			this.html.as.innerHTML = " as ";
			this.divDescription.appendChild( this.html.as );
		 // Drop zone for selector
		 this.html.selector = document.createElement('div');
			this.html.selector.classList.add('selector');
			this.html.selector.innerHTML = "Insert Selector here";
			this.divDescription.appendChild( this.html.selector );
			this.dropZoneSelectorId = DragDrop.newDropZone( this.html.selector
								, { acceptedClasse	: 'SelectorNode'
								  , CSSwhenAccepted	: 'possible2drop'
								  , CSSwhenOver		: 'ready2drop'
								  , ondrop			: function(evt, draggedNode, infoObj) {
										 var Pnode = new infoObj.constructor(infoObj).init( '' );
										 self.appendChild( Pnode );
										}
								  }
								);
		} 
	return root;
}

// Return the constructor
return Var_DefinitionPresentation;
});
