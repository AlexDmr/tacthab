// require( "./EventNode.css"		);

var EventNode	= require( "../EventNode.js" );

var EventNodeBrickUPnP_MediaRenderer = function(scope) {
	EventNode.apply(this, [scope]);
	this.eventLabel		= this.instruction.eventLabel	|| "Event";
	this.eventIcon		= this.instruction.eventIcon	|| "/js/Presentations/UPnP/images/defaultMediaRenderer.png";
	this.sources		= ['BrickUPnP_MediaRenderer'];
	Object.setPrototypeOf(this, EventNodeBrickUPnP_MediaRenderer.prototype);
}

EventNodeBrickUPnP_MediaRenderer.prototype 		= Object.create( EventNode.prototype );
EventNodeBrickUPnP_MediaRenderer.prototype.type = EventNode.prototype.type.slice();
EventNodeBrickUPnP_MediaRenderer.prototype.type.push( 'EventNodeBrickUPnP_MediaRenderer' );

module.exports = EventNodeBrickUPnP_MediaRenderer;





