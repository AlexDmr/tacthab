var openHab_Action	= require( './openHab_Action.js' )
  // , utils		= require( '../../../utils.js' )
  , DragDrop		= require( '../../DragDrop.js' )
  , openHabTypes	= require( '../../openHabTypes.js' )
  , str_template	= require( './templates/openHab_Action_OnOff.html' )
  , html_template	= document.createElement( "div" )
  ;
  
html_template.innerHTML = str_template;

// 
var openHab_Action_OnOff = function() {
	 openHab_Action.apply(this, []);
	 this.mustDoRender = true;
	 return this;
	}

openHab_Action_OnOff.prototype = Object.create( openHab_Action.prototype );
openHab_Action_OnOff.prototype.constructor = openHab_Action_OnOff;

openHab_Action_OnOff.prototype.init		= function(PnodeID, parent, children) {
	 openHab_Action.prototype.init.apply(this, [PnodeID, parent, children]);
	 return this;
	}

openHab_Action_OnOff.prototype.serialize = function() {
	 var json = openHab_Action.prototype.serialize.apply(this, []);
	 json.subType = 'openHab_Action_OnOff';
	 return json;
	}

openHab_Action_OnOff.prototype.forceRender		= function() {
	this.mustDoRender = true;
	return openHab_Action.prototype.forceRender.apply(this, []);
}

openHab_Action_OnOff.prototype.Render = function() {
	 var self = this;
	 var root = openHab_Action.prototype.Render.apply(this,[]);
	 if(this.mustDoRender) {
		 this.mustDoRender = false;
		 root.classList.add( "openHab_Action_OnOff" );
		 this.copyHTML(html_template, this.html.actionName);
		 this.html.OnOff			= root.querySelector("select.OnOff");
		 this.html.OnOff.value		= this.action.method = this.action.method || 'Do_On';
		 this.html.OnOff.onchange	= function() {self.action.method = this.value;}
		 DragDrop.updateConfig	( this.dropZoneSelectorId
								, { acceptedClasse: [[openHabTypes.OnOff]]
								  }
								);
		}
	 return root;
	}

module.exports = openHab_Action_OnOff;
