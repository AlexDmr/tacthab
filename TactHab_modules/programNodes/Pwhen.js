var Pnode = require( './Pnode.js' )
  , Brick = require( '../Bricks/Brick.js' )
  ;

// Definition of a when node for programs
var WhenNode = function() {
	 Pnode.prototype.constructor.apply(this, []);	 
	 return this;
	}

// API for starting, stopping the instruction
WhenNode.prototype = Object.create(Pnode.prototype); //new Pnode();
WhenNode.prototype.className	= 'WhenNode';
Pnode.prototype.appendClass(WhenNode);

var classes = Pnode.prototype.getClasses();
classes.push(WhenNode.prototype.className);
WhenNode.prototype.getClasses	= function() {return classes;};

WhenNode.prototype.init			= function(parent, children) {
	Pnode.prototype.init.apply(this, [parent, children]);
	this.when = { childEvent	: null
				, childReaction	: null
				, varName		: 'brick'
				, varType		: []
				};
	this.forever	= true;
	
	return this;
}

WhenNode.prototype.serialize	= function() {
	// console.log("<WhenNode::serialize id=", this.id, ">");
	if(this.when.childEvent   ) {this.when.childEvent.setParent    (null);}
	if(this.when.childReaction) {this.when.childReaction.setParent (null);}
	var json = Pnode.prototype.serialize.apply(this, []);
	if(this.when.childEvent   ) {this.when.childEvent.setParent    (this);}
	if(this.when.childReaction) {this.when.childReaction.setParent (this);}
	
	json.when = { varName	: this.when.varName
				, varId		: this.getImplicitVariableId()
				, varType	: []
				};
	if(this.when.childEvent   ) {json.when.childEvent		= this.when.childEvent   .serialize();
								 // Check for implicite variable
								 this.when.varType = json.when.varType = this.updateType();
								}
	if(this.when.childReaction) {json.when.childReaction	= this.when.childReaction.serialize();
								}

	// console.log("</WhenNode::serialize id=", this.id, ">");
	return json;
}

WhenNode.prototype.unserialize	= function(json, Putils) {
	Pnode.prototype.unserialize.apply(this, [json, Putils]);
	this.when = { childEvent	: null
				, childReaction	: null
				, varName		: json.when.varName
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
	if( res && this.when.childEvent ) {
		 this.implicitVariableValue = null;
		 this.when.childEvent.Start();
		}
	return res;
}

WhenNode.prototype.getContext		= function() {
	var context = Pnode.prototype.getContext.apply(this, []);
	// Add the implicit variable if it exists
	if(this.implicitVariableId) {
		 context.variables[this.implicitVariableId] = this;
		}
	return context;
}

WhenNode.prototype.getDescription	= function() {
	var descr =	{ type	: this.updateType()
				, name	: this.when.varName
				, expose: false
				, id	: this.implicitVariableId
				};
	return descr;
}

WhenNode.prototype.evalSelector	= function() {
	if(this.implicitVariableId && this.implicitVariableValue) {
		 return [this.implicitVariableValue];
		} else {return [];}
}

WhenNode.prototype.eventFromChild = function(child, event) {
	if(child === this.when.childEvent) {
		 // Stop the eventNode
		 this.when.childEvent.Stop();
		 // Start the thenNode
		 if(this.when.childReaction) {
			 if(event && event.brickId) {
				 this.implicitVariableValue = Brick.prototype.getBrickFromId( event.brickId );
				} else {this.implicitVariableValue = null;}
			 this.when.childReaction.Start();
			}
		} else {throw new Error('WhenNode::eventFromChild received an event from a child wich is not the eventNode.');}
}

WhenNode.prototype.childStateChanged = function(child, prevState, newState) {
	if(child === this.when.childReaction && newState === 0) {
		 // Restart listening if forever is true, Stop otherwise
		 if(this.forever) {
			 // Set this.implicitVariableValue with respect to the event
			 this.implicitVariableValue = null;
			 this.when.childEvent.Start();
			} else {this.Stop();}
		}
}

WhenNode.prototype.getName		= function() {
	return this.when.varName;
}

WhenNode.prototype.updateType	= function() {
	if(this.when.childEvent) {return this.when.childEvent.getRelatedTypes();}
	return [];
}

WhenNode.prototype.getSelectorId			= function() {
	return this.implicitVariableId;
}

WhenNode.prototype.getImplicitVariableId	= function() {
	// Find parent program
	try {var prog = this.getProgram();
		 if(prog) {this.implicitVariableId = prog.definitions.getVariableId(this.implicitVariableId, this, "When_");
				   return this.implicitVariableId;
				  } else {console.trace("EventNode::getImplicitVariableId NO PROGRAM ANCESTOR");}
		} catch(err) {console.trace("ERROR EventNode::getImplicitVariableId", err);
					 }
	return null;
}

module.exports = WhenNode;

