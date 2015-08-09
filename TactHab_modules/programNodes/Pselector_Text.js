var Pnode		= require( './Pnode.js' )
  , Pselector	= require( './Pselector.js' )
  ;

// console.log('Pnode is a ', Pnode);
// Definition of a node for programs
var Pselector_Text = function() {
	 Pnode.prototype.constructor.apply(this, []);
	 return this;
	}

// API for starting, stopping the instruction
Pselector_Text.prototype = Object.create( Pselector.prototype ); //new Pselector();
Pselector_Text.prototype.constructor	= Pselector_Text;
Pselector_Text.prototype.className		= 'Pselector_Text';
Pnode.prototype.appendClass( Pselector_Text );

var classes = Pselector.prototype.getClasses().slice();
classes.push(Pselector_Text.prototype.className);
Pselector_Text.prototype.getClasses	= function() {return classes;};

Pselector_Text.prototype.init			= function(parent, children) {
	Pselector.prototype.init.apply(this, [parent, children]);
	this.selector = {text: ''};
	return this;
}

Pselector_Text.prototype.evalSelector	= function() {
	return this.selector.text;
}

Pselector_Text.prototype.updateType		= function() {
	Pselector.prototype.updateType.apply(this, []);
	return [ 'Text' ];
}

Pselector_Text.prototype.serialize		= function() {
	var json		= Pselector.prototype.serialize.apply(this, []);
	json.selector	= this.selector;
	return json;
}

Pselector_Text.prototype.unserialize	= function(json, Putils) {
	Pselector.prototype.unserialize.apply(this, [json, Putils]);
	this.selector = json.selector;
	return this;
}

module.exports = Pselector_Text;

