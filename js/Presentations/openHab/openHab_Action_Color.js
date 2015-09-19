var openHab_Action	= require( './openHab_Action.js' )
  // , utils		= require( '../../../utils.js' )
  , DragDrop		= require( '../../DragDrop.js' )
  , openHabTypes	= require( '../../openHabTypes.js' )
  , str_template	= require( './templates/openHab_Action_Color.html' )
  , html_template	= document.createElement( "div" )
  ;
  
html_template.innerHTML = str_template;

// 
var openHab_Action_Color = function() {
	 openHab_Action.apply(this, []);
	 this.mustDoRender = true;
	 return this;
	}

openHab_Action_Color.prototype = Object.create( openHab_Action.prototype );
openHab_Action_Color.prototype.constructor = openHab_Action_Color;

openHab_Action_Color.prototype.init		= function(PnodeID, parent, children) {
	 openHab_Action.prototype.init.apply(this, [PnodeID, parent, children]);
	 return this;
	}

openHab_Action_Color.prototype.serialize = function() {
	 this.action.method = "setColor_RGB";
	 var json = openHab_Action.prototype.serialize.apply(this, []);
	 json.subType = 'openHab_Action_Color';
	 return json;
	}

openHab_Action_Color.prototype.forceRender		= function() {
	this.mustDoRender = true;
	return openHab_Action.prototype.forceRender.apply(this, []);
}

openHab_Action_Color.prototype.Render = function() {
	 var self = this;
	 var root = openHab_Action.prototype.Render.apply(this,[]);
	 if(this.mustDoRender) {
		 this.mustDoRender = false;
		 root.classList.add( "openHab_Action_Color" );
		 this.copyHTML(html_template, this.html.actionName);
		 this.html.color			= root.querySelector("input.color");
		 if(this.action.params.length === 0) {
			 this.action.params = [255, 0, 0];
			}
		 this.html.color.onchange	= function() {
			 // console.log(this.value);
			 var R = parseInt( this.value.substring(1,3), 16)
			   , G = parseInt( this.value.substring(3,5), 16)
			   , B = parseInt( this.value.substring(5,7), 16)
			   ;
			 self.action.params = [R, G, B];
			 // console.log("Color", self.action.params);
			}
		 DragDrop.updateConfig	( this.dropZoneSelectorId
								, { acceptedClasse: [[openHabTypes.HSB]]
								  }
								);
		}
	 // console.log("Render color", this.action.params);
	 this.html.color.value	= "#" 
							+ ("0" + this.action.params[0].toString(16) ).slice(-2)
							+ ("0" + this.action.params[1].toString(16) ).slice(-2)
							+ ("0" + this.action.params[2].toString(16) ).slice(-2)
							;
	 return root;
	}

module.exports = openHab_Action_Color;
