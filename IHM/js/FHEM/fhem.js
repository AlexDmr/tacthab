require( "./fhem.css" );
var utils = require( "../../../js/utils.js" );

var template = require("./fhem.html");
module.exports = function(app) {
	var controller = function() {
		var ctrl = this, host, port;
		if( localStorage.TActHab_fhemConnect_host && localStorage.TActHab_fhemConnect_port ) {
			host	= localStorage.TActHab_fhemConnect_host;
			port	= localStorage.TActHab_fhemConnect_port;
		} else {host = "127.0.0.1"; port = 8880;}
		this.config		= {
		 	host	: host,
		 	port	: port
		};
		this.connect	= function() {
			utils.XHR	('POST', '/Fhem', {host: this.config.host, port: this.config.port})
				 .then	( function(xhr) {
				 				console.log( "POST /Fhem", ctrl.config, "=>", xhr.responseText);
				 				localStorage.TActHab_fhemConnect_host	= ctrl.config.host;
				 				localStorage.TActHab_fhemConnect_port	= ctrl.config.port;
				 			} ) 
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
