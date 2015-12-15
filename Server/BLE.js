var BrickBLE_server;
  
module.exports = function(webServer) {
	webServer.app.get	( "/BLE_init"
						, function(req, res) {
							res.end( BrickBLE_server?""+BrickBLE_server.init():"false" );
						});
	webServer.app.get	( "/BLE_isInit"
						, function(req, res) {
							res.end( BrickBLE_server?""+BrickBLE_server.isInit():"false" );
						});
}

try {
	BrickBLE_server	= require( "../TactHab_modules/Bricks/BLE/BrickBLE_server.js" );
	console.log( "BrickBLE_server required" );
} catch(errorBLE) {BrickBLE_server = undefined;
				   console.error( "BrickBLE_server error:", errorBLE );
				  }
  