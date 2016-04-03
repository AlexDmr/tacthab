var BrickFhem = require( "./BrickFhem.js" );
require( "./EnO_4BS.css" );

module.exports = function($scope, utils) {
	BrickFhem.apply(this, [$scope, utils]);

	this.update = function(event) {
		console.log( "actuator.01 -> update with", event);
		this.brick.state = event;
		$scope.$applyAsync();
	}

}
