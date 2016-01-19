require( "./ActionNode.css"		);

var ActionNode = function(scope) {
	this.instruction.label	= this.instruction.label || "Action";
	this.type				= ActionNode.type;
}

ActionNode.type = ['Pnode', 'ActionNode'];

module.exports = ActionNode;
