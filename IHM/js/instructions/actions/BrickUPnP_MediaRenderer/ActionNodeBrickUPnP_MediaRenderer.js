var ActionNode = require( "../ActionNode.js" );

var ActionNodeBrickUPnP_MediaRenderer = function(scope) {
	ActionNode.apply(this, [scope]);
	this.actionLabel	= this.instruction.actionLabel	|| "Action";
	this.actionIcon		= this.instruction.actionIcon	|| "/js/Presentations/UPnP/images/defaultMediaRenderer.png";
	this.type			= ActionNodeBrickUPnP_MediaRenderer.type;
	this.sources		= ['BrickUPnP_MediaRenderer'];
}

ActionNodeBrickUPnP_MediaRenderer.type = ActionNode.type.slice();
ActionNodeBrickUPnP_MediaRenderer.type.push( 'ActionNodeBrickUPnP_MediaRenderer' );

module.exports = ActionNodeBrickUPnP_MediaRenderer;
