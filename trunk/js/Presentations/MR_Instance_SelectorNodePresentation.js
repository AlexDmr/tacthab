define	( [ './PnodePresentation.js'
		  , './SelectorNodePresentation.js'
		  , './UPnP/MediaBrowser.js'
		  , '../utils.js'
		  ]
		, function( PnodePresentation, SelectorNodePresentation
				  , MediaBrowser
				  , utils
				  ) {

function MR_Instance_SelectorNodePresentation(infoObj) {
	SelectorNodePresentation.apply(this, [infoObj]);
	this.selector.type.push( 'MediaRenderer' );
	if(infoObj) this.selector.objectId = infoObj.config.uuid;
}

MR_Instance_SelectorNodePresentation.prototype = new SelectorNodePresentation();
MR_Instance_SelectorNodePresentation.prototype.className = 'Pselector_ObjInstance';

MR_Instance_SelectorNodePresentation.prototype.Render = function() {
	var self = this;
	var root = SelectorNodePresentation.prototype.Render.apply(this, []);
	// Call server for the latest description of Media Player this.selector.objectId
	if(this.selector.objectId) {
		 utils.XHR( 'POST', 'getContext'
				  , { variables	: {nodeId: this.PnodeID}
				    , onload	: function() {
						 var data = JSON.parse( this.responseText );
						 console.log("select", self.selector.objectId, data.bricks);
						 if(typeof data.bricks[ self.selector.objectId ] !== 'undefined') {
							 console.log("XXX Render properly the selected MR with", data.bricks[ self.selector.objectId ]);
							 root.innerHTML = '';
							 root.classList.add( 'MediaBrowserFlow' );
							 var MR = data.bricks[ self.selector.objectId ];
							 var MP = MediaBrowser.prototype.RenderItem( MR.name // name
															 , MR.iconURL || 'js/Presentations/UPnP/images/defaultMediaRenderer.png'// iconURL
															 , MR.id // mediaServerId
															 , 0 // directoryId
															 , 'MediaRenderer' // classes
															 , false // isItem
															 );
							 MP.onclick = null;
							 root.appendChild( MP );
							}
						}
				    }
				  );
		}
	
	/** DEBUG
	if(this.selector.objectId) {
		console.log( 'Display Media Player: ', this.selector.objectId );
		utils.XHR( 'GET', 'get_MediaDLNA'
				 , function() {
					 var data = JSON.parse( this.responseText );
					 var LMR = data.MediaRenderer;
					 for(var i=0; i<LMR.length; i++) {
						 var MR = LMR[i];
						 if(MR.id === self.selector.objectId) {
							 root.innerHTML = '';
							 root.classList.add( 'MediaBrowserFlow' );
							 var MP = MediaBrowser.prototype.RenderItem( MR.name // name
															 , MR.iconURL || 'js/Presentations/UPnP/images/defaultMediaRenderer.png'// iconURL
															 , MR.id // mediaServerId
															 , 0 // directoryId
															 , 'MediaRenderer' // classes
															 , false // isItem
															 );
							 MP.onclick = null;
							 root.appendChild( MP );
							 break;
							}
						}
					}
				 );
		}
	*/
	return root;
}

MR_Instance_SelectorNodePresentation.prototype.serialize	= function() {
	var json = SelectorNodePresentation.prototype.serialize.apply(this, []);
	// Describe action here
	json.subType	= 'MR_Instance_SelectorNodePresentation';
	json.selector.objectId	= this.selector.objectId;
	return json;
}

MR_Instance_SelectorNodePresentation.prototype.unserialize	= function(json, PresoUtils) {
	// Describe action here
	SelectorNodePresentation.prototype.unserialize.apply(this, [json, PresoUtils]);
	this.selector.objectId = json.selector.objectId;
	return this;
}

return MR_Instance_SelectorNodePresentation;
});