define( [ './Pevent.js'
		, '../Bricks/Brick.js'
	    ]
	  , function(Pevent, Brick) {
// Definition of a PeventBrick
var PeventBrick = function(parent, children) {
	 var self = this;
	 Pevent.prototype.constructor.apply(this, [parent, children]);
	 D_EventNode[this.id] = this;
	 this.event = {};
	 this.triggerEventCB = function(e) {self.triggerEvent(e);}
	 return this;
	}

// API for starting, stopping the instruction
PeventBrick.prototype = new Pevent();
PeventBrick.prototype.className	= 'PeventBrick';
PeventBrick.prototype.appendClass(PeventBrick);

var classes = [];//Pnode.prototype.getClasses();
classes.push(PeventBrick.prototype.className);
PeventBrick.prototype.getClasses	= function() {return classes;};

PeventBrick.prototype.serialize		= function() {
	var json = Pnode.prototype.serialize.apply(this, []);
	// Describe action here
	json.subType = this.subType;
	json.eventNode	= { objectId  : this.event.objectId  ,
						eventName : this.event.eventName };
	return json;
}

PeventBrick.prototype.unserialize	= function(json, Putils) {
	Pnode.prototype.unserialize.apply(this, [json, Putils]);
	this.subType = json.subType;
	this.event.objectId		= json.eventNode.objectId;
	this.event.eventName	= json.eventNode.eventName;
	this.syncWithBrick(this.event.objectId, this.event.eventName);
	return this;
}

PeventBrick.prototype.triggerEvent = function(event) {
	if(this.parent && this.state) {
		 this.parent.eventFromChild(this, event);
		 return true;
		}
	return false;
}

PeventBrick.prototype.syncWithBrick = function(brickId, eventName) {
	var self = this;
	var brick = Brick.prototype.getBrickFromId(brickId);
	if(brick) {
		 brick.on( eventName
				 , this.triggerEventCB
				 );
		}
}

return PeventBrick;
});
