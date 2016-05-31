var BrickFhem = require( "./BrickFhem.js" ).controller;
require( "./switch.css" );

module.exports = {
	template	: require( "./switch.html" ),
	controller	: function($scope, utils) {
		var ctrl = this;
		BrickFhem.apply(this, [$scope, utils]);

		this.update = function(event) {
			// console.log( "switch -> update with", event);
			if( event.state ) {
				ctrl.brick.fhem.buttons.state.length = 0;
				event.state.forEach( function(e) {
					ctrl.brick.fhem.buttons.state.push( e );
				});
			}
			if( event.state ) {
				this.brick.fhem.buttons.pressed	= event.pressed;
			}
			$scope.$applyAsync();
		}
	}
}