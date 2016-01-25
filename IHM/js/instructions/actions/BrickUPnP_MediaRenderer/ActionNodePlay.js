var ActionNodeBrickUPnP_MediaRenderer = require( "./ActionNodeBrickUPnP_MediaRenderer.js" );

var ActionNodePlay = function(scope) {
	this.instruction	=  this.instruction	
						||	{ className		: 'ActionNode'
							, subType		: 'BrickUPnP_MediaRenderer/ActionNodePlay'
							, actionLabel	: 'Play'
							, actionIcon	: "/js/Presentations/UPnP/images/icon_PLAY.png"
							, children		: []
							};
	ActionNodeBrickUPnP_MediaRenderer.apply(this, [scope]);
	this.type			= ActionNodePlay.type;
}

ActionNodePlay.type = ActionNodeBrickUPnP_MediaRenderer.type.slice();
ActionNodePlay.type.push( 'ActionNodePlay' );

module.exports = ActionNodePlay;
