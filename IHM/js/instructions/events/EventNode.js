require( "./EventNode.css"		);
var Pnode = require( "../Pnode.js" );

var EventNode = function(scope) {
	var ctrl = this;
	Pnode.apply(this, [scope]);

	this.instruction	= this.instruction				|| {children: [], className: "EventNode"};
	this.eventLabel		= this.instruction.eventLabel	|| "Event";
	this.eventIcon		= this.instruction.eventIcon	|| "/js/Presentations/HTML_templates/event-icon.png";
	this.type			= EventNode.type;
	this.sources		= ['Brick'];

	this.toJSON	= this.toJSON_EventNode = function() {
		var json = this.toJSON_Pnode();
		json.eventLabel	= this.instruction.eventLabel;
		json.eventIcon 		= this.instruction.eventIcon;
		return json;
	}

	this.appendEvent	= function(data) {
		console.log( "appendEvent", data );
		scope.$applyAsync(function() {
			ctrl.instruction.children.push( data.draggedData );
		});
	}
}

EventNode.type = ['Pnode', 'EventNode'];

module.exports = EventNode;
