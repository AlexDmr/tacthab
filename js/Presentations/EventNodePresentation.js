var PnodePresentation	= require( './PnodePresentation.js' )
  , DragDrop			= require( '../DragDrop.js' )
  // , utils				= require( '../utils.js' )
  , htmlTemplateText	= require( './HTML_templates/EventNodePresentation.html' )
  ;

// var css = document.createElement('link');
// css.setAttribute('rel' , 'stylesheet');
// css.setAttribute('href', 'js/Presentations/HTML_templates/EventNodePresentation.css');
// document.head.appendChild(css);
require( "./HTML_templates/EventNodePresentation.css" );

var htmlTemplate = document.createElement('div');
htmlTemplate.innerHTML = htmlTemplateText;

  
// Desfining EventNodePresentation
var EventNodePresentation = function() {
	PnodePresentation.apply(this, []);
	return this;
}

EventNodePresentation.prototype = Object.create( PnodePresentation.prototype ); // new PnodePresentation();
EventNodePresentation.prototype.constructor	= EventNodePresentation;
EventNodePresentation.prototype.className	= 'EventNode';

EventNodePresentation.prototype.init = function(PnodeID, parent, children) {
	PnodePresentation.prototype.init.apply(this, [PnodeID, parent, children]);
	this.event = {};
	return this;
}

EventNodePresentation.prototype.serialize = function() {
	var json = PnodePresentation.prototype.serialize.apply(this, []);
	json.subType = 'EventNodePresentation';
	if(this.implicitVariableId) {json.implicitVariableId = this.implicitVariableId;}
	return json;
}

EventNodePresentation.prototype.unserialize	= function(json, PresoUtils) {
	// var self = this;
	PnodePresentation.prototype.unserialize.apply(this, [json, PresoUtils]);
	if(json.implicitVariableId) {this.implicitVariableId = json.implicitVariableId;}
	return this;
}

EventNodePresentation.prototype.primitivePlug	= function(c) {
	 // console.log("Primitive plug ", this.root, " ->", c.root);
	 this.Render();
	 var P = this.html.divSelector
		, N = c.Render();
	 if(N.parentElement === null) {
		 P.innerHTML = '';
		 P.appendChild( N );
		}
	 return this;
	 
	}

EventNodePresentation.prototype.Render	= function() {
	var self = this;
	var root = PnodePresentation.prototype.Render.apply(this, []);
	root.classList.add('EventNode');
	root.classList.add("EventNodePresentation");
	root.classList.remove('Pnode');
	if(typeof this.html.eventName === 'undefined') {
		 this.copyHTML(htmlTemplate, root);
		 this.html.img_symbol	= root.querySelector( "img.event_symbol" );
		 this.html.eventName	= root.querySelector(".eventName");
		 this.html.divSelector	= root.querySelector(".selector");
		 this.html.eventDescr	= root.querySelector(".event_description");
		 this.html.img_symbol.setAttribute("src", "js/Presentations/HTML_templates/event-icon.png");
		 this.dropZoneSelectorId = DragDrop.newDropZone	( this.html.divSelector
														, { acceptedClasse	: 'SelectorNode'
														  , CSSwhenAccepted	: 'possible2drop'
														  , CSSwhenOver		: 'ready2drop'
														  , ondrop			: function(evt, draggedNode, infoObj) {
																 var Pnode = new infoObj.constructor().init	( undefined	// PnodeID
																											, undefined	// parent
																											, undefined	// children
																											, infoObj
																											);
																 self.appendChild( Pnode );
																}
														  }
														);
		}
	return root;
}

// Return the constructor
module.exports = EventNodePresentation;

