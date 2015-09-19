var openHab_Action	= require( './openHab_Action.js' )
  // , utils		= require( '../../../utils.js' )
  , DragDrop		= require( '../../DragDrop.js' )
  , openHabTypes	= require( '../../openHabTypes.js' )
  , str_template	= require( './templates/openHab_Action_Number.html' )
  , html_template	= document.createElement( "div" )
  ;
  
html_template.innerHTML = str_template;

// 
var openHab_Action_Number = function() {
	 openHab_Action.apply(this, []);
	 this.mustDoRender = true;
	 return this;
	}

openHab_Action_Number.prototype = Object.create( openHab_Action.prototype );
openHab_Action_Number.prototype.constructor = openHab_Action_Number;

openHab_Action_Number.prototype.init		= function(PnodeID, parent, children) {
	 openHab_Action.prototype.init.apply(this, [PnodeID, parent, children]);
	 return this;
	}

openHab_Action_Number.prototype.serialize = function() {
	 this.action.method = "setNumber";
	 var json = openHab_Action.prototype.serialize.apply(this, []);
	 json.subType = 'openHab_Action_Number';
	 return json;
	}

openHab_Action_Number.prototype.forceRender		= function() {
	this.mustDoRender = true;
	return openHab_Action.prototype.forceRender.apply(this, []);
}

openHab_Action_Number.prototype.Render = function() {
	 var self = this;
	 var root = openHab_Action.prototype.Render.apply(this,[]);
	 if(this.mustDoRender) {
		 this.mustDoRender = false;
		 root.classList.add( "openHab_Action_Number" );
		 this.copyHTML(html_template, this.html.actionName);
		 this.html.number			= root.querySelector("input.number");
		 if(this.action.params.length === 0) {
			 this.action.params = [""];
			}
		 this.html.number.onchange	= function() {
			 self.action.params[0] = this.value;
			}
		 DragDrop.updateConfig	( this.dropZoneSelectorId
								, { acceptedClasse: [[openHabTypes.Decimal]]
								  }
								);
		}
	 this.html.number.value	= this.action.params[0];
	 return root;
	}

module.exports = openHab_Action_Number;
