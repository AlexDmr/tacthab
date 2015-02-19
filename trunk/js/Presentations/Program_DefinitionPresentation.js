define	( [ './PnodePresentation.js'
		  , '../DragDrop.js'
		  ]
		, function(PnodePresentation, DragDrop) {

var Program_DefinitionPresentation = function() {
	// console.log(this);
	PnodePresentation.prototype.constructor.apply(this, []);
	this.programDef		= { name	: ''
						  };
	this.html			= {};
	return this;
}

Program_DefinitionPresentation.prototype = new PnodePresentation();
Program_DefinitionPresentation.prototype.className = 'PprogramDeclaration';

Program_DefinitionPresentation.prototype.init = function(PnodeID, parent, children) {
	PnodePresentation.prototype.init.apply(this, [parent, children]);
	this.PnodeID = PnodeID;
	return this;
}

Program_DefinitionPresentation.prototype.serialize	= function() {
	var json = PnodePresentation.prototype.serialize.apply(this, []);
	// Describe action here
	json.subType	= 'Program_DefinitionPresentation';
	json.programDef = { name	: this.programDef.name };
	if(this.programDef.id) {json.programDef.id = this.programDef.id;}
	return json;
}

Program_DefinitionPresentation.prototype.unserialize	= function(json, PresoUtils) {
	// Describe action here
	PnodePresentation.prototype.unserialize.apply(this, [json, PresoUtils]);
	this.programDef.id	= json.programDef.id;
	this.programDef.name= json.programDef.name;
	if(this.html.inputId) {
		 this.html.inputId.value = this.programDef.name;
		 this.html.editProgram.setAttribute('href', 'editor?programId=' + encodeURIComponent(this.programDef.id) );
		}
	return this;
}

Program_DefinitionPresentation.prototype.updateType = function() {}

Program_DefinitionPresentation.prototype.Render	= function() {
	var self = this;
	var root = PnodePresentation.prototype.Render.apply(this, []);
	root.classList.add('DefinitionNode');
	if(typeof this.html.inputId === 'undefined') {
		 this.html.labelId = document.createElement('span');
			this.html.labelId.classList.add( 'varId' );
			this.html.labelId.innerHTML = "Define sub-program ";
			this.divDescription.appendChild( this.html.labelId );
		 this.html.inputId = document.createElement('input');
			this.html.inputId.classList.add( 'varId' );
			this.html.inputId.innerHTML = "ACTION";
			this.html.inputId.onkeyup = function() {self.programDef.name = self.html.inputId.value;};
			this.divDescription.appendChild( this.html.inputId );
		 // Link
		 this.html.editProgram = document.createElement('a');
			this.html.editProgram.setAttribute('href', 'editor?programId=' + encodeURIComponent(this.programDef.id) );
			this.html.editProgram.setAttribute('target', "_blank");
			this.html.editProgram.innerHTML = " edit ";
			this.divDescription.appendChild( this.html.editProgram );
		} 
	return root;
}

// Return the constructor
return Program_DefinitionPresentation;
});
