var BrickOpenHAB = require( "./BrickOpenHAB.js" );

module.exports = function(scope, utils) {
	BrickOpenHAB.apply(this, [scope, utils]);
	// console.log( "Create a Dimmer controller", scope.brick.state, this );
	this.userSetDimmer = function() {
		// console.log("userSetDimmer", this.value);
		utils.call	( this.brick.id
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
	if(typeof this.brick.state === "string") {this.brick.state = parseInt(this.brick.state) || 0;}
	this.updateState( {data: {value: this.brick.state}}, true );
	
}
