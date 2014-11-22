define ( [ "../js/utils.js"
		 , '../js/domReady.js'
		 , '../js/editor.js'
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
