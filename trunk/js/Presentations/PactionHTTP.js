define	( [ './PnodePresentation.js'
		  , '../utils.js'
		  ]
		, function(PnodePresentation, utils) {
// Retrieving htmlTemplate
var htmlTemplate = '';
utils.XHR( 'GET', 'js/Presentations/HTML_templates/PactionHTTP.html'
		 , function() {htmlTemplate = this.responseText;}
		 );

var css = document.createElement('link');
	css.setAttribute('rel' , 'stylesheet');
	css.setAttribute('href', 'js/Presentations/HTML_templates/PactionHTTP.css');
	document.head.appendChild(css);

// Defining PactionHTTP
var PactionHTTP = function() {
	// console.log(this);
	PnodePresentation.prototype.constructor.apply(this, []);
	return this;
}

PactionHTTP.prototype = new PnodePresentation();
PactionHTTP.prototype.className = 'ActionNode';

PactionHTTP.prototype.init = function(PnodeID, parent, children) {
	PnodePresentation.prototype.init.apply(this, [PnodeID, parent, children]);
	this.action			= { method		: 'httpRequest'
						  , params		: []
						  };
	return this;
}
PactionHTTP.prototype.serialize	= function() {
	var json = PnodePresentation.prototype.serialize.apply(this, []);
	// Describe action here
	json.subType	= 'PactionHTTP';
	var headers = { 'Content-Type': this.html.headers.value};
	this.action.params = { url		: this.html.url.value
						 , method	: this.html.method.value
						 , headers	: headers
						 , body		: this.html.body.value
						 };
	json.ActionNode = { method		: 'httpRequestJSONstringified'
					  , params		: [this.action.params]
					  , targets		: ['webServer']
					  };
	return json;
}
PactionHTTP.prototype.unserialize	= function(json, PresoUtils) {
	// Describe action here
	PnodePresentation.prototype.unserialize.apply(this, [json, PresoUtils]);
	this.action.method		= 'httpRequest';
	this.action.params		= json.ActionNode.params[0];
	if(typeof this.html.method !== 'undefined') {
		 this.html.url.value		= this.action.params.url;
		 this.html.method.value		= this.action.params.method;
		 this.html.headers.value	= this.action.params.headers['Content-Type'];
		 this.html.body.value		= this.action.params.body;
		}
	return this;
}

PactionHTTP.prototype.Render	= function() {
	var self = this;
	var root = PnodePresentation.prototype.Render.apply(this, []);
	root.classList.add('ActionNode');
	root.classList.add('PactionHTTP');
	if(typeof this.html.method === 'undefined') {
		 this.divDescription.innerHTML = htmlTemplate;
		 this.html.url		= this.divDescription.querySelector('input.url'     );
		 this.html.method	= this.divDescription.querySelector('select.method' );
		 this.html.headers	= this.divDescription.querySelector('select.headers');
		 this.html.body		= this.divDescription.querySelector('textarea.body' );
		} 
	return root;
}

// Return the constructor
return PactionHTTP;
});
