require( "./openHab.css" );

var utils = require( "../../../js/utils.js" );

/*
var templates	=	{ BrickOpenHAB_Switch			: require( "./templates/BrickOpenHAB_Switch.html"		)
					, BrickOpenHAB_String			: require( "./templates/BrickOpenHAB_String.html"		)
					, BrickOpenHAB_RollerShutter	: require( "./templates/BrickOpenHAB_RollerShutter.html")
					, BrickOpenHAB_Number			: require( "./templates/BrickOpenHAB_Number.html"		)
					, BrickOpenHAB_Dimmer			: require( "./templates/BrickOpenHAB_Dimmer.html"		)
					, BrickOpenHAB_DateTime			: require( "./templates/BrickOpenHAB_DateTime.html"		)
					, BrickOpenHAB_Contact			: require( "./templates/BrickOpenHAB_Contact.html"		)
					, BrickOpenHAB_Color			: require( "./templates/BrickOpenHAB_Color.html"		)
					};

var controllers	=	{ BrickOpenHAB_Switch			: require( "./templates/BrickOpenHAB_Switch.js"			)
					, BrickOpenHAB_String			: require( "./templates/BrickOpenHAB_String.js"			)
					, BrickOpenHAB_RollerShutter	: require( "./templates/BrickOpenHAB_RollerShutter.js"	)
					, BrickOpenHAB_Number			: require( "./templates/BrickOpenHAB_Number.js"			)
					, BrickOpenHAB_Dimmer			: require( "./templates/BrickOpenHAB_Dimmer.js"			)
					, BrickOpenHAB_DateTime			: require( "./templates/BrickOpenHAB_DateTime.js"		)
					, BrickOpenHAB_Contact			: require( "./templates/BrickOpenHAB_Contact.js"		)
					, BrickOpenHAB_Color			: require( "./templates/BrickOpenHAB_Color.js"			)
					};
*/					
// Subscribe to openHab messages
// 		openHab_state
// 		openHab_update

var template = require("./openHab.html");
module.exports = function(app) {
	var controller = function($mdToast) {
		// console.log( utils );
		this.config = {
		 	MQTT_host	: "127.0.0.1",
		 	MQTT_port	: 1883,
		 	MQTT_prefix	: "a4h",
			logMQTT		: "",
			host		: "127.0.0.1",
			port		: "8080"
		};
		this.connect	= function() {
			 utils.XHR( "POST", "/openHAB"
					  , { MQTT_host		: this.config.MQTT_host
						, MQTT_port		: this.config.MQTT_port
						, MQTT_prefix	: this.config.MQTT_prefix
						, logMQTT		: this.config.logMQTT
						, host			: this.config.host
						, port			: this.config.port
						}
					  ).then( function(xhr) {
									 console.log("MQTT connected", xhr);
									 var json, message;
									 try {json = JSON.parse(xhr.responseText);} catch(errParse) {
									 	console.error("errParse:", errParse);
									 }
									 message = json.error?json.error:"MQTT connected";
									 $mdToast.show(
											$mdToast.simple().content(message).hideDelay(3000)
											);
									}
							, function(xhr) {
									 $mdToast.show(
											$mdToast.simple().content( "MQTT error: " + xhr.responseText ).hideDelay(3000)
											);
									}
							);
			}
		};
	controller.$inject = ['$mdToast'];
	app.component( "openHab"
				 , 	{ bindings		: { brick	: "=brick"
									  }
					, controller	: controller
					, template		: template
					}
				);
}
