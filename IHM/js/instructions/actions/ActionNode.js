require( "./ActionNode.css"		);
var Pnode = require( "../Pnode.js" );

var ActionNode = function(scope) {
	Pnode.apply(this, [scope]);
	
	this.instruction	= this.instruction				|| {children: [], className: "ActionNode"};
	this.actionLabel	= this.instruction.actionLabel	|| "Action";
	this.actionIcon		= this.instruction.actionIcon	|| "/js/Presentations/HTML_templates/event-icon.png";
	this.type			= ActionNode.type;
	this.sources		= ['Brick'];

	this.toJSON	= this.toJSON_ActionNode = function() {
		var json = this.toJSON_Pnode();
		json.actionLabel	= this.instruction.actionLabel;
		json.actionIcon 	= this.instruction.actionIcon;
		return json;
	}
}

ActionNode.type = ['Pnode', 'ActionNode'];

module.exports = ActionNode;
