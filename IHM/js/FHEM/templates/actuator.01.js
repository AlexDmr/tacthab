var BrickFhem = require( "./BrickFhem.js" ).controller;
require( "./actuator.01.css" );

module.exports = {
	template	: require( "./default.html"),  // require( "./actuator.01.html" ),
	controller	: function($scope, utils) {
		BrickFhem.apply(this, [$scope, utils]);

		this.update = function(event) {
			// console.log( "actuator.01 -> update with", event);
			this.brick.state = event;
			$scope.$applyAsync();
		}
	}
}
