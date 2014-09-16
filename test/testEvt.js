define ( [ "../js/utils.js"
		 , '../js/domReady.js'
		 ]
	   , function(utils, domReady) {
			 domReady( function() {
				 testEvt = new Object();
				 testEvt.utils = utils;
				});
			 return testEvt;
			}
);
