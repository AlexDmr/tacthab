

var controllers 	= {
	ParallelNode 				: require( "./templates/ParallelNode.js"	),
	SequenceNode				: require( "./templates/SequenceNode.js"	),
	WhenNode					: require( "./templates/WhenNode.js"		),
	ActionNode					: require( "./templates/ActionNode.js"		)
};

var templates	 	= {
	ParallelNode 				: require( "./templates/ParallelNode.html"	),
	SequenceNode				: require( "./templates/SequenceNode.html"	),
	WhenNode					: require( "./templates/WhenNode.html"		),
	ActionNode					: require( "./templates/ActionNode.html"	)
};

var instructionFct = function(app) {
	/* Pnode serialization
		  className: this.className
		, PnodeID: this.id
		, children: []
	*/
	app.directive	(
		"instruction",
		function($compile) {
			return {
				  restrict			: 'E'
				, controller		: function($scope) {
					// console.log( "Create an instruction controller", this);
					var className = this.instruction.className;
					if(controllers[className]) {
						controllers[className].apply(this, [$scope]);
					} else {
						console.error( "className", className, "is currently not supported as controller..." );
					}
				}
				, bindToController 	: true
				, controllerAs		: 'ctrl'
				, scope				: { instruction	: "=data"
									  }
				, link				: function(scope, element, attr, controller) {
					var className = controller.instruction.className;
					if(templates[className]) {
						// console.log( "Link instruction", className, templates[className]);
						element.html( templates[className] );
				 		$compile(element.contents())(scope);
					} else {
						console.error( "className", className, "is currently not supported for templating..." );
					}
				}
			};
		}
		);
}

instructionFct.instructions = [];
var i, fct;
for(i in controllers) {
	fct = controllers[i];
	instructionFct.instructions.push( {className: i, type: fct.type} );
}


module.exports = instructionFct;