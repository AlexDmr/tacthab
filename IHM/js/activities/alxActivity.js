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
var pipo = {
	title		: "End-User DomiCube",
	components	: [],
	inputs		: [],
	outputs		: [],
	logic		: null
};

var controller = function($scope) {
	var ctrl 		= this;
	this.activity 	= pipo;
	this.dataProgram = {
		className: "ParallelNode",
		type	 : ["Pnode", "ControlFlow", "NChildNode", "ParallelNode"], 
		children: [{ 
			className	: 'ActionNode',
			label		: 'Action 1',
			type		: ['Pnode', 'ActionNode']
			},
			{ 
			className	: 'WhenNode',
			type		: ['WhenNode']
			}
		]
	};
	this.appendBrick	= function(data) {
		$scope.$applyAsync( function() {
			ctrl.activity.components.push( data );
		});
	}
}
controller.$inject = ["$scope"];

module.exports = function(app) {
	app.directive	( "alxActivity"
					, function() {
						return {
							  restrict			: 'E'
							, controller		: controller
							, bindToController	: true
							, controllerAs		: 'ctrl'
							, templateUrl		: "/IHM/js/activities/alxActivity.html"
							, scope				: { context	: "<"
												  }
							, link				: function(/*scope, element, attr, controller*/) {
								// Get the program node
								// var HTML_program 	= element[0].querySelector("section.mechanisms > section.program");
								// controller.program 	= new ProgramNode();
								// HTML_program.appendChild( controller.program.init('').Render() );
							}
						};
					});
}
