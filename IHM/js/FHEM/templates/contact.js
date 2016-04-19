var BrickFhem = require( "./BrickFhem.js" ).controller;
require( "./contact.css" );

module.exports = {
	template	: require( "./contact.html" ),
	controller	: function($scope, utils) {
		// var ctrl = this;
		BrickFhem.apply(this, [$scope, utils]);

		console.log( "Fhem contact", this );

		this.stateIconURL = this.brick.fhem.isOpen?"/IHM/js/FHEM/templates/images/open.svg":"/IHM/js/FHEM/templates/images/close.svg";

		this.update = function(event) {
			console.log( "contact -> update with", event);
			if(event.data && (event.data.isOpen !== undefined)) {
				this.brick.fhem.isOpen = event.data.isOpen;
				this.stateIconURL = this.brick.fhem.isOpen?"/IHM/js/FHEM/templates/images/open.svg":"/IHM/js/FHEM/templates/images/close.svg";
			}
			$scope.$applyAsync();
		}
	}
};
