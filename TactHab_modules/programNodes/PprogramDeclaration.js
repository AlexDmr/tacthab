var Pnode					= require( './Pnode.js' )
  , PvariableDeclaration	= require( './PvariableDeclaration.js' )
  , ProgramNode				= require( './program.js' )
  ;

var PprogramDeclaration = function() {
	PvariableDeclaration.apply(this, []);
	return this;
}

// API for starting, stopping the instruction
PprogramDeclaration.prototype = Object.create( PvariableDeclaration.prototype ); // new PvariableDeclaration();
PprogramDeclaration.prototype.constructor	= PprogramDeclaration;
PprogramDeclaration.prototype.className		= 'PprogramDeclaration';
Pnode.prototype.appendClass( PprogramDeclaration );

PprogramDeclaration.prototype.init		= function(parent, children) {
	PvariableDeclaration.prototype.init.apply(this, [parent, children]);
	this.varDef = { type		: this.updateType()
				  , programId	: null
				  };
	return this;
}

PprogramDeclaration.prototype.dispose	= function() {
	var subProgram = Pnode.prototype.getNode( this.varDef.programId );
	if(subProgram && subProgram.parent === this) {subProgram.setParent(null);}
	Pnode.prototype.dispose.apply(this, []);
	return this;
}

var classes = PvariableDeclaration.prototype.getClasses().slice();
classes.push(PprogramDeclaration.prototype.className);
PprogramDeclaration.prototype.getClasses	= function() {return classes;};

PprogramDeclaration.prototype.getDescription = function() {
	var descr		= PvariableDeclaration.prototype.getDescription.apply(this, []);
	descr.programId	= this.varDef.programId;
	return	descr;
}

PprogramDeclaration.prototype.Start = function() {
	var res = Pnode.prototype.Start.apply(this, []);
	this.Stop();
	return res;
}

PprogramDeclaration.prototype.updateType	= function() {return ['ProgramDeclaration', 'Program']}
PprogramDeclaration.prototype.evalSelector	= function() {
	var L = [];
	var P = Pnode.prototype.getNode( this.varDef.programId );
	if(P) {L.push(P);} else {console.error("\tThere is no program", this.varDef.programId);}
	return L;
}

PprogramDeclaration.prototype.serialize	= function() {
	var children = this.children; this.children = [];
	var json =	PvariableDeclaration.prototype.serialize.apply(this, []);
	json.varDef.programId = this.varDef.programId;
	this.children = children;
	return json;
}

PprogramDeclaration.prototype.unserialize	= function(json, Putils) {
	PvariableDeclaration.prototype.unserialize.apply(this, [json, Putils]);
	// className and id are fixed by the constructor of the object itself
	// console.log("<PprogramDeclaration::unserialize programId", json.varDef.programId, ">");
	if(json.varDef.programId !== null) {
		 var subProgram = Pnode.prototype.getNode( json.varDef.programId );
		 if(subProgram) {
			 console.log("There is a node identified by", json.varDef.programId, ":", subProgram.className);
			 this.varDef.programId	= json.varDef.programId;
			 subProgram.setParent(this);
			 console.log("\tparent of", subProgram.id, "is", subProgram.parent?subProgram.parent.id:'NONE');
			} else {console.log("There is no node identified by", json.varDef.programId);}
		}
	if(this.varDef.programId === null) {
		 console.log("Creating a new sub-program for", json.varDef.programId);
		 var pg = new ProgramNode().init(); console.log("\tProgramNode id is", pg.id);
		 pg.setParent(this);
		 if(json.varDef.programId) {
			 console.log("\tsubprogram id set to", json.varDef.programId, json);
			 pg.substituteIdBy(json.varDef.programId);
			}
		 this.varDef.programId = pg.id;
		 console.log("\tsubprogram identified by", this.varDef.programId);
		}
	return this;
} 


module.exports = PprogramDeclaration;

