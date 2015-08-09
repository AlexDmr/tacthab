var Pnode = require( './Pnode.js' );

// console.log('Pnode is a ', Pnode);
// Definition of a node for programs
var Pselector = function() {
	Pnode.prototype.constructor.apply(this, []);
	return this;
}

// API for starting, stopping the instruction
Pselector.prototype = Object.create( Pnode.prototype ); //new Pnode();
Pselector.prototype.constructor	= Pselector;
Pselector.prototype.className	= 'Pselector';
Pnode.prototype.appendClass( Pselector );

var classes = Pnode.prototype.getClasses().slice();
classes.push(Pselector.prototype.className);
Pselector.prototype.getClasses	= function() {return classes;};

Pselector.prototype.init		= function(parent, children) {
	Pnode.prototype.init.apply(this, [parent, children]);
	this.selector = {};
	return this;
}

Pselector.prototype.Start			= function() {
	var res = Pnode.prototype.Start.apply(this, []);
	this.Stop();
	return res;
}

Pselector.prototype.getESA			= function() {
	var json	= {}
	  , targets	= this.evalSelector();
	for(var i=0; i<targets.length; i++) {
		 json[targets[i].brickId] = targets[i].getESA();
		}
	return json;
}

Pselector.prototype.evalSelector	= function() {
	var res;
	if(this.children[0]) {
		 res = this.children[0].evalSelector();
		} else {res = [];}
	return res;
}

Pselector.prototype.updateType		= function() {
	this.selector.type = [ 'selector' ];
	for(var i=0; i<this.children.length; i++) {
		 this.children[i].updateType();
		}
	if(this.children[0]) {
		 this.selector.type = this.selector.type.concat( this.children[0].selector.type );
		}
	return this.selector.type;
}

Pselector.prototype.serialize	= function() {
	var json =	Pnode.prototype.serialize.apply(this, []);
	json.selector = { name	: this.selector.name
					, type	: this.selector.type
					};
	return json;
}

Pselector.prototype.unserialize	= function(json, Putils) {
	Pnode.prototype.unserialize.apply(this, [json, Putils]);
	// className and id are fixed by the constructor of the object itself
	this.selector.name	= json.selector.name;
	this.selector.type	= json.selector.type;
	return this;
}

module.exports = Pselector;

