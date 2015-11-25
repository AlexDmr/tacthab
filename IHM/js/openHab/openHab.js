require( "./openHab.css" );

var utils = require( "../../../js/utils.js" );
var templates	=	{ BrickOpenHAB_Switch			: require( "./templates/BrickOpenHAB_Switch.html"		)
					, BrickOpenHAB_String			: require( "./templates/BrickOpenHAB_String.html"		)
					, BrickOpenHAB_RollerShutter	: require( "./templates/BrickOpenHAB_RollerShutter.html")
					, BrickOpenHAB_Number			: require( "./templates/BrickOpenHAB_Number.html"		)
					, BrickOpenHAB_Dimmer			: require( "./templates/BrickOpenHAB_Dimmer.html"		)
					, BrickOpenHAB_DateTime			: require( "./templates/BrickOpenHAB_DateTime.html"		)
					, BrickOpenHAB_Contact			: require( "./templates/BrickOpenHAB_Contact.html"		)
					, BrickOpenHAB_Color			: require( "./templates/BrickOpenHAB_Color.html"		)
					};

var controllers	=	{BrickOpenHAB_Switch			: require( "./templates/BrickOpenHAB_Switch.js"			)
					, BrickOpenHAB_String			: require( "./templates/BrickOpenHAB_String.js"			)
					, BrickOpenHAB_RollerShutter	: require( "./templates/BrickOpenHAB_RollerShutter.js"	)
					, BrickOpenHAB_Number			: require( "./templates/BrickOpenHAB_Number.js"			)
					, BrickOpenHAB_Dimmer			: require( "./templates/BrickOpenHAB_Dimmer.js"			)
					, BrickOpenHAB_DateTime			: require( "./templates/BrickOpenHAB_DateTime.js"		)
					, BrickOpenHAB_Contact			: require( "./templates/BrickOpenHAB_Contact.js"		)
					, BrickOpenHAB_Color			: require( "./templates/BrickOpenHAB_Color.js"			)
					};
					
// Subscribe to openHab messages
// 		openHab_state
// 		openHab_update


module.exports = function(app) {
	app.directive( "openHab"
				 , function() {
					 return {
						  restrict		: 'E'
						, scope			: { config	: "=config"
										  , brick	: "=brick"
										  }
						, controller	: function($scope, $mdToast) {
							 // console.log( utils );
							 
							 $scope.config = $scope.config || {};
							 $scope.config.MQTT_host	= $scope.config.MQTT_host	|| "127.0.0.1";
							 $scope.config.MQTT_port	= $scope.config.MQTT_port	|| 1883;
							 $scope.config.MQTT_prefix	= $scope.config.MQTT_prefix	|| "a4h";
							 $scope.config.logMQTT		= $scope.config.logMQTT		|| "";
							 $scope.config.host			= $scope.config.host		|| "127.0.0.1";
							 $scope.config.port			= $scope.config.port		|| "8080";
							 this.connect	= function() {
								 utils.XHR( "POST", "/openHAB"
										  , { MQTT_host		: $scope.config.MQTT_host
											, MQTT_port		: $scope.config.MQTT_port
											, MQTT_prefix	: $scope.config.MQTT_prefix
											, logMQTT		: $scope.config.logMQTT
											, host			: $scope.config.host
											, port			: $scope.config.port
											}
										  ).then( function(xhr) {
														 console.log("MQTT connected", xhr);
														 var json, message;
														 try {json = JSON.parse(xhr.responseText);} catch(errParse) {}
														 message = json.error?json.error:"MQTT connected";
														 $mdToast.show(
																$mdToast.simple().content(message).hideDelay(3000)
																);
														}
												, function(xhr) {
														 $mdToast.show(
																$mdToast.simple().content( "MQTT error: " + xhr.responseText ).hideDelay(3000)
																);
														}
												);
								}
							}
						, controllerAs	: "openHabCtrl"
						, templateUrl	: "/IHM/js/openHab/openHab.html"
						, link			: function(scope, element, attr, controller) {
							 //
							}
					 } 
					}
				) 
	.directive	( "brickOpenhab"
				, function($compile) {
					 return {
						   restrict		: 'E'
						 , scope		: { brick	: "=data" }
						 , controller	: function($scope) {
							 // console.log("brick:", $scope.brick);
							 var ctrl = this;
							 var cbEventName = $scope.brick.id + "::state";
							 utils.io.emit	( "subscribeBrick"
											, { brickId		: $scope.brick.id
											  , eventName	: "state"
											  , cbEventName	: cbEventName
											  } 
											);
							 this.updateState = function(event) {
								 $scope.brick.state = event.data.value;
								 $scope.$apply();
								}
							 utils.io.on	( cbEventName
											, function(event) {
												 // console.log("brickOpenhab event:", event);
												 ctrl.updateState(event);
												}
											);
							 this.setState = function() {
								 // console.log( "state", $scope.brick.state);
								 utils.call	( $scope.brick.id
											, "setState"
											, [$scope.brick.state]
											);
								}
							 if( typeof controllers[$scope.brick.class] === "function" ) {
								 controllers[$scope.brick.class].apply(this, [$scope, utils])
								}
							}
						 , controllerAs	: "ctrl"
						 , link			: function(scope, element, attr, controller) {
							 element.html( templates[scope.brick.class] );
							 $compile(element.contents())(scope);
							}
					 };
					}
				)
}
