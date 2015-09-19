var openHab_Event	= require( './openHab_Event.js' )
  // , utils		= require( '../../../utils.js' )
  , DragDrop		= require( '../../DragDrop.js' )
  , openHabTypes	= require( '../../openHabTypes.js' )
  , str_template	= require( './templates/openHab_Event_Color.html' )
  , html_template	= document.createElement( "div" )
  ;
  
html_template.innerHTML = str_template;
  
// 
var openHab_Event_Color = function() {
	 openHab_Event.apply(this, []);
	 this.eventNode.filters = [];
	 return this;
	}

openHab_Event_Color.prototype = Object.create( openHab_Event.prototype );
openHab_Event_Color.prototype.constructor = openHab_Event_Color;

openHab_Event_Color.prototype.init		= function(PnodeID, parent, children) {
	 openHab_Event.prototype.init.apply(this, [PnodeID, parent, children]);
	 return this;
	}

openHab_Event_Color.prototype.serialize = function() {
	 var json = openHab_Event.prototype.serialize.apply(this, []);
	 json.subType = 'openHab_Event_Color';
	 return json;
	}

openHab_Event_Color.prototype.Render = function() {
	 // var self = this;
	 var root = openHab_Event.prototype.Render.apply(this, []);
	 root.classList.add( "openHab_Event_Color" );
	 // template
	 this.copyHTML(html_template, this.html.eventName);
	 // DragDrop
	 DragDrop.updateConfig	( this.dropZoneSelectorId
							, { acceptedClasse: [[openHabTypes.HSB]]
							  }
							);
	 return root;
	}

module.exports = openHab_Event_Color;


