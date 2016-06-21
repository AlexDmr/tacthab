var utils				= require( "../../../js/utils.js" )
  , subscribeForEvent	= require( "./subscribeForEvent.js" )
  , Specs				= {
  		Brick 			: { controller 	: function() {},
							template 	: require( "./templates/bleBrick.html" ),
							link		: function() {} 							},
		BrickMetaWear	: require( "./bleMetaWear.js" )
  }
  ;

var controller = function($scope) {
	var ctrl			= this;
	this.isConnecting	= false;
	var notifications   = {};
	this.connect		= function() {
		console.log( "connecting to", ctrl.brick.id );
		$scope.$applyAsync( function() {ctrl.isConnecting = true;} );
		utils.call( ctrl.brick.id, "connect", [] 
				  ).then( function(/*res*/) {
							 $scope.$applyAsync( function() {ctrl.brick.isConnected	= true;} );
							}
						, function(err) {
							 console.error("error connecting to", $scope.brick.id, ":", err);
							} 
				  ).then( function() {
							 $scope.$applyAsync( function() {ctrl.isConnecting = false;} );
							} 
				  );
	}
	this.disconnect		= function() {
		console.log( "disconnecting from", ctrl.brick.id );
		$scope.$applyAsync( function() {ctrl.isConnecting = false;} );
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
	
	this.notifyCharacteristic   = function(characteristic){
		utils.call( ctrl.brick.id, "notifyCharacteristic", [characteristic.uuid, true]
				  ).then( function(res) {
						console.log("notifyCharacteristic =>", res);
						characteristic.stringInput = res;
						var cb = notifications[characteristic.uuid];
						if(!cb) {
							cb = function(eventData) {
								console.log("notification", characteristic.uuid, ":", eventData);
								$scope.$applyAsync( function() {
									characteristic.stringInput = eventData.utf8;
								});
							};
							console.log("subscribeForEvent", ctrl.brick, characteristic.uuid);
							subscribeForEvent(ctrl.brick, characteristic.uuid, null, cb);
						}
				  } );
	}
	function getResultCB(characteristic) {
		return function(res) {
			var i;
			console.log("getting result =>", res);
			characteristic.stringInput = res.utf8 + ' :: 0x';
			var hex = new Uint8Array(res.data);
			for(i=0; i<hex.length; i++) {
				characteristic.stringInput += ('0' + hex[i].toString(16)).slice(-2).toUpperCase();
			}
			characteristic.stringInput += " :: " + hex;

			$scope.$apply();
		}
  }

	this.readCharacteristic		= function(characteristic) {
		utils.call( ctrl.brick.id, "readCharacteristic", [characteristic.uuid]
				  ).then( getResultCB(characteristic) );
	}
	
	this.writeCharacteristic	= function(characteristic, value) {
		utils.call( ctrl.brick.id, "writeCharacteristic", [characteristic.uuid, value + "\r\n"]
				  ).then( getResultCB(characteristic) );
	}
/*	this.readCharacteristic		= function(characteristic) {
		utils.call( ctrl.brick.id, "readCharacteristic", [characteristic.uuid]
				  ).then( function(res) {
						console.log("readCharacteristic =>", res);
						$scope.$applyAsync( function() {
							characteristic.stringInput = res + " (utf8: " + res.utf8 + ")";
						});
				  } );
	}
	this.writeCharacteristic	= function(characteristic, value) {
		utils.call( ctrl.brick.id, "writeCharacteristic", [characteristic.uuid, value + "\r\n"]
				  ).then( function(res) {
						console.log("writeCharacteristic =>", res);
						$scope.$apply( function() {
					  		characteristic.stringInput = res.utf8;
						});
				  } );
	}*/
	
	// Polymorphism
	var types = this.brick?this.brick.type:[] //'Brick'
	  , i, constr;
	for(i=types.length-1; i>=0; i--) {
		constr = Specs[ types[i] ]?Specs[ types[i] ].controller:undefined;
		if(constr) {
			constr.apply(this, [$scope]);
			this.type = types[i];
			break;
		}
	}
	if( this.type === undefined ) {
		console.error( "Problem no brick controller for",  this);
	}
}
controller.$inject = ["$scope"];
						
module.exports = function(app) {
	app.directive( "bleBrick"
				 , ["$compile", function($compile) {
					 return {
						restrict			: 'E',
						scope				: {brick: "<", ui: "@"},
						controller			: controller,
						controllerAs		: "ctrl",
						bindToController 	: true,
						templateUrl			: "/IHM/js/BLE/templates/bleBrick.html",
						link				: function(scope, element, attr, controller) {
							var uiType = controller.ui || controller.type;
							// Load UI
							if(Specs[uiType]) {
								element.html( Specs[uiType].template );
						 		$compile(element.contents())(scope);
						 	} else {
						 		console.error( "Problem no brick template with type", uiType, "in", controller);
						 	}

							// Subscription
							subscribeForEvent( controller.brick, "updateDescription", element
											 , function(event) {
												  scope.$applyAsync( function() {controller.brick.services = event.services;} );
												 } 
											 );
							// Polymorphism
							if(Specs[uiType]) {
								Specs[uiType].link(scope, element, attr, controller);
						 	} else {
						 		console.error( "Problem no brick link with type", uiType, "in", controller);
						 	}

						}
					 };
				 }]);
}