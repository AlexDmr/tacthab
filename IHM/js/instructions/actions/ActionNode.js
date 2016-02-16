require( "./ActionNode.css"		);
var Pnode = require( "../Pnode.js" );

var ActionNode = function(scope) {
	Pnode.apply(this, [scope]);
	
	this.instruction	= this.instruction				|| {children: [], className: "ActionNode"};
	this.actionLabel	= this.instruction.actionLabel	|| "Action";
	this.actionIcon		= this.instruction.actionIcon	|| "/js/Presentations/HTML_templates/action-icon.png";
	this.sources		= ['Brick'];
	Object.setPrototypeOf(this, ActionNode.prototype);
}

ActionNode.prototype 				= Object.create( Pnode.prototype );
ActionNode.prototype.constructor 	= ActionNode;
ActionNode.prototype.type 			= Pnode.prototype.type.slice();
ActionNode.prototype.type.push( 'ActionNode' );
ActionNode.prototype.toJSON 		= function() {
	var json = Pnode.prototype.toJSON.apply(this, []);
	json.actionLabel	= this.instruction.actionLabel;
	json.actionIcon 	= this.instruction.actionIcon;
	return json;
}

ActionNode.prototype.constructor = ActionNode;
module.exports = ActionNode;
