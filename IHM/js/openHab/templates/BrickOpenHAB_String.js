var BrickOpenHAB = require( "./BrickOpenHAB.js" );
require( "./BrickOpenHAB_String.css" );

module.exports = {
	template	: require( "./BrickOpenHAB_String.html" ),
	controller	: function(scope, utils) {
		BrickOpenHAB.apply(this, [scope, utils]);
		// console.log( "Create a color controller", this, scope );
		this.userSetText = function() {
			utils.call	( this.brick.id
						, "setString"
						, [this.brick.state]
						);
		}
		this.updateState = function(event, noUpdate) {
			console.log( "string update", event.data.value );
			this.brick.state = event.data.value;
			if(noUpdate !== true) {scope.$apply();}
		}
		
		this.updateState( {data: {value: this.brick.state}}
						, true 
						);
	}
}
