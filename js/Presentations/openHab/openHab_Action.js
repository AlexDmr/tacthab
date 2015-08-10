var ActionNodePresentation	= require( '../ActionNodePresentation.js' )
  // , utils					= require( '../../../utils.js' )
  // , DragDrop				= require( '../../../DragDrop.js' )
  ;
  
// 
var openHab_Action = function() {
	 ActionNodePresentation.apply(this, []);
	 return this;
	}

openHab_Action.prototype = Object.create( ActionNodePresentation.prototype ); // new ActionNodePresentation();
openHab_Action.prototype.constructor = openHab_Action;

openHab_Action.prototype.init		= function(PnodeID, parent, children) {
	 ActionNodePresentation.prototype.init.apply(this, [PnodeID, parent, children]);
	 return this;
	}

openHab_Action.prototype.serialize = function() {
	 var json = ActionNodePresentation.prototype.serialize.apply(this, []);
	 json.subType = 'openHab_Action';
	 return json;
	}
	
openHab_Action.prototype.Render = function() {
	 // var self = this;
	 var root = ActionNodePresentation.prototype.Render.apply(this, []);
	 root.classList.add( "openHab_Action" );
	 this.html.img_symbol.setAttribute("src", "js/Presentations/openHab/templates/openhab-logo-square.png");
	 return root;
	}

module.exports = openHab_Action;


