define	( [ '../protoPresentation.js'
		  , '../../utils.js'
		  ]
		, function(protoPresentation, utils) {
	var XMLparser = new DOMParser();
	var css = document.createElement('link');
		css.setAttribute('rel' , 'stylesheet');
		css.setAttribute('href', 'js/Presentations/UPnP/css/MediaBrowser.css');
		document.head.appendChild( css );
	
	function MediaBrowser() {
		 protoPresentation.apply(this, []);
		 var self			= this;
		 this.Breadcrumbs	= [ {name: 'Servers', mediaServerId:'', directoryId:''}
							  ];
		 return this;
		}
		
	MediaBrowser.prototype	= new protoPresentation();
	MediaBrowser.prototype.Render	= function() {
		 var root = protoPresentation.prototype.Render.apply(this, []);
		 if(typeof this.htmlh1 === "undefined") {
			 root.classList.add( 'MediaBrowser' );
			 this.htmldivBackground = document.createElement('div');
				this.htmldivBackground.classList.add('background');
				root.appendChild( this.htmldivBackground );
			 this.htmlh1 = document.createElement('h1');
				this.htmlh1.appendChild( document.createTextNode( "UPnP Media Browser" ) );
				root.appendChild( this.htmlh1 );
			 this.htmldivNavigation	= document.createElement('div');
				root.appendChild( this.htmldivNavigation );
				this.htmldivNavigation.classList.add('navigation');
			 this.htmldivContent	= document.createElement('div');
				root.appendChild( this.htmldivContent );
				this.htmldivContent.classList.add('content');
			}
		 this.Browse();
		 return root;
		}
	MediaBrowser.prototype.RenderNavigation = function() {
		 var self = this;
		 function RenderNavElement( element, index ) {
			 var span = document.createElement('span');
			 span.classList.add('element');
			 span.onclick = function() {
				 self.Breadcrumbs.splice(i+1, self.Breadcrumbs.length);
				 self.Browse();
				}
			 span.appendChild( document.createTextNode(element.name + ' > ') );
			 return span;
			}
		 // Render Breadcrumbs
		 this.htmldivNavigation.innerHTML = '';
		 for(var i=0; i<this.Breadcrumbs.length; i++) {
			 var htmlElement = RenderNavElement( this.Breadcrumbs[i] );
			 this.htmldivNavigation.appendChild( htmlElement );
			}
		}
	MediaBrowser.prototype.RenderItem = function(name, iconURL, mediaServerId, directoryId) {
		 var self = this;
		 var htmlMS = document.createElement('div');
		 htmlMS.classList.add('MediaServer');
		 var img = document.createElement('img');
			img.setAttribute('src', iconURL);
			img.classList.add('icon');
			htmlMS.appendChild( img );
		 htmlMS.appendChild( document.createTextNode(name) );
		 htmlMS.onclick = function() {
			 self.Breadcrumbs.push( { name			: name
									, mediaServerId	: mediaServerId
									, directoryId	: directoryId } );
			 self.Browse();
			}
		 return htmlMS;
		}
	MediaBrowser.prototype.getServers = function() {
		 var self = this;
		 this.htmldivContent.innerHTML = '';
		 this.htmldivContent.classList.remove('error');
		 utils.XHR( 'GET', '/get_MediaDLNA'
				  , {onload : function() {
								 var data = JSON.parse( this.responseText );
								 if(data.error) {
									 this.htmldivContent.classList.add('error');
									 this.htmldivContent.appendChild( document.createTextNode('error with /get_MediaDLNA', data) );
									 console.error('error with /get_MediaDLNA', data);
									} else	{var MSs = data.MediaServer;
											 self.htmldivContent.innerHTML = '';
											 for(var i=0; i<MSs.length; i++) {
												 var MS = MSs[i];
												 var htmlMS = self.RenderItem( MS.name
																			 , MS.iconURL || 'js/Presentations/UPnP/images/defaultMediaServer.png'
																			 , MS.id
																			 , '0');
												 self.htmldivContent.appendChild( htmlMS );
												}
											}
								}
					}
				 );
		}
	MediaBrowser.prototype.Browse = function() {
		 var self = this;
		 var element = this.Breadcrumbs[ this.Breadcrumbs.length - 1 ];
		 this.RenderNavigation();
		 if( element.mediaServerId === '') {return this.getServers();}
		 
		 utils.call	( element.mediaServerId
					, 'Browse'
					, [element.directoryId]
					, function(res) {
						 // console.log("Result of Browse", id, ":", res);
						 self.htmldivContent.innerHTML = '';
						 if(typeof res === "string") {
							 var doc = XMLparser.parseFromString(res, "text/xml");
							 var Result = doc.getElementsByTagName('Result').item(0);
							 if(Result) {
								 var ResultDoc = XMLparser.parseFromString(Result.textContent, "text/xml");
								 var L_containers = ResultDoc.getElementsByTagName('container');
								 for(var i=0; i<L_containers.length; i++) {
									 var container	= L_containers.item(i);
									 var contId		= container.getAttribute('id');
									 var title		= container.getElementsByTagName('title').item(0).textContent;
									 console.log('title', container);
									 var icon	;
										if(container.getElementsByTagName('albumArtURI').length) {
											 icon = container.getElementsByTagName('albumArtURI').item(0).textContent;
											} else {icon = null;}
									 var htmlContainer = self.RenderItem( title
																		, icon || 'js/Presentations/UPnP/images/folder_256.png'
																		, element.mediaServerId
																		, contId );
									 self.htmldivContent.appendChild( htmlContainer );
									} // End of containers
								 var L_items	= ResultDoc.getElementsByTagName('item');
								 // console.log("There is", L_items.length, "items");
								 for(var i=0; i<L_items.length; i++) {
									 var item	= L_items.item(i);
									 var itemId	= item.getAttribute('id');
									 var title	= item.getElementsByTagName('title').item(0).textContent;
									 var icon	;
										if(item.getElementsByTagName('albumArtURI').length) {
											 icon = item.getElementsByTagName('albumArtURI').item(0).textContent;
											} else {icon = null;}
									 var uri	= item.getElementsByTagName('res').item(0).textContent;
									 var htmlMedia = self.RenderItem( title
																	, icon || 'js/Presentations/UPnP/images/media_icon.jpg'
																	, element.mediaServerId
																	, itemId );
									 self.htmldivContent.appendChild( htmlMedia );
									}
								}
							}
						}
					);
		}
	
	return MediaBrowser;
});
