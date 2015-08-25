var Pnode = require( './Pnode.js' )
  , Pcall = require( './Pcall.js' )
  , Brick = require( '../Bricks/Brick.js' )
  ;

// Definition of a node for programs
var ActionNode = function(parent, mtd, params) {
	 Pnode.prototype.constructor.apply(this, []);
	 return this;
	}

// API for starting, stopping the instruction
ActionNode.prototype = Object.create( Pnode.prototype ); //new Pnode();
ActionNode.prototype.constructor	= ActionNode;
ActionNode.prototype.className		= 'ActionNode';
Pnode.prototype.appendClass(ActionNode);

var classes = Pnode.prototype.getClasses();
classes.push(ActionNode.prototype.className);
ActionNode.prototype.getClasses	= function() {return classes;};

ActionNode.prototype.init		= function(parent, children, mtd, params) {
	Pnode.prototype.init.apply(this, [parent, children]);
	this.subType = 'ActionNode';
	this.setCommand(mtd, params);
	return this;
}

ActionNode.prototype.triggerDirectly	= function(mtd, params) {
	var mtd_svg		= this.mtd
	  , params_svg	= this.params
	  , self		= this
	  ;

	this.mtd	= mtd;
	this.params	= params;

	this.Start();
	setTimeout( function() {self.Stop();}, 100 );
	
	this.mtd	= mtd_svg;
	this.params	= params_svg;
}


ActionNode.prototype.setCommand = function(mtd, params) {
	this.mtd	= mtd;
	this.params	= params;
	return this;
}

ActionNode.prototype.Start = function() {
	var self = this
	  , result  = Pnode.prototype.Start.apply(this, []);
	// console.log("ActionNode::Start", result, this.mtd, this.params);
	if(result) {
		if( (this.children[0] && this.children[0].evalSelector)
		  ||this.targets
		  ) {
			// Evaluate the targets
			var targets, i, obj;
			if(this.targets) {
				 targets = [];
				 for(i=0; i<this.targets.length; i++) {
					 obj = Brick.prototype.getBrickFromId(this.targets[i]);
					 if(obj) {targets.push(obj);} else {console.error("No brick for", this.targets[i]);}
					}
				} else {targets = this.children[0].evalSelector();}
			// console.log("ActionNode->Calling", targets.length, this.mtd, this.params);
			// Propagate the call
			this.call( new Pcall( targets, this.mtd, this.params
								, function(res) {console.log("Success:", res); self.Stop();}
								, function(err) {console.log("Error  :", err); self.Stop();}
								) 
					 );
			} else {console.error( "Action not performed:\n"
								 , "\tcall  :", this.mtd, this.params
								 , "\tchild :", this.children[0]?this.children[0].id:'NONE'
								 );
					this.Stop();
				   }
		}
	return result;
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
		 if(json.ActionNode.targets) {
			 this.targets = json.ActionNode.targets;
			} else {delete this.targets;}
		} else {console.error('action reference an invalid method : ', json.ActionNode.method);}
	return this;
}

module.exports = ActionNode;


