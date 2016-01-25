// require( "./EventNode.css"		);

var EventNodeBrickUPnP_MediaRenderer = require( "./EventNodeBrickUPnP_MediaRenderer.js" );


var EventNodePause = function(scope) {
	this.instruction	=	this.instruction	
						||	{ className		: 'EventNode'
							, subType		: 'BrickUPnP_MediaRenderer/EventNodePause'
							, eventLabel	: 'Pause'
							, eventIcon		: "/js/Presentations/UPnP/images/icon_PAUSE.png"
							, children		: []
							};
	EventNodeBrickUPnP_MediaRenderer.apply(this, [scope]);
	this.type			= EventNodePause.type;
}

EventNodePause.type = EventNodeBrickUPnP_MediaRenderer.type.slice();
EventNodePause.type.push( 'EventNodePause' );

module.exports = EventNodePause;
