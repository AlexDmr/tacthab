define( [ './Pnode.js'
		, './Pcall.js'
		]
	  , function(Pnode, Pcall) {
var PcontrolBrick = function(parent) {
	 Pnode.prototype.constructor.apply(this, [parent]);
	 this.idControler = 'Controler_' + this.id;
	 return this;
	}
	
PcontrolBrick.prototype = new Pnode();
PcontrolBrick.prototype.constructor = PcontrolBrick;
PcontrolBrick.prototype.className	= 'PcontrolBrick';
Pnode.prototype.appendClass(PcontrolBrick);

var classes = Pnode.prototype.getClasses();
classes.push(PcontrolBrick.prototype.className);
PcontrolBrick.prototype.getClasses	= function() {return classes;};

PcontrolBrick.prototype.serialize		= function() {
	var json = Pnode.prototype.serialize.apply(this, []);
	json.idControler = this.idControler;
	return json;
}
PcontrolBrick.prototype.unserialize		= function(json, Putils) {
	Pnode.prototype.unserialize.apply(this, [json, Putils]);
	return this;
}

return PcontrolBrick;
});
