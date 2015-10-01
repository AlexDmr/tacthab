var protoPresentation	= require( '../protoPresentation.js' )
  , utils				= require( '../../utils.js' )
  , AlxEvents			= require( '../../AlxEvents.js' )
  ;
  
var XMLparser = new DOMParser();

require( "./css/MediaBrowser.css" );
// var css = document.createElement('link');
	// css.setAttribute('rel' , 'stylesheet');
	// css.setAttribute('href', 'js/Presentations/UPnP/css/MediaBrowser.css');
	// document.head.appendChild( css );

function MediaBrowser(title) {
	 // var self			= this;
	 protoPresentation.apply(this, []);
	 this.title			= title || 'TITLE';
	 this.Breadcrumbs	= [ {name: 'Servers', mediaServerId:'', directoryId:'', classes: 'MediaServer'}
						  ];
	 return this;
	}
	
MediaBrowser.prototype				= Object.create( protoPresentation.prototype ); // new protoPresentation();
MediaBrowser.prototype.constructor	= MediaBrowser;

AlxEvents( MediaBrowser );
MediaBrowser.prototype.Render	= function() {
	 var self = this;
	 var root = protoPresentation.prototype.Render.apply(this, []);
	 root.onclick = function(e) {
		 e.stopPropagation(); e.preventDefault();
		 var prevSelected = self.htmldivContent.querySelector( '.foreground .Media.selected' );
		 if(prevSelected) {prevSelected.classList.remove( 'selected' );}
		}
	 if(typeof this.htmlh1 === "undefined") {
		 root.classList.add( 'MediaBrowser' );
		 this.htmldivBackground = document.createElement('div');
			this.htmldivBackground.classList.add('background');
			root.appendChild( this.htmldivBackground );
		 this.htmldivForeground = document.createElement('div');
			this.htmldivForeground.classList.add('foreground');
			root.appendChild( this.htmldivForeground );
		 this.htmlh1 = document.createElement('h1');
			this.htmlh1.appendChild( document.createTextNode( this.title ) );
			this.htmldivForeground.appendChild( this.htmlh1 );
			// Cross to quit
			this.crossCancel = document.createElement('span');
				this.crossCancel.appendChild( document.createTextNode('X') );
				this.crossCancel.classList.add('cancel');
				this.htmlh1.appendChild( this.crossCancel );
				this.crossCancel.onclick = function() {
					 self.setParent(null);
					}
		 this.htmldivNavigation	= document.createElement('div');
			this.htmldivForeground.appendChild( this.htmldivNavigation );
			this.htmldivNavigation.classList.add('navigation');
		 this.htmldivContent	= document.createElement('div');
			this.htmldivForeground.appendChild( this.htmldivContent );
			this.htmldivContent.classList.add('content');
		}
	 this.Browse();
	 return root;
	}
MediaBrowser.prototype.RenderNavigation = function() {
	 var self = this;
	 function RenderNavElement( element, index ) {
		 var span = document.createElement('a');
		 span.setAttribute('class', element.classes);
		 span.classList.add('element');
		 span.onclick = function(e) {
			 e.preventDefault(); e.stopPropagation();
			 self.Breadcrumbs.splice(index+1, self.Breadcrumbs.length);
			 self.Browse();
			}
		 span.appendChild( document.createTextNode(element.name) );
		 return span;
		}
	 // Render Breadcrumbs
	 this.htmldivNavigation.innerHTML = '';
	 var i;
	 for(i=0; i<this.Breadcrumbs.length - 1; i++) {
		 var htmlElement = RenderNavElement( this.Breadcrumbs[i], i );
		 this.htmldivNavigation.appendChild( htmlElement );
		 this.htmldivNavigation.appendChild( document.createTextNode(' > ') );
		}
	 this.htmldivNavigation.appendChild( RenderNavElement(this.Breadcrumbs[i], i) );
	}
MediaBrowser.prototype.Selected	= function(mediaServerId, itemId, htmlMS, name, iconURL) {
	 this.emit( 'selected'
			  , { mediaServerId : mediaServerId
				, itemId		: itemId
				, htmlMS		: htmlMS
				, name			: name
				, iconURL		: iconURL
				}
			  );
	}
MediaBrowser.prototype.RenderItem = function(name, iconURL, mediaServerId, directoryId, classes, isItem) {
	 var self = this;
	 var htmlMS = document.createElement('div');
	 htmlMS.setAttribute('class', classes);
	 htmlMS.classList.add('Media');
	 var img = document.createElement('img');
		img.setAttribute('src', iconURL);
		img.classList.add('icon');
		htmlMS.appendChild( img );
	 var title = document.createElement("div");
		title.appendChild( document.createTextNode(name) );
		title.classList.add('title');
		htmlMS.appendChild( title );
	 if(isItem) {
		 htmlMS.onclick = function(e) {
			 e.stopPropagation(); e.preventDefault();
			 var prevSelected = self.htmldivContent.querySelector( '.foreground .Media.selected' );
			 if(prevSelected) {
				 prevSelected.classList.remove( 'selected' );
				 if(prevSelected !== this) {
					 this.classList.add('selected');
					} else {this.classList.remove('selected');
							self.setParent(null);
							self.Selected(mediaServerId, directoryId, htmlMS, name, iconURL);
						   }
				} else {this.classList.add('selected');
					   }
			}
		} else {htmlMS.onclick = function() {
					 self.Breadcrumbs.push( { name			: name
											, mediaServerId	: mediaServerId
											, directoryId	: directoryId
											, classes		: classes } );
					 self.Browse();
					}
			   }
	 return htmlMS;
	}
MediaBrowser.prototype.getServers = function(PnodeID) {
	 var self = this;
	 this.htmldivContent.innerHTML = '';
	 this.htmldivContent.classList.remove('error');
	 utils.XHR( 'POST', 'getContext'
			  , { variables	: {nodeId: this.PnodeID}
				, onload	: function() {
					 var data = JSON.parse( this.responseText )
					   , brick;
					 self.htmldivContent.innerHTML = '';
					 for(var i in data.bricks) {
						 brick = data.bricks[i];
						 if(brick.type.indexOf('BrickUPnP_MediaServer') !== -1) {
							 var htmlMS = self.RenderItem( brick.name
														 , brick.iconURL || 'js/Presentations/UPnP/images/defaultMediaServer.png'
														 , brick.id
														 , '0'
														 , 'MediaServer' );
							 self.htmldivContent.appendChild( htmlMS );
							}
						}
					}
				}
			  );
	}
MediaBrowser.prototype.getHtmlItemFrom = function(mediaServerId, itemId, cb) {
	 var self = this;
	 utils.call	( mediaServerId
				, 'getMetaData'
				, [itemId]
				, function(res) {
					 if(typeof res === "string") {
						var doc = XMLparser.parseFromString(res, "text/xml");
						var Result = doc.getElementsByTagName('Result').item(0);
						if(Result) {
							 var ResultDoc	= XMLparser.parseFromString(Result.textContent, "text/xml");
							 var title		= ResultDoc.querySelector("title").textContent; 
							 var icon		= ResultDoc.querySelector("albumArtURI"); icon = icon?icon.textContent:null;
							 var htmlMedia = self.RenderItem( title
															, icon || 'js/Presentations/UPnP/images/media_icon.jpg'
															, mediaServerId
															, itemId
															, 'MediaFile'
															, true );
							 cb(htmlMedia);
							} else {console.error("Error in ", res); cb(null);}
						} else {console.log("Error getHtmlItemFrom :", res);
								cb(null); }
					}
				);
	}
MediaBrowser.prototype.Browse = function(PnodeID) {
	 var self = this;
	 var element = this.Breadcrumbs[ this.Breadcrumbs.length - 1 ];
	 this.RenderNavigation();
	 if( element.mediaServerId === '') {return this.getServers(PnodeID);}
	 
	 utils.call	( element.mediaServerId
				, 'Browse'
				, [element.directoryId]
				, function(res) {
					 self.htmldivContent.innerHTML = '';
					 if(typeof res === "string") {
						 var doc = XMLparser.parseFromString(res, "text/xml");
						 var Result = doc.getElementsByTagName('Result').item(0);
						 if(Result) {
							 var ResultDoc = XMLparser.parseFromString(Result.textContent, "text/xml");
							 var L_containers = ResultDoc.querySelectorAll('container') 
							   , i, title, icon;
							 for(i=0; i<L_containers.length; i++) {
								 var container	= L_containers.item(i);
								 var contId		= container.getAttribute('id');
								 title	= container.querySelector('title').textContent; //container.getElementsByTagName('title').item(0).textContent;
								 icon	= container.querySelector('albumArtURI'); icon = icon?icon.textContent:null;
								 var htmlContainer = self.RenderItem( title
																	, icon || 'js/Presentations/UPnP/images/folder_256.png'
																	, element.mediaServerId
																	, contId
																	, 'MediaFolder'
																	, false );
								 self.htmldivContent.appendChild( htmlContainer );
								} // End of containers
							 var L_items	= ResultDoc.querySelectorAll('item'); 
							 for(i=0; i<L_items.length; i++) {
								 var item	= L_items.item(i);
								 var itemId	= item.getAttribute('id');
								 title	= item.querySelector('title').textContent; //item.getElementsByTagName('title').item(0).textContent;
								 icon	= item.querySelector('albumArtURI'); icon = icon?icon.textContent:null; 
								 var htmlMedia = self.RenderItem( title
																, icon || 'js/Presentations/UPnP/images/media_icon.jpg'
																, element.mediaServerId
																, itemId
																, 'MediaFile'
																, true );
								 self.htmldivContent.appendChild( htmlMedia );
								}
							}
						}
					}
				);
	}

module.exports = MediaBrowser;

