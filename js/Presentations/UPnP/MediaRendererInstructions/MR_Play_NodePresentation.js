var ActionNodePresentation	= require( '../../ActionNodePresentation.js' )
  , DragDrop				= require( '../../../DragDrop.js' )
  ;
  
// 
var MR_Play_NodePresentation = function() {
	 ActionNodePresentation.apply(this, []);
	 return this;
	}

MR_Play_NodePresentation.prototype = Object.create( ActionNodePresentation.prototype );
MR_Play_NodePresentation.prototype.constructor = MR_Play_NodePresentation;

MR_Play_NodePresentation.prototype.init		= function(PnodeID, parent, children) {
	 ActionNodePresentation.prototype.init.apply(this, [PnodeID, parent, children]);
	 this.action.method	= 'Play';
	 return this;
	}

MR_Play_NodePresentation.prototype.serialize = function() {
	 // this.action.method	= 'Play';
	 var json = ActionNodePresentation.prototype.serialize.apply(this, []);
	 json.subType = 'MR_Play_NodePresentation';
	 return json;
	}
MR_Play_NodePresentation.prototype.Render = function() {
	 // var self = this;
	 var root = ActionNodePresentation.prototype.Render.apply(this,[]);
	 this.html.actionName.innerHTML = "Play";
	 this.html.img_symbol.setAttribute('src', 'js/Presentations/UPnP/images/icon_PLAY.png');
	 this.html.actionName.innerHTML = "PLAY"
	 DragDrop.updateConfig(this.dropZoneSelectorId, {acceptedClasse: [['BrickUPnP_MediaRenderer']]});
	 return root;
	}

module.exports = MR_Play_NodePresentation;

