require( "./alxActivity.css" );
// var utils = require( "../../../js/utils.js" );

/* Activity :
 *	- name			: string
 *	- description	: HTML code
 *	- subActivities	: []
 *	- automatisms	: []
 *	- hci			: {}
 *	- parameters	: {}
 *	- context		: { bricks	: {}
					  , users	: {}
					  }
*/

module.exports = function(app) {
	app.directive	( "alxActivity"
					, function() {
						return {
							  restrict	: 'E'
							, controller	: function($scope) {
								 this.activity = $scope.activity;
								 
								}
							, controllerAs	: 'ctrl'
							, templateUrl	: "/IHM/js/activities/alxActivity.html"
							, scope			: { activity	: "=activity"
											  }
							, link			: function(scope, element, attr, controller) {}
						};
					});
}
