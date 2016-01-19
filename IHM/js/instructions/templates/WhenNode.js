require( "./WhenNode.css" );

/*{ childEvent	: null
, childReaction	: null
, varName		: 'brick'
, varType		: []
};*/

var WhenNode = function(scope) {
	var ctrl = this;
	this.type = WhenNode.type;
	
	this.appendEvent		= function(data) {
		console.log( "WhenNode append event", data );
		scope.$applyAsync(function() {
			ctrl.instruction.childEvent		= data.draggedData;
		});
	}
	this.appendInstruction	= function(data) {
		console.log( "WhenNode append instruction", data );
		scope.$applyAsync(function() {
			ctrl.instruction.childReaction	= data.draggedData;		
		});
	}
}

WhenNode.type = ['Pnode', 'ControlFlow', 'WhenNode'];

module.exports = WhenNode;