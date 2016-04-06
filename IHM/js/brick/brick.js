require( "./brick.css" );
var utils = require( "../../../js/utils.js" );


module.exports = function(app) {
	var controllers 	= {
		Brick 						: function() {},
		// openHab
		BrickUPnP					: require( "../UPnP/templates/default.js" ),
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
		BrickFhem_contact			: require( "../FHEM/templates/contact.js"							)
	};

	var templates	 	= {
		Brick 						: require( "./brick.html" ),
		// openHab
		BrickUPnP					: require( "../UPnP/templates/default.html" ),
		BrickOpenHAB_Switch			: require( "../openHab/templates/BrickOpenHAB_Switch.html"			),
		BrickOpenHAB_String			: require( "../openHab/templates/BrickOpenHAB_String.html"			),
		BrickOpenHAB_RollerShutter	: require( "../openHab/templates/BrickOpenHAB_RollerShutter.html"	),
		BrickOpenHAB_Number			: require( "../openHab/templates/BrickOpenHAB_Number.html"			),
		BrickOpenHAB_Dimmer			: require( "../openHab/templates/BrickOpenHAB_Dimmer.html"			),
		BrickOpenHAB_DateTime		: require( "../openHab/templates/BrickOpenHAB_DateTime.html"		),
		BrickOpenHAB_Contact		: require( "../openHab/templates/BrickOpenHAB_Contact.html"			),
		BrickOpenHAB_Color			: require( "../openHab/templates/BrickOpenHAB_Color.html"			),
		// Fhem
		BrickFhem					: require( "../FHEM/templates/default.html"							),
		BrickFhem_tempSensor_05		: require( "../FHEM/templates/tempSensor.05.html"					),
		BrickFhem_EnO_4BS			: require( "../FHEM/templates/EnO_4BS.html"							),
		BrickFhem_actuator_01		: require( "../FHEM/templates/actuator.01.html"						),
		BrickFhem_tempHumiSensor_02	: require( "../FHEM/templates/tempHumiSensor.02.html"				),
		BrickFhem_EnO_switch		: require( "../FHEM/templates/switch.html"							),
		BrickFhem_lightSensor_01	: require( "../FHEM/templates/lightSensor.01.html"					),
		BrickFhem_contact			: require( "../FHEM/templates/contact.html"							)
	};	

	var controller = function($scope) {
		console.log( "new brick", this.brick, $scope );
		var types = this.brick?this.brick.type:[] //'Brick'
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
	controller.$inject = ["$scope"];
	app.directive	( "brick"
					, ["$compile", function($compile) {
						 return { restrict			: 'E'
								, controller		: controller
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
						}]
					);
};

