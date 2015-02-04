define( [ './Pnode.js'
		, './Pselector.js'
		, '../Bricks/Brick.js'
	    ]
	  , function(Pnode, Pselector, Brick) {
// console.log('Pnode is a ', Pnode);
// Definition of a node for programs
var Pselector_ObjInstance = function(parent, children) {
	 Pnode.prototype.constructor.apply(this, [parent, children]);
	 this.selector = {};
	 return this;
	}

// API for starting, stopping the instruction
Pselector_ObjInstance.prototype = new Pselector();
Pselector_ObjInstance.prototype.className	= 'Pselector_ObjInstance';
Pnode.prototype.appendClass( Pselector );

var classes = Pselector.prototype.getClasses().slice();
classes.push(Pselector_ObjInstance.prototype.className);
Pselector_ObjInstance.prototype.getClasses	= function() {return classes;};
 
Pselector_ObjInstance.prototype.updateType = function() {
	Pselector.prototype.updateType.apply(this, []);
	// XXX Get type from object if it exists
	if(typeof this.selector.objectId !== 'undefined') {
		 var brick = Brick.prototype.getBrickFromId( this.selector.objectId );
		 this.selector.type = brick.getTypes();
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

return Pselector_ObjInstance;
});
