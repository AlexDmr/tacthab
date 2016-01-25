var id = 0;

var Pnode = function(scope) {
	this.PnodeControllerId = id++;
	if(scope) {scope.Pnode = Pnode;}
	this.toJSON	= this.toJSON_Pnode = function() {
		var json = {
			className	: this.instruction.className,
			children	: this.instruction.children
		};
		if(this.instruction.subType) {json.subType = this.instruction.subType;}
		return json;
	}
};

Pnode.hasOneType	= function(instruction, types) {
		return types.indexOf( instruction.draggedData.className ) >= 0
			|| types.indexOf( instruction.draggedData.subType	) >= 0 ;
	}

module.exports = Pnode;