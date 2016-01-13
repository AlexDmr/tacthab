require( "./alxBrickType.css" );
// var utils = require( "../../../js/utils.js" );

module.exports = function(app) {
	app.directive	( "alxBrickType"
					, function() {
						return {
							  restrict	: 'E'
							, controller	: function($scope) {
								 $scope.brickType 		= $scope.context.brickTypes[ $scope.type ];
								 //$scope.nb_instances 	= $scope.brickType.instances.l;								 
								}
							, controllerAs	: 'ctrl'
							, templateUrl	: "/IHM/js/brick/alxBrickType.html"
							, scope			: { context		: "="
											  , type		: "@type"
											  }
							, link			: function(scope, element, attr, controller) {
								// 
							}
						};
					});
}