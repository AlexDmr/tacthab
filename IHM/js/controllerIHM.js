require( "./controllerIHM.css" );
require( "./openHab/openHab.css" );
require( "../bower_components/ngDraggable/ngDraggable.js" );

var utils	= require( "../../js/utils.js" )
  , context	= {bricks: {}}
  ;

utils.initIO( location.hostname + ":" + location.port + "/m2m" );
// utils.initIO(  );
var timer;
function refresh(scope, dt) {
	if(timer) {clearTimeout( timer );}
	timer = setTimeout( function() {scope.$apply(); timer = null;}, dt );
}

var app =
angular	.module( "ihmActivity", ["ngMaterial", "ui.router", "angular-toArrayFilter", "ngDraggable"] )
		.controller	( "TActHabIHMController"
					, function($scope, $http) {
						 var ctrl = this;
						 this.context = context;
						 this.context.activities = {}; //localStorage.activities?JSON.parse(localStorage.activities):[];
						 
						 $scope.filterBrickOpenHAB = function(obj, i, A) {
							 return obj.type.indexOf("BrickOpenHAB") !== -1;
							}
						 
						 $http	.get('/getContext')
								.success( function(data) {
									ctrl.context = data;
									console.log("ctrl.context:", ctrl.context);
									utils.io.on	( "brickAppears"
												, function(data) {
													// console.log( "brickAppears", data );
													ctrl.context.bricks[data.id] = data;
													// $scope.$apply();
													refresh($scope, 100);
												});
									utils.io.on	( "brickDisappears"
												, function(data) {
													// console.log( "brickDisappears", data );
													delete ctrl.context.bricks[data.brickId];
													// $scope.$apply();
													refresh($scope, 100);
												});
								});
						}
					)
		;

require( "./brick/brick.js" )(app);
require( "./brick/mediaPlayer.js" )(app);
require( "../templates/mediaSelector.js" )(app);
require( "./alxDragDrop.js" )(app);
require( "./activities/alxActivities.js" )(app);
require( "./activities/alxActivity.js" )(app);
require( "./openHab/openHab.js" )(app);
require( "./BLE/BLE.js" )(app);

