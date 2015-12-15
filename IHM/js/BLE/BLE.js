var bleSensorTag 	= require( "./bleSensorTag.js" )
  , alxGrapher		= require( "./alxGrapher.js" )
  ;

module.exports = function(app) {
	bleSensorTag(app);
	alxGrapher	(app);
	app.directive( "bleServer"
				 , function() {
					 return {
						restrict	: 'E',
						scope		: {context	: "="},
						controller	: function($http, $scope) {
							var ctrl = this;
							this.isInit	= false;
							$http.get( "/BLE_isInit" ).then( function(obj) {
								console.log("BLE_isInit =>", obj, ctrl);
								if(obj.status === 200 && obj.data === true) {ctrl.isInit = true;}
							});
							this.init = function() {
							$http.get( "/BLE_init" ).then( function(obj) {
								console.log("/BLE_init =>", obj);
								if(obj.status === 200 && obj.data === true) {ctrl.isInit = true;}
							});
							}
						},
						controllerAs: "ctrl",
						templateUrl	: "/IHM/js/BLE/templates/bleServer.html",
						link		: function(scope, element, attr, controller) {}
					 };
				 });
}