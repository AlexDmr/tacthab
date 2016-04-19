var BrickOpenHAB = require( "./BrickOpenHAB.js" );
require( "./BrickOpenHAB_Switch.css" );

module.exports = {
	template	: require( "./BrickOpenHAB_Switch.html" ),
	controller	: function(scope, utils) {
		BrickOpenHAB.apply(this, [scope, utils]);
		// console.log( "Create a switch controller", this.brick.state, this );
		this.userSetSwitch = function() {
			// console.log(e, this.value);
			utils.call	( this.brick.id
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
		this.updateState( {data: {value: this.brick.state}}, true );
	}
}
