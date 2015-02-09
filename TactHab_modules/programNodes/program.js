define( [ './parallel.js'
		, './sequence.js'
		, './Pdefinition.js'
		, './Pcall.js'
		, './Pnode.js'
		, '../Bricks/Brick.js'
	    ]
	  , function( ParalleNode, SequenceNode
				, Pdefinition, Pcall, Pnode, Brick) {
// Definition of a node for programs
var ProgramNode = function(parent, children) {
	 SequenceNode.prototype.constructor.apply(this, [parent, children]);
	 // Add a definition node
	 this.definitions	= new Pdefinition(this, []); 
	 // Add a parallel node
	 this.instructions	= new ParalleNode(this, []);
	 
	 return this;
	}

// API for starting, stopping the instruction
ProgramNode.prototype = new SequenceNode();
ProgramNode.prototype.className	= 'ProgramNode';
Pnode.prototype.appendClass(ProgramNode);

var classes = SequenceNode.prototype.getClasses().slice();
classes.push(ProgramNode.prototype.className);
ProgramNode.prototype.getClasses	= function() {return classes;};

ProgramNode.prototype.call = function(call) {
	// Filter call
	
	// Propagate an action call if it is not forbidden
	// console.log('ProgramNode::call', call);
	if(this.parent) {
		 return this.parent.call(call);
		} else {call.execute();}
}

ProgramNode.prototype.getContext = function() {
	var context, i;
	if(this.parent) {
		 context = Pnode.prototype.getContext.apply(this, []);
		} else {context = {bricks:{}, variables:{}};
				// Register Bricks
				var D_bricks = Brick.prototype.getBricks();
				for(i in D_bricks) {context.bricks[i] = D_bricks[i];}
			   }
		
	// Resgister Variables
	var L_defs = this.definitions.children;
	for(i=0; i<L_defs.length; i++) {
		 var def = L_defs[i]; // Variable definition
		 context.variables[ def.getSelectorId() ] = def;
		}
		
	// Filter context
	
	// Result
	return context;
}

// API for starting, stopping the instruction
ProgramNode.prototype.serialize	= function() {
	this.definitions.setParent ( null );
	this.instructions.setParent( null );
	var json = Pnode.prototype.serialize.apply(this, []);
	this.definitions.setParent ( this );
	this.instructions.setParent( this );
	json.pg = { definitions	: this.definitions.serialize ().children
			  , instructions: this.instructions.serialize().children
			  }
	return json;
}

ProgramNode.prototype.unserialize	= function(json, Putils) {
	Pnode.prototype.unserialize.apply(this, [json, Putils]);
	this.definitions.setParent ( this );
	this.instructions.setParent( this );
	// Plug definitions part
	var i;
	for(i=0; i<json.pg.definitions.length; i++) {
		 Putils.unserialize(json.pg.definitions[i], Putils).setParent ( this.definitions  );
		}
	// instructions part
	for(i=0; i<json.pg.instructions.length; i++) {
		 Putils.unserialize(json.pg.instructions[i], Putils).setParent( this.instructions );
		}
	return this;
}

return ProgramNode;
});