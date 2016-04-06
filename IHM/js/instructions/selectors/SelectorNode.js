require( "./SelectorNode.css" );

var templates = {
	SelectorNode 			: { controller 	: function() {console.log( "new SelectorNode", this.instruction);},
								template 	: require( "./SelectorNode.html" )
								},
	Pselector_ObjInstance	: require( "./templates/SelectorNode_Brick.js" )
};
templates[ undefined ] = templates.SelectorNode;

var controller = function($scope) {
	console.log( "Create a selector controller", this);
	var className = this.instruction?(this.instruction.subType || this.instruction.className):'SelectorNode'
	if(templates[className]) {
		templates[className].controller.apply(this, [$scope]);
	} else {
		console.error( "className", className, "is currently not supported as selector controller..." );
	}
}
controller.$inject = [ "$scope" ];

module.exports = function(app) {
	app.directive	(
		"selector",
		["$compile", function($compile) {
			return {
				  restrict			: 'E'
				, controller		: controller
				, bindToController 	: true
				, controllerAs		: '$ctrl'
				, scope				: { instruction	: "<data"
									  , context		: "<"
									  }
				, link				: function(scope, element, attr, controller) {
					var className = controller.instruction?(controller.instruction.subType || controller.instruction.className):'SelectorNode';
					if(templates[className]) {
						// console.log( "Link instruction", className, templates[className]);
						element.html( templates[className].template );
				 		$compile(element.contents())(scope);
					} else {
						console.error( "className", className, "is currently not supported for templating..." );
					}
				}
			};
		}]
		);
}
