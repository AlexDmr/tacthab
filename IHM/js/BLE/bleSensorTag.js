var utils = require( "../../../js/utils.js" )
  ; 
require( "./templates/bleSensorTag.css" );

function subscribeForEvent(brick, eventName, element, cb) {
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
							this.acc   = { data: [], period: 100, maxSize: 200, enabled: false
										 , name 		: "Accelerometer"};
							this.gyro  = { data: [], period: 100, maxSize: 200, enabled: false
										 , name 		: "Gyroscope"};
							this.compas = { data: [], period: 100, maxSize: 200, enabled: false
										 , enable 		: "Magnetometer"};
							this.IR_temperature = { data: [], period: 100, maxSize: 200, enabled: false
										 , name 		: "IrTemperature"};
							this.Humidity = { data: [], period: 100, maxSize: 200, enabled: false
										 , name 		: "Humidity"};
							this.BarometricPressure = { data: [], period: 100, maxSize: 200, enabled: false
										 , name 		: "BarometricPressure"};
							this.Luxometer = { data: [], period: 100, maxSize: 200, enabled: false
										 , name 		: "Luxometer"};


							this.setPeriodSensor		= function(sensor) {
								if(sensor.enabled) {
									var ms = sensor.period;
									utils.call($scope.brick.id, "set"+sensor.name+"Period", [ms]).then(
										function() {console.log(sensor.name, "<-", ms);}
										);
								}
							};
							this.enableSensor	= function(sensor) {
								console.log("enable"+sensor.name, $scope.brick.id);
								utils.call	($scope.brick.id, "enable"+sensor.name, []
											).then( function() {return utils.call($scope.brick.id, "notify"+sensor.name, []);} )
								  			 .then( function() {return utils.call($scope.brick.id, "set"+sensor.name+"Period", [ctrl.acc.period]);} )
								  			 .then( function() {sensor.enabled = true; $scope.$apply();})
							};
							this.disableSensor	= function(sensor) {
								utils.call	($scope.brick.id, "disable"+sensor.name, []
											).then( function() {sensor.enabled = false;})
							};
						},
						controllerAs: "ctrl",
						templateUrl	: "/IHM/js/BLE/templates/bleSensorTag.html",
						//templateNamespace: "svg",
						link		: function(scope, element, attr, controller) {
							// console.log("create bleSensorTag HTML");
							var processEvent = function(event, sensor) {
								scope.$applyAsync( function() {
									sensor.enabled = true;
									sensor.data.push( event );
									sensor.data.splice(0, sensor.data.length - sensor.maxSize);
								});
							}
							subscribeForEvent( scope.brick, "accelerometerChange", element
											 , function(event) {processEvent(event, controller.acc);} );
							subscribeForEvent( scope.brick, "gyroscopeChange", element
											 , function(event) {processEvent(event, controller.gyro);} );
							subscribeForEvent( scope.brick, "magnetometerChange", element
											 , function(event) {processEvent(event, controller.compas);} );


							subscribeForEvent( scope.brick, "irTemperatureChange", element
											 , function(event) {processEvent(event, controller.IR_temperature);} );
							subscribeForEvent( scope.brick, "humidityChange", element
											 , function(event) {processEvent(event, controller.Humidity);} );
							subscribeForEvent( scope.brick, "barometricPressureChange", element
											 , function(event) {processEvent(event, controller.BarometricPressure);} );
							subscribeForEvent( scope.brick, "luxometerChange", element
											 , function(event) {processEvent(event, controller.Luxometer);} );
						}
					 };
				 });
}