define	( [ "../js/utils.js"
		  , '../js/domReady.js'
		  , '../js/AlxHierarchicalList/liste.js'
		  , '../js/Presentations/UPnP/MediaServer.js'
		  , '../js/Presentations/UPnP/MediaRenderer.js'
		  ]
		, function( utils, domReady, AlxHierarchicalList
				  , MediaServer, MediaRenderer) {
	domReady( function() {
		function createHTML_MediaServer(id, name, uuid) {
			 var MS = new MediaServer(id, name, uuid);
			 return MS.Render();
			}
		function createHTML_MediaRenderer(id, name, uuid) {
			 var MR = new MediaRenderer(id, name, uuid);
			 return MR.Render();
			}
		
		// Do a AJAX call
		console.log("Getting MediaDLNA");
		utils.XHR( 'GET', '/get_MediaDLNA'
				 , { onload : function() {
						 var data = JSON.parse( this.responseText );
						 // console.log( data );
						 var divMediaRenderer = document.getElementById('MediaRenderer');
						 var divMediaServer   = document.getElementById('MediaServer'  );
						 for(var i=0; i<data.MediaRenderer.length; i++) {
							 var MS = data.MediaRenderer[i];
							 divMediaRenderer.appendChild( createHTML_MediaRenderer(MS.id, MS.name, MS.uuid) );
							}
						 for(var i=0; i<data.MediaServer.length; i++) {
							 var MR = data.MediaServer[i];
							 divMediaServer.appendChild( createHTML_MediaServer    (MR.id, MR.name, MR.uuid) );
							}
						}
				   }
				 );
		});
});
