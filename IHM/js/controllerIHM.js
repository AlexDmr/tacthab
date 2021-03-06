require( "angular-material/angular-material.css" );
require( "./controllerIHM.css" );
require( "./openHab/openHab.css" );
// var ngDraggable = require( "ng-draggable" );

var utils			= require( "../../js/utils.js"	)
  , context			= {bricks: {}}
  , angular			= require( "angular"			)
  , angularMaterial	= require( "angular-material"	)
  ;

utils.initIO( location.hostname + ":" + location.port + "/m2m" );
// utils.initIO(  );

var filters = require( "./filters.js" );
console.log( "require filters", filters);

// hdfgjhdfgjdf;

function processContextTypes( context, type ) {
	var nb, i;
	if(type) {
		nb = context.brickTypes[type].instances.length;
		for(i=0; i<context.brickTypes[type].specializations.length; i++) {
			nb += processContextTypes( context, context.brickTypes[type].specializations[i] );
		}
		context.brickTypes[type].nbInstances = nb;
	} else {
		for(type in context.brickTypes) {
			processContextTypes(context, type);
		}
	}
	return nb;
}

var app =
angular	.module( "ihmActivity", [filters, angularMaterial])//"ngMaterial", "ui.router", "angular-toArrayFilter", "ngDraggable"] )
		.filter('toArray', function () {
			return function (obj, addKey) {
				if (!angular.isObject(obj)) return obj;
				if ( addKey === false ) {
					return Object.keys(obj).map(function(key) {
					return obj[key];
					});
					} else {
						return Object.keys(obj).map(function (key) {
						var value = obj[key];
						return angular.isObject(value) ?
						Object.defineProperty(value, '$key', { enumerable: false, value: key}) :
						{ $key: key, $value: value };
						});
					}
			};
		})
		.controller	( "TActHabIHMController"
					, ["$scope", "$http", function($scope, $http) {
						 var ctrl = this;
						 this.context = context;
						 this.context.activities = {}; //localStorage.activities?JSON.parse(localStorage.activities):[];						 
						 $http	.get('/getContext')
								.success( function(data) {
									ctrl.context = data;
									processContextTypes( data );

									console.log("ctrl.context:", ctrl.context);
									utils.io.on	( "brickAppears"
												, function(data) {
													// console.log( "brickAppears", data);
													$scope.$applyAsync( function() {
														var hci_class, i;
														for(i=data.type.length-1; i>=0; i--) {
															if( ctrl.context.brickTypes[ data.type[i] ] ) {
																hci_class = data.type[i];
																break;
															}
														}
														ctrl.context.bricks[data.id] = data;
														if( ctrl.context.brickTypes[ hci_class ] ) {
															var L = ctrl.context.brickTypes[ hci_class ].instances;
															if(L.indexOf(data.id) !== -1) {
																console.error("brick", data.id, "already present in instances of", hci_class, L);
															} else {
																L.push( data.id );
																processContextTypes( ctrl.context );
															}
														} else {console.error("No bricktype for", data.class, data, "\n", ctrl.context.brickTypes); }
													});
												});
									utils.io.on	( "brickDisappears"
												, function(data) {
													// console.log("brick brickDisappears", data);
													$scope.$applyAsync( function() {
														delete ctrl.context.bricks[data.brickId];
														if( ctrl.context.brickTypes[ data.class ] ) {
															var L 	= ctrl.context.brickTypes[ data.class ].instances
															  , pos = L.indexOf( data.brickId )
															  ;
															if(pos>=0) {
																L.splice(pos, 1);
																processContextTypes( ctrl.context );
															}
														}
													});
												});
								});
						}]
					)
		;

console.log( "Loading directives" );
require( "./brick/brick.js" 				)(app);
require( "./brick/mediaPlayer.js" 			)(app);
require( "../templates/mediaSelector.js" 	)(app);
require( "./alxDragDrop.js" 				)(app);
require( "./activities/alxActivities.js" 	)(app);
require( "./activities/alxActivity.js" 		)(app);
require( "./UPnP/UPnP.js" 					)(app);
require( "./openHab/openHab.js" 			)(app);
require( "./BLE/BLE.js" 					)(app);
require( "./FHEM/fhem.js" 					)(app);
require( "./socketBus/socketBus.js" 		)(app);
