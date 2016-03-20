var utils				= require( "../../../js/utils.js" )
  , subscribeForEvent	= require( "./subscribeForEvent.js" )
  ;

module.exports = function(app) {
	app.directive( "bleBrick"
				 , function() {
					 return {
						restrict	: 'E',
						scope		: {brick	: "="},
						controller	: function($scope) {
							var ctrl			= this;
							this.isConnecting	= false;
							var notifications   = {};
							this.connect		= function() {
								console.log( "connecting to", $scope.brick.id );
								ctrl.isConnecting = true; $scope.$applyAsync();
								utils.call( $scope.brick.id, "connect", [] 
										  ).then( function(/*res*/) {
													 $scope.brick.isConnected	= true;
													}
												, function(err) {
													 console.error("error connecting to", $scope.brick.id, ":", err);
													} 
										  ).then( function() {
													 ctrl.isConnecting = false;
													 $scope.$applyAsync();
													} 
										  );
							}
							this.disconnect		= function() {
								console.log( "disconnecting from", $scope.brick.id );
								ctrl.isConnecting = true; $scope.$applyAsync();
								utils.call( $scope.brick.id, "disconnect", [] 
										  ).then( function(/*res*/) {
													 $scope.brick.isConnected	= false;
													}
												, function(err) {
													 console.error("error disconnecting from", $scope.brick.id, ":", err);
													} 
										  ).then( function() {
													 ctrl.isConnecting = false;
													 $scope.$applyAsync();
													}
										  );
							}
							
							this.notifyCharacteristic   = function(characteristic){
								utils.call( $scope.brick.id, "notifyCharacteristic", [characteristic.uuid, true]
										  ).then( function(res) {
												console.log("notifyCharacteristic =>", res);
												characteristic.stringInput = res;
												var cb = notifications[characteristic.uuid];
												if(!cb) {
													cb = function(eventData) {
														console.log("notification", characteristic.uuid, ":", eventData);
														characteristic.stringInput = eventData.utf8;
														$scope.$applyAsync();
													};
													console.log("subscribeForEvent", $scope.brick, characteristic.uuid);
													subscribeForEvent($scope.brick, characteristic.uuid, null, cb);
												}
										  } );
							}
							this.readCharacteristic		= function(characteristic) {
								utils.call( $scope.brick.id, "readCharacteristic", [characteristic.uuid]
										  ).then( function(res) {
											  console.log("readCharacteristic =>", res);
											  characteristic.stringInput = res;
											  $scope.$apply();
										  } );
							}
							this.writeCharacteristic	= function(characteristic, value) {
								utils.call( $scope.brick.id, "writeCharacteristic", [characteristic.uuid, value + "\r\n"]
										  ).then( function(res) {
											  console.log("writeCharacteristic =>", res);
											  characteristic.stringInput = res.utf8;
											  $scope.$apply();
										  } );
							}
							
						},
						controllerAs: "ctrl",
						templateUrl	: "/IHM/js/BLE/templates/bleBrick.html",
						link		: function(scope, element/*, attr, controller*/) {
							subscribeForEvent( scope.brick, "updateDescription", element
											 , function(event) {
												  scope.$applyAsync( function() {scope.brick.services = event.services;} );
												 } 
											 );
						}
					 };
				 });
}