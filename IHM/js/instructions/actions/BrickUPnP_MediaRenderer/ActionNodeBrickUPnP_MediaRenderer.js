var ActionNode = require( "../ActionNode.js" );

var ActionNodeBrickUPnP_MediaRenderer = function(scope) {
	ActionNode.apply(this, [scope]);
	this.actionLabel	= this.instruction.actionLabel	|| "Action";
	this.actionIcon		= this.instruction.actionIcon	|| "/js/Presentations/UPnP/images/defaultMediaRenderer.png";
	this.sources		= ['BrickUPnP_MediaRenderer'];
	Object.setPrototypeOf(this, ActionNodeBrickUPnP_MediaRenderer.prototype);
}

ActionNodeBrickUPnP_MediaRenderer.prototype 		= Object.create( ActionNode.prototype );
ActionNodeBrickUPnP_MediaRenderer.prototype.type 	= ActionNode.prototype.type.slice();
ActionNodeBrickUPnP_MediaRenderer.prototype.type.push( 'ActionNodeBrickUPnP_MediaRenderer' );

ActionNodeBrickUPnP_MediaRenderer.prototype.constructor	= ActionNodeBrickUPnP_MediaRenderer;
module.exports = ActionNodeBrickUPnP_MediaRenderer;
