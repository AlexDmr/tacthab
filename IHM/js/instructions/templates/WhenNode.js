require( "./WhenNode.css" );

var Pnode = require( "../Pnode.js" );

/*{ childEvent	: null
, childReaction	: null
, varName		: 'brick'
, varType		: []
};*/

var WhenNode = function(scope) {
	var ctrl = this;
	Pnode.apply(this, [scope]);

	this.type = WhenNode.type;
	this.instruction	= this.instruction	|| {className: 'WhenNode', children: []};
	
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
	this.toJSON	= this.toJSON_WhenNode = function() {
		var json = this.toJSON_Pnode();
		json.childEvent		= this.instruction.childEvent;
		json.childReaction	= this.instruction.childReaction;
		return json;
	}
}

WhenNode.type = ['Pnode', 'ControlFlow', 'WhenNode'];

module.exports = WhenNode;