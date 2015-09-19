var openHab_Event	= require( './openHab_Event.js' )
  // , utils		= require( '../../../utils.js' )
  , DragDrop		= require( '../../DragDrop.js' )
  , openHabTypes	= require( '../../openHabTypes.js' )
  , str_template	= require( './templates/openHab_Event_Contact.html' )
  , html_template	= document.createElement( "div" )
  ;
  
html_template.innerHTML = str_template;
  
// 
var openHab_Event_Contact = function() {
	 openHab_Event.apply(this, []);
	 this.eventFilter.val = "OPEN"
	 return this;
	}

openHab_Event_Contact.prototype = Object.create( openHab_Event.prototype );
openHab_Event_Contact.prototype.constructor = openHab_Event_Contact;

openHab_Event_Contact.prototype.init		= function(PnodeID, parent, children) {
	 openHab_Event.prototype.init.apply(this, [PnodeID, parent, children]);
	 return this;
	}

openHab_Event_Contact.prototype.serialize = function() {
	 var json = openHab_Event.prototype.serialize.apply(this, []);
	 json.subType = 'openHab_Event_Contact';
	 return json;
	}

openHab_Event_Contact.prototype.Render = function() {
	 var self = this;
	 var root = openHab_Event.prototype.Render.apply(this, []);
	 root.classList.add( "openHab_Event_Contact" );
	 // template
	 this.copyHTML(html_template, this.html.eventName);
	 this.html.OpenClose			= root.querySelector("select.contact");
	 this.html.OpenClose.value		= this.eventFilter.val = this.eventFilter.val || 'OPEN';
	 this.html.OpenClose.onchange	= function() {self.eventFilter.val = this.value;}
	 // DragDrop
	 DragDrop.updateConfig	( this.dropZoneSelectorId
							, { acceptedClasse: [[openHabTypes.OpenClosed]]
							  }
							);
	 return root;
	}

module.exports = openHab_Event_Contact;


