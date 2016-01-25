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
	this.type			= ActionNodeStop.type;
}

ActionNodeStop.type = ActionNodeBrickUPnP_MediaRenderer.type.slice();
ActionNodeStop.type.push( 'ActionNodeStop' );

module.exports = ActionNodeStop;
