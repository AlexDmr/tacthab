var PnodePresentation	= require( './PnodePresentation.js' )
  // , DragDrop			= require( '../DragDrop.js' )
  , utils				= require( '../utils.js' )
  , AlxTextEditor		= require( './widgets/AlxTextEditor.js' )
  ;

// XXX Try direct loading
var htmlTemplate;
utils.XHR( 'GET', 'js/Presentations/HTML_templates/Pselector_TextPresentation.html'
		 , function() {htmlTemplate = this.responseText;}
		 );
var css = document.createElement('link');
	css.setAttribute('rel' , 'stylesheet');
	css.setAttribute('href', 'js/Presentations/HTML_templates/Pselector_TextPresentation.css');
	document.head.appendChild( css );

var Pselector_TextPresentation = function() {
	// console.log(this);
	PnodePresentation.prototype.constructor.apply(this, []);
	this.alxTextEditor = new AlxTextEditor();
	return this;
}

Pselector_TextPresentation.prototype = Object.create( PnodePresentation.prototype ); // new PnodePresentation();
Pselector_TextPresentation.prototype.constructor	= Pselector_TextPresentation;
Pselector_TextPresentation.prototype.className		= 'Pselector_Text';

Pselector_TextPresentation.prototype.init = function(PnodeID, parent, children, infoObj) {
	PnodePresentation.prototype.init.apply(this, [PnodeID, parent, children, infoObj]);
	this.selector	= {text : ''};
	if(infoObj) {
		 this.selector.text	= infoObj.config.text;
		}
	return this;
}

Pselector_TextPresentation.prototype.serialize	= function() {
	var json = PnodePresentation.prototype.serialize.apply(this, []);
	// Describe action here
	json.subType	= 'Pselector_TextPresentation';
	json.selector = this.selector;
	return json;
}

Pselector_TextPresentation.prototype.unserialize	= function(json, PresoUtils) {
	// Describe action here
	PnodePresentation.prototype.unserialize.apply(this, [json, PresoUtils]);
	this.selector = json.selector;
	if(this.html.spanVarId) {
		 this.html.spanVarId.innerHTML = '';
		 this.html.spanVarId.classList.add( this.selector.variableId );
		 this.html.spanVarId.appendChild( document.createTextNode(this.selector.name) );
		}
	return this;
}

Pselector_TextPresentation.prototype.updateType = function() {}

Pselector_TextPresentation.prototype.Render	= function() {
	// var self = this;
	var root = PnodePresentation.prototype.Render.apply(this, []);
	root.classList.add('Pselector_TextPresentation');
	this.divDescription.setAttribute('', 'true');
	return root;
}

// Return the constructor
module.exports = Pselector_TextPresentation;

