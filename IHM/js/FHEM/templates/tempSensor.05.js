require( "./tempSensor.05.css" );

var BrickFhem = require( "./BrickFhem.js" );

module.exports = function($scope, utils) {
	var ctrl = this;
	BrickFhem.apply(this, [$scope, utils]);

	this.lastUpdate		= null;
	this.temperature	= null;
	this.update = function(event) {
		console.log( "tempSensor.05.js -> update with", event);
		this.brick.state = event;
		$scope.$applyAsync( function() {
			ctrl.lastUpdate		= event.time;
			ctrl.temperature	= event.temperature;
		} );
	}

}
