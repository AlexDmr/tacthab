// require( "./EventNode.css"		);

var EventNodeBrickUPnP_MediaRenderer = require( "./EventNodeBrickUPnP_MediaRenderer.js" );

var subType = "BrickUPnP_MediaRenderer/EventNodePause";
var EventNodePause = function(scope) {
	this.instruction	=	this.instruction	
						||	{ className		: 'EventNode'
							, subType		: subType
							, eventLabel	: 'Pause'
							, eventIcon		: "/js/Presentations/UPnP/images/icon_PAUSE.png"
							, children		: []
							};
	EventNodeBrickUPnP_MediaRenderer.apply(this, [scope]);
	Object.setPrototypeOf(this, EventNodePause.prototype);
}

EventNodePause.prototype 		= Object.create( EventNodeBrickUPnP_MediaRenderer.prototype );
EventNodePause.prototype.type 	= EventNodeBrickUPnP_MediaRenderer.prototype.type.slice();
EventNodePause.prototype.type.push( subType );

module.exports = EventNodePause;
