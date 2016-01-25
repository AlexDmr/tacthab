require( "./ActionNode.css"		);

var Pnode = require( "../Pnode.js" );

var ActionNode = function(scope) {
	Pnode.apply(this, [scope]);

	this.instruction		= this.instruction	|| {className: 'ActionNode', children: []};
	this.instruction.label	= this.instruction.label || "Action";
	this.type				= ActionNode.type;
}

ActionNode.type = ['Pnode', 'ActionNode'];

module.exports = ActionNode;
