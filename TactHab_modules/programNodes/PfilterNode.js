define( [ './program.js'
		, './Pnode.js'
	    ]
	  , function( ProgramNode
				, Pnode ) {
// Definition of a node for programs
var PfilterNode = function(parent, children) {
	 Pnode.prototype.constructor.apply(this, [parent, children]);
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
PfilterNode.prototype = new Pnode();
PfilterNode.prototype.className	= 'PfilterNode';
Pnode.prototype.appendClass(PfilterNode);

var classes = Pnode.prototype.getClasses().slice();
classes.push(PfilterNode.prototype.className);
PfilterNode.prototype.getClasses	= function() {return classes;};

PfilterNode.prototype.Start	= function() {
	var res = Pnode.prototype.Start.apply(this, []);
	
	return res;
}

PfilterNode.prototype.Stop	= function() {
	var res = Pnode.prototype.Stop.apply(this, []);
	return res;
}

// API for starting, stopping the instruction
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

return PfilterNode;
});
