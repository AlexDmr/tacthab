require( "./NChildNode.css"		);
require( "./SequenceNode.css"	);
// require( "./ActionNode.css"		);

var Pnode = require( "../Pnode.js" );


var SequenceNode = function(scope) {
	Pnode.apply(this, [scope]);
	
	this.instruction	= this.instruction	|| {className: 'SequenceNode', children: []};
	this.type			= SequenceNode.type;

	var pipo = {className: "ActionNode", label: "Sequence"};
	if(this.instruction.children.length === 0) {
		this.instruction.children.push( pipo );
	}
	this.appendChild	= function(data) {
		console.log( "SequenceNode append child", data );
		this.instruction.children.push( data.draggedData );
	}
}

SequenceNode.type = ['Pnode', 'ControlFlow', 'NChildNode', 'SequenceNode'];

module.exports = SequenceNode;
