var PnodePresentation	= require( './PnodePresentation.js' )
  // , DragDrop			= require( '../DragDrop.js' )
  ;

require( "./HTML_templates/Program_UsePresentation.css" );
// var css = document.createElement('link');
	// css.setAttribute('rel' , 'stylesheet');
	// css.setAttribute('href', 'css/Program_UsePresentation.css');
	// document.head.appendChild( css );

var Program_UsePresentation = function() {
	// console.log(this);
	PnodePresentation.prototype.constructor.apply(this, []);
	return this;
}

Program_UsePresentation.prototype = Object.create( PnodePresentation.prototype ); // new PnodePresentation();
Program_UsePresentation.prototype.className		= 'Pselector_program';
Program_UsePresentation.prototype.constructor	= Program_UsePresentation

Program_UsePresentation.prototype.init = function(PnodeID, parent, children, infoObj) {
	PnodePresentation.prototype.init.apply(this, [PnodeID, parent, children, infoObj]);
	this.selector	= { progDefId	: null
					  , name		: ''
					  };
	if(infoObj) {
		 this.selector.progDefId	= infoObj.config.id;
		 this.selector.name			= infoObj.config.name;
		}
	return this;
}

Program_UsePresentation.prototype.serialize	= function() {
	var json = PnodePresentation.prototype.serialize.apply(this, []);
	// Describe action here
	json.subType	= 'Program_UsePresentation';
	json.selector = { progDefId		: this.selector.progDefId
					};
	return json;
}

Program_UsePresentation.prototype.unserialize	= function(json, PresoUtils) {
	// Describe action here
	PnodePresentation.prototype.unserialize.apply(this, [json, PresoUtils]);
	this.selector.progDefId	= json.selector.progDefId;
	this.selector.name		= json.selector.name;
	if(this.html.spanProgramName) {
		 this.html.spanProgramName.innerHTML = '';
		 this.html.spanProgramName.classList.add( this.selector.progDefId );
		 this.html.spanProgramName.appendChild( document.createTextNode(this.selector.name) );
		}
	return this;
}

Program_UsePresentation.prototype.updateType = function() {
	
}

Program_UsePresentation.prototype.Render	= function() {
	// var self = this;
	var root = PnodePresentation.prototype.Render.apply(this, []);
	root.classList.add('Pselector_program');
	if(typeof this.html.spanProgramName === 'undefined') {
		 this.html.spanProgramName = document.createElement('span');
			this.html.spanProgramName.classList.add( 'program' );
			this.divDescription.appendChild( this.html.spanProgramName );
			if(this.selector.progDefId) {
				 this.html.spanProgramName.classList.add( this.selector.progDefId );
				 this.html.spanProgramName.appendChild( document.createTextNode(this.selector.name) );
				}
		}
	return root;
}

// Return the constructor
module.exports = Program_UsePresentation;

