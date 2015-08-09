var PnodePresentation	= require( './PnodePresentation.js' )
  // , DragDrop			= require( '../DragDrop.js' )
  ;

var Program_DefinitionPresentation = function() {
	// console.log(this);
	PnodePresentation.prototype.constructor.apply(this, []);
	return this;
}

Program_DefinitionPresentation.prototype = Object.create( PnodePresentation.prototype ); // new PnodePresentation();
Program_DefinitionPresentation.prototype.constructor	= Program_DefinitionPresentation;
Program_DefinitionPresentation.prototype.className		= 'PprogramDeclaration';

Program_DefinitionPresentation.prototype.init = function(PnodeID, parent, children) {
	PnodePresentation.prototype.init.apply(this, [PnodeID, parent, children]);
	this.varDef	= { name	: ''
				  , expose	: false
				  };
	return this;
}

Program_DefinitionPresentation.prototype.serialize	= function() {
	var json = PnodePresentation.prototype.serialize.apply(this, []);
	// Describe action here
	json.subType	= 'Program_DefinitionPresentation';
	json.varDef = { name	: this.varDef.name
				  , expose	: this.varDef.expose
				  };
	if(this.varDef.id		) {json.varDef.id		 = this.varDef.id		;}
	if(this.varDef.programId) {json.varDef.programId = this.varDef.programId;}
	return json;
}

Program_DefinitionPresentation.prototype.unserialize	= function(json, PresoUtils) {
	// Describe action here
	PnodePresentation.prototype.unserialize.apply(this, [json, PresoUtils]);
	this.varDef.id			= json.varDef.id;
	this.varDef.name		= json.varDef.name;
	this.varDef.expose		= json.varDef.expose;
	this.varDef.programId	= json.varDef.programId;
	if(this.html.inputId) {
		 this.html.inputId.value = this.varDef.name;
		 this.html.editProgram.setAttribute('href', 'editor?programId=' + encodeURIComponent(this.varDef.programId) );
		 this.html.expose.checked = this.varDef.expose;
		}
	return this;
}

Program_DefinitionPresentation.prototype.updateType = function() {}

Program_DefinitionPresentation.prototype.Render	= function() {
	var self = this;
	var root = PnodePresentation.prototype.Render.apply(this, []);
	root.classList.add('DefinitionNode');
	if(typeof this.html.inputId === 'undefined') {
		 this.html.expose = document.createElement('input');
			this.html.expose.setAttribute('type', 'checkbox');
			this.html.expose.checked = self.varDef.expose;
			this.html.expose.onchange = function() {self.varDef.expose = this.checked; console.log(self.varDef.expose);};
			this.divDescription.appendChild( this.html.expose );
		 this.html.labelId = document.createElement('span');
			this.html.labelId.classList.add( 'varId' );
			this.html.labelId.innerHTML = "Define sub-program ";
			this.divDescription.appendChild( this.html.labelId );
		 this.html.inputId = document.createElement('input');
			this.html.inputId.classList.add( 'varId' );
			this.html.inputId.innerHTML = "ACTION";
			this.html.inputId.onkeyup = function() {self.varDef.name = self.html.inputId.value;};
			this.divDescription.appendChild( this.html.inputId );
		 // Link
		 this.html.editProgram = document.createElement('a');
			this.html.editProgram.setAttribute('href', 'editor?programId=' + encodeURIComponent(this.varDef.programId) );
			this.html.editProgram.setAttribute('target', "_blank");
			this.html.editProgram.innerHTML = " edit ";
			this.divDescription.appendChild( this.html.editProgram );
		} 
	return root;
}

// Return the constructor
module.exports = Program_DefinitionPresentation;

