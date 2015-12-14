var utils = require( "../../../js/utils.js" )
  ; 

function subscribeForEvent(brick, eventName, controller, element, cb) {
	var eventCB
	  , cbEventName = brick.id + "->" + eventName;
	utils.io.emit	( "subscribeBrick"
					, { brickId		: brick.id
					  , eventName	: eventName
					  , cbEventName	: cbEventName
					  } 
					);
	utils.io.on	( cbEventName
					, eventCB = function(eventData) {
						 try {cb(eventData.data);} catch(error) {console.error(error);}
						}
					); 
	element.on		( "$destroy"
					, function() {
						 utils.io.off( cbEventName, eventCB);
						 utils.io.emit	( "unSubscribeBrick"
										, { brickId		: brick.brickId
										  , eventName	: eventName
										  , cbEventName	: cbEventName
										  }
										);
						} 
					);
}
module.exports = function(app) {
	app.directive( "bleSensorTag"
				 , function() {
					 return {
						restrict	: 'E',
						scope		: {brick	: "="},
						controller	: function($http, $scope) {
							var ctrl = this;
							this.accelerationEnabled = false;
							utils.acceleration = {x:0, y:0, z:0};
							this.enableAccelerometer	= function() {console.log("enableAccelerometer", $scope.brick.id);
																	  utils.call($scope.brick.id, "enableAccelerometer", []
																				).then( function() {ctrl.accelerationEnabled = true;})
																	 };
							this.disableAccelerometer	= function() {utils.call($scope.brick.id, "disableAccelerometer", []
																				).then( function() {ctrl.accelerationEnabled = false;})
																	 };
						},
						controllerAs: "ctrl",
						templateUrl	: "/IHM/js/BLE/templates/bleSensorTag.html",
						link		: function(scope, element, attr, controller) {
							subscribeForEvent(scope.brick, "accelerometerChange", controller, element, function(event) {
								console.log("accelerometerChange", event);
								controller.accelerationEnabled = true;
								Object.assign(controller.acceleration, event);
								scope.$apply();
							});
							
						}
					 };
				 });
}