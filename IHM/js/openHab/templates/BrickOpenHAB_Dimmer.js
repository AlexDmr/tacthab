module.exports = function(scope, utils) {
	// console.log( "Create a Dimmer controller", scope.brick.state, this );
	this.userSetDimmer = function() {
		// console.log("userSetDimmer", this.value);
		utils.call	( scope.brick.id
					, "setValue"
					, [this.value]
					);
	}
	this.updateState = function(event, noUpdate) {
		// console.log( "Dimmer event", event.data.value);
		this.value = event.data.value;
		// console.log(this.color);
		if(noUpdate !== true) {scope.$apply();}
	}
	if(typeof scope.brick.state === "string") {scope.brick.state = parseInt(scope.brick.state) || 0;}
	this.updateState( {data: {value: scope.brick.state}}, true );
	
}
