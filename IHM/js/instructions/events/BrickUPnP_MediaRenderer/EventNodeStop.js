// require( "./EventNode.css"		);

var EventNodeBrickUPnP_MediaRenderer = require( "./EventNodeBrickUPnP_MediaRenderer.js" );


var EventNodeStop = function(scope) {
	this.instruction	=	this.instruction	
						||	{ className		: 'EventNode'
							, subType		: 'BrickUPnP_MediaRenderer/EventNodeStop'
							, eventLabel	: 'Stop'
							, eventIcon		: "/js/Presentations/UPnP/images/icon_STOP.png"
							, children		: []
							};
	EventNodeBrickUPnP_MediaRenderer.apply(this, [scope]);
	this.type			= EventNodeStop.type;
	console.log( "EventNodeStop", this);
}

EventNodeStop.type = EventNodeBrickUPnP_MediaRenderer.type.slice();
EventNodeStop.type.push( 'EventNodeStop' );

module.exports = EventNodeStop;
