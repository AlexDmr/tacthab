define( [ './Pnode.js'
		, './Pcall.js'
		, '../Bricks/Brick.js'
	    ]
	  , function(Pnode, Pcall, Brick) {
// Definition of a node for programs
var ActionNode = function(parent, mtd, params) {
	 Pnode.prototype.constructor.apply(this, [parent]);
	 this.subType = 'ActionNode';
	 this.setCommand(mtd, params);
	 return this;
	}

// API for starting, stopping the instruction
ActionNode.prototype = new Pnode();
ActionNode.prototype.className	= 'ActionNode';
Pnode.prototype.appendClass(ActionNode);

var classes = Pnode.prototype.getClasses();
classes.push(ActionNode.prototype.className);
ActionNode.prototype.getClasses	= function() {return classes;};

ActionNode.prototype.setCommand = function(mtd, params) {
	this.mtd	= mtd;
	this.params	= params;
	return this;
}
ActionNode.prototype.Start = function() {
	var self = this
	  , res  = Pnode.prototype.Start.apply(this, []);
	
	if(res) {
		if(this.children[0] && this.children[0].evalSelector) {
			// Evaluate the targets
			var targets = this.children[0].evalSelector();
			console.log("ActionNode->Calling", targets.length, this.mtd, this.params);
			// Propagate the call
			this.call( new Pcall( targets, this.mtd, this.params
								, function(res) {console.log("Success:", res); self.Stop();}
								, function(err) {console.log("Error  :", err); self.Stop();}
								) 
					 );
			} else {this.Stop();}
		}
	return res;
}
ActionNode.prototype.serialize		= function() {
	var json = Pnode.prototype.serialize.apply(this, []);
	// Describe action here
	json.ActionNode = { method	: this.mtd
					  , params	: this.params
					  };
	json.subType = this.subType;
	return json;
}
ActionNode.prototype.unserialize	= function(json, Putils) {
	Pnode.prototype.unserialize.apply(this, [json, Putils]);
	// Describe action here
	this.subType = json.subType;
	var mtd = json.ActionNode.method;
	if(mtd) {
		 this.setCommand(mtd, json.ActionNode.params);
		} else {console.error('action reference an invalid method : ', json.ActionNode.method);}
	return this;
}

return ActionNode;
});

