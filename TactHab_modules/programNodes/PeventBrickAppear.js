define( [ './Pevent.js'
		, '../Bricks/Brick.js'
	    ]
	  , function(Pevent, Brick) {
var ProtoBrick = Brick.prototype.getBrickFromId( 'ProtoBrick' );

// Definition of a PeventBrick
var PeventBrickAppear = function() {
	Pevent.prototype.constructor.apply(this, []);
	return this;
}

// API for starting, stopping the instruction
PeventBrickAppear.prototype = new Pevent();
PeventBrickAppear.prototype.className	= 'PeventBrickAppear';
PeventBrickAppear.prototype.appendClass(PeventBrickAppear);

var classes = Pevent.prototype.getClasses();
classes.push(PeventBrickAppear.prototype.className);
PeventBrickAppear.prototype.getClasses	= function() {return classes;};

PeventBrickAppear.prototype.init		= function(parent, children) {
	var self = this;
	Pevent.prototype.init.apply(this, [parent, children]);
	this.event = { eventName	: null };
	this.triggerEventCB = function(e) {self.triggerEvent(e);}
	return this
}

PeventBrickAppear.prototype.dispose		= function() {
	if(this.event.eventName) {ProtoBrick.off(this.event.eventName, this.triggerEventCB);}
	Pevent.prototype.dispose.apply(this, []);
	return this;
}

PeventBrickAppear.prototype.Start		= function() {
	var res = Pevent.prototype.Start.apply(this, []);
	if(res) {
		 console.log("PeventBrickAppear->Start listening for", this.event.eventName);
		 ProtoBrick.on(this.event.eventName, this.triggerEventCB);
		}
	return res;
}

PeventBrickAppear.prototype.Stop		= function() {
	var res = Pevent.prototype.Stop.apply(this, []);
	if(res && this.event.eventName) {
		 ProtoBrick.off(this.event.eventName, this.triggerEventCB);
		}
	return res;
}

PeventBrickAppear.prototype.serialize		= function() {
	var json = Pevent.prototype.serialize.apply(this, []);
	// Describe action here
	json.subType = this.subType;
	json.eventNode	= { eventName	: this.event.eventName
					  };
	return json;
}

PeventBrickAppear.prototype.unserialize	= function(json, Putils) {
	Pevent.prototype.unserialize.apply(this, [json, Putils]);
	if(this.event.eventName) {ProtoBrick.off(this.event.eventName, this.triggerEventCB);}
	this.subType = json.subType;
	// this.event.objectId		= json.eventNode.objectId;
	this.event.eventName	= json.eventNode.eventName;
	this.event.filters		= [];
	// Add filters for each of the targets that are stored in the child node.
	ProtoBrick.on(this.event.eventName, this.triggerEventCB);
	return this;
}

PeventBrickAppear.prototype.triggerEvent = function(event) {
	console.log("PeventBrickAppear::triggerEvent for", event.brickId, "?");
	if(this.parent && this.state && this.children.length) {
		 var targets = this.children[0].evalSelector();
		 for(var i=0; i<targets.length; i++) {
			 console.log("\t-", targets[i].brickId);
			 if(targets[i].brickId === event.brickId) {
				 this.parent.eventFromChild(this, event);
				 return true;
				}
			}
		}
	return false;
}


return PeventBrickAppear;
});
