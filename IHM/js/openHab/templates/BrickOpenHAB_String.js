module.exports = function(scope, utils) {
	// console.log( "Create a color controller", this, scope );
	this.userSetText = function() {
		utils.call	( scope.brick.id
					, "setString"
					, [scope.brick.state]
					);
	}
	this.updateState = function(event, noUpdate) {
		console.log( "string update", event.data.value );
		scope.brick.state = event.data.value;
		if(noUpdate !== true) {scope.$apply();}
	}
	
	this.updateState( {data: {value: scope.brick.state}}
					, true 
					);
}
