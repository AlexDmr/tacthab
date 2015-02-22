define( [ './Pnode.js'
		, './program.js'
	    ]
	  , function(Pnode, ProgramNode) {

var PprogramDeclaration = function(parent, children) {
	 Pnode.prototype.constructor.apply(this, [parent, children]);
	 this.programDef  = { id	: undefined
						, name	: ''
						, type	: this.updateType()
						};
	 return this;
}

// API for starting, stopping the instruction
PprogramDeclaration.prototype = new Pnode();
PprogramDeclaration.prototype.className	= 'PprogramDeclaration';
Pnode.prototype.appendClass( PprogramDeclaration );

var classes = Pnode.prototype.getClasses().slice();
classes.push(PprogramDeclaration.prototype.className);
PprogramDeclaration.prototype.getClasses	= function() {return classes;};

PprogramDeclaration.prototype.getDescription = function() {
	return	{ id	: this.programDef.id
			, name	: this.programDef.name
			, type	: this.programDef.type
			};
}

PprogramDeclaration.prototype.Start = function() {
	var res = Pnode.prototype.Start.apply(this, []);
	if(res) {this.Stop();}
	return res;
}

PprogramDeclaration.prototype.getSelectorId = function() {return this.programDef.id}

PprogramDeclaration.prototype.updateType	= function() {return ['ProgramDeclaration', 'Program']}

PprogramDeclaration.prototype.evalSelector	= function() {return []}

PprogramDeclaration.prototype.serialize	= function() {
	var children = this.children; this.children = [];
	var json =	Pnode.prototype.serialize.apply(this, []);
	json.programDef = this.getDescription();
	this.children = children;
	return json;
}
PprogramDeclaration.prototype.unserialize	= function(json, Putils) {
	Pnode.prototype.unserialize.apply(this, [json, Putils]);
	// className and id are fixed by the constructor of the object itself
	this.programDef   = { type	: this.updateType()
						, name	: json.programDef.name
						, id	: null
						};
	if(json.programDef.id) {
		 var subProgram = Pnode.prototype.getNode( this.programDef.id );
		 if(subProgram) {
			 this.programDef.id	= json.programDef.id;
			 subProgram.setParent(this);
			}
		}
	if(this.programDef.id === null) {
		 var pg = new ProgramNode();
		 pg.setParent(this);
		 this.programDef.id = pg.id;
		}
	return this;
} 


return PprogramDeclaration;
});
