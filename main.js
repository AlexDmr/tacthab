var Putils					= require( './TactHab_modules/programNodes/Putils.js' )
  // , Pnode					= require( './TactHab_modules/programNodes/Pnode.js' )
  , UpnpServer				= require( './TactHab_modules/UpnpServer/UpnpServer.js' )
  // , Brick					= require( './TactHab_modules/Bricks/Brick.js' )
  , BrickUPnP_MediaRenderer	= require( './TactHab_modules/Bricks/BrickUPnP_MediaRenderer.js' )
  , BrickUPnP_MediaServer	= require( './TactHab_modules/Bricks/BrickUPnP_MediaServer.js' )
  , BrickUPnP_HueBridge		= require( './TactHab_modules/Bricks/BrickUPnP_HueBridge.js' )
  , Factory__Fhem			= require( './TactHab_modules/Bricks/Factory__Fhem.js' )
  , webServer				= require( './TactHab_modules/webServer/webServer.js' )
  // , ProgramNode				= require( './TactHab_modules/programNodes/program.js' )
  // , request					= require( 'request' )
  // , xmldom					= require( 'xmldom' )
  // , passport				= require( 'passport' )
  // , passportGoogle			= require( 'passport-google' )
  // , Factory__OpenHAB		= require( './TactHab_modules/Bricks/Factory__OpenHAB.js' )
  // , fs						= require( 'fs-extra' )
  ;

var rootPath = __dirname.slice();
console.log('webServer.init(',__dirname,',8888, 8443)');
webServer.init(__dirname, '8888', '8443', rootPath);
UpnpServer.init( webServer.TLS_SSL );

require( "./Server/interpreter.js" )(webServer);
require( "./Server/editor.js"      )(webServer);
require( "./Server/tacthab_web.js" )(webServer);
require( "./Server/openHab.js"     )(webServer);
require( "./Server/M2MIAGE.js"     )(webServer);

try {
	require( "./Server/BLE.js"     	   )(webServer);
} catch(errorBLE) {console.error("errorBLE", errorBLE);}