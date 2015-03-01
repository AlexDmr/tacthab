define( [ './Pnode.js'
		, './Pselector.js'
		, './PvariableDeclaration.js'
	    ]
	  , function(Pnode, Pselector, PvariableDeclaration) {
// console.log('Pnode is a ', Pnode);
// Definition of a node for programs
var Pselector_variable = function(parent, children) {
	 Pnode.prototype.constructor.apply(this, [parent, children]);
	 this.selector = {};
	 return this;
	}

// API for starting, stopping the instruction
Pselector_variable.prototype = new Pselector();
Pselector_variable.prototype.className	= 'Pselector_variable';
Pnode.prototype.appendClass( Pselector_variable );

var classes = Pselector.prototype.getClasses().slice();
classes.push(Pselector_variable.prototype.className);
Pselector_variable.prototype.getClasses	= function() {return classes;};

Pselector_variable.prototype.getVariableDeclaration	= function() {
	var context = this.getContext();
	return context.variables[ this.selector.variableId ];
}

Pselector_variable.prototype.evalSelector	= function() {
	Pselector.prototype.evalSelector.apply(this, []);
	// Get reference to the variable declaration
	var variableDeclaration = this.getVariableDeclaration();
	if(variableDeclaration) {
		 return variableDeclaration.evalSelector();
		} else {return [];}
}

Pselector_variable.prototype.updateType = function() {
	Pselector.prototype.updateType.apply(this, []);
	// XXX Get type from object if it exists
	if(typeof this.selector.variableId !== 'undefined') {
		 var variableDeclaration = this.getVariableDeclaration();
		 if(variableDeclaration) this.selector.type = variableDeclaration.updateType();
		}
	return this.selector.type;
}

Pselector_variable.prototype.serialize	= function() {
	var json =	Pselector.prototype.serialize.apply(this, []);
	json.selector.variableId	= this.selector.variableId;
	return json;
}

Pselector_variable.prototype.unserialize	= function(json, Putils) {
	// console.log("Pselector_variable::unserialize", json);
	Pselector.prototype.unserialize.apply(this, [json, Putils]);
	// className and id are fixed by the constructor of the object itself
	this.selector.variableId = json.selector.variableId;
	return this;
}

return Pselector_variable;
});
