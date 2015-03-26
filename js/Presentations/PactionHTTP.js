define	( [ './PnodePresentation.js'
		  ]
		, function(PnodePresentation, DragDrop) {
// Retrieving htmlTemplate
var htmlTemplate = '';
utils.XHR( 'GET', 'js/Presentations/HTML_templates/PactionHTTP.html'
		 , function() {htmlTemplate = this.responseText;}
		 );

// Defining PactionHTTP
var PactionHTTP = function() {
	// console.log(this);
	this.html			= {};
	PnodePresentation.prototype.constructor.apply(this, []);
	this.action			= { method		: ''
						  , params		: []
						  };
	return this;
}

PactionHTTP.prototype = new PnodePresentation();
PactionHTTP.prototype.className = 'ActionNode';

PactionHTTP.prototype.init = function(PnodeID, parent, children) {
	PnodePresentation.prototype.init.apply(this, [parent, children]);
	this.PnodeID = PnodeID;
	return this;
}
PactionHTTP.prototype.serialize	= function() {
	var json = PnodePresentation.prototype.serialize.apply(this, []);
	// Describe action here
	json.subType	= 'PactionHTTP';
	json.ActionNode = { method		: 'httpQuery'
					  , params		: this.action.params
					  , targets		: ['webServer']
					  };
	return json;
}
PactionHTTP.prototype.unserialize	= function(json, PresoUtils) {
	// Describe action here
	PnodePresentation.prototype.unserialize.apply(this, [json, PresoUtils]);
	this.action.method		= json.ActionNode.method;
	this.action.params		= json.ActionNode.params;
	return this;
}

PactionHTTP.prototype.Render	= function() {
	var self = this;
	var root = PnodePresentation.prototype.Render.apply(this, []);
	root.classList.add('ActionNode');
	if(typeof this.html.operation === 'undefined') {
		 this.divDescription.innerHTML = htmlTemplate;
		} 
	return root;
}

// Return the constructor
return PactionHTTP;
});
