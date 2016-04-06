require( "./alxActivities.css" );
// var utils = require( "../../../js/utils.js" );
var instructionDir = require( "../instructions/instruction.js" );

var controller = function($scope, $mdSidenav) {
	this.toggleBricks		= function() {$mdSidenav("bricksList"		).toggle();};
	this.openBricks			= function() {$mdSidenav("bricksList"		).open  ();};
	this.closeBricks		= function() {$mdSidenav("bricksList"		).close ();};

	this.toggleInstructions	= function() {$mdSidenav("instructionsList"	).toggle();}
	this.openInstructions	= function() {$mdSidenav("instructionsList"	).open  ();};
	this.closeInstructions	= function() {$mdSidenav("instructionsList"	).close ();};

	this.brickTypeName 		= "Brick";
	this.breadcrumb 		= [ this.brickTypeName ];

	this.updateBreadcrumb 	= function() {
		this.brickTypeName 	= this.breadcrumb[ this.breadcrumb.length-1 ];
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

	// Update instructions
	this.instructionsType 		= instructionDir.instructionTypes;
	this.breadcrumbInstructions	= [ this.instructionsType ];

	this.gotoInstructionsType	= function(type) {
		var pos = this.breadcrumbInstructions.indexOf(type);
		if(pos >= 0) {
			this.breadcrumbInstructions.splice(pos, this.breadcrumbInstructions.length);
		}
		this.breadcrumbInstructions.push(type);
		this.instructionsType = this.breadcrumbInstructions[ this.breadcrumbInstructions.length - 1 ];
	}

	// this.instructionTypes = instructionDir.instructionTypes;
	console.log( "instructionTypes:", this.instructionTypes);
}
controller.$inject = ["$scope", "$mdSidenav"];
				
module.exports = function(app) {
	instructionDir(app);
	app.directive	( "alxActivities"
					, function() {
						return {
							  restrict			: 'E'
							, controller		: controller
							, bindToController 	: true
							, controllerAs		: 'ctrl'
							, templateUrl		: "/IHM/js/activities/alxActivities.html"
							, scope				: { activities	: "=activities"
												  , context		: "<"
												  , title		: "@title"
												  }
							, link				: function(/*scope, element, attr, controller*/) {
							}
						};
					});
}