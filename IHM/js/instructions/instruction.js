

var controllers 	= {
	ParallelNode 				: require( "./templates/ParallelNode.js"	),
	ActionNode					: require( "./templates/ActionNode.js"		)
};

var templates	 	= {
	ParallelNode 				: require( "./templates/ParallelNode.html"	),
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

instructionFct.instructions = Object.keys( controllers );

module.exports = instructionFct;