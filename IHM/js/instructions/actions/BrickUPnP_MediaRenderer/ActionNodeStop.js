var ActionNodeBrickUPnP_MediaRenderer = require( "./ActionNodeBrickUPnP_MediaRenderer.js" );

var ActionNodeStop = function(scope) {
	this.instruction	=  this.instruction	
						||	{ className		: 'ActionNode'
							, subType		: 'BrickUPnP_MediaRenderer/ActionNodeStop'
							, actionLabel	: 'Stop'
							, actionIcon	: "/js/Presentations/UPnP/images/icon_STOP.png"
							, children		: []
							};
	ActionNodeBrickUPnP_MediaRenderer.apply(this, [scope]);
	Object.setPrototypeOf(this, ActionNodeStop.prototype);
}

ActionNodeStop.prototype		= Object.create( ActionNodeBrickUPnP_MediaRenderer.prototype );
ActionNodeStop.prototype.type	= ActionNodeBrickUPnP_MediaRenderer.prototype.type.slice();
ActionNodeStop.prototype.type.push( 'ActionNodeStop' );

ActionNodeStop.prototype.constructor = ActionNodeStop;
module.exports = ActionNodeStop;
