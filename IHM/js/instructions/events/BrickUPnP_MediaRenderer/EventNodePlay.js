// require( "./EventNode.css"		);

var EventNodeBrickUPnP_MediaRenderer = require( "./EventNodeBrickUPnP_MediaRenderer.js" );

var subType = "BrickUPnP_MediaRenderer/EventNodePlay";
var EventNodePlay = function(scope) {
	this.instruction	=	this.instruction	
						||	{ className		: 'EventNode'
							, subType		: subType
							, eventLabel	: 'Play'
							, eventIcon		: "/js/Presentations/UPnP/images/icon_PLAY.png"
							, children		: []
							};
	EventNodeBrickUPnP_MediaRenderer.apply(this, [scope]);
	Object.setPrototypeOf(this, EventNodePlay.prototype);
}

EventNodePlay.prototype 		= Object.create( EventNodeBrickUPnP_MediaRenderer.prototype );
EventNodePlay.prototype.type 	= EventNodeBrickUPnP_MediaRenderer.prototype.type.slice();
EventNodePlay.prototype.type.push( subType );

module.exports = EventNodePlay;
