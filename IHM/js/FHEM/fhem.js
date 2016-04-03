require( "./fhem.css" );
var utils = require( "../../../js/utils.js" );

var template = require("./fhem.html");
module.exports = function(app) {
	var controller = function() {
		var ctrl = this;
		this.config		= {
		 	host	: "127.0.0.1",
		 	port	: 8880
		};
		this.connect	= function() {
			utils.XHR	('POST', '/Fhem', {host: this.config.host, port: this.config.port})
				 .then	( function(xhr) {console.log( "POST /Fhem", ctrl.config, "=>", xhr.responseText);} ) 
				 ;
		}
	};
	controller.$inject = [];
	app.component( "fhem"
				 , 	{ bindings		: { brick	: "=brick"
									  }
					, controller	: controller
					, template		: template
					}
				);
}
