require( "./NChildNode.css"		);
require( "./ParallelNode.css"	);
// require( "./ActionNode.css"		);

var Pnode = require( "../Pnode.js" );


var ParallelNode = function(scope) {
	Pnode.apply(this, [scope]);
	
	this.instruction	= this.instruction	|| {className: 'ParallelNode', children: []};
	this.type = ParallelNode.type;
	
	var pipo = {className: "ActionNode", label: "Parallel"};
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