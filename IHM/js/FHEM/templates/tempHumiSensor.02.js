var BrickFhem = require( "./BrickFhem.js" ).controller;
require( "./tempHumiSensor.02.css" );

module.exports =  {
	template	: require( "./tempHumiSensor.02.html" ),
	controller	: function($scope, utils) {
		var ctrl = this;
		BrickFhem.apply(this, [$scope, utils]);

		this.lastUpdate		= null;
		this.update = function(event) {
			// console.log( "tempHumiSensor.02 -> update with", event);
			$scope.$applyAsync( function() {
				ctrl.lastUpdate				= event.data.time;
				ctrl.brick.fhem.temperature	= event.data.temperature;
				ctrl.brick.fhem.humidity	= event.data.humidity;
			} );
		}
	}
}; // module.exports

