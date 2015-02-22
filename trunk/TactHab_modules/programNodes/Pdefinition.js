define( [ './Pnode.js'
		, './sequence.js'
	    ]
	  , function(Pnode, SequenceNode) {
// console.log('Pnode is a ', Pnode);
// Definition of a node for programs
var DefinitionNode = function(parent, children) {
	 SequenceNode.prototype.constructor.apply(this, [parent, children]);
	 this.variableId = 0;
	 return this;
	}

// API for starting, stopping the instruction
DefinitionNode.prototype = new SequenceNode();
DefinitionNode.prototype.className	= 'DefinitionNode';
Pnode.prototype.appendClass(DefinitionNode);

var classes = SequenceNode.prototype.getClasses().slice();
classes.push(DefinitionNode.prototype.className);
DefinitionNode.prototype.getClasses	= function() {return classes;};

DefinitionNode.prototype.getVariableId = function() {
	// retrieve exising names
	var Dico = {};
	for(var i=0; i<this.children.length; i++) {
		 if(this.children[i].varDef && this.children[i].varDef.id) {
			  Dico[ this.children[i].varDef.id ] = this.children[i];
			 }
		}	
	// genrate a new one
	var prefix = "V_", name, i=0;
	do	{name = prefix + (i++);
		} while(Dico[name]);
	// return name
	return name;
}

return DefinitionNode;
});
