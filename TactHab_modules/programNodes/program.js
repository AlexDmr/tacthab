var Pnode			= require( './Pnode.js' )
  , ParalleNode		= require( './parallel.js' )
  , SequenceNode	= require( './sequence.js' )
  , Pdefinition		= require( './Pdefinition.js' )
  // , Pcall			= require( './Pcall.js' )
  , Brick			= require( '../Bricks/Brick.js' )
  ;

// Definition of a node for programs
var ProgramNode = function() {
	 SequenceNode.apply(this, []);
	 return this;
	}

// API for starting, stopping the instruction
ProgramNode.prototype = Object.create( SequenceNode.prototype ); //new SequenceNode();
ProgramNode.prototype.constructor	= ProgramNode;
ProgramNode.prototype.className	= 'ProgramNode';
Pnode.prototype.appendClass(ProgramNode);

ProgramNode.prototype.init			= function(parent, children) {
	SequenceNode.prototype.init.apply(this, [parent, children]);
	
	// Add a definition node
	this.definitions	= (new Pdefinition()).init(this, []); 
	// Add a parallel node
	this.instructions	= (new ParalleNode()).init(this, []);
	// Manage filters
	this.filtering		= false;
	this.filterNodes	= [];

	this.filterCallNodes= [];	
	
	return this;
}

ProgramNode.prototype.dispose		= function() {
	if(this.definitions ) {this.definitions.dispose (); delete this.definitions ;}
	if(this.instructions) {this.instructions.dispose(); delete this.instructions;}
	SequenceNode.prototype.dispose.apply(this, []);
}

var classes = SequenceNode.prototype.getClasses().slice();
classes.push(ProgramNode.prototype.className);
ProgramNode.prototype.getClasses	= function() {return classes;};

ProgramNode.prototype.getProgram		= function() {return this;}
ProgramNode.prototype.getESA			= function() {
	return { events	: ['Start', 'Stop']
		   , states	: []
		   , actions: ['Start', 'Stop']
		   };
}

ProgramNode.prototype.getSubPrograms	= function() {
	var L = [], def;
	for(var i=0; i<this.definitions.children.length; i++) {
		 def = this.definitions.children[i];
		 if(def.className === 'PprogramDeclaration') {
			 L = L.concat( def.evalSelector() );
			}
		}
	return L;
}

/**
  * Get exposed events, states and actions
*/
ProgramNode.prototype.getExposedAPI	= function() {
	var obj = { events	: []
			  , states	: []
			  , actions: []
			  };
	var i, def, type;
	for(i=0; i<this.definitions.children.length; i++) {
		 def = this.definitions.children[i];
		 if(def.isExposed()) {
			 type = def.updateType();
			 // console.log("\tvariable", def.id, "typed", type);
			 if(type.indexOf('EventNode' ) >= 0) {obj.events.push (def);}
			 if(type.indexOf('StateNode' ) >= 0) {obj.states.push (def);}
			 if(type.indexOf('ActionNode') >= 0) {obj.actions.push(def);}
			}
		}
	
	return obj;
}

ProgramNode.prototype.getExposedAPI_serialized	= function() {
	var obj  = this.getExposedAPI();
	var json = { events	: []
			   , states	: []
			   , actions: []
			   };
	var i;
	for(i in obj.events ) {json.events.push ( obj.events [i].getDescription() );}
	for(i in obj.states ) {json.states.push ( obj.states [i].getDescription() );}
	for(i in obj.actions) {json.actions.push( obj.actions[i].getDescription() );}
	return json;
}

/**
  * Managing call
*/
ProgramNode.prototype.RegisterFilterCall	= function(filterCallNode) {
	for(var i=0; i<this.filterCallNodes.length; i++) {
		 if(this.filterCallNodes[i] === filterCallNode) {this.filterCallNodes.splice(i, 1); break;}
		}
	this.filterCallNodes.push(filterCallNode);
	return this;
}

ProgramNode.prototype.call					= function(call) {
	// Filter call
	var actualCall;
	if(this.filterCallNodes.length) {
		 actualCall = call.newCopy();
		 for(var i=0; i<this.filterCallNodes.length; i++) {
			 this.filterCallNodes[i].applyFilterOn( call, actualCall );
			}
		} else {actualCall = call;}
	
	// Propagate an action call if it is not forbidden
	if(this.parent) {
		 return this.parent.call(actualCall);
		} else {actualCall.execute();}
}

/**
  * Managing context
*/
ProgramNode.prototype.getLocalVariables	= function() {
	var variables = {}, def, varId, i;
	for(i=0; i<this.definitions.children.length; i++) {
		 def = this.definitions.children[i]; // Variable definition
		 varId = def.getSelectorId()
		 variables[ varId ] = def;
		}
	return variables;
}

ProgramNode.prototype.RegisterFilter = function(filterNode) {
	for(var i=0; i<this.filterNodes.length; i++) {
		 if(this.filterNodes[i] === filterNode) {this.filterNodes.splice(i, 1); break;}
		}
	this.filterNodes.push(filterNode);
	return this;
}

ProgramNode.prototype.getContext		= function() {
	if(this.filtering) {return this.cacheContext;}
	this.filtering = true;
	
	var context, i;
	// console.log("<ProgramNode:getContext", this.id, ">");
	if(this.parent) {
		 context = Pnode.prototype.getContext.apply(this, []);
		} else {context = {bricks:{}, variables:{}};
				// Register Bricks
				// console.log("Program", this.id, "is root");
				var D_bricks = Brick.prototype.getBricks();
				for(i in D_bricks) {context.bricks[i] = D_bricks[i];}
			   }
	this.cacheContext = context;
	
	// 1) Resgister Variables
	var L_defs = this.definitions.children, varId, def;
	for(i=0; i<L_defs.length; i++) {
		 def = L_defs[i]; // Variable definition
		 try {
			 varId = def.getSelectorId();
			 context.variables[ varId ] = def;
			 // console.log("ProgramNode::getContext", this.id, i, '/', L_defs.length, def.className, def.id);
			} catch(err) {console.error("ProgramNode::getContext", this.id, "Impossible to get selectorId for", i, '/', L_defs.length, def.className, def.id);}
		}
		
	// 2) Filter context
	 this.cacheContext = context;
	 this.filtering = true;
	 for(i=0; i<this.filterNodes.length; i++) {
		 this.filterNodes[i].applyFilterOn( context );
		}
		
	// 3) Delete variables that are "empty" with respect to the context
	var variables = {}, variable, L, v;
	for(v in context.variables) {
		 variable = context.variables[v];
		 L = variable.evalSelector();
		 var empty = true;
		 for(i=0; i<L.length; i++) {// Are all objects present in the context?
			 if(  (L[i].brickId	&& typeof context.bricks   [ L[i].brickId] !== 'undefined')
			   || (L[i].id		&& typeof context.variables[ L[i].id     ] !== 'undefined') ) {empty = false; break;}
			}
		 if(!empty || !variable.isTypedAs('ProgramNode')) {variables[v] = variable;}
		}
	 context.variables = variables;
	 this.filtering = false;
		 
		 
	// console.log("</ProgramNode:getContext", this.id, ">");
	// Result
	return context;
}

/**
  * Serialization
*/
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
	var i, def;
	for(i=0; i<json.pg.definitions.length; i++) {
		 def = Putils.unserialize(json.pg.definitions[i], Putils)
		 def.setParent ( this.definitions  );
		 // console.log("ProgramNode::unserialize", this.id, def.className, def.id);
		}
	// instructions part
	for(i=0; i<json.pg.instructions.length; i++) {
		 Putils.unserialize(json.pg.instructions[i], Putils).setParent( this.instructions );
		}
	return this;
}

module.exports = ProgramNode;
