var BrickOpenHAB = require( "./BrickOpenHAB.js" );
require( "./BrickOpenHAB_RollerShutter.css" );

module.exports = {
	template	: require( "./BrickOpenHAB_RollerShutter.html" ),
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
			console.log( "BrickOpenHAB_RollerShutter event", event, noUpdate);
		}
	}
}
