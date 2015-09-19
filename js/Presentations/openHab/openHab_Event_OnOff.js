var openHab_Event	= require( './openHab_Event.js' )
  // , utils		= require( '../../../utils.js' )
  , DragDrop		= require( '../../DragDrop.js' )
  , openHabTypes	= require( '../../openHabTypes.js' )
  , str_template	= require( './templates/openHab_Event_OnOff.html' )
  , html_template	= document.createElement( "div" )
  ;
  
html_template.innerHTML = str_template;
  
// 
var openHab_Event_OnOff = function() {
	 openHab_Event.apply(this, []);
	 this.eventFilter.val = "ON"
	 return this;
	}

openHab_Event_OnOff.prototype = Object.create( openHab_Event.prototype );
openHab_Event_OnOff.prototype.constructor = openHab_Event_OnOff;

openHab_Event_OnOff.prototype.init		= function(PnodeID, parent, children) {
	 openHab_Event.prototype.init.apply(this, [PnodeID, parent, children]);
	 return this;
	}

openHab_Event_OnOff.prototype.serialize = function() {
	 var json = openHab_Event.prototype.serialize.apply(this, []);
	 json.subType = 'openHab_Event_OnOff';
	 return json;
	}

openHab_Event_OnOff.prototype.Render = function() {
	 var self = this;
	 var root = openHab_Event.prototype.Render.apply(this, []);
	 root.classList.add( "openHab_Event_OnOff" );
	 // template
	 this.copyHTML(html_template, this.html.eventName);
	 this.html.OnOff			= root.querySelector("select.OnOff");
	 this.html.OnOff.value		= this.eventFilter.val = this.eventFilter.val || 'ON';
	 this.html.OnOff.onchange	= function() {self.eventFilter.val = this.value;}
	 // DragDrop
	 DragDrop.updateConfig	( this.dropZoneSelectorId
							, { acceptedClasse: [[openHabTypes.OnOff]]
							  }
							);
	 return root;
	}

module.exports = openHab_Event_OnOff;


