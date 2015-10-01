var PnodePresentation	= require( './PnodePresentation.js' )
  // , DragDrop			= require( '../DragDrop.js' )
  ;
  
require( "./HTML_templates/Var_UsePresentation.css" );
// var css = document.createElement('link');
	// css.setAttribute('rel' , 'stylesheet');
	// css.setAttribute('href', 'css/Var_UsePresentation.css');
	// document.head.appendChild( css );

var Var_UsePresentation = function() {
	// console.log(this);
	PnodePresentation.prototype.constructor.apply(this, []);
	return this;
}

Var_UsePresentation.prototype = Object.create( PnodePresentation.prototype ); // new PnodePresentation();
Var_UsePresentation.prototype.constructor	= Var_UsePresentation;
Var_UsePresentation.prototype.className		= 'Pselector_variable';

Var_UsePresentation.prototype.init = function(PnodeID, parent, children, infoObj) {
	PnodePresentation.prototype.init.apply(this, [PnodeID, parent, children, infoObj]);
	this.selector	= { variableId	: null
					  , name		: ''
					  };
	if(infoObj) {
		 this.selector.variableId	= infoObj.config.id;
		 this.selector.name			= infoObj.config.name;
		}
	return this;
}

Var_UsePresentation.prototype.serialize	= function() {
	var json = PnodePresentation.prototype.serialize.apply(this, []);
	// Describe action here
	json.subType	= 'Var_UsePresentation';
	json.selector = { name			: this.selector.name
					, type			: []
					, variableId	: this.selector.variableId
					};
	return json;
}

Var_UsePresentation.prototype.unserialize	= function(json, PresoUtils) {
	// Describe action here
	PnodePresentation.prototype.unserialize.apply(this, [json, PresoUtils]);
	this.selector.variableId	= json.selector.variableId;
	this.selector.name			= json.selector.variableName;
	if(this.html.spanVarId) {
		 this.html.spanVarId.innerHTML = '';
		 this.html.spanVarId.classList.add( this.selector.variableId );
		 this.html.spanVarId.appendChild( document.createTextNode(this.selector.name) );
		}
	return this;
}

Var_UsePresentation.prototype.updateType = function() {}

Var_UsePresentation.prototype.Render	= function() {
	// var self = this;
	var root = PnodePresentation.prototype.Render.apply(this, []);
	root.classList.add('Pselector_variable');
	if(typeof this.html.spanVarId === 'undefined') {
		 this.html.spanVarId = document.createElement('span');
			this.html.spanVarId.classList.add( 'varId' );
			this.divDescription.appendChild( this.html.spanVarId );
			if(this.selector.variableId) {
				 this.html.spanVarId.classList.add( this.selector.variableId );
				 this.html.spanVarId.appendChild( document.createTextNode(this.selector.name) );
				}
		}
	return root;
}

// Return the constructor
module.exports = Var_UsePresentation;

