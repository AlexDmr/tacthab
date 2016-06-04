require( "./socketBus.css" );
var utils = require( "../../../js/utils.js" );

var template = require("./socketBus.html");
module.exports = function(app) {
	var controller = function($scope) {
		var ctrl = this;
		utils.call( 'socketBus', 'getConnections', [] ).then( function(json) {
			console.log( "socketBus getConnections =>", json);
			for(var i in json) {
				ctrl.config.host			= json[i].host || "https://thacthab.herokuapp.com";
				ctrl.config.login			= json[i].login;
				ctrl.config.friendlyName	= json[i].friendlyName;
				if( ctrl.config.login !== "" ) {ctrl.connected = true;}
				$scope.$apply();
				break;
			}
		});
		this.logs		= [];
		this.connected	= false;
		this.config		= {
		 	host			: "https://thacthab.herokuapp.com",
		 	login			: "",
		 	pass			: "",
		 	friendlyName	: ""
		};
		this.ping		= function() {utils.call( "socketBus", "ping", [] );}
		this.connect	= function() {
			utils.call( "socketBus", "connectTo", [this.config.host, this.config.login, this.config.pass] );
		}

		// Subscribe to messages
		utils.subscribeBrick( "socketBus", "message", function(event) {
			console.log("brickOpenhab message:", event);
			$scope.$applyAsync( function() { ctrl.logs.push( event.data );} );
		});

		utils.subscribeBrick( "socketBus", "connected", function(event) {
			console.log("brickOpenhab connected:", event);
			$scope.$applyAsync( function() {
			 	ctrl.connected		= true;
				ctrl.config.host	= event.data.host;
				ctrl.config.login	= event.data.login;
			});
		});
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
