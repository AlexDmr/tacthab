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
	Object.setPrototypeOf(this, ActionNodePause.prototype);
}

ActionNodePause.prototype 		= Object.create( ActionNodeBrickUPnP_MediaRenderer.prototype );
ActionNodePause.prototype.type 	= ActionNodeBrickUPnP_MediaRenderer.prototype.type.slice();
ActionNodePause.prototype.type.push( 'ActionNodePause' );

ActionNodePause.prototype.constructor = ActionNodePause;
module.exports = ActionNodePause;
