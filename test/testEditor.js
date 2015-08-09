/*
require.config({
    paths : {
        //create alias to plugins (not needed if plugins are on the baseUrl)
        async	: '../js/requirejs-plugins/src/async',
        font	: '../js/requirejs-plugins/src/font',
        goog	: '../js/requirejs-plugins/src/goog',
        image	: '../js/requirejs-plugins/src/image',
        json	: '../js/requirejs-plugins/src/json',
        noext	: '../js/requirejs-plugins/src/noext',
        mdown	: '../js/requirejs-plugins/src/mdown',
        propertyParser		: '../js/requirejs-plugins/src/propertyParser'
    }
});

*/

var utils		= require( "../js/utils.js" )
  , domReady	= require( '../js/domReady.js' )
  , editor		= require( '../js/editor.js' )
  ;
  
  
 domReady( function() {
	 // Editor
	 var testEvt = {};
	 testEvt.utils	= utils;
	 testEvt.editor	= editor;
	 editor.init( 'instructionType'
				, document.getElementById('program')
				, utils.io);
	});


