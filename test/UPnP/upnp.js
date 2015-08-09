var utils				= require( "../js/utils.js" )
  , domReady			= require( '../js/domReady.js' )
  // , AlxHierarchicalList	= require( '../js/AlxHierarchicalList/liste.js' )
  , MediaServer			= require( '../js/Presentations/UPnP/MediaServer.js' )
  , MediaRenderer		= require( '../js/Presentations/UPnP/MediaRenderer.js' )
  ;
					  
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
					 var data = JSON.parse( this.responseText )
					   , i, MR, MS;
					 // console.log( data );
					 var divMediaRenderer = document.getElementById('MediaRenderer');
					 var divMediaServer   = document.getElementById('MediaServer'  );
					 for(i=0; i<data.MediaRenderer.length; i++) {
						 MS = data.MediaRenderer[i];
						 divMediaRenderer.appendChild( createHTML_MediaRenderer(MS.id, MS.name, MS.uuid) );
						}
					 for(i=0; i<data.MediaServer.length; i++) {
						 MR = data.MediaServer[i];
						 divMediaServer.appendChild( createHTML_MediaServer    (MR.id, MR.name, MR.uuid) );
						}
					}
			   }
			 );
	});
