require( "./controllerIHM.css" );
require( "./openHab/openHab.css" );
require( "../bower_components/ngDraggable/ngDraggable.js" );

var utils	= require( "../../js/utils.js" )
  , context	= {bricks: {}}
  ;

utils.initIO( location.hostname + ":" + location.port + "/m2m" );
// utils.initIO(  );

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
													// console.log( "brickAppears", data);
													$scope.$applyAsync( function() {
														ctrl.context.bricks[data.id] = data;
														var L = ctrl.context.brickTypes[ data.class ].instances;
														if(L.indexOf(data.id) !== -1) {
															console.error("brick", data.id, "already present in instances of", data.class, L);
														} else {L.push( data.id );}
													});
												});
									utils.io.on	( "brickDisappears"
												, function(data) {
													// console.log("brick brickDisappears", data);
													$scope.$applyAsync( function() {
														delete ctrl.context.bricks[data.brickId];
														var L 	= ctrl.context.brickTypes[ data.class ].instances
														  , pos = L.indexOf( data.brickId )
														  ;
														if(pos>=0) {L.splice(pos, 1);}
													});
												});
								});
						}
					)
		;

console.log( "Loading directives" );
require( "./brick/brick.js" )(app);
require( "./brick/mediaPlayer.js" )(app);
require( "../templates/mediaSelector.js" )(app);
require( "./alxDragDrop.js" )(app);
require( "./activities/alxActivities.js" )(app);
require( "./activities/alxActivity.js" )(app);
require( "./UPnP/UPnP.js" )(app);
require( "./openHab/openHab.js" )(app);
require( "./BLE/BLE.js" )(app);

