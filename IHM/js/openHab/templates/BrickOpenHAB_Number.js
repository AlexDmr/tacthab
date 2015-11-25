module.exports = function(scope, utils) {
	// console.log( "Create a Dimmer controller", scope.brick.state, this );
	this.userSetNumber = function(e) {
		// console.log(e, this.value);
		utils.call	( scope.brick.id
					, "setNumber"
					, [this.value]
					);
	}
	this.updateState = function(event, noUpdate) {
		// console.log( "Number event", event);
		this.value = event.data.value;
		// console.log(this.color);
		if(noUpdate !== true) {scope.$apply();}
	}
	if(typeof scope.brick.state !== "number") {scope.brick.state = 0;}
	this.updateState( {data: {value: scope.brick.state}}, true );
}
