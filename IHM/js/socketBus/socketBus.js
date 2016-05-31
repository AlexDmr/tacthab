require( "./socketBus.css" );
var utils = require( "../../../js/utils.js" );

var template = require("./socketBus.html");
module.exports = function(app) {
	var controller = function($scope) {
		var ctrl = this;
		utils.XHR( 'GET', '/socketBus' ).then( function(xhr) {
			var json = JSON.parse( xhr.responseText );
			ctrl.config.host	= json.host || "https://thacthab.herokuapp.com";
			ctrl.config.login	= json.login;
			if( ctrl.config.login !== "" ) {ctrl.connected = true;}
			console.log( 'socketBus =>', json);
			$scope.$apply();
		});
		this.logs		= [];
		this.connected	= false;
		this.config		= {
		 	host	: "https://thacthab.herokuapp.com",
		 	login	: "",
		 	pass	: ""
		};
		this.connect	= function() {
			utils.XHR	('POST', '/socketBus', {host: this.config.host, login: this.config.login, pass: this.config.pass})
				 .then	( function(xhr) {
				 				console.log( "POST /socketBus", ctrl.config, "=>", xhr.responseText);
				 				ctrl.connected = true;
				 				$scope.$apply();
				 			} ) 
				 ;
		}

		// Subscribe to messages
		var cbEventName ="socketBus::update";
		utils.io.emit	( "subscribeBrick"
						, { brickId		: "socketBus"
						  , eventName	: "message"
						  , cbEventName	: cbEventName
						  }
						);
		utils.io.on	( cbEventName
					, function(event) {
						 console.log("brickOpenhab event:", event);
						 ctrl.logs.push( event );
						 $scope.$apply();
						}
					);
	};
	controller.$inject = [ '$scope' ];
	app.component( "socketBus"
				 , 	{ bindings		: {
									  }
					, controller	: controller
					, template		: template
					}
				);
}
