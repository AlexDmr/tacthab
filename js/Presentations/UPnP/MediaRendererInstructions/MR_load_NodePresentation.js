define	( [ './MR_Play_NodePresentation.js'
		  , '../../../utils.js'
		  , '../MediaBrowser.js'
		  ]
		, function(MR_Play_NodePresentation, utils, MediaBrowser) {
	var MB = new MediaBrowser( 'Select Media to be loaded' );
	
	
	var MR_load_NodePresentation = function() {
		 var self = this;
		 MR_Play_NodePresentation.apply(this, []);
		 this.action.method	= 'loadMedia';
		 this.cbSelected = function(event) {
			 console.log('MR_load_NodePresentation::cbSelected', self, event);
			 self.action.mediaServerId	= event.mediaServerId;
			 self.action.itemId			= event.itemId;
			 self.html.mediaBrowser.innerHTML = '';
			 self.html.mediaBrowser.appendChild( event.htmlMS );
			 self.action.params = [self.action.mediaServerId, self.action.itemId];
			}
		 return this;
		}
	
	MR_load_NodePresentation.prototype = new MR_Play_NodePresentation();
	MR_load_NodePresentation.prototype.unserialize = function(json) {
		 var self = this;
		 MR_Play_NodePresentation.prototype.unserialize.apply(this, [json]);
		 this.action.method	= 'loadMedia';
		 console.log( "MR_load_NodePresentation::unserialize"
					, this.action.objectId
					, this.action.method
					, this.action.params );
		 if(this.action.params && this.action.params.length === 2) {
			 MB.getHtmlItemFrom	( this.action.params[0]
								, this.action.params[1]
								, function(htmlItem) {
									 if(self.html.mediaBrowser) {
										 self.html.mediaBrowser.innerHTML = '';
										 self.html.mediaBrowser.appendChild( htmlItem );
										}
									 self.html.htmlItem = htmlItem;
									}
								);
			}
		 return this;
		}
	MR_load_NodePresentation.prototype.serialize = function() {
		 this.action.method	= 'loadMedia';
		 var json = MR_Play_NodePresentation.prototype.serialize.apply(this, []);
		 json.ActionNode.mediaServerId	= this.action.mediaServerId;
		 json.ActionNode.itemId			= this.action.itemId;
		 json.subType = 'MR_load_NodePresentation';
		 return json;
		}
	MR_load_NodePresentation.prototype.Render = function() {
		 var self = this;
		 var root = MR_Play_NodePresentation.prototype.Render.apply(this,[]);
		 this.html.actionName.innerHTML = "loadMedia";
		 // Create elements for selecting the media
		 console.log( "MR_load_NodePresentation::Render");
		 if(typeof this.html.mediaBrowser === 'undefined') {
			 this.html.mediaBrowser = document.createElement('button');
				this.html.mediaBrowser.classList.add('MediaBrowserFlow');
				if(self.html.htmlItem) {
					 this.html.mediaBrowser.appendChild( self.html.htmlItem );
					} else {this.html.mediaBrowser.appendChild( document.createTextNode('Select Media') );}
				this.html.mediaBrowser.addEventListener(
					  'click'
					, function() {self.appendChild(MB);
								  MB.on('selected', self.cbSelected);
								 }
					, true );
			 this.divDescription.insertBefore( this.html.mediaBrowser, this.html.select );
			}
		 return root;
		}
	
	return MR_load_NodePresentation;
});
