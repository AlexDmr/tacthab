var BrickBLE_server = function() {
	console.error( "The system was not able to load BLE module properly..." );
};

try {
	BrickBLE_server = require( "../TactHab_modules/Bricks/BLE/BrickBLE_server.js" );
	console.log( "BrickBLE_server successfully loaded" );
} catch(errorBLE) {
	console.error( "BrickBLE_server error:", errorBLE );
}

module.exports = BrickBLE_server;
