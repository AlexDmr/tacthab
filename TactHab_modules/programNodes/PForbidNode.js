var /*ProgramNode	= require( './program.js' )
  , */Pnode		= require( './Pnode.js' )
  , OP			= require( '../../js/operators.js' )
  , _			= require( 'underscore' )
  ;
  
// Definition of a node for programs
var PForbidNode = function() {
	Pnode.prototype.constructor.apply(this, []);
	return this;
}

// API for starting, stopping the instruction
PForbidNode.prototype = Object.create( Pnode.prototype ); //new Pnode();
PForbidNode.prototype.constructor = PForbidNode;
PForbidNode.prototype.className	= 'PForbidNode';
Pnode.prototype.appendClass(PForbidNode);

var classes = Pnode.prototype.getClasses().slice();
classes.push(PForbidNode.prototype.className);
PForbidNode.prototype.getClasses	= function() {return classes;};

PForbidNode.prototype.init			= function(parent, children) {
	Pnode.prototype.init.apply(this, [parent, children]);
	this.forbid		= { programs	: null
					  , objects		: null
					  , action		: ''
					  , parameters	: []
					  , forbidden	: true
					  };
	return this;
}

PForbidNode.prototype.dispose		= function() {
	Pnode.prototype.dispose.apply(this, []);
	if(this.forbid.programs) {this.forbid.programs.dispose(); this.forbid.programs = null;}
	if(this.forbid.objects ) {this.forbid.objects.dispose (); this.forbid.objects  = null;}
}

PForbidNode.prototype.getESA		= function() {
	var res = {events:{}, states:{}, actions:{}}, L;
	if(this.forbid.objects) {
		 L = this.forbid.objects.evalSelector();
		 if(L.length) {
			 res = L[0].getESA();
			}
		}
	return res;
}

// API for starting, stopping the instruction
PForbidNode.prototype.Start	= function() {
	var res = Pnode.prototype.Start.apply(this, []);
	
	// Get program
	var programs;
	if(this.forbid.programs) {
		 programs = this.forbid.programs.evalSelector();
		 console.log("RegisterFilterCall for", programs.length, "programs.");
		} else {programs = [];}
	
	// Register this forbid
	for(var i=0; i<programs.length; i++) {
		 programs[i].RegisterFilterCall(this);
		}
	
	this.Stop();
	// Returns Pnode Start result
	return res;
}

PForbidNode.prototype.Stop	= function() {
	var res = Pnode.prototype.Stop.apply(this, []);
	return res;
}

PForbidNode.prototype.doesFilterApplyOnPrameters	= function(call) {
	var op, value;
	for(var i=0; i<this.forbid.parameters.length; i++) {
		 op		= this.forbid.parameters[i].op;
		 value	= this.forbid.parameters[i].value;
		 if(  call.parameters.length
		   && !OP[op](call.parameters, value) ) {return false;}
		}
	return true;
}

PForbidNode.prototype.applyFilterOn					= function(originalCall, currentCall) {
	if(this.forbid.objects && originalCall.mtdName === this.forbid.action) {
		var objects = this.forbid.objects.evalSelector()
		  , filteredObject;
		 if(this.forbid.forbidden) {														// Do we have to remove some targets?
			 // filteredObject = _.intersection(objects, currentCall.targets);
			 if(this.doesFilterApplyOnPrameters(currentCall)) {
				 currentCall.targets = _.difference(currentCall.targets, objects);
				}
			} else {// Do we have to re-add some targets?
					filteredObject = _.intersection(objects, originalCall.targets);
					if(this.doesFilterApplyOnPrameters(currentCall)) {
						 currentCall.targets = _.union(currentCall.targets, filteredObject);
						}
				   }			
		}
	return [currentCall];
}

// API for serialization
PForbidNode.prototype.serialize	= function() {
	var json = Pnode.prototype.serialize.apply(this, []);
	json.forbid = { forbidden	: this.forbid.forbidden
				  , action		: this.forbid.action
				  , parameters	: this.forbid.parameters
				  }
	if(this.forbid.programs) {json.forbid.programs = this.forbid.programs.serialize();}
	if(this.forbid.objects ) {json.forbid.objects  = this.forbid.objects.serialize ();}
	return json;
}

PForbidNode.prototype.unserialize	= function(json, Putils) {
	if(this.forbid.programs) {this.forbid.programs.dispose(); this.forbid.programs = null;}
	if(this.forbid.objects ) {this.forbid.objects.dispose (); this.forbid.objects  = null;}
	Pnode.prototype.unserialize.apply(this, [json, Putils]);
	// Plug forbid part
	this.forbid.forbidden	= json.forbid.forbidden;
	this.forbid.action		= json.forbid.action;
	this.forbid.parameters	= json.forbid.parameters;
	if(json.forbid.programs) {this.forbid.programs = Putils.unserialize(json.forbid.programs); this.forbid.programs.setParent(this);}
	if(json.forbid.objects ) {this.forbid.objects  = Putils.unserialize(json.forbid.objects ); this.forbid.objects.setParent (this);}
	this.children = [];
	return this;
}

module.exports = PForbidNode;
