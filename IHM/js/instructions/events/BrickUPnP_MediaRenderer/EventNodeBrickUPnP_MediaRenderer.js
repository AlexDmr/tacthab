// require( "./EventNode.css"		);

var EventNode	= require( "../EventNode.js" );

var EventNodeBrickUPnP_MediaRenderer = function(scope) {
	EventNode.apply(this, [scope]);
	this.eventLabel		= this.instruction.eventLabel	|| "Event";
	this.eventIcon		= this.instruction.eventIcon	|| "/js/Presentations/UPnP/images/defaultMediaRenderer.png";
	this.type			= EventNodeBrickUPnP_MediaRenderer.type;
	this.sources		= ['BrickUPnP_MediaRenderer'];
}

EventNodeBrickUPnP_MediaRenderer.type = EventNode.type.slice();
EventNodeBrickUPnP_MediaRenderer.type.push( 'EventNodeBrickUPnP_MediaRenderer' );

module.exports = EventNodeBrickUPnP_MediaRenderer;





