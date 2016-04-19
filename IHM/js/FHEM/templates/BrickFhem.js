// var utils = require( "../../../../js/utils.js" );

module.exports = {
	template	: require( "../../brick/brick.html"	),
	controller	: function($scope, utils) {
		var ctrl = this;
		var cbEventName = this.brick.id + "::update";
		this.iconURL = "images/icons/fhem.png";

		utils.io.emit	( "subscribeBrick"
						, { brickId		: this.brick.id
						  , eventName	: "update"
						  , cbEventName	: cbEventName
						  }
						);
		this.update = function(/*event*/) {
			// this.brick.state = event.data.value;
			$scope.$applyAsync();
		}
		utils.io.on	( cbEventName
					, function(event) {
						 // console.log("brickOpenhab event:", event);
						 ctrl.update(event);
						}
					);
		this.sendCommand = function( cmd ) {
			// console.log( "state", this.brick.state);
			utils.call	( this.brick.id
						, "sendCommand"
						, [cmd]
						);
		}
	}
};