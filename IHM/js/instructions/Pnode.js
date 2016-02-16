var id = 0;

var Pnode = function(scope) {
	this.PnodeControllerId = id++;
	this.scope = scope;
	if(scope) {
		scope.Pnode = Pnode;
		Object.setPrototypeOf(Pnode.prototype, Object.getPrototypeOf(this));
		Object.setPrototypeOf(this, Pnode.prototype);
	}
};

Pnode.prototype			= Object.create( {} );
Pnode.prototype.toJSON 	= function() {
	var json = {
		className	: this.instruction.className,
		children	: this.instruction.children,
		type 		: this.type
	};
	if(this.instruction.subType) {json.subType = this.instruction.subType;}
	return json;
}

Pnode.prototype.type = [ 'Pnode' ];
Pnode.prototype.copyInstruction = function(instruction) {
	var obj = JSON.parse(JSON.stringify(instruction));
	if(obj.$$hashKey) {delete obj.$$hashKey;}
	return obj;

}
Pnode.hasOneType	= function(instruction, types) {
		var t;
		for(t=0; t<types.length; t++) {
			if( instruction.type.indexOf(types[t]) >= 0) {return true;}
		}
		return false;
	}

module.exports = Pnode;