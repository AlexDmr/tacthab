require( "./openHab.css" );

var utils = require( "../../../js/utils.js" );

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
