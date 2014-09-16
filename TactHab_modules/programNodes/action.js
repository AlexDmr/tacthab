define( [ './Pnode.js'
		, './Pcall.js'
	    ]
	  , function(Pnode, Pcall) {
// Definition of a node for programs
var ActionNode = function(parent, obj, mtd, params) {
	 Pnode.prototype.constructor.apply(this, [parent]);
	 this.setCommand(obj, mtd, params);
	 return this;
	}

// API for starting, stopping the instruction
ActionNode.prototype = new Pnode();
ActionNode.prototype.className	= 'ActionNode';
Pnode.prototype.appendClass(ActionNode);

var classes = Pnode.prototype.getClasses();
classes.push(ActionNode.prototype.className);
ActionNode.prototype.getClasses	= function() {return classes;};

ActionNode.prototype.setCommand = function(obj, mtd, params) {
	this.obj	= obj;
	this.mtd	= mtd;
	this.params	= params;
	return this;
}
ActionNode.prototype.Start = function() {
	var self = this
	  , res  = Pnode.prototype.Start.apply(this, []);
	
	if( res ) {
		// Propagate the call
		this.call( new Pcall( this.obj, this.mtd, this.params
							, function(){self.Stop();}, function(){self.Stop();} ) 
				 );
		}
	return res;
}

ActionNode.prototype.serialize		= function() {
	var json = Pnode.prototype.serialize.apply(this, []);
	// Describe action here
	return json;
}
ActionNode.prototype.unserialize	= function(json, Putils) {
	Pnode.prototype.unserialize.apply(this, [json, Putils]);
	// Describe action here
	this.setCommand(console, console.log, [this.id]);
	return this;
}

return ActionNode;
});

