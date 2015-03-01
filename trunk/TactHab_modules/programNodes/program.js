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
	 // Manage filters
	 this.filterNodes	= [];
	 this.filtering		= false;
	 
	 return this;
	}
ProgramNode.prototype.dispose		= function() {
	Pnode.prototype.dispose.apply(this, []);
	this.definitions.dispose (); delete this.definitions;
	this.instructions.dispose(); delete this.instructions;
}

// API for starting, stopping the instruction
ProgramNode.prototype = new SequenceNode();
ProgramNode.prototype.constructor	= ProgramNode;
ProgramNode.prototype.className	= 'ProgramNode';
Pnode.prototype.appendClass(ProgramNode);

var classes = SequenceNode.prototype.getClasses().slice();
classes.push(ProgramNode.prototype.className);
ProgramNode.prototype.getClasses	= function() {return classes;};

ProgramNode.prototype.RegisterFilter = function(filterNode) {
	for(var i=0; i<this.filterNodes.length; i++) {
		 if(this.filterNodes[i] === filterNode) {this.filterNodes.splice(i, 1); break;}
		}
	this.filterNodes.push(filterNode);
	return this;
}

ProgramNode.prototype.call = function(call) {
	// Filter call
	
	// Propagate an action call if it is not forbidden
	// console.log('ProgramNode::call', call);
	if(this.parent) {
		 return this.parent.call(call);
		} else {call.execute();}
}

ProgramNode.prototype.getContext = function() {
	if(this.filtering) return this.cacheContext;
	this.filtering = true;
	
	var context, i;
	// console.log("<ProgramNode:getContext", this.id, ">");
	if(this.parent) {
		 context = Pnode.prototype.getContext.apply(this, []);
		} else {context = {bricks:{}, variables:{}};
				// Register Bricks
				var D_bricks = Brick.prototype.getBricks();
				for(i in D_bricks) {context.bricks[i] = D_bricks[i];}
			   }
	
	this.cacheContext = context;	
	// Resgister Variables
	var L_defs = this.definitions.children, varId, def;
	for(i=0; i<L_defs.length; i++) {
		 def = L_defs[i]; // Variable definition
		 varId = def.getSelectorId()
		 context.variables[ varId ] = def;
		 // console.log("\t- add variable", varId, ":", def.getName(), ":", def.evalSelector().length, "elements" );
		}
		
	// Filter context
		 this.cacheContext = context;
		 this.filtering = true;
		 for(i=0; i<this.filterNodes.length; i++) {
			 this.filterNodes[i].applyFilterOn( context );
			}
		// Delete variables that are "empty" with respect to the context
		var variables = {}, variable, L, v;
		for(v in context.variables) {
			 variable = context.variables[v];
			 L = variable.evalSelector();
			 var empty = true;
			 for(i=0; i<L.length; i++) {// Are all objects present in the context?
				 if(  (L[i].brickId	&& typeof context.bricks   [ L[i].brickId] !== 'undefined')
				   || (L[i].id		&& typeof context.variables[ L[i].id     ] !== 'undefined') ) {empty = false; break;}
				}
			 if(!empty) {variables[v] = variable;} else {
				 L_str = "[";
				 for(i=0; i<L.length; i++) {L_str += L[i].id + ', ';}
				 L_str += "]";
				 // console.log("\tRemoving variable", v, L_str);
				}
			}
		 context.variables = variables;
		 this.filtering = false;
		 
		 
	// console.log("</ProgramNode:getContext", this.id, ">");
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