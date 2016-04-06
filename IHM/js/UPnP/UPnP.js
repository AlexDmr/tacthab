require( "./UPnP.css" );

var utils = require( "../../../js/utils.js" );
var templates	=	{ default		: require( "./templates/default.html" )
					};

var controllers	=	{ default		: require( "./templates/default.js" )
					};
					
// Subscribe to openHab messages
// 		openHab_state
// 		openHab_update

var controller = function($scope) {
	var controllerFct	=  controllers[$scope.brick.class]
						|| controllers.default ;
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
							 var template 	=  templates[scope.brick.class]
							 				|| templates.default ;
							 element.html( template );
							 $compile(element.contents())(scope);
							}
					 };
					}]
				)
}
