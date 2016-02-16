require( "./EventNode.css"		);
var Pnode = require( "../Pnode.js" );

var EventNode = function(scope) {
	Pnode.apply(this, [scope]);

	this.instruction	= this.instruction				|| {children: [], className: "EventNode"};
	this.eventLabel		= this.instruction.eventLabel	|| "Event";
	this.eventIcon		= this.instruction.eventIcon	|| "/js/Presentations/HTML_templates/event-icon.png";
	this.sources		= ['Brick'];
	Object.setPrototypeOf(this, EventNode.prototype);
}

EventNode.prototype 			= Object.create( Pnode.prototype );
EventNode.prototype.type 		= Pnode.prototype.type.slice();
EventNode.prototype.type.push( 'EventNode' );
EventNode.prototype.appendEvent = function(data) {
	var ctrl = this;
	// console.log( "appendEvent", data );
	this.scope.$applyAsync(function() {
		ctrl.instruction.children.push( data.draggedData );
	});
}
EventNode.prototype.toJSON 		= function() {
	var json = Pnode.prototype.toJSON.apply(this, []);
	json.eventLabel	= this.instruction.eventLabel;
	json.eventIcon 	= this.instruction.eventIcon;
	return json;
}
module.exports = EventNode;
