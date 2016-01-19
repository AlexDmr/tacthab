require( "./NChildNode.css"		);
require( "./ParallelNode.css"	);
// require( "./ActionNode.css"		);

var ParallelNode = function(scope) {
	this.type = ParallelNode.type;
	
	var pipo = {className: "ActionNode", label: "Parrallel"};
	if(this.instruction.children.length === 0) {
		this.instruction.children.push( pipo );
	}
	this.appendChild	= function(data) {
		console.log( "ParrallelNode append child", data );
		this.instruction.children.push( data.draggedData );
	}
}

ParallelNode.type = ['Pnode', 'ControlFlow', 'NChildNode', 'ParallelNode'];

module.exports = ParallelNode;