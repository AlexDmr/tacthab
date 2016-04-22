require( "./brick.css" );
require( "./brickType.css" );
var utils = require( "../../../js/utils.js" );

module.exports = function(app) {
	var Specs 	= {
		Brick 						: { controller 	: function() {},
										template 	: require( "./brick.html" )							},
		brickType					: { controller 	: function() {},
										template 	: require( "./brickType.html" )						},
		BrickUPnP					: require( "../UPnP/templates/default.js" 							),
		BrickUPnP_MediaServer		: require( "../UPnP/templates/BrickUPnP_MediaServer.js" 			),
		BrickUPnP_MediaRenderer		: require( "../UPnP/templates/BrickUPnP_MediaRenderer.js" 			),
		// openHab
		BrickOpenHAB_item			: require( "../openHab/templates/BrickOpenHAB.js" 					),
		BrickOpenHAB_Switch			: require( "../openHab/templates/BrickOpenHAB_Switch.js"			),
		BrickOpenHAB_String			: require( "../openHab/templates/BrickOpenHAB_String.js"			),
		BrickOpenHAB_RollerShutter	: require( "../openHab/templates/BrickOpenHAB_RollerShutter.js"		),
		BrickOpenHAB_Number			: require( "../openHab/templates/BrickOpenHAB_Number.js"			),
		BrickOpenHAB_Dimmer			: require( "../openHab/templates/BrickOpenHAB_Dimmer.js"			),
		BrickOpenHAB_DateTime		: require( "../openHab/templates/BrickOpenHAB_DateTime.js"			),
		BrickOpenHAB_Contact		: require( "../openHab/templates/BrickOpenHAB_Contact.js"			),
		BrickOpenHAB_Color			: require( "../openHab/templates/BrickOpenHAB_Color.js"				),
		// Fhem
		BrickFhem					: require( "../FHEM/templates/BrickFhem.js"							),
		BrickFhem_tempSensor_05		: require( "../FHEM/templates/tempSensor.05.js"						),
		BrickFhem_EnO_4BS			: require( "../FHEM/templates/EnO_4BS.js"							),
		BrickFhem_actuator_01		: require( "../FHEM/templates/actuator.01.js"						),
		BrickFhem_tempHumiSensor_02	: require( "../FHEM/templates/tempHumiSensor.02.js"					),
		BrickFhem_EnO_switch		: require( "../FHEM/templates/switch.js"							),
		BrickFhem_lightSensor_01	: require( "../FHEM/templates/lightSensor.01.js"					),
		BrickFhem_contact			: require( "../FHEM/templates/contact.js"							),
		BrickFhemZwave				: require( "../FHEM/templates/BrickFhemZwave.js" 					)
	};

	var controller = function($scope) {
		// console.log( "new brick", this.brick, $scope );
		var types = this.brick?this.brick.type:[] //'Brick'
		  , i, constr;
		for(i=types.length-1; i>=0; i--) {
			constr = Specs[ types[i] ]?Specs[ types[i] ].controller:undefined;
			if(constr) {
				constr.apply(this, [$scope, utils]);
				this.type = types[i];
				break;
			}
		}
		if( this.type === undefined ) {
			console.error( "Problem no brick controller for",  this);
		}
	}
	controller.$inject = ["$scope"];
	app.directive	( "brick"
					, ["$compile", function($compile) {
						 return { restrict			: 'E'
								, controller		: controller
								, bindToController 	: true
								, controllerAs		: 'ctrl'
								, templateUrl		: "/IHM/js/brick/brick.html"
								, scope				: { brick		: "<data"
													  , ui 			: "@"
													  , brickType	: "<"
													  }
								, link				: function(scope, element, attr, controller) {
									// console.log( "link:", templates[controller.type] );
									var uiType = controller.ui || controller.type;
									if(Specs[uiType]) {
										element.html( Specs[uiType].template );
								 		$compile(element.contents())(scope);
								 	} else {
								 		console.error( "Problem no brick template with type", uiType, "in", controller);
								 	}
								}
								};
						}]
					);
};
