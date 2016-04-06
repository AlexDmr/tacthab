require( "./ActionNode.css"		);
var Pnode = require( "../Pnode.js" );

var ActionNode = function(scope) {
	Pnode.apply(this, [scope]);
	
	this.instruction	= this.instruction				|| {children: [], className: "ActionNode"};
	this.actionLabel	= this.instruction.actionLabel	|| "Action";
	this.actionIcon		= this.instruction.actionIcon	|| "/js/Presentations/HTML_templates/action-icon.png";
	this.selNode		= this.instruction.selector;
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
ActionNode.prototype.appendSelector	= function(obj) {
	console.log( this, "ActionNode::appendSelector", obj );
	if( this.selNode ) { // Thee is already a selector, have to combine !
		// obj.type.indexOf( '' )
	} else { // There is no selector yet
		if( obj.selector ) { // The dropped object is a selector, just reference it
			this.selNode = obj;
		} else { // The dropped object is a brick, add a brick selector
			this.selNode =	{ className : 'Pselector_ObjInstance'
							, selector	: { name		: obj.name
										  , type 		: obj.type
										  , objectId	: obj.id
										  , defaultDescr: obj
										  }
							}
		}
	}
}

module.exports = ActionNode;
