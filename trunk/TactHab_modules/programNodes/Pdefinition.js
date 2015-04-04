define( [ './Pnode.js'
		, './sequence.js'
	    ]
	  , function(Pnode, SequenceNode) {
// console.log('Pnode is a ', Pnode);
// Definition of a node for programs
var DefinitionNode = function() {
	SequenceNode.prototype.constructor.apply(this, []);
	return this;
}

// API for starting, stopping the instruction
DefinitionNode.prototype = new SequenceNode();
DefinitionNode.prototype.className	= 'DefinitionNode';
Pnode.prototype.appendClass(DefinitionNode);

var classes = SequenceNode.prototype.getClasses().slice();
classes.push(DefinitionNode.prototype.className);
DefinitionNode.prototype.getClasses	= function() {return classes;};

DefinitionNode.prototype.init			= function(parent, children) {
	SequenceNode.prototype.init.apply(this, [parent, children]);
	this.variableId = 0;
	return this;
}

DefinitionNode.prototype.getVariableId	= function(prefix) {
	var program = this.parent, i;
	while(program && program.className !== 'ProgramNode') {program = program.parent;}
	if(!program) {console.error('!!!!!!!!!! => THERE IS NO PROGRAM ANCESTOR FOR DefinitionNode:', this.id);}
	
	// retrieve exising names
	var Dico = {};
	for(i=0; i<this.children.length; i++) {
		 if(this.children[i].varDef && this.children[i].varDef.id) {
			  Dico[ this.children[i].varDef.id ] = this.children[i];
			 }
		}	
	// genrate a new one
	prefix = prefix || "V_";
	var name;
	i = 0;
	do	{name = program.id + ':' + prefix + (i++);
		} while(Dico[name]);
	// return name
	return name;
}

return DefinitionNode;
});
