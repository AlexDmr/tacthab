require( "./UPnP.css" );

var utils = require( "../../../js/utils.js" );

var Specs	=	{ default		: require( "./templates/default.js" )
				};
					
// Subscribe to openHab messages
// 		openHab_state
// 		openHab_update

var controller = function($scope) {
	var controllerFct	=  Specs[$scope.brick.class].controller
						|| Specs.default.controller ;
	controllerFct.apply(this, [$scope, utils]);
}
controller.$inject = ["$scope"];

module.exports = function(app) {
	app.directive	( "brickUpnp"
				, ["$compile", function($compile) {
					 return {
						   restrict		: 'E'
						 , scope		: { brick	: "=data" }
						 , controller	: controller
						 , controllerAs	: "ctrl"
						 , link			: function(scope, element/*, attr, controller*/) {
							 var template 	=  Specs[scope.brick.class].template
							 				|| Specs.default.template ;
							 element.html( template );
							 $compile(element.contents())(scope);
							}
					 };
					}]
				)
}
