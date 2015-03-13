define( [ './Pnode.js'
		, './Pselector.js'
		, './Pevent.js'
		, './PvariableDeclaration.js'
	    ]
	  , function(Pnode, Pselector, Pevent, PvariableDeclaration) {
// console.log('Pnode is a ', Pnode);
// Definition of a node for programs
var Pselector_variable = function(parent, children) {
	 var self = this;
	 Pnode.prototype.constructor.apply(this, [parent, children]);
	 this.selector = {};
	 this.CB_triggerEvent = function(event) {
		 console.log("Propagate event", event);
		 Pevent.prototype.triggerEvent.apply(self, [event]);
		}
	 return this;
	}


// API for starting, stopping the instruction
Pselector_variable.prototype = new Pselector();
Pselector_variable.prototype.className	= 'Pselector_variable';
Pnode.prototype.appendClass( Pselector_variable );

Pselector_variable.prototype.dispose		= function() {
	var valueNode = this.getValueNode();
	if(valueNode) {valueNode.off('triggerEvent', this.CB_triggerEvent);}
	return Pselector.prototype.dispose.apply(this, []);
}

// Mixing from Pevent
Pselector_variable.prototype.eventFromChild = Pevent.prototype.eventFromChild;
Pselector_variable.prototype.Start = function() {
	if(this.isTypedAs('EventNode')) {
		 console.log("bidouille Start pour variable typée EventNode");
		 //XXX XXX en fait, on a besoin de gérer des abonnements au niveau
		 // du noeud évènement.
		 // ICI : on va s'abonner au noeud 
		 // LORS DU STOP, on se désabonne du noeud qui gère l'évènement...
		 var valueNode = this.getValueNode();
		 if(valueNode) {valueNode.on ('triggerEvent', this.CB_triggerEvent);}
		 return Pevent.prototype.Start.apply(this, []);
		} else {return Pselector.prototype.Start.apply(this, []);}
}
Pselector_variable.prototype.Stop = function() {
	if(this.isTypedAs('EventNode')) {
		 console.log("bidouille Stop pour variable typée EventNode");
		 var valueNode = this.getValueNode();
		 if(valueNode) {valueNode.off('triggerEvent', this.CB_triggerEvent);}
		 return Pevent.prototype.Stop.apply(this, []);
		} else {return Pselector.prototype.Stop.apply(this, []);}
}


var classes = Pselector.prototype.getClasses().slice();
classes.push(Pselector_variable.prototype.className);
Pselector_variable.prototype.getClasses	= function() {return classes;};

Pselector_variable.prototype.getVariableDeclaration	= function() {
	var context = this.getContext();
	return context.variables[ this.selector.variableId ];
}

Pselector_variable.prototype.getValueNode	= function() {
	var variableDeclaration = this.getVariableDeclaration();
	if(variableDeclaration) {
		 return variableDeclaration.getValueNode();
		} else {return null;}
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
