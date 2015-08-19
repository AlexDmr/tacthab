var MR_Play_NodePresentation	= require( './MR_Play_NodePresentation.js' )
  // , utils						= require( '../../../utils.js' )
  , MediaBrowser				= require( '../MediaBrowser.js' )
  ;

var MB = new MediaBrowser( 'Select Media to be loaded' );

var MR_load_NodePresentation = function() {
	 MR_Play_NodePresentation.apply(this, []);
	 return this;
	}

MR_load_NodePresentation.prototype = Object.create( MR_Play_NodePresentation.prototype ); // new MR_Play_NodePresentation();
MR_load_NodePresentation.prototype.constructor = MR_load_NodePresentation;

MR_load_NodePresentation.prototype.init			= function(PnodeID, parent, children) {
	 var self = this;
	 MR_Play_NodePresentation.prototype.init.apply(this, [PnodeID, parent, children]);
	 this.action.method	= 'loadMedia';
	 this.forceRendering = false;
	 this.cbSelected = function(event) {
		 // console.log('MR_load_NodePresentation::cbSelected', self, event);
		 self.action.mediaServerId	= event.mediaServerId;
		 self.action.itemId			= event.itemId;
		 self.html.mediaBrowser.innerHTML = '';
		 self.html.mediaBrowser.appendChild( event.htmlMS );
		 self.action.params = [self.action.mediaServerId, self.action.itemId];
		}
	 return this;
	}

MR_load_NodePresentation.prototype.unserialize = function(json, PresoUtils) {
	 var self = this;
	 MR_Play_NodePresentation.prototype.unserialize.apply(this, [json, PresoUtils]);
	 // this.action.method	= 'loadMedia';
	 if(this.action.params && this.action.params.length === 2) {
		 MB.getHtmlItemFrom	( this.action.params[0]
							, this.action.params[1]
							, function(htmlItem) {
								 if(self.html.mediaBrowser) {
									 self.html.mediaBrowser.innerHTML = '';
									 self.html.mediaBrowser.appendChild( htmlItem );
									}
								 self.html.htmlItem = htmlItem;
								 // console.log("MR_load_NodePresentation: now html item is available");
								 this.forceRendering = true;
								}
							);
		}
	 return this;
	}
MR_load_NodePresentation.prototype.serialize = function() {
	 // this.action.method	= 'loadMedia';
	 var json = MR_Play_NodePresentation.prototype.serialize.apply(this, []);
	 json.ActionNode.mediaServerId	= this.action.mediaServerId;
	 json.ActionNode.itemId			= this.action.itemId;
	 json.subType = 'MR_load_NodePresentation';
	 return json;
	}

MR_load_NodePresentation.prototype.primitivePlug	= function(c) {
	 if(c === MB) {
		 this.Render();
		 var P = this.root
			, N = c.Render();
		 if(N.parentElement === null) {
			 P.appendChild( N );
			}
		 return this;
		} else {return MR_Play_NodePresentation.prototype.primitivePlug.apply(this, [c]);}
	}

MR_load_NodePresentation.prototype.Render = function() {
	 var self = this;
	 var root = MR_Play_NodePresentation.prototype.Render.apply(this,[]);
	 this.html.img_symbol.setAttribute('src', 'js/Presentations/UPnP/images/icon_LOAD.png');
	 this.html.actionName.innerHTML = "LOAD MEDIA"
	 // Create elements for selecting the media
	 if((typeof this.html.mediaBrowser === 'undefined') || this.forceRendering) {
		 // console.log( "MR_load_NodePresentation::Render" );
		 this.forceRendering = false;
		 if(this.html.mediaBrowser && this.html.mediaBrowser.parentNode) {
			 this.html.mediaBrowser.parentNode.removeChild( this.html.mediaBrowser );
			}
		 this.html.mediaBrowser = document.createElement('div');
		 this.html.mediaBrowser.classList.add('button');
		 this.html.mediaBrowser.classList.add('MediaBrowserFlow');
		 if(self.html.htmlItem) {
			 this.html.mediaBrowser.appendChild( self.html.htmlItem );
			} else {this.html.mediaBrowser.appendChild( document.createTextNode('Select Media') );}
		 this.html.mediaBrowser.addEventListener(
			  'click'
			, function() {self.appendChild( MB );
						  MB.on('selected', self.cbSelected);
						 }
			, true );
		 this.html.actionDescr.appendChild( this.html.mediaBrowser );
		} // else {console.log("MR_load_NodePresentation: no render");}
	 return root;
	}

module.exports = MR_load_NodePresentation;

