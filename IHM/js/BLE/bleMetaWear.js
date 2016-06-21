require( "./templates/bleMetaWear.css" );

var utils				= require( "../../../js/utils.js" )
  , subscribeForEvent	= require( "./subscribeForEvent.js" )
  , template			= require( "./templates/bleMetaWear.html" )
  ;

var controller = function($scope) {
	var ctrl = this;
	this.isConnecting	= false;
	this.button			= { data: [], period: 100, maxSize: 200, enabled: false
						  , name 		: "Button/Switch"};
	this.acc   			= { data: [], period: 100, maxSize: 200, enabled: false
						  , name 		: "Accelerometer"};
	this.gyro  			= { data: [], period: 100, maxSize: 200, enabled: false
						  , name 		: "Gyroscope"};
	this.magnetometer	= { data: [], period: 'MWL_MW_MAG_BMM_150_PP_LOW_POWER', maxSize: 200, enabled: false
						  , name 		: "Magnetometer"};
	this.pressure		= { data: [], period: '2', maxSize: 200, enabled: false
						  , name 		: "Barometer"};
	this.altitude		= { data: [], period: '2', maxSize: 200, enabled: false
						  , name 		: "Barometer"};
	this.temperature	= { data: [], maxSize: 200, enabled: false
						  , name 		: "Temperature"};
	this.luminometer	= { data: [], maxSize: 200, enabled: false
						  , name 		: "Luminometer"};

	this.connect		= function() {
		console.log( "connecting to", ctrl.brick.id );
		$scope.$applyAsync( function() {ctrl.isConnecting = true;} );
		utils.call( ctrl.brick.id, "connect", [] 
				  ).then( function(/*res*/) {
							 $scope.$applyAsync( function() {ctrl.brick.isConnected	= true;} );
							}
						, function(err) {
							 console.error("error connecting to", ctrl.brick.id, ":", err);
							} 
				  ).then( function() {
							 $scope.$applyAsync( function() {ctrl.isConnecting = false;} );
							} 
				  );
	}
	this.disconnect		= function() {
		console.log( "disconnecting from", ctrl.brick.id );
		$scope.$applyAsync( function() {ctrl.isConnecting = true;} );
		utils.call( ctrl.brick.id, "disconnect", [] 
				  ).then( function(/*res*/) {
							 $scope.$applyAsync( function() {ctrl.brick.isConnected	= false;} );
							}
						, function(err) {
							 console.error("error disconnecting from", ctrl.brick.id, ":", err);
							} 
				  ).then( function() {
							 $scope.$applyAsync( function() {ctrl.isConnecting = false;} );
							}
				  );
	}


	this.setPeriodSensor		= function(/*sensor*/) {
		/*if(sensor.enabled) {
			var ms = sensor.period;
			utils.call($scope.brick.id, "set"+sensor.name+"Period", [ms]).then(
				function() {console.log(sensor.name, "<-", ms);}
				);
		}*/
	};
	this.enableSensor	= function(sensor) {
		console.log("enable"+sensor.name, ctrl.brick.id);
		utils.call	(ctrl.brick.id, "enable"+sensor.name, []
					).then( function() {return utils.call(ctrl.brick.id, "notify"+sensor.name, []);} )
					 .then( function() {return utils.call(ctrl.brick.id, "set"+sensor.name+"Period", [sensor.period]);} )
					 .then( function() { $scope.$applyAsync( function() {sensor.enabled = true;} );})
	};
	this.disableSensor	= function(sensor) {
		utils.call	(ctrl.brick.id, "disable"+sensor.name, []
					).then( function() {
						$scope.$applyAsync( function() {sensor.enabled = false;} );
					});
	};
}
controller.$inject = ["$http", "$scope"];
						

function link(scope, element, attr, controller) {
	// console.log("create bleSensorTag HTML");
	var processEvent = function(event, sensor) {
		// console.log("processEvent", event, sensor);
		scope.$applyAsync( function() {
			sensor.enabled = true;
			sensor.data.push( event );
			sensor.data.splice(0, sensor.data.length - sensor.maxSize);
		});
	}
	var altitude, pressure;
	subscribeForEvent( controller.brick, "buttonChange", element
					 , function(event) {processEvent(event, controller.button);} );
	subscribeForEvent( controller.brick, "temperatureChange", element
					 , function(event) {processEvent(event, controller.temperature);} );
	subscribeForEvent( controller.brick, "luminometerChange", element
					 , function(event) {processEvent(event, controller.luminometer);} );
	subscribeForEvent( controller.brick, "accelerometerChange", element
					 , function(event) {processEvent(event, controller.acc);} );
	subscribeForEvent( controller.brick, "gyroscopeChange", element
					 , function(event) {processEvent(event, controller.gyro);} );
	subscribeForEvent( controller.brick, "magnetometerChange", element
					 , function(event) {processEvent(event, controller.magnetometer);} );
	subscribeForEvent( controller.brick, "pressureChange", element
					 , function(event) {
					 		pressure = pressure || event.pressure;
					 		event.pressure = event.pressure - pressure;
					 		processEvent(event, controller.pressure); 
					 	});
	subscribeForEvent( controller.brick, "altitudeChange", element
					 , function(event) {
					 		altitude = altitude || event.altitude;
					 		event.altitude = event.altitude - altitude;
					 		processEvent(event, controller.altitude); 
					 	});
}


module.exports = {
	controller	: controller,
	template	: template,
	link		: link
};
