var BrickBLE_server	= require( "../TactHab_modules/Bricks/BLE/BrickBLE_server.js" )
  ;
  
  
module.exports = function(webServer) {
	webServer.app.get	( "/BLE_init"
						, function(req, res) {
							req.end( BrickBLE_server.init() );
						});
	webServer.app.get	( "/BLE_isInit"
						, function(req, res) {
							req.end( BrickBLE_server.isInit() );
						});
}

