define( [ './Pnode.js'
	    ]
	  , function(Pnode) {
// console.log('Pnode is a ', Pnode);
// Definition of a node for programs
var PvariableDeclaration = function(parent, children) {
	 Pnode.prototype.constructor.apply(this, [parent, children]);
	 this.varDef  = { id	: ''
					, val	: null
					};
	 return this;
	}

// API for starting, stopping the instruction
PvariableDeclaration.prototype = new Pnode();
PvariableDeclaration.prototype.className	= 'PvariableDeclaration';
Pnode.prototype.appendClass( PvariableDeclaration );

var classes = Pnode.prototype.getClasses().slice();
classes.push(PvariableDeclaration.prototype.className);
PvariableDeclaration.prototype.getClasses	= function() {return classes;};

PvariableDeclaration.prototype.serialize	= function() {
	var json =	Pnode.prototype.serialize.apply(this, []);
	json.varDef = { id	:  this.varDef.id
				  , val	:  this.varDef.val
				  };
	return json;
}
PvariableDeclaration.prototype.unserialize	= function(json, Putils) {
	Pnode.prototype.unserialize.apply(this, [json, Putils]);
	// className and id are fixed by the constructor of the object itself
	 this.varDef  = { id	: json.varDef.id
					, val	: json.varDef.val
					};
	return this;
} 


return PvariableDeclaration;
});
