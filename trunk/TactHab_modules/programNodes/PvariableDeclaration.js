define( [ './Pnode.js'
	    ]
	  , function(Pnode) {
// Definition of a node for PvariableDeclaration
var PvariableDeclaration = function(parent, children) {
	 Pnode.prototype.constructor.apply(this, [parent, children]);
	 this.varDef  = { id	: undefined
					, name	: ''
					, expose: false
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
	var descr =	{ type	: this.updateType()
				, name	: this.varDef.name
				, expose: this.varDef.expose
				};
	descr.id = this.getSelectorId();
	return descr;
}

PvariableDeclaration.prototype.Start = function() {
	var res = Pnode.prototype.Start.apply(this, []);
	this.updateType();
	this.Stop();
	/* XXX Debug
	if(this.children.length === 1) {
		 this.children[0].Start();
		} else {this.Stop();}
	*/
	return res;
}

PvariableDeclaration.prototype.childStateChanged = function(child, prevState, newState) {
	if(child === this.children[0]) {
		 if(newState === 0){this.Stop();}
		} else {error('PvariableDeclaration::childStateChanged : a child state changed but this was not the expected child !');}
}

PvariableDeclaration.prototype.getName		= function() {return this.varDef.name;}
PvariableDeclaration.prototype.isExposed	= function() {return this.varDef.expose;}

PvariableDeclaration.prototype.getSelectorId = function() {
	 this.varDef.id = this.varDef.id || this.parent.getVariableId();
	 return this.varDef.id;
	}

PvariableDeclaration.prototype.getValueNode	= function() {
	if(this.children[0]) {return this.children[0];}
	return null;
}

PvariableDeclaration.prototype.updateType	= function() {
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
					, expose: json.varDef.expose
					};
	if(json.varDef.id) {this.varDef.id	= json.varDef.id;}
	return this;
} 


return PvariableDeclaration;
});
