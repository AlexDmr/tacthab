var BrickOpenHAB = require( "./BrickOpenHAB.js" );
require( "./BrickOpenHAB_Number.css" );

module.exports = {
	template	: require( "./BrickOpenHAB_Number.html" ),
	controller	: function(scope, utils) {
		BrickOpenHAB.apply(this, [scope, utils]);
		// console.log( "Create a Dimmer controller", scope.brick.state, this );
		this.userSetNumber = function(/*e*/) {
			// console.log(e, this.value);
			utils.call	( this.brick.id
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
		if(typeof this.brick.state !== "number") {this.brick.state = 0;}
		this.updateState( {data: {value: this.brick.state}}, true );
	}
}
