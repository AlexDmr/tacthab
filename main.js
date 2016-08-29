var Putils						= require( './TactHab_modules/programNodes/Putils.js' )
	// , Pnode					= require( './TactHab_modules/programNodes/Pnode.js' )
	, UpnpServer				= require( './TactHab_modules/UpnpServer/UpnpServer.js' )
	// , Brick					= require( './TactHab_modules/Bricks/Brick.js' )
	, BrickUPnP_MediaRenderer	= require( './TactHab_modules/Bricks/BrickUPnP_MediaRenderer.js' )
	, BrickUPnP_MediaServer		= require( './TactHab_modules/Bricks/BrickUPnP_MediaServer.js' )
	, BrickUPnP_HueBridge		= require( './TactHab_modules/Bricks/BrickUPnP_HueBridge.js' )
	, Factory__Fhem				= require( './TactHab_modules/Bricks/Factory__Fhem.js' )
	, webServer					= require( './TactHab_modules/webServer/webServer.js' )
	// , ProgramNode				= require( './TactHab_modules/programNodes/program.js' )
	// , request					= require( 'request' )
	// , xmldom					= require( 'xmldom' )
	// , passport				= require( 'passport' )
	// , passportGoogle			= require( 'passport-google' )
	// , Factory__OpenHAB		= require( './TactHab_modules/Bricks/Factory__OpenHAB.js' )
	// , fs						= require( 'fs-extra' )
	;

/**_________________________________________________________________________________________________________________________________
 * Parse command line parameters and initialize everything ------------------------------------------------------------------------
 **/
var params = {}, p;
for(var i=2; i<process.argv.length; i++) {
	p = process.argv[i].split(':');
	params[p[0]] = p[1];
}

console.log("Parameters:", params);


/**_________________________________________________________________________________________________________________________________
 * Init modules --------------------------------------------------------------------------------------------------------------------
 **/
var rootPath = __dirname.slice();
console.log('webServer.init(',__dirname,', 8888, 8843)');
webServer.init(__dirname, '8888', '8843', rootPath);
UpnpServer.init( webServer.TLS_SSL );






var interpreter = 
require( "./Server/interpreter.js"	)(webServer);				console.log( "\t-interpreter" );
require( "./Server/editor.js"		)(webServer);				console.log( "\t-editor" );
require( "./Server/tacthab_web.js"	)(webServer, interpreter);	console.log( "\t-tacthab_web" );
require( "./Server/openHab.js"		)(webServer);				console.log( "\t-openHab" );
require( "./Server/M2MIAGE.js"		)(webServer);				console.log( "\t-M2M" );

require( "./Server/Fhem.js"			)(webServer);				console.log( "\t-Fhem" );
// var FhemBridge = require( "./TactHab_modules/Bricks/Factory__Fhem.js" );
// var fb = new FhemBridge( "192.168.1.12", 8880);

if( typeof params.BLE !== "undefined" ) {
	console.log("\t-BLE");
	require("./Server/BLE.js");
}
console.log( "\t-OK!");