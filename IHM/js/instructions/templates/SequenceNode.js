require( "./NChildNode.css"		);
require( "./SequenceNode.css"	);
// require( "./ActionNode.css"		);

var Pnode = require( "../Pnode.js" );


var SequenceNode = function(scope) {
	Pnode.apply(this, [scope]);
	
	this.instruction	= this.instruction	|| {className: 'SequenceNode', children: []};

	var pipo = {pipo: true, className: "ActionNode", label: "Sequence", type: ['Pnode', 'ActionNode']};
	if(this.instruction.children.length === 0) {
		this.instruction.children.push( pipo );
	}
	Object.setPrototypeOf(this, SequenceNode.prototype);
}

SequenceNode.prototype 			= Object.create( Pnode.prototype );
SequenceNode.prototype.type		= Pnode.prototype.type.slice();
SequenceNode.prototype.type.push( 'ControlFlow' 	);
SequenceNode.prototype.type.push( 'NChildNode' 		);
SequenceNode.prototype.type.push( 'SequenceNode' 	);
SequenceNode.prototype.appendChild	= function(instruction) {
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

SequenceNode.prototype.constructor = SequenceNode;
module.exports = SequenceNode;
