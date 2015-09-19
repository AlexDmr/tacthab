var openHab_Action	= require( './openHab_Action.js' )
  // , utils		= require( '../../../utils.js' )
  , DragDrop		= require( '../../DragDrop.js' )
  , openHabTypes	= require( '../../openHabTypes.js' )
  , str_template	= require( './templates/openHab_Action_RollerShutter.html' )
  , html_template	= document.createElement( "div" )
  ;
  
html_template.innerHTML = str_template;

// 
var openHab_Action_RollerShutter = function() {
	 openHab_Action.apply(this, []);
	 this.mustDoRender = true;
	 return this;
	}

openHab_Action_RollerShutter.prototype = Object.create( openHab_Action.prototype );
openHab_Action_RollerShutter.prototype.constructor = openHab_Action_RollerShutter;

openHab_Action_RollerShutter.prototype.init		= function(PnodeID, parent, children) {
	 openHab_Action.prototype.init.apply(this, [PnodeID, parent, children]);
	 return this;
	}

openHab_Action_RollerShutter.prototype.serialize = function() {
	 var json = openHab_Action.prototype.serialize.apply(this, []);
	 json.subType = 'openHab_Action_RollerShutter';
	 return json;
	}

openHab_Action_RollerShutter.prototype.forceRender		= function() {
	this.mustDoRender = true;
	return openHab_Action.prototype.forceRender.apply(this, []);
}

openHab_Action_RollerShutter.prototype.Render = function() {
	 var self = this;
	 var root = openHab_Action.prototype.Render.apply(this,[]);
	 if(this.mustDoRender) {
		 this.mustDoRender = false;
		 root.classList.add( "openHab_Action_RollerShutter" );
		 this.copyHTML(html_template, this.html.actionName);
		 this.html.RollerShutter			= root.querySelector("select.RollerShutter");
		 this.html.RollerShutter.onchange	= function() {self.action.method = this.value;}
		 DragDrop.updateConfig	( this.dropZoneSelectorId
								, { acceptedClasse: [ [openHabTypes.UpDown  ]
													, [openHabTypes.StopMove]
													, [openHabTypes.Percent ]
													]
								  }
								);
		}
	 this.html.RollerShutter.value		= this.action.method = this.action.method || 'Do_UP';
	 return root;
	}

module.exports = openHab_Action_RollerShutter;
