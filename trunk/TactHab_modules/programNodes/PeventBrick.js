define( [ './Pevent.js'
		, '../Bricks/Brick.js'
	    ]
	  , function(Pevent, Brick) {

var OP = { 'equal'			: function(a, b) {return a === b;}
		 , 'different'		: function(a, b) {return a !== b;}
		 , 'greater'		: function(a, b) {return parseFloat(a) >  parseFloat(b);}
		 , 'greaterOrEqual'	: function(a, b) {return parseFloat(a) >= parseFloat(b);}
		 , 'lower'			: function(a, b) {return parseFloat(a) <  parseFloat(b);}
		 , 'lowerOrEqual'	: function(a, b) {return parseFloat(a) <= parseFloat(b);}
		};

// Definition of a PeventBrick
var PeventBrick = function(parent, children) {
	 var self = this;
	 Pevent.prototype.constructor.apply(this, [parent, children]);
	 D_EventNode[this.id] = this;
	 this.event = { targets		: []
				  , eventName	: null
				  , filters		: []
				  };
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

PeventBrick.prototype.Start			= function() {
	var res = Pevent.prototype.Start.apply(this, []);
	if(res) {
		if(this.children[0] && this.children[0].evalSelector) {
			// Evaluate the targets
			var targets = this.children[0].evalSelector();
			console.log("PeventBrick->Start on", targets.length, "targets");
			// Subscribe
			this.synchronizeWithTargets( targets );
			} else {console.error( "PeventBrick->Start ERROR evalSelector"
								 , "\tchild", this.children[0]?this.children[0].id:'NONE'
								 );
					this.Stop();
				   }
		}
	return res;
}

PeventBrick.prototype.Stop			= function() {
	Pevent.prototype.Stop.apply(this, []);
	if(res) {
		}
	return res;
}

PeventBrick.prototype.serialize		= function() {
	var json = Pevent.prototype.serialize.apply(this, []);
	// Describe action here
	json.subType = this.subType;
	json.eventNode	= { /*objectId  : this.event.objectId
					  , */
					    eventName : this.event.eventName
					  , filters: this.event.filters
					  };
	return json;
}

PeventBrick.prototype.unserialize	= function(json, Putils) {
	Pevent.prototype.unserialize.apply(this, [json, Putils]);
	this.subType = json.subType;
	// this.event.objectId		= json.eventNode.objectId;
	this.event.eventName	= json.eventNode.eventName;
	this.event.filters		= json.eventNode.filters;
	this.syncWithBrick(this.event.objectId, this.event.eventName, this.event.filters);
	return this;
}

PeventBrick.prototype.synchronizeWithTargets	= function(targets) {
	var i;
	// Unsubscribe
	for(i=0; i<this.event.targets.length; i++) {
		 this.event.targets[i].off(this.event.eventName, this.triggerEventCB);
		}
	
	// Subscribe
	this.event.target = targets;
	for(i=0; i<targets.length; i++) {
		 targets[i].on(this.event.eventName, this.triggerEventCB);
		}
		
}

PeventBrick.prototype.syncWithBrick = function(brickId, eventName, filters) {
	var self = this;
	var brick = Brick.prototype.getBrickFromId(brickId);
	if(brick) {
		 brick.on( eventName
				 , this.triggerEventCB
				 );
		}
}

PeventBrick.prototype.triggerEvent = function(event) {
	if(this.parent && this.state) {
		 // Check that filters match
		 var att, val, op;
		 for(var i=0; i<this.event.filters.length; i++) {
			 att = this.event.filters[i].att
			 val = this.event.filters[i].val
			  op = this.event.filters[i].op
			 // Check
			 if(  typeof event[att] === 'undefined'
			   || !OP[op](event[att], val)
			   ) return false;
			}
		 this.parent.eventFromChild(this, event);
		 return true;
		}
	return false;
}


return PeventBrick;
});
