var BrickFhem = require( "./BrickFhem.js" ).controller;
require( "./BrickFhemZwave.css" );

module.exports = {
	template	: require( "./BrickFhemZwave.html" ),
	controller	: function($scope, utils) {
		BrickFhem.apply(this, [$scope, utils]);

		var prefixImg = "/IHM/js/FHEM/templates/images/";
		this.iconDevice = prefixImg + "zwave.svg";
		if(this.brick.type.indexOf('SWITCH_BINARY') >= 0) {
			this.iconDevice		= prefixImg + "plug.svg";
			this.triggerAction	= function(event) {
				this.sendSetCommand		( (this.brick.fhem.SWITCH_BINARY === 'on')?"off":"on" );
				event.preventDefault	();
				event.stopPropagation	();
			}
		}

		this.update			= function(event) {
			var ctrl = this;
			// console.log( "BrickFhemZwave -> update with", event);
			$scope.$applyAsync( function() {
				Object.assign(ctrl.brick.fhem, event.data);
			});
		}
	}
};
