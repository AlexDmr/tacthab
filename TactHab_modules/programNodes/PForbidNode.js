define( [ './program.js'
		, './Pnode.js'
		, '../../js/operators.js'
		, 'underscore'
	    ]
	  , function( ProgramNode
				, Pnode
				, OP
				, _ ) {
// Definition of a node for programs
var PForbidNode = function() {
	Pnode.prototype.constructor.apply(this, []);
	return this;
}

// API for starting, stopping the instruction
PForbidNode.prototype = new Pnode();
PForbidNode.prototype.className	= 'PForbidNode';
Pnode.prototype.appendClass(PForbidNode);

var classes = Pnode.prototype.getClasses().slice();
classes.push(PForbidNode.prototype.className);
PForbidNode.prototype.getClasses	= function() {return classes;};

PForbidNode.prototype.init			= function(parent, children) {
	Pnode.prototype.init.apply(this, [parent, children]);
	this.forbid		= { programs	: null
					  , objects		: null
					  , mtdName		: ''
					  , parameters	: []
					  , forbidden	: true
					  };
	return this;
}

PForbidNode.prototype.dispose		= function() {
	Pnode.prototype.dispose.apply(this, []);
	if(this.filter.programs) {this.filter.programs.dispose(); this.filter.programs = null;}
	if(this.filter.objects ) {this.filter.objects.dispose (); this.filter.objects  = null;}
}

// API for starting, stopping the instruction
PForbidNode.prototype.Start	= function() {
	var res = Pnode.prototype.Start.apply(this, []);
	
	// Get program
	var programs;
	if(this.filter.programs) {
		 programs = this.filter.programs.evalSelector();
		 console.log("RegisterFilterCall for", programs.length, "programs.");
		} else {programs = [];}
	
	// Register this filter
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
	for(var i=0; i<this.parameters.length; i++) {
		 op		= this.parameters[i].op;
		 value	= this.parameters[i].value;
		 if(  call.parameters.length
		   && !OP[op](call.parameters, value) ) {return false;}
		}
	return true;
}

PForbidNode.prototype.applyFilterOn					= function(originalCall, currentCall) {
	if(this.filter.objects && originalCall.mtdName === this.forbid.mtdName) {
		var objects = this.filter.objects.evalSelector()
		  , filteredObject, i;
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

return PForbidNode;
});
