var Pnode		= require( './Pnode.js' )
  , Pselector	= require( './Pselector.js' )
  , Brick		= require( '../Bricks/Brick.js' )
  ;

// console.log('Pnode is a ', Pnode);
// Definition of a node for programs
var Pselector_ObjInstance = function() {
	 Pnode.prototype.constructor.apply(this, []);
	 return this;
	}

// API for starting, stopping the instruction
Pselector_ObjInstance.prototype = Object.create( Pselector.prototype ); //new Pselector();
Pselector_ObjInstance.prototype.constructor	= Pselector_ObjInstance;
Pselector_ObjInstance.prototype.className	= 'Pselector_ObjInstance';
Pnode.prototype.appendClass( Pselector_ObjInstance );

var classes = Pselector.prototype.getClasses().slice();
classes.push(Pselector_ObjInstance.prototype.className);
Pselector_ObjInstance.prototype.getClasses	= function() {return classes;};

Pselector_ObjInstance.prototype.init		= function(parent, children) {
	Pselector.prototype.init.apply(this, [parent, children]);
	this.selector = {};
	return this;
}

Pselector_ObjInstance.prototype.evalSelector	= function() {
	var context	= this.getContext()
	  , brick	= Brick.prototype.getBrickFromId( this.selector.objectId )
	  , res		= [];
	if(brick) {
		 if(typeof context.bricks[ brick.brickId ] !== 'undefined') {
			 res.push(brick);
			} else {console.error("There is no brick", brick.brickId, "in the context");}
		} else {console.error("There is no brick identified by", this.selector.objectId);}
	return res; //[ Brick.prototype.getBrickFromId( this.selector.objectId ) ];
}

Pselector_ObjInstance.prototype.updateType = function() {
	Pselector.prototype.updateType.apply(this, []);
	// XXX Get type from object if it exists
	if(typeof this.selector.objectId !== 'undefined') {
		 var brick = Brick.prototype.getBrickFromId( this.selector.objectId );
		 if(brick) {this.selector.type = brick.getTypes();}
		}
	return this.selector.type;
}

Pselector_ObjInstance.prototype.serialize	= function() {
	var json =	Pselector.prototype.serialize.apply(this, []);
	json.selector.objectId	= this.selector.objectId;
	return json;
}

Pselector_ObjInstance.prototype.unserialize	= function(json, Putils) {
	Pselector.prototype.unserialize.apply(this, [json, Putils]);
	// className and id are fixed by the constructor of the object itself
	this.selector.objectId = json.selector.objectId;
	return this;
}

module.exports = Pselector_ObjInstance;
