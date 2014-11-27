define( [ './Pevent.js'
		, '../Bricks/Brick.js'
	    ]
	  , function(Pevent, Brick) {
// Definition of a PeventBrick
var PeventBrick = function(parent, children) {
	 Pevent.prototype.constructor.apply(this, [parent, children]);
	 D_EventNode[this.id] = this;
	 return this;
	}

// API for starting, stopping the instruction
PeventBrick.prototype = new Pevent();
PeventBrick.prototype.className	= 'PeventBrick';
PeventBrick.prototype.appendClass(PeventBrick);

var classes = [];//Pnode.prototype.getClasses();
classes.push(PeventBrick.prototype.className);
PeventBrick.prototype.getClasses	= function() {return classes;};

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
				 , function(event) {self.triggerEvent(event);}
				 );
		}
}

return PeventBrick;
});
