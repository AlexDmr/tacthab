var Pevent	= require( './Pevent.js' )
  , Brick	= require( '../Bricks/Brick.js' )
  , OP		= require( '../../js/operators.js' )
  ;

// Definition of a PeventBrick
var PeventBrick = function() {
	 Pevent.prototype.constructor.apply(this, []);
	 return this;
	}

// API for starting, stopping the instruction
PeventBrick.prototype = Object.create( Pevent.prototype ); // new Pevent();
PeventBrick.prototype.constructor	= PeventBrick;
PeventBrick.prototype.className		= 'PeventBrick';
PeventBrick.prototype.appendClass(PeventBrick);

var classes = [];//Pnode.prototype.getClasses();
classes.push(PeventBrick.prototype.className);
PeventBrick.prototype.getClasses	= function() {return classes;};

PeventBrick.prototype.init			= function(parent, children) {
	var self = this;
	Pevent.prototype.init.apply(this, [parent, children]);
	this.event = { targets		: []
				 , eventName	: null
				 , filters		: []
				 };
	this.triggerEventCB = function(e) {self.triggerEvent(e);}
	return this;
}

PeventBrick.prototype.dispose		= function() {
	this.synchronizeWithTargets( [] );
	Pevent.prototype.dispose.apply(this, []);
}

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
	var res = Pevent.prototype.Stop.apply(this, []);
	if(res) {
		 this.synchronizeWithTargets( [] );
		}
	return res;
}

PeventBrick.prototype.serialize		= function() {
	var json = Pevent.prototype.serialize.apply(this, []);
	// Describe action here
	json.subType = this.subType;
	json.eventNode	= { /*objectId  : this.event.objectId
					  , */
					    eventName	: this.event.eventName
					  , filters		: this.event.filters
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
	console.log(this.event.targets.length, "unsubscribe");
	for(i=0; i<this.event.targets.length; i++) {
		 console.log("\t", this.id, "unsubscribe from", this.event.targets[i].brickId);
		 this.event.targets[i].off(this.event.eventName, this.triggerEventCB);
		}
	
	// Subscribe
	console.log(targets.length, "subscribe");
	this.event.target = targets;
	for(i=0; i<targets.length; i++) {
		 console.log("\t", this.id, "subscribe to", this.event.eventName, "on", targets[i].brickId);
		 targets[i].on(this.event.eventName, this.triggerEventCB);
		}
		
}

PeventBrick.prototype.syncWithBrick = function(brickId, eventName, filters) {
	// var self = this;
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
		 console.log("PeventBrick", this.id, "filters", event, "\nwith", this.event);
		 for(var i=0; i<this.event.filters.length; i++) {
			 att = this.event.filters[i].att
			 val = this.event.filters[i].val
			  op = this.event.filters[i].op
			 // Check
			 if(  typeof event[att] === 'undefined'
			   || !OP[op](event[att], val)
			   ) {return false;}
			}
		 this.parent.eventFromChild(this, event);
		 return true;
		}
	return false;
}


module.exports = PeventBrick;

