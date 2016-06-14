var bleSensorTag 	= require( "./bleSensorTag.js" )
  , bleBrick		= require( "./bleBrick.js" )
  , bleMetawear		= require( "./bleMetaWear.js" )
  , alxGrapher		= require( "./alxGrapher.js" )
  , BrickBLE_server	= require( "./BrickBLE_server.js" )
  , utils			= require( "../../../js/utils.js" )
  ;

var controller = function($http, $scope) {
	var ctrl = this;
	this.isInit	= false;
	$http.get( "/BLE_isInit" ).then( function(obj) {
		console.log("BLE_isInit =>", obj, ctrl);
		if(obj.status === 200 && obj.data === true) {ctrl.isInit = true;}
	});
	
	this.readCharacteristic		= function(brick, characteristic) {
		utils.call( brick.id, "readCharacteristic", [characteristic.uuid]
				  ).then( function(res) {
					  console.log("readCharacteristic =>", res);
					  characteristic.stringInput = res;
					  $scope.$apply();
				  } );
	}
	
	this.writeCharacteristic	= function(brick, characteristic, value) {
		utils.call( brick.id, "writeCharacteristic", [characteristic.uuid, value]
				  ).then( function(res) {
					  console.log("writeCharacteristic =>", res);
					  characteristic.stringInput = res.utf8;
					  $scope.$apply();
				  } );
	}
	
	this.init = function() {
	$http.get( "/BLE_init" ).then( function(obj) {
		console.log("/BLE_init =>", obj);
		if(obj.status === 200 && obj.data === true) {ctrl.isInit = true;}
	});
	}
}
controller.$inject = ["$http", "$scope"];
						
module.exports = function(app) {
	bleBrick		(app);
	bleSensorTag	(app);
	alxGrapher		(app);
	bleMetawear		(app);
	BrickBLE_server	(app);
	app.directive( "bleServer"
				 , function() {
					 return {
						restrict	: 'E',
						scope		: {context	: "="},
						controller	: controller,
						controllerAs: "ctrl",
						templateUrl	: "/IHM/js/BLE/templates/bleServer.html",
						link		: function(/*scope, element, attr, controller*/) {}
					 };
				 });
}