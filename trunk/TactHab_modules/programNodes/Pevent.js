define( [ './Pnode.js'
	    ]
	  , function(Pnode) {
var D_EventNode	= {};

// Definition of a node for programs
var EventNode = function(parent, children) {
	 Pnode.prototype.constructor.apply(this, [parent, children]);
	 D_EventNode[this.id] = this;
	 return this;
	}

// API for starting, stopping the instruction
EventNode.prototype = new Pnode();
EventNode.prototype.className	= 'EventNode';
Pnode.prototype.appendClass(EventNode);

var classes = [];//Pnode.prototype.getClasses();
classes.push(EventNode.prototype.className);
EventNode.prototype.getClasses	= function() {return classes;};

EventNode.prototype.triggerEvent = function(event) {
	if(this.parent && this.state) {
		 this.parent.eventFromChild(this, event);
		 return true;
		}
	return false;
}
EventNode.prototype.eventFromChild = function(child, event) {
	console.log(this.className + "::eventFromChild(", child, " ,", event, ")");
}

return EventNode;
});
