var actions = require( "./actions/actions.js" ),
	events	= require( "./events/events.js" )
	;

var i, json, ctrl;

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

// Register instructions classified with respect to their type (workflow, brick type, ...)
// instructionTypes
// 	name
// 	instructions
// 		|
// 		|
var workflow		 = {name: 'Workflow', instructions: []}
  , instructionTypes = {workflow: workflow};
for(i in controllers) {
	console.log( "instruction", i);
	// Instantiate : check if no problem with scope
	ctrl = new controllers[i]();
	// Implement a toJSON method for controller in order to serialize
	json = ctrl.toJSON(); //JSON.stringify( ctrl );
	// Save the JSON
	workflow.instructions.push( json );
}

// Register instructions related to ACTIONS
var brickType, nodeType, id, instructionType;
for(brickType in actions) {
	instructionType 	= {name: brickType, instructions: []};
	instructionTypes[brickType] = instructionType;
	for(nodeType in actions[brickType]) {
		id = brickType + '/' + nodeType;
		controllers [id] = ctrl = actions[brickType][nodeType].controller	;
		templates	[id] = actions[brickType][nodeType].template	;
		// Save in instructionsTypes
		console.log( "instruction", id);
		ctrl = new controllers[id]();
		// Implement a toJSON method for controller in order to serialize
		json = ctrl.toJSON(); //JSON.stringify( ctrl );
		// Save the JSON
		instructionType.instructions.push( json );
	}
}

// Register instructions related to EVENTS
for(brickType in events) {
	instructionType 	= instructionTypes[brickType] || {name: brickType, instructions: []};
	instructionTypes[brickType] = instructionType;
	for(nodeType in events[brickType]) {
		id = brickType + '/' + nodeType;
		controllers [id] = events[brickType][nodeType].controller	;
		templates	[id] = events[brickType][nodeType].template	;
		// Save in instructionsTypes
		ctrl = new controllers[id]();
		// Implement a toJSON method for controller in order to serialize
		json = ctrl.toJSON(); //JSON.stringify( ctrl );
		// Save the JSON
		instructionType.instructions.push( json );
	}
}

console.log( "instructionTypes:", instructionTypes);

// Register the instruction directive in Angular
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
					var className = this.instruction.subType || this.instruction.className;
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
					var className = controller.instruction.subType || controller.instruction.className;
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
var fct;
for(i in controllers) {
	fct = controllers[i];
	instructionFct.instructions.push( {className: i, type: fct.type} );
}

instructionFct.instructionTypes = instructionTypes;

module.exports = instructionFct;