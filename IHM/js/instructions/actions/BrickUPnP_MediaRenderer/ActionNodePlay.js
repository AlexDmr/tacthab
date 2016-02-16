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
	Object.setPrototypeOf(this, ActionNodePlay.prototype);
}

ActionNodePlay.prototype 		= Object.create( ActionNodeBrickUPnP_MediaRenderer.prototype );
ActionNodePlay.prototype.type 	= ActionNodeBrickUPnP_MediaRenderer.prototype.type.slice();
ActionNodePlay.prototype.type.push( 'ActionNodePlay' );

ActionNodePlay.prototype.constructor = ActionNodePlay;
module.exports = ActionNodePlay;
