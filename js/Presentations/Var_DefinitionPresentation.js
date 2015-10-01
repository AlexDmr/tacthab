var PnodePresentation	= require( './PnodePresentation.js' )
  , DragDrop			= require( '../DragDrop.js' )
  ;

// linking CSS
require( "./HTML_templates/Var_DefinitionPresentation.css" );
// var css = document.createElement('link');
	// css.setAttribute('rel' , 'stylesheet');
	// css.setAttribute('href', 'css/Var_DefinitionPresentation.css');
	// document.body.appendChild(css);
		
// Defining Var_DefinitionPresentation
var Var_DefinitionPresentation = function() {
	// console.log(this);
	PnodePresentation.prototype.constructor.apply(this, []);
	return this;
}

Var_DefinitionPresentation.prototype = Object.create( PnodePresentation.prototype ); // new PnodePresentation();
Var_DefinitionPresentation.prototype.constructor	= Var_DefinitionPresentation;
Var_DefinitionPresentation.prototype.className		= 'PvariableDeclaration';

Var_DefinitionPresentation.prototype.init = function(PnodeID, parent, children) {
	PnodePresentation.prototype.init.apply(this, [PnodeID, parent, children]);
	this.varDef			= { name	: ''
						  , expose	: false
						  };
	return this;
}
Var_DefinitionPresentation.prototype.serialize	= function() {
	var json = PnodePresentation.prototype.serialize.apply(this, []);
	// Describe action here
	json.subType	= 'Var_DefinitionPresentation';
	json.varDef = { name	: this.varDef.name
				  , expose	: this.varDef.expose
				  };
	if(this.varDef.id) {json.varDef.id = this.varDef.id;}
	return json;
}
Var_DefinitionPresentation.prototype.unserialize	= function(json, PresoUtils) {
	// Describe action here
	PnodePresentation.prototype.unserialize.apply(this, [json, PresoUtils]);
	this.varDef.id		= json.varDef.id;
	this.varDef.name	= json.varDef.name;
	this.varDef.expose	= json.varDef.expose;
	if(this.html.inputId) {
		 this.html.inputId.value	= this.varDef.name;
		 this.html.expose.checked	= this.varDef.expose;
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

Var_DefinitionPresentation.prototype.updateType = function() {}

Var_DefinitionPresentation.prototype.Render	= function() {
	var self = this;
	var root = PnodePresentation.prototype.Render.apply(this, []);
	root.classList.add('DefinitionNode');
	if(typeof this.html.inputId === 'undefined') {
		 this.html.expose = document.createElement('input');
			this.html.expose.setAttribute('type', 'checkbox');
			this.html.expose.checked = self.varDef.expose;
			this.html.expose.onchange = function() {self.varDef.expose = this.checked; console.log(self.varDef.expose);};
			this.divDescription.appendChild( this.html.expose );
			// console.error("XXX Var_DefinitionPresentation::Render must implement checkbox changes");
		 this.html.labelId = document.createElement('span');
			this.html.labelId.classList.add( 'varId' );
			this.html.labelId.innerHTML = "Define variable ";
			this.divDescription.appendChild( this.html.labelId );
		 this.html.inputId = document.createElement('input');
			this.html.inputId.classList.add( 'varId' );
			this.html.inputId.innerHTML = "ACTION";
			this.html.inputId.onkeyup = function() {self.varDef.name = self.html.inputId.value;};
			this.divDescription.appendChild( this.html.inputId );
		 this.html.as = document.createElement('span');
			this.html.as.classList.add('as');
			this.html.as.innerHTML = " as ";
			this.divDescription.appendChild( this.html.as );
		 // Drop zone for selector
		 this.html.selector = document.createElement('span');
			this.html.selector.classList.add('selector');
			this.html.selector.innerHTML = "Insert Selector here";
			this.divDescription.appendChild( this.html.selector );
			this.dropZoneSelectorId = DragDrop.newDropZone( this.html.selector
								, { acceptedClasse	: [['SelectorNode'], ['EventNode']]
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
		} 
	return root;
}

// Return the constructor
module.exports = Var_DefinitionPresentation;

