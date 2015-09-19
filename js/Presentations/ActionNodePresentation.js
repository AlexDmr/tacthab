var PnodePresentation	= require( './PnodePresentation.js' )
  , DragDrop			= require( '../DragDrop.js' )
  , htmlTemplateText	= require( './HTML_templates/ActionNodePresentation.html' )
  , utils				= require( '../utils.js' )
  ;

// var css = document.createElement('link');
// css.setAttribute('rel' , 'stylesheet');
// css.setAttribute('href', 'js/Presentations/HTML_templates/ActionNodePresentation.css');
// document.head.appendChild(css);

require("./HTML_templates/ActionNodePresentation.css");



var htmlTemplate = document.createElement('div');
htmlTemplate.innerHTML = htmlTemplateText;

var ActionNodePresentation = function() {
	// console.log(this);
	PnodePresentation.prototype.constructor.apply(this, []);
	return this;
}


ActionNodePresentation.prototype = Object.create( PnodePresentation.prototype ); // new PnodePresentation();
ActionNodePresentation.prototype.className = ActionNodePresentation;
ActionNodePresentation.prototype.className = 'ActionNode';

ActionNodePresentation.prototype.init = function(PnodeID, parent, children) {
	var self = this;
	PnodePresentation.prototype.init.apply(this, [PnodeID, parent, children]);
	this.action			= { method		: ''
						  , params		: []
						  };
	this.html			= {};
	this.contextualMenuItems.unshift	( { content	: "trigger action"
										  , cb		: function() {
														 utils.call	( self.PnodeID
																	, 'triggerDirectly'
																	, [self.action.method, self.action.params]
																	);
														}
										  }
										);
	return this;
}

ActionNodePresentation.prototype.serialize	= function() {
	var json = PnodePresentation.prototype.serialize.apply(this, []);
	// Describe action here
	json.subType	= 'ActionNode';
	json.ActionNode = { method		: this.action.method
					  , params		: this.action.params
					  };
	return json;
}
ActionNodePresentation.prototype.unserialize	= function(json, PresoUtils) {
	// Describe action here
	PnodePresentation.prototype.unserialize.apply(this, [json, PresoUtils]);
	this.action.method		= json.ActionNode.method;
	this.action.params		= json.ActionNode.params;
	console.log("ActionNodePresentation::", this.action);
	return this;
}

ActionNodePresentation.prototype.primitivePlug	= function(c) {
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

ActionNodePresentation.prototype.Render	= function() {
	var self = this
	  , root = PnodePresentation.prototype.Render.apply(this, []);
	root.classList.add('ActionNode');
	root.classList.add('ActionNodePresentation');
	if(typeof this.html.actionName === 'undefined') {
		 this.copyHTML(htmlTemplate, root);
		 this.html.img_symbol	= root.querySelector( "img.action_symbol" );
		 this.html.actionName	= root.querySelector(".actionName");
		 this.html.divSelector	= root.querySelector(".selector");
		 this.html.actionDescr	= root.querySelector(".action_description");
		 this.html.img_symbol.setAttribute("src", "js/Presentations/HTML_templates/action_128x128.jpg");
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
module.exports = ActionNodePresentation;

