var /*PnodePresentation			= require( './PnodePresentation.js' )
  , */SelectorNodePresentation	= require( './SelectorNodePresentation.js' )
  , MediaBrowser				= require( './UPnP/MediaBrowser.js' )
  , utils						= require( '../utils.js' )
  ;

function MR_Instance_SelectorNodePresentation() {
	SelectorNodePresentation.apply(this, []);
	return this;
}

MR_Instance_SelectorNodePresentation.prototype = Object.create( SelectorNodePresentation.prototype ); // new SelectorNodePresentation();
MR_Instance_SelectorNodePresentation.prototype.constructor	= MR_Instance_SelectorNodePresentation;
MR_Instance_SelectorNodePresentation.prototype.className	= 'Pselector_ObjInstance';

MR_Instance_SelectorNodePresentation.prototype.init		= function(PnodeID, parent, children, infoObj) {
	SelectorNodePresentation.prototype.init.apply(this, [PnodeID, parent, children, infoObj]);
	this.selector.type.push( 'MediaRenderer' );
	if(infoObj) {this.selector.objectId = infoObj.config.uuid;}
	return this;
}

MR_Instance_SelectorNodePresentation.prototype.Render	= function() {
	var self = this;
	var root = SelectorNodePresentation.prototype.Render.apply(this, []);
	// Call server for the latest description of Media Player this.selector.objectId
	if(this.selector.objectId) {
		 utils.XHR( 'POST', 'getContext'
				  , { variables	: {nodeId: this.PnodeID}
				    , onload	: function() {
						 var data = JSON.parse( this.responseText );
						 // console.log("select", self.selector.objectId, data.bricks);
						 if(typeof data.bricks[ self.selector.objectId ] !== 'undefined') {
							 // console.log("XXX Render properly the selected MR with", data.bricks[ self.selector.objectId ]);
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
							} else {console.error("/getContext from", self.PnodeID, " : The brick", self.selector.objectId, "is not present in the context", data);}
						}
				    }
				  );
		}
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

module.exports = MR_Instance_SelectorNodePresentation;
