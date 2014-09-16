define( [ './Pnode.js'
	    ]
	  , function(Pnode) {
// Definition of a when node for programs
// when EVENT then [ACTION | RULE | ...]
var WhenNode = function(parent, eventNode, thenNode, forever) {
	 var children = [];
	 if(eventNode) {children.push(eventNode);}
	 if(thenNode ) {children.push(thenNode );}
	 Pnode.prototype.constructor.apply(this, [parent, children]);
	 this.eventNode	= eventNode;
	 this.thenNode	= thenNode;
	 
	 if(forever === undefined) {forever = true;}
	 this.forever	= forever;
	 
	 return this;
	}

// API for starting, stopping the instruction
WhenNode.prototype = new Pnode();
WhenNode.prototype.className	= 'WhenNode';
Pnode.prototype.appendClass(WhenNode);

var classes = Pnode.prototype.getClasses();
classes.push(WhenNode.prototype.className);
WhenNode.prototype.getClasses	= function() {return classes;};

WhenNode.prototype.serialize	= function() {
	var json = Pnode.prototype.serialize.apply(this, []);
	json.childEvent		= this.children.indexOf(this.eventNode);
	json.childReaction	= this.children.indexOf(this.thenNode );
	return json;
}
WhenNode.prototype.unserialize	= function(json, Putils) {
	Pnode.prototype.unserialize.apply(this, [json, Putils]);
	this.eventNode = this.thenNode = null;
	if(json.childEvent	  >= 0) {this.eventNode = this.children[json.childEvent	  ];}
	if(json.childReaction >= 0) {this.thenNode  = this.children[json.childReaction];}
	return this;
}

WhenNode.prototype.Start = function() {
	var res = Pnode.prototype.Start.apply(this, []);
	if( res ) {
		 if(this.eventNode) {this.eventNode.Start();}
		}
	return res;
}

WhenNode.prototype.setEventThen = function(whenNode, thenNode) {
	if(this.eventNode) {this.eventNode.setParent(null);}
	if(this.thenNode ) {this.thenNode.setParent (null);}
	this.eventNode	= eventNode;
	this.thenNode	= thenNode;
	this.children	= [];
	if(eventNode) {this.children.push(eventNode);}
	if(thenNode ) {this.children.push(thenNode );}
	
	return this;
}
WhenNode.prototype.eventFromChild = function(child, event) {
	if(child === this.eventNode) {
		 // Stop the eventNode
		 this.eventNode.Stop();
		 // Start the thenNode
		 if(this.thenNode) {this.thenNode.Start();}
		} else {error('WhenNode::eventFromChild received an event from a child wich is not the eventNode.');}
}
WhenNode.prototype.childStateChanged = function(child, prevState, newState) {
	if(child === this.thenNode && newState === 0) {
		 // Restart listening if forever is true, Stop otherwise
		 if(this.forever) {this.eventNode.Start();} else {this.Stop();}
		}
}

return WhenNode;
});
