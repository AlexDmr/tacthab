module.exports = function(app) {
	app.directive( "bleServer"
				 , function() {
					 return {
						restrict	: 'E',
						scope		: {}
						controller	: function($http, $scope) {
							var ctrl = this;
							this.isInit	= false;
							$http.get( "/BLE_isInit" ).then( function(obj) {console.log("BLE_isInit", obj, ctrl);} );
							this.init = function() {
								$http.get( "/BLE_init" ).then( function(obj) {console.log(obj);} );
							}
						},
						controllerAs: "ctrl"
						templateUrl	: "/IHM/js/BLE/templates/bleServer.html",
						link		: function() {}
					 };
				 });
}