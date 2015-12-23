require( "./UPnP.css" );

var utils = require( "../../../js/utils.js" );
var templates	=	{ 
					};

var controllers	=	{
					};
					
// Subscribe to openHab messages
// 		openHab_state
// 		openHab_update


module.exports = function(app) {
	.directive	( "brickUpnp"
				, function($compile) {
					 return {
						   restrict		: 'E'
						 , scope		: { brick	: "=data" }
						 , controller	: function($scope) {
							 // console.log("brick:", $scope.brick);
							 var ctrl = this;
							 var cbEventName = $scope.brick.id + "::state";
							 
							 if( typeof controllers[$scope.brick.class] === "function" ) {
								 controllers[$scope.brick.class].apply(this, [$scope, utils])
								}
							}
						 , controllerAs	: "ctrl"
						 , link			: function(scope, element, attr, controller) {
							 if(templates[scope.brick.class]) {
							 	element.html( templates[scope.brick.class] );
							 	$compile(element.contents())(scope);
							}
							}
					 };
					}
				)
}
