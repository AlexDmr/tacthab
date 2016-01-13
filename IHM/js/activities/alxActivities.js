require( "./alxActivities.css" );
// var utils = require( "../../../js/utils.js" );

module.exports = function(app) {
	app.directive	( "alxActivities"
					, function() {
						return {
							  restrict	: 'E'
							, controller	: function($scope, $mdSidenav) {
								 this.toggleBricks		= function() {$mdSidenav("bricksList").toggle();};
								 this.openBricks		= function() {$mdSidenav("bricksList").open();};
								 this.closeBricks		= function() {$mdSidenav("bricksList").close();};

								 this.brickTypeName 	= "Brick";
								 this.breadcrumb 		= [ this.brickTypeName ];

								 this.updateBreadcrumb 	= function() {
									 this.brickTypeName 	= this.breadcrumb[ this.breadcrumb.length-1 ];
									 // this.specializations 	= this.context.brickTypes[brickTypeName].specializations;
									 // console.log( "Display", brickTypeName, this.context.brickTypes[brickTypeName]);
									 // this.instances 		= [];
									 // this.brickTypeName 	= brickTypeName;
									 // this.instances 		= this.context.brickTypes[brickTypeName].instances;
									 // for(i=0; i<L.length; i++) {
									 // 	this.instances.push( this.context.bricks[ L[i] ] );
									 // }
								 };
								 this.updateBreadcrumb();

								 this.gotoType 			= function(type) {
								 	var pos = this.breadcrumb.indexOf(type);
								 	if(pos >= 0) {
								 		this.breadcrumb.splice(pos, this.breadcrumb.length);
								 	}
								 	this.breadcrumb.push(type);
								 	// console.log( "breadcrumb:", this.breadcrumb );
								 	this.updateBreadcrumb();
								 }
								}
							, bindToController 	: true
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