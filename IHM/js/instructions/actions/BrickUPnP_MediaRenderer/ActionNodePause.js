var ActionNodeBrickUPnP_MediaRenderer = require( "./ActionNodeBrickUPnP_MediaRenderer.js" );

var ActionNodePause = function(scope) {
	this.instruction	=	this.instruction	
						||	{ className		: 'ActionNode'
							, subType		: 'BrickUPnP_MediaRenderer/ActionNodePause'
							, actionLabel	: 'Pause'
							, actionIcon	: "/js/Presentations/UPnP/images/icon_PAUSE.png"
							, children		: []
							};

	ActionNodeBrickUPnP_MediaRenderer.apply(this, [scope]);
	this.type			= ActionNodePause.type;
}

ActionNodePause.type = ActionNodeBrickUPnP_MediaRenderer.type.slice();
ActionNodePause.type.push( 'ActionNodePause' );

module.exports = ActionNodePause;
