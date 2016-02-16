// require( "./EventNode.css"		);

var EventNodeBrickUPnP_MediaRenderer = require( "./EventNodeBrickUPnP_MediaRenderer.js" );


var subType = "BrickUPnP_MediaRenderer/EventNodeStop";
var EventNodeStop = function(scope) {
	this.instruction	=	this.instruction	
						||	{ className		: 'EventNode'
							, subType		: subType
							, eventLabel	: 'Stop'
							, eventIcon		: "/js/Presentations/UPnP/images/icon_STOP.png"
							, children		: []
							};
	EventNodeBrickUPnP_MediaRenderer.apply(this, [scope]);
	Object.setPrototypeOf(this, EventNodeStop.prototype);
}

EventNodeStop.prototype 		= Object.create( EventNodeBrickUPnP_MediaRenderer.prototype );
EventNodeStop.prototype.type	= EventNodeBrickUPnP_MediaRenderer.prototype.type.slice();
EventNodeStop.prototype.type.push( subType );

module.exports = EventNodeStop;
