require( "./templates/BrickBLE_server.css" );
var utils = require( "../../../js/utils.js" );

var template = require("./templates/BrickBLE_server.html");
module.exports = function(app) {
	var controller = function($scope) {
		var ctrl = this;
		if(this.brick) {
			utils.subscribeBrick( this.brick.id, "update_BrickBLE_sever", function(event) {
				$scope.$applyAsync( function() {
					console.log( "BrickBLE_server update with", event.data );
					Object.assign(ctrl.brick.BLE_server, event.data);
					console.log( "BLE_server brick:", ctrl.brick );
				});
			});
		}
		this.startScanning	= function() {
			if(this.brick) {utils.call( "BrickBLE_sever", "startScanning", [this.brick.BLE_server.continuousScan]);}
		}
		this.stopScanning	= function() {
			if(this.brick) {utils.call( "BrickBLE_sever", "stopScanning" , []);}
		}
	};
	controller.$inject = ["$scope"];
	app.component( "brickBleServer"
				 , 	{ bindings		: { brick	: "<"
				 					  , context	: "<"
									  }
					, controller	: controller
					, template		: template
					}
				);
}
