var PnodePresentation	= require( './PnodePresentation.js' )
  // , DragDrop			= require( '../DragDrop.js' )
  ;
		
var css = document.createElement('link');
	css.setAttribute('rel' , 'stylesheet');
	css.setAttribute('href', 'js/Presentations/HTML_templates/Pselector_ObjTypePresentation.css');
	document.head.appendChild( css );

var Pselector_ObjTypePresentation = function() {
	// console.log(this);
	PnodePresentation.prototype.constructor.apply(this, []);
	return this;
}

Pselector_ObjTypePresentation.prototype = Object.create( PnodePresentation.prototype ); // new PnodePresentation();
Pselector_ObjTypePresentation.prototype.constructor	= Pselector_ObjTypePresentation;
Pselector_ObjTypePresentation.prototype.className	= 'Pselector_ObjType';

Pselector_ObjTypePresentation.prototype.init = function(PnodeID, parent, children, infoObj) {
	PnodePresentation.prototype.init.apply(this, [PnodeID, parent, children, infoObj]);
	this.selector	= { objectsType	: null
					  };
	if(infoObj) {
		 this.selector.objectsType	= infoObj.config.objectsType;
		}
	return this;
}

Pselector_ObjTypePresentation.prototype.serialize	= function() {
	var json = PnodePresentation.prototype.serialize.apply(this, []);
	// Describe action here
	json.subType	= 'Pselector_ObjTypePresentation';
	json.selector = { objectsType	: this.selector.objectsType
					};
	return json;
}

Pselector_ObjTypePresentation.prototype.unserialize	= function(json, PresoUtils) {
	// Describe action here
	PnodePresentation.prototype.unserialize.apply(this, [json, PresoUtils]);
	this.selector.objectsType	= json.selector.objectsType;
	if(this.html.select) {
		 this.html.select.value = this.selector.objectsType;
		}
	return this;
}

Pselector_ObjTypePresentation.prototype.updateType = function() {}

Pselector_ObjTypePresentation.prototype.Render	= function() {
	var self = this, i, option, L
	  , root = PnodePresentation.prototype.Render.apply(this, []);
	root.classList.add('Pselector_ObjTypePresentation');
	if(typeof this.html.select === 'undefined') {
		 this.html.select = document.createElement('select');
		 this.divDescription.innerHTML = "all the";
		 this.divDescription.appendChild( this.html.select );
		 L = ['BrickUPnP_MediaRenderer', 'BrickUPnP_MediaServer', 'BrickUPnP_HueLamp'];
		 for(i=0; i<L.length; i++) {
			 option = document.createElement('option' );
			 option.setAttribute('value', L[i]);
			 option.appendChild( document.createTextNode(L[i]) );
			 this.html.select.appendChild( option );
			}
		 this.html.select.onchange = function(e) {
										 self.selector.objectsType = self.html.select.value;
										}
		 if(this.selector.objectsType) {
			 this.html.select.value = this.selector.objectsType;
			} else {this.html.select.value = L[0];
					this.html.select.onchange();
				   }
		}
	return root;
}

// Return the constructor
module.exports = Pselector_ObjTypePresentation;

