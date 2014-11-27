define( [ './Pnode.js'
	    ]
	  , function(Pnode) {
var D_EventNode	= {};

// Definition of a node for programs
var EventNode = function(parent, children) {
	 Pnode.prototype.constructor.apply(this, [parent, children]);
	 D_EventNode[this.id] = this;
	 this.event = {};
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

EventNode.prototype.serialize		= function() {
	var json = Pnode.prototype.serialize.apply(this, []);
	// Describe action here
	json.ActionNode = {};
	if(this.obj) {
		 json.ActionNode.objectId = this.obj.brickId;
		} else {json.ActionNode.objectId = '';}
	json.ActionNode.method	= this.mtd;
	json.ActionNode.params	= this.params;
	json.subType = this.subType;
	return json;
}

EventNode.prototype.unserialize	= function(json, Putils) {
	Pnode.prototype.unserialize.apply(this, [json, Putils]);
	// Describe action here
	this.subType = json.subType;
	var obj = Brick.prototype.getBrickFromId( json.ActionNode.objectId );
	if(obj) {
		var mtd = json.ActionNode.method;
		if(mtd) {
			 this.setCommand( obj
							, mtd
							, json.ActionNode.params
							);
			} else {console.error('action reference an invalid method : ', json.ActionNode.method);}
		} else {console.error('action reference an invalid object : ', json.ActionNode.objectId);}
	return this;
}

return EventNode;
});
