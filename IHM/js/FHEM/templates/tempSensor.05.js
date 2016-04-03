var BrickFhem = require( "./BrickFhem.js" );

module.exports = function($scope, utils) {
	BrickFhem.apply(this, [$scope, utils]);

	this.update = function(event) {
		console.log( "tempSensor.05.js -> update with", event);
		this.brick.state = event;
		$scope.$applyAsync();
	}

}
