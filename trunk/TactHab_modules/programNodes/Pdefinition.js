define( [ './Pnode.js'
		, './sequence.js'
	    ]
	  , function(Pnode, SequenceNode) {
// console.log('Pnode is a ', Pnode);
// Definition of a node for programs
var DefinitionNode = function(parent, children) {
	 SequenceNode.prototype.constructor.apply(this, [parent, children]);
	 return this;
	}

// API for starting, stopping the instruction
DefinitionNode.prototype = new SequenceNode();
DefinitionNode.prototype.className	= 'DefinitionNode';
Pnode.prototype.appendClass(DefinitionNode);

var classes = SequenceNode.prototype.getClasses().slice();
classes.push(DefinitionNode.prototype.className);
DefinitionNode.prototype.getClasses	= function() {return classes;};

return DefinitionNode;
});
