require( "./brick.css" );

module.exports = function(app) {
	app.directive	( "brickItem"
					, function() {
						 return { restrict		: 'A'
								, controller	: function() {
									 console.log( "new brick" );
									}
								, controllerAs	: 'brickItemController'
								, templateUrl	: "/IHM/js/brick/brick.html"
								, scope			: { brick	: "=brick"
												  }
								, link			: function(scope, element, attr, controller) {
									}
								};
						}
					);
};

