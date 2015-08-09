var Pnode		= require( './Pnode.js' )
  , Pselector	= require( './Pselector.js' )
  , Brick		= require( '../Bricks/Brick.js' )
  ;

// console.log('Pnode is a ', Pnode);
// Definition of a node for programs
var Pselector_ObjType = function() {
	 Pnode.prototype.constructor.apply(this, []);
	 return this;
	}

// API for starting, stopping the instruction
Pselector_ObjType.prototype = Object.create(Pselector.prototype); //new Pselector();
Pselector_ObjType.prototype.constructor	= Pselector_ObjType;
Pselector_ObjType.prototype.className	= 'Pselector_ObjType';
Pnode.prototype.appendClass( Pselector_ObjType );

var classes = Pselector.prototype.getClasses().slice();
classes.push(Pselector_ObjType.prototype.className);
Pselector_ObjType.prototype.getClasses	= function() {return classes;};

Pselector_ObjType.prototype.init		= function(parent, children) {
	Pselector.prototype.init.apply(this, [parent, children]);
	this.selector = {};
	return this;
}

Pselector_ObjType.prototype.evalSelector	= function() {
	var context	= this.getContext()
	  , res		= [], i;
	console.log("Pselector_ObjType::evalSelector for", this.selector.objectsType);
	if(this.selector.objectsType) {
		 for(i in context.bricks) {
			 if(  context.bricks[i].getTypeName // Case of pseudo bricks...
			   && context.bricks[i].getTypeName() === this.selector.objectsType) {
					 console.log("\tadd", context.bricks[i].brickId);
					 res.push( context.bricks[i] );
					}// else {console.log("\tNO for", context.bricks[i].getTypeName());}
			}
		}
	 console.log("\t=>", res.length, "bricks");
	return res; 
}

Pselector_ObjType.prototype.updateType = function() {
	Pselector.prototype.updateType.apply(this, []);
	// console.log("Pselector_ObjType::updateType =>", this.selector.objectsType);
	return Brick.prototype.getTypesFromName(this.selector.objectsType);
}

Pselector_ObjType.prototype.serialize	= function() {
	var json =	Pselector.prototype.serialize.apply(this, []);
	json.selector.objectsType	= this.selector.objectsType;
	json.selector.objectsTypes	= Brick.prototype.getTypes(this.selector.objectsType);
	return json;
}

Pselector_ObjType.prototype.unserialize	= function(json, Putils) {
	Pselector.prototype.unserialize.apply(this, [json, Putils]);
	// className and id are fixed by the constructor of the object itself
	console.log("Pselector_ObjType::unserialize", json.selector.objectsType);
	this.selector.objectsType = json.selector.objectsType;
	return this;
}

module.exports = Pselector_ObjType;

