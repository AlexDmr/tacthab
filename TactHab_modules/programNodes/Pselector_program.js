var Pnode		= require( './Pnode.js' )
  , Pselector	= require( './Pselector.js' )
  // , ProgramNode	= require( './program.js' )
  ;

// Definition of a node for Pselector_program
var Pselector_program = function() {
	 Pnode.prototype.constructor.apply(this, []);
	 return this;
	}

// API for starting, stopping the instruction
Pselector_program.prototype = Object.create( Pselector.prototype ); //new Pselector();
Pselector_program.prototype.constructor = Pselector_program;
Pselector_program.prototype.className	= 'Pselector_program';
Pnode.prototype.appendClass( Pselector_program );

var classes = Pselector.prototype.getClasses().slice();
classes.push(Pselector_program.prototype.className);
Pselector_program.prototype.getClasses	= function() {return classes;};

Pselector_program.prototype.init		= function(parent, children) {
	Pselector.prototype.init.apply(this, [parent, children]);
	this.selector = {};
	return this;
}

Pselector_program.prototype.getProgramDeclaration	= function() {
	var context = this.getContext();
	return context.variables[ this.selector.progDefId ];
}

Pselector_program.prototype.evalSelector	= function() {
	Pselector.prototype.evalSelector.apply(this, []);
	// Get reference to the variable declaration
	var programDeclaration = this.getProgramDeclaration();
	if(programDeclaration) {
		 return programDeclaration.evalSelector();
		} else {console.error("\tThere is no program declaration for", this.selector.progDefId);
				return [];
			   }
}

Pselector_program.prototype.updateType = function() {
	Pselector.prototype.updateType.apply(this, []);
	// XXX Get type from object if it exists
	if(typeof this.selector.progDefId !== 'undefined') {
		 var programDeclaration = this.getProgramDeclaration();
		 if(programDeclaration) {this.selector.type = programDeclaration.updateType();}
		}
	return this.selector.type;
}

Pselector_program.prototype.serialize	= function() {
	var context = this.getContext();
	var json	=	Pselector.prototype.serialize.apply(this, []);
	var progDef	= context.variables[ this.selector.progDefId  ];
	json.selector.progDefId	= this.selector.progDefId;
	if(progDef) {json.selector.name	= progDef.getName();}
	return json;
}

Pselector_program.prototype.unserialize	= function(json, Putils) {
	// console.log("Pselector_program::unserialize", json);
	Pselector.prototype.unserialize.apply(this, [json, Putils]);
	// className and id are fixed by the constructor of the object itself
	this.selector.progDefId = json.selector.progDefId;
	return this;
}

module.exports = Pselector_program;
