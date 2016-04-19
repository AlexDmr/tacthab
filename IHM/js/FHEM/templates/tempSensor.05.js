var BrickFhem = require( "./BrickFhem.js" ).controller;
require( "./tempSensor.05.css" );

module.exports = {
	template	: require( "./tempSensor.05.html" ),
	controller	: function($scope, utils) {
		var ctrl = this;
		BrickFhem.apply(this, [$scope, utils]);

		this.lastUpdate		= null;
		this.update = function(event) {
			console.log( "tempSensor.05.js -> update with", event);
			$scope.$applyAsync( function() {
				ctrl.lastUpdate				= event.data.time;
				ctrl.brick.fhem.temperature	= event.data.temperature;
			} );
		}
	}
}
