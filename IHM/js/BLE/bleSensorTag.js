var utils = require( "../../../js/utils.js" )
  ; 
require( "./templates/bleSensorTag.css" );

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
						 try {
						 	cb(eventData.data);
						 } catch(error) {
						 	console.error(error);
						 }
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
							this.acceleration   = {x:0, y:0, z:0};
							this.accelerations  = [];
							this.accelerationsX = "";
							this.accelerationsY = "";
							this.accelerationsZ = "";

							this.enableAccelerometer	= function() {console.log("enableAccelerometer", $scope.brick.id);
																	  utils.call($scope.brick.id, "enableAccelerometer", []
																				).then( function() {return utils.call($scope.brick.id, "notifyAccelerometer", []);} )
																	  			 .then( function() {return utils.call($scope.brick.id, "setAccelerometerPeriod", [100]);} )
																	  			 .then( function() {ctrl.accelerationEnabled = true; $scope.$apply();})
																	 };
							this.disableAccelerometer	= function() {utils.call($scope.brick.id, "disableAccelerometer", []
																				).then( function() {ctrl.accelerationEnabled = false;})
																	 };
						},
						controllerAs: "ctrl",
						templateUrl	: "/IHM/js/BLE/templates/bleSensorTag.html",
						//templateNamespace: "svg",
						link		: function(scope, element, attr, controller) {
							console.log("create bleSensorTag HTML");
							subscribeForEvent(scope.brick, "accelerometerChange", controller, element, function(event) {
								var i, acc, scale = 30;
								//console.log("accelerometerChange", event);
								controller.accelerationEnabled = true;
								Object.assign(controller.acceleration, event);
								controller.accelerations.push( event );
								controller.accelerationsX = "";
								controller.accelerationsY = "";
								controller.accelerationsZ = "";
								for(i=0; i<controller.accelerations.length; i++) {
									acc = controller.accelerations[i];
									controller.accelerationsX += i + " " + scale*acc.x + " ";
									controller.accelerationsY += i + " " + scale*acc.y + " ";
									controller.accelerationsZ += i + " " + scale*acc.z + " ";
								}
								scope.$apply();
							});
							
						}
					 };
				 });
}