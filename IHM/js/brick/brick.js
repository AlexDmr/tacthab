require( "./brick.css" );
var utils = require( "../../../js/utils.js" );


module.exports = function(app) {
	var controllers 	= {
		Brick 						: function() {},
		BrickUPnP					: require( "../UPnP/templates/default.js" ),
		BrickOpenHAB_Switch			: require( "../openHab/templates/BrickOpenHAB_Switch.js"			),
		BrickOpenHAB_String			: require( "../openHab/templates/BrickOpenHAB_String.js"			),
		BrickOpenHAB_RollerShutter	: require( "../openHab/templates/BrickOpenHAB_RollerShutter.js"		),
		BrickOpenHAB_Number			: require( "../openHab/templates/BrickOpenHAB_Number.js"			),
		BrickOpenHAB_Dimmer			: require( "../openHab/templates/BrickOpenHAB_Dimmer.js"			),
		BrickOpenHAB_DateTime		: require( "../openHab/templates/BrickOpenHAB_DateTime.js"			),
		BrickOpenHAB_Contact		: require( "../openHab/templates/BrickOpenHAB_Contact.js"			),
		BrickOpenHAB_Color			: require( "../openHab/templates/BrickOpenHAB_Color.js"				)
	};

	var templates	 	= {
		Brick 						: require( "./brick.html" ),
		BrickUPnP					: require( "../UPnP/templates/default.html" ),
		BrickOpenHAB_Switch			: require( "../openHab/templates/BrickOpenHAB_Switch.html"			),
		BrickOpenHAB_String			: require( "../openHab/templates/BrickOpenHAB_String.html"			),
		BrickOpenHAB_RollerShutter	: require( "../openHab/templates/BrickOpenHAB_RollerShutter.html"	),
		BrickOpenHAB_Number			: require( "../openHab/templates/BrickOpenHAB_Number.html"			),
		BrickOpenHAB_Dimmer			: require( "../openHab/templates/BrickOpenHAB_Dimmer.html"			),
		BrickOpenHAB_DateTime		: require( "../openHab/templates/BrickOpenHAB_DateTime.html"		),
		BrickOpenHAB_Contact		: require( "../openHab/templates/BrickOpenHAB_Contact.html"			),
		BrickOpenHAB_Color			: require( "../openHab/templates/BrickOpenHAB_Color.html"			)
	};

	app.directive	( "brick"
					, function($compile) {
						 return { restrict			: 'E'
								, controller		: function($scope) {
									console.log( "new brick", this.brick, $scope );
									var types = this.brick.type
									  , i, constr;
									for(i=types.length-1; i>=0; i--) {
										constr = controllers[ types[i] ];
										if(constr) {
											constr.apply(this, [$scope, utils]);
											this.type = types[i];
											break;
										}
									}
								}
								, bindToController 	: true
								, controllerAs		: 'ctrl'
								, templateUrl		: "/IHM/js/brick/brick.html"
								, scope				: { brick	: "=data"
													  }
								, link				: function(scope, element, attr, controller) {
									// console.log( "link:", templates[controller.type] );
									element.html( templates[controller.type] );
							 		$compile(element.contents())(scope);
								}
								};
						}
					);
};

