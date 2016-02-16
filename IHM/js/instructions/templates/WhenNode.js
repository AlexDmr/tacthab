require( "./WhenNode.css" );

var Pnode = require( "../Pnode.js" );

/*{ childEvent	: null
, childReaction	: null
, varName		: 'brick'
, varType		: []
};*/

var WhenNode = function(scope) {
	Pnode.apply(this, [scope]);
	this.instruction	= this.instruction	|| {className: 'WhenNode', children: [], childEvent: null, childReaction: null};
	Object.setPrototypeOf(this, WhenNode.prototype);
	this.childEvent 	= this.instruction.childEvent	?[ this.instruction.childEvent 		]:[];
	this.childReaction 	= this.instruction.childReaction?[ this.instruction.childReaction 	]:[];
}

WhenNode.prototype 			= Object.create( Pnode.prototype );
WhenNode.prototype.type 	= Pnode.prototype.type.slice();
WhenNode.prototype.type.push( 'ControlFlow' );
WhenNode.prototype.type.push( 'WhenNode' 	);
WhenNode.prototype.toJSON 				= function() {
	var json = Pnode.prototype.toJSON.apply(this, [])   ;
	json.childEvent		= this.instruction.childEvent   ;
	json.childReaction	= this.instruction.childReaction;
	return json;
}
WhenNode.prototype.appendEvent			= function(instruction) {
		var ctrl = this;
		// console.log( "WhenNode append event", data );
		this.scope.$applyAsync(function() {
			ctrl.instruction.childEvent = ctrl.copyInstruction(instruction);
			if(ctrl.childEvent.length) {
				ctrl.childEvent.splice(0, 1);
			}
			ctrl.childEvent.push( ctrl.instruction.childEvent );
			// 
		});
	}
WhenNode.prototype.appendInstruction	= function(instruction) {
		var ctrl = this;
		// console.log( "WhenNode append instruction", data );
		this.scope.$applyAsync(function() {
			ctrl.childReaction.splice(0, 1);
			ctrl.instruction.childReaction = ctrl.copyInstruction(instruction);
			ctrl.childReaction.push( ctrl.instruction.childReaction );
		});
	}

WhenNode.prototype.constructor = WhenNode;
module.exports = WhenNode;