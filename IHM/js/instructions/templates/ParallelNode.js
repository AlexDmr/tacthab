require( "./NChildNode.css"		);
require( "./ParallelNode.css"	);
// require( "./ActionNode.css"		);

module.exports = function(scope) {
	/*var pipoChild = {className: 'pipoNode', children: []};
	this.instruction.children.push( pipoChild );*/
	this.appendChild	= function(data) {
		console.log( "Append child", data );
	}
}
