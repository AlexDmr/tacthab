require( "./alxActivities.css" );
// var utils = require( "../../../js/utils.js" );

module.exports = function(app) {
	app.directive	( "alxActivities"
					, function() {
						return {
							  restrict	: 'E'
							, controller	: function($scope, $mdSidenav) {
								 this.toggleBricks	= function() {$mdSidenav("bricksList").toggle();};
								 this.openBricks	= function() {$mdSidenav("bricksList").open();};
								 this.closeBricks	= function() {$mdSidenav("bricksList").close();};
								 $scope.newActivity = { name		: ""
													  , description	: ""
													  };
								}
							, controllerAs	: 'ctrl'
							, templateUrl	: "/IHM/js/activities/alxActivities.html"
							, scope			: { activities	: "=activities"
											  , context		: "="
											  , title		: "@title"
											  }
							, link			: function(scope, element, attr, controller) {
								// element[0].ontouchstart = function(e) {
									// e.preventDefault();
									// console.log( "e.preventDefault()" );
								// }
							}
						};
					});
}