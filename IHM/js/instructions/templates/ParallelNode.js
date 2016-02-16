require( "./NChildNode.css"		);
require( "./ParallelNode.css"	);
// require( "./ActionNode.css"		);

var Pnode = require( "../Pnode.js" );


var ParallelNode = function(scope) {
	Pnode.apply(this, [scope]);
	
	this.instruction	= this.instruction	|| {className: 'ParallelNode', children: []};
	
	var pipo = {pipo: true, className: "ActionNode", label: "Parallel", type: ['Pnode', 'ActionNode']};
	if(this.instruction.children.length === 0) {
		this.instruction.children.push( pipo );
	}
	Object.setPrototypeOf(this, ParallelNode.prototype);
}

ParallelNode.prototype				= Object.create( Pnode.prototype );
ParallelNode.prototype.type			= Pnode.prototype.type.slice();
ParallelNode.prototype.type.push( 'ControlFlow' 	);
ParallelNode.prototype.type.push( 'NChildNode' 		);
ParallelNode.prototype.type.push( 'ParallelNode' 	);
ParallelNode.prototype.appendChild	= function(instruction) {
	// console.log( "ParrallelNode append child", instruction );
	var ctrl = this;
	if(ctrl.instruction.children[0] && ctrl.instruction.children[0].pipo) {
		ctrl.instruction.children.splice(0,1);
		this.scope.$apply();
	}
	this.scope.$applyAsync(function() {
		ctrl.instruction.children.push( ctrl.copyInstruction(instruction) );
	});
}

ParallelNode.prototype.constructor = ParallelNode;
module.exports = ParallelNode;