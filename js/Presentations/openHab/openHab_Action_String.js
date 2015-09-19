var openHab_Action	= require( './openHab_Action.js' )
  // , utils		= require( '../../../utils.js' )
  , DragDrop		= require( '../../DragDrop.js' )
  , openHabTypes	= require( '../../openHabTypes.js' )
  , str_template	= require( './templates/openHab_Action_String.html' )
  , html_template	= document.createElement( "div" )
  ;
  
html_template.innerHTML = str_template;

// 
var openHab_Action_String = function() {
	 openHab_Action.apply(this, []);
	 this.mustDoRender = true;
	 return this;
	}

openHab_Action_String.prototype = Object.create( openHab_Action.prototype );
openHab_Action_String.prototype.constructor = openHab_Action_String;

openHab_Action_String.prototype.init		= function(PnodeID, parent, children) {
	 openHab_Action.prototype.init.apply(this, [PnodeID, parent, children]);
	 return this;
	}

openHab_Action_String.prototype.serialize = function() {
	 this.action.method = "setString";
	 var json = openHab_Action.prototype.serialize.apply(this, []);
	 json.subType = 'openHab_Action_String';
	 return json;
	}

openHab_Action_String.prototype.forceRender		= function() {
	this.mustDoRender = true;
	return openHab_Action.prototype.forceRender.apply(this, []);
}

openHab_Action_String.prototype.Render = function() {
	 var self = this;
	 var root = openHab_Action.prototype.Render.apply(this,[]);
	 if(this.mustDoRender) {
		 this.mustDoRender = false;
		 root.classList.add( "openHab_Action_String" );
		 this.copyHTML(html_template, this.html.actionName);
		 this.html.string			= root.querySelector("input.string");
		 if(this.action.params.length === 0) {
			 this.action.params = [""];
			}
		 this.html.string.onchange	= function() {
			 self.action.params[0] = this.value;
			}
		 DragDrop.updateConfig	( this.dropZoneSelectorId
								, { acceptedClasse: [[openHabTypes.String]]
								  }
								);
		}
	 this.html.string.value	= this.action.params[0];
	 return root;
	}

module.exports = openHab_Action_String;
