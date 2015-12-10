require( "./tabs.js" );
var domReady	= require( "./domReady.js" )
  , accelero	= require( "./accelerometer.js" )
  , multitouch	= require( "./multitouch.js" )
  , voice		= require( "./voice.js" )
  ;
	
require( "./M2MM.css");

domReady( function() {
	accelero  .init( ".accelerometer" );
	multitouch.init( ".multitouch"    );
	voice	  .init( ".vocal"         );
});