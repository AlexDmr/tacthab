var BrickFhem = require( "./BrickFhem.js" ).controller;
require( "./lightSensor.01.css" );

module.exports = {
	template	: require( "./lightSensor.01.html" ),
	controller	: function($scope, utils) {
		BrickFhem.apply(this, [$scope, utils]);

		this.update = function(event) {
			var ctrl = this;
			// console.log( "lightSensor.01 -> update with", event);
			$scope.$applyAsync( function() {
				ctrl.brick.fhem.brightness = event.data.brightness;
			});
		}
	}
};