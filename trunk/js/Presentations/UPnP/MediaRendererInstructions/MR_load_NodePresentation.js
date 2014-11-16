define	( [ './MR_Play_NodePresentation.js'
		  , '../../../utils.js'
		  , '../MediaBrowser.js'
		  ]
		, function(MR_Play_NodePresentation, utils, MediaBrowser) {
	// 
	var MR_load_NodePresentation = function() {
		 MR_Play_NodePresentation.apply(this, []);
		 this.action.method	= 'loadMedia';
		 return this;
		}
	
	MR_load_NodePresentation.prototype = new MR_Play_NodePresentation();
	MR_load_NodePresentation.prototype.serialize = function() {
		 var json = MR_Play_NodePresentation.prototype.serialize.apply(this, []);
		 json.subType = 'MR_load_NodePresentation';
		 return json;
		}
	MR_load_NodePresentation.prototype.Render = function() {
		 var self = this;
		 var root = MR_Play_NodePresentation.prototype.Render.apply(this,[]);
		 this.html.actionName.innerHTML = "loadMedia";
		 // Create elements for selecting the media
		 if(typeof this.html.mediaBrowser === 'undefined') {
			 this.html.mediaBrowser = document.createElement('button');
				this.html.mediaBrowser.classList.add('MediaBrowser');
				this.html.mediaBrowser.appendChild( document.createTextNode('SelectMedia') );
				this.html.mediaBrowser.onclick = function() {
					 var MB = new MediaBrowser();
					 self.appendChild(MB);
					}
			 this.divDescription.insertBefore( this.html.mediaBrowser, this.html.select );
			}
		 return root;
		}
	
	return MR_load_NodePresentation;
});
