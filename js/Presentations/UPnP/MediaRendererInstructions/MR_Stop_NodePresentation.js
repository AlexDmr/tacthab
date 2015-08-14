var MR_Play_NodePresentation	= require( './MR_Play_NodePresentation.js' )
  // , utils						= require( '../../../utils.js' )
  ;
  
	// 
var MR_Stop_NodePresentation = function() {
	 MR_Play_NodePresentation.apply(this, []);
	 return this;
	}

MR_Stop_NodePresentation.prototype = Object.create( MR_Play_NodePresentation.prototype ); // new MR_Play_NodePresentation();
MR_Stop_NodePresentation.prototype.constructor = MR_Stop_NodePresentation;

MR_Stop_NodePresentation.prototype.init		= function(PnodeID, parent, children) {
	 MR_Play_NodePresentation.prototype.init.apply(this, [PnodeID, parent, children]);
	 this.action.method	= 'Stop';
	 return this;
	}
MR_Stop_NodePresentation.prototype.serialize = function() {
	 // this.action.method	= 'Stop';
	 var json = MR_Play_NodePresentation.prototype.serialize.apply(this, []);
	 json.subType = 'MR_Stop_NodePresentation';
	 return json;
	}
MR_Stop_NodePresentation.prototype.Render = function() {
	 // var self = this;
	 var root = MR_Play_NodePresentation.prototype.Render.apply(this,[]);
	 this.html.img_symbol.setAttribute('src', 'js/Presentations/UPnP/images/icon_STOP.png');
	 this.html.actionName.innerHTML = "STOP"
	 return root;
	}

module.exports = MR_Stop_NodePresentation;

