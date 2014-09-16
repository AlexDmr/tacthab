define( [ './parallel.js'
		, './Pcall.js'
		, './Pnode.js'
	    ]
	  , function(ParalleNode, Pcall, Pnode) {
// Definition of a node for programs
var ProgramNode = function(parent, children) {
	 ParalleNode.prototype.constructor.apply(this, [parent, children]);
	 return this;
	}

// API for starting, stopping the instruction
ProgramNode.prototype = new ParalleNode();
ProgramNode.prototype.className	= 'ProgramNode';
Pnode.prototype.appendClass(ProgramNode);

var classes = ParalleNode.prototype.getClasses().slice();
classes.push(ProgramNode.prototype.className);
ProgramNode.prototype.getClasses	= function() {return classes;};

ProgramNode.prototype.call = function(call) {
	// Filter call
	
	// Propagate an action call if it is not forbidden
	// console.log('ProgramNode::call', call);
	if(this.parent) {
		 return this.parent.call(call);
		} else {call.execute();}
}

return ProgramNode;
});