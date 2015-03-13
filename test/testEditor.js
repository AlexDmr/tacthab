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


define ( [ "../js/utils.js"
		 , '../js/domReady.js'
		 , '../js/editor.js'
         // , 'async!http://maps.google.com/maps/api/js?sensor=false'
		 // , 'goog!visualization,1,packages:[corechart,geochart]'
		 ]
	   , function(utils, domReady, editor) {
			 domReady( function() {
				 // Editor
				 testEvt = new Object();
				 testEvt.utils	= utils;
				 testEvt.editor	= editor;
				 editor.init( 'instructionType'
							, document.getElementById('program')
							, utils.io);
				});
			 return null;
			}
);
