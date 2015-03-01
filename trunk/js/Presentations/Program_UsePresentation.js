define	( [ './PnodePresentation.js'
		  , '../DragDrop.js'
		  ]
		, function(PnodePresentation, DragDrop) {
var css = document.createElement('link');
	css.setAttribute('rel' , 'stylesheet');
	css.setAttribute('href', 'css/Program_UsePresentation.css');
	document.head.appendChild( css );

var Program_UsePresentation = function(infoObj) {
	// console.log(this);
	PnodePresentation.prototype.constructor.apply(this, []);
	this.selector	= { programId	: null
					  , name		: ''
					  };
	this.html			= {};
	if(infoObj) {
		 this.selector.programId	= infoObj.config.id;
		 this.selector.name			= infoObj.config.name;
		}
	return this;
}

Program_UsePresentation.prototype = new PnodePresentation();
Program_UsePresentation.prototype.className = 'Pselector_program';

Program_UsePresentation.prototype.init = function(PnodeID, parent, children) {
	PnodePresentation.prototype.init.apply(this, [parent, children]);
	this.PnodeID = PnodeID;
	return this;
}

Program_UsePresentation.prototype.serialize	= function() {
	var json = PnodePresentation.prototype.serialize.apply(this, []);
	// Describe action here
	json.subType	= 'Program_UsePresentation';
	json.selector = { name			: this.selector.name
					, type			: []
					, programId		: this.selector.programId
					};
	return json;
}

Program_UsePresentation.prototype.unserialize	= function(json, PresoUtils) {
	// Describe action here
	PnodePresentation.prototype.unserialize.apply(this, [json, PresoUtils]);
	this.selector.programId	= json.selector.programId;
	this.selector.name		= json.selector.name;
	if(this.html.spanVarId) {
		 this.html.spanVarId.innerHTML = '';
		 this.html.spanVarId.classList.add( this.selector.programId );
		 this.html.spanVarId.appendChild( document.createTextNode(this.selector.name) );
		}
	return this;
}

Program_UsePresentation.prototype.updateType = function() {
	
}

Program_UsePresentation.prototype.Render	= function() {
	// var self = this;
	var root = PnodePresentation.prototype.Render.apply(this, []);
	root.classList.add('Pselector_program');
	if(typeof this.html.spanVarId === 'undefined') {
		 this.html.spanVarId = document.createElement('span');
			this.html.spanVarId.classList.add( 'varId' );
			this.divDescription.appendChild( this.html.spanVarId );
			if(this.selector.programId) {
				 this.html.spanVarId.classList.add( this.selector.programId );
				 this.html.spanVarId.appendChild( document.createTextNode(this.selector.name) );
				}
		}
	return root;
}

// Return the constructor
return Program_UsePresentation;
});
