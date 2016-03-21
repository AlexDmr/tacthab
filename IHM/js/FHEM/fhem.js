require( "./fhem.css" );

// Subscribe to openHab messages
// 		openHab_state
// 		openHab_update

var template = require("./fhem.html");
module.exports = function(app) {
	var controller = function() {
		// console.log( utils );
		this.config = {
		 	host	: "127.0.0.1",
		 	port	: 8880
		};
	};
	controller.$inject = [];
	app.component( "openHab"
				 , 	{ bindings		: { brick	: "=brick"
									  }
					, controller	: controller
					, template		: template
					}
				);
}
