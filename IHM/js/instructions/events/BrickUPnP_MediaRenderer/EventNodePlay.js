// require( "./EventNode.css"		);

var EventNodeBrickUPnP_MediaRenderer = require( "./EventNodeBrickUPnP_MediaRenderer.js" );


var EventNodePlay = function(scope) {
	this.instruction	=	this.instruction	
						||	{ className		: 'EventNode'
							, subType		: 'BrickUPnP_MediaRenderer/EventNodePlay'
							, eventLabel	: 'Play'
							, eventIcon		: "/js/Presentations/UPnP/images/icon_PLAY.png"
							, children		: []
							};
	EventNodeBrickUPnP_MediaRenderer.apply(this, [scope]);
	this.type			= EventNodePlay.type;
}

EventNodePlay.type = EventNodeBrickUPnP_MediaRenderer.type.slice();
EventNodePlay.type.push( 'EventNodePlay' );

module.exports = EventNodePlay;
