var BrickOpenHAB = require( "./BrickOpenHAB.js" );

module.exports = function(scope, utils) {
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
