module.exports = function(scope, utils) {
	// console.log( "Create a switch controller", scope.brick.state, this );
	this.userSetSwitch = function() {
		// console.log(e, this.value);
		utils.call	( scope.brick.id
					, "setState"
					, [this.value?"ON":"OFF"]
					);
	}
	this.updateState = function(event, noUpdate) {
		// console.log( "Switch event", event);
		this.value = event.data.value === "ON";
		// console.log(this.color);
		if(noUpdate !== true) {scope.$apply();}
	}
	this.updateState( {data: {value: scope.brick.state}}, true );
	
}
