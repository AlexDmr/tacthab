var Pnode		= require( './Pnode.js' )
  // , ProgramNode	= require( './program.js' )
  // , _			= require( 'underscore' )
  ;

// Definition of a node for programs
var PfilterNode = function() {
	Pnode.prototype.constructor.apply(this, []);
	return this;
}

// API for starting, stopping the instruction
PfilterNode.prototype = Object.create( Pnode.prototype ); //new Pnode();
PfilterNode.prototype.constructor	= PfilterNode;
PfilterNode.prototype.className		= 'PfilterNode';
Pnode.prototype.appendClass(PfilterNode);

var classes = Pnode.prototype.getClasses().slice();
classes.push(PfilterNode.prototype.className);
PfilterNode.prototype.getClasses	= function() {return classes;};

PfilterNode.prototype.init			= function(parent, children) {
	Pnode.prototype.init.apply(this, [parent, children]);
	this.filter		= { programs	: null
					  , objects		: null
					  , HideExpose	: 'hide'
					  };
	return this;
}

PfilterNode.prototype.dispose		= function() {
	Pnode.prototype.dispose.apply(this, []);
	if(this.filter.programs) {this.filter.programs.dispose(); this.filter.programs = null;}
	if(this.filter.objects ) {this.filter.objects.dispose (); this.filter.objects  = null;}
}

// API for starting, stopping the instruction
PfilterNode.prototype.Start	= function() {
	var res = Pnode.prototype.Start.apply(this, []);
	
	// Get program
	var programs;
	if(this.filter.programs) {
		 programs = this.filter.programs.evalSelector();
		 console.log("Filtering for", programs.length, "programs.");
		} else {programs = [];}
	
	// Register this filter
	for(var i=0; i<programs.length; i++) {
		 programs[i].RegisterFilter(this);
		}
	
	this.Stop();
	// Returns Pnode Start result
	return res;
}

PfilterNode.prototype.Stop	= function() {
	var res = Pnode.prototype.Stop.apply(this, []);
	return res;
}

PfilterNode.prototype.applyFilterOn = function(context) {
	if(this.filter.objects) {
		var objects = this.filter.objects.evalSelector()
		  , object, i;
		if(this.filter.HideExpose === 'hide') {
			 // context.bricks = _.difference(context.bricks, objects);
			 for(i=0; i<objects.length; i++) {
				 object = objects[i];
				 delete context.bricks[ object.brickId ];
				 console.log("\tPfilterNode:Removing", object.brickId);
				}
			} else {for(i=0; i<objects.length; i++) {
						 object = objects[i];
						 if(typeof context.bricks[ object.brickId ] === 'undefined') {
							 context.bricks[ object.brickId ] = object;
							 console.log("\tPfilterNode:Exposing", object.brickId);
							}
						}
				   }
		}
}

// API for serialization
PfilterNode.prototype.serialize	= function() {
	var json = Pnode.prototype.serialize.apply(this, []);
	json.filter = { HideExpose	: this.filter.HideExpose }
	if(this.filter.programs) {json.filter.programs = this.filter.programs.serialize();}
	if(this.filter.objects ) {json.filter.objects  = this.filter.objects.serialize ();}
	return json;
}

PfilterNode.prototype.unserialize	= function(json, Putils) {
	if(this.filter.programs) {this.filter.programs.dispose(); this.filter.programs = null;}
	if(this.filter.objects ) {this.filter.objects.dispose (); this.filter.objects  = null;}
	Pnode.prototype.unserialize.apply(this, [json, Putils]);
	// Plug filter part
	this.filter.HideExpose = json.filter.HideExpose;
	if(json.filter.programs) {this.filter.programs = Putils.unserialize(json.filter.programs); this.filter.programs.setParent(this);}
	if(json.filter.objects ) {this.filter.objects  = Putils.unserialize(json.filter.objects ); this.filter.objects.setParent (this);}
	this.children = [];
	return this;
}

module.exports = PfilterNode;

