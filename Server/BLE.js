try {
	require( "../TactHab_modules/Bricks/BLE/BrickBLE_server.js" );
	console.log( "BrickBLE_server successfully loaded" );
} catch(errorBLE) {
	console.error( "BrickBLE_server error:", errorBLE );
}
  