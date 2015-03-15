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

PprogramDeclaration.prototype.dispose	= function() {
	var subProgram = Pnode.prototype.getNode( this.programDef.id );
	if(subProgram) {subProgram.setParent(null);}
	Pnode.prototype.dispose.apply(this, []);
	return this;
}

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

PprogramDeclaration.prototype.getName		= function() {return this.programDef.name;}
PprogramDeclaration.prototype.getSelectorId = function() {return this.programDef.id  ;}

PprogramDeclaration.prototype.updateType	= function() {return ['ProgramDeclaration', 'Program']}

PprogramDeclaration.prototype.evalSelector	= function() {
	var L = [];
	var P = Pnode.prototype.getNode( this.getSelectorId() );
	if(P) {L.push(P);}
	return L;
}

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
	if(json.programDef.id !== null) {
		 var subProgram = Pnode.prototype.getNode( json.programDef.id );
		 if(subProgram) {
			 console.log("There is a node identified by", json.programDef.id, ":", subProgram.className);
			 this.programDef.id	= json.programDef.id;
			 subProgram.setParent(this);
			} else {console.log("There is no node identified by", json.programDef.id);}
		}
	if(this.programDef.id === null) {
		 console.log("Creating a new sub-program");
		 var pg = new ProgramNode();
		 pg.setParent(this);
		 /*if(json.programDef.id) {*/pg.substituteIdBy(json.programDef.id);//}
		 this.programDef.id = pg.id;
		}
	return this;
} 


return PprogramDeclaration;
});
