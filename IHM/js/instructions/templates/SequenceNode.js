require( "./NChildNode.css"		);
require( "./SequenceNode.css"	);
// require( "./ActionNode.css"		);

var SequenceNode = function(scope) {
	this.type = SequenceNode.type;

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
