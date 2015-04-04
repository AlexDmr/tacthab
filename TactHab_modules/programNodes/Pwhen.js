define( [ './Pnode.js'
	    ]
	  , function(Pnode) {
// Definition of a when node for programs
var WhenNode = function() {
	 Pnode.prototype.constructor.apply(this, []);	 
	 return this;
	}

// API for starting, stopping the instruction
WhenNode.prototype = new Pnode();
WhenNode.prototype.className	= 'WhenNode';
Pnode.prototype.appendClass(WhenNode);

var classes = Pnode.prototype.getClasses();
classes.push(WhenNode.prototype.className);
WhenNode.prototype.getClasses	= function() {return classes;};

WhenNode.prototype.init			= function(parent, children) {
	Pnode.prototype.init.apply(this, [parent, children]);
	this.when = { childEvent	: null
				, childReaction	: null
				};
	this.forever	= true;
	
	return this;
}

WhenNode.prototype.serialize	= function() {
	if(this.when.childEvent   ) {this.when.childEvent.setParent    (null);}
	if(this.when.childReaction) {this.when.childReaction.setParent (null);}
	var json = Pnode.prototype.serialize.apply(this, []);
	if(this.when.childEvent   ) {this.when.childEvent.setParent    (this);}
	if(this.when.childReaction) {this.when.childReaction.setParent (this);}
	
	json.when = {};
	if(this.when.childEvent   ) {json.when.childEvent		= this.when.childEvent   .serialize();}
	if(this.when.childReaction) {json.when.childReaction	= this.when.childReaction.serialize();}

	return json;
}
WhenNode.prototype.unserialize	= function(json, Putils) {
	Pnode.prototype.unserialize.apply(this, [json, Putils]);
	this.when = { childEvent	: null
				, childReaction	: null
				};
	if(json.when.childEvent   ) {this.when.childEvent		= Putils.unserialize( json.when.childEvent    );
								 this.when.childEvent.setParent(this);
								}
	if(json.when.childReaction) {this.when.childReaction	= Putils.unserialize( json.when.childReaction );
								 this.when.childReaction.setParent(this);
								}
	return this;
}

WhenNode.prototype.Start = function() {
	var res = Pnode.prototype.Start.apply(this, []);
	if( res ) {
		 if(this.when.childEvent) {this.when.childEvent.Start();}
		}
	return res;
}

WhenNode.prototype.eventFromChild = function(child, event) {
	if(child === this.when.childEvent) {
		 // console.log("When event triggered");
		 // Stop the eventNode
		 this.when.childEvent.Stop();
		 // Start the thenNode
		 if(this.when.childReaction) {this.when.childReaction.Start();}
		} else {error('WhenNode::eventFromChild received an event from a child wich is not the eventNode.');}
}
WhenNode.prototype.childStateChanged = function(child, prevState, newState) {
	if(child === this.when.childReaction && newState === 0) {
		 // Restart listening if forever is true, Stop otherwise
		 if(this.forever) {this.when.childEvent.Start();} else {this.Stop();}
		}
}

return WhenNode;
});
