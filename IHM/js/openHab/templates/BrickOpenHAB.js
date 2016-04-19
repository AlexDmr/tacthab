// var utils = require( "../../../../js/utils.js" );

module.exports = function($scope, utils) {
	var ctrl = this;
	var cbEventName = this.brick.id + "::state";
	this.iconURL = "images/icons/openHab.png";
	utils.io.emit	( "subscribeBrick"
					, { brickId		: this.brick.id
					  , eventName	: "state"
					  , cbEventName	: cbEventName
					} 
					);
	this.updateState = function(event) {
		this.brick.state = event.data.value;
		$scope.$applyAsync();
	}
	utils.io.on	( cbEventName
				, function(event) {
					 // console.log("brickOpenhab event:", event);
					 ctrl.updateState(event);
					}
				);
	this.setState = function() {
		// console.log( "state", this.brick.state);
		utils.call	( this.brick.id
					, "setState"
					, [this.brick.state]
					);
	}
}

module.exports.controller	= module.exports;
module.exports.template		= require( "../../brick/brick.html" );