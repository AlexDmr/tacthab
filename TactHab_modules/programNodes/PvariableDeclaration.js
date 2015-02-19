define( [ './Pnode.js'
	    ]
	  , function(Pnode) {
var varIdCounter = 0;
function getVarId() {return 'V_' + (varIdCounter++);}

// console.log('Pnode is a ', Pnode);
// Definition of a node for programs
var PvariableDeclaration = function(parent, children) {
	 Pnode.prototype.constructor.apply(this, [parent, children]);
	 this.varDef  = { id	: undefined
					, name	: ''
					, type	: []
					};
	 return this;
}

// API for starting, stopping the instruction
PvariableDeclaration.prototype = new Pnode();
PvariableDeclaration.prototype.className	= 'PvariableDeclaration';
Pnode.prototype.appendClass( PvariableDeclaration );

var classes = Pnode.prototype.getClasses().slice();
classes.push(PvariableDeclaration.prototype.className);
PvariableDeclaration.prototype.getClasses	= function() {return classes;};

PvariableDeclaration.prototype.getDescription = function() {
	return	{ type	: this.updateType()
			, id	: this.varDef.id
			, name	: this.varDef.name
			};
}

PvariableDeclaration.prototype.Start = function() {
	var res = Pnode.prototype.Start.apply(this, []);
	this.updateType();
	if(this.children.length === 1) {
		 this.children[0].Start();
		} else {this.Stop();}
	return res;
}

PvariableDeclaration.prototype.childStateChanged = function(child, prevState, newState) {
	if(child === this.children[0]) {
		 if(newState === 0){this.Stop();}
		} else {error('PvariableDeclaration::childStateChanged : a child state changed but this was not the expected child !');}
}

PvariableDeclaration.prototype.getSelectorId = function() {return this.varDef.id}

PvariableDeclaration.prototype.updateType = function() {
	if(this.children.length === 1) {
		 this.children[0].updateType();
		 this.varDef.type = this.children[0].updateType().slice();
		} else {this.varDef.type = [];}
	return this.varDef.type;
}

PvariableDeclaration.prototype.evalSelector	= function() {
	if(this.children.length === 1) {
		 return this.children[0].evalSelector();
		} else {return [];}
}

PvariableDeclaration.prototype.serialize	= function() {
	var json =	Pnode.prototype.serialize.apply(this, []);
	json.varDef = this.getDescription();
	return json;
}
PvariableDeclaration.prototype.unserialize	= function(json, Putils) {
	Pnode.prototype.unserialize.apply(this, [json, Putils]);
	// className and id are fixed by the constructor of the object itself
	 this.varDef  = { type	: this.updateType()
					, name	: json.varDef.name
					};
	if(json.varDef.id) {
		 this.varDef.id	= json.varDef.id;
		} else {this.varDef.id = getVarId();}
	return this;
} 


return PvariableDeclaration;
});
