define	( [ './EventNodePresentation.js'
		  , '../DragDrop.js'
		  , '../utils.js'
		  ]
		, function(EventNodePresentation, DragDrop, utils, Var_UsePresentation) {

var htmlTemplate = null;
utils.XHR( 'GET', 'js/Presentations/HTML_templates/PeventBrickAppear.html'
		 , function() {htmlTemplate = this.responseText;}
		 );

var css = document.createElement('link');
	css.setAttribute('rel' , 'stylesheet');
	css.setAttribute('href', 'js/Presentations/HTML_templates/PeventBrickAppear.css');
	document.head.appendChild(css);
	
var PeventBrickAppear = function() {
	this.event = {};
	this.html  = {};
	EventNodePresentation.prototype.constructor.apply(this, []);
	return this;
}

PeventBrickAppear.prototype = new EventNodePresentation();
PeventBrickAppear.prototype.className = 'PeventBrickAppear';

PeventBrickAppear.prototype.serialize = function() {
	 var json = EventNodePresentation.prototype.serialize.apply(this, []);
	 json.subType = 'PeventBrickAppear';
	 json.eventNode  = 	{ targets	: ['ProtoBrick']
						, parameters: this.event.parameters
						, eventName	: this.event.eventName
						};
	 return json;
	}

PeventBrickAppear.prototype.unserialize	= function(json, PresoUtils) {
	var self = this;
	
	// Describe action here
	EventNodePresentation.prototype.unserialize.apply(this, [json, PresoUtils]);
	this.event.parameters	= json.eventNode.parameters;
	this.event.eventName	= json.eventNode.eventName;
		
	if(typeof this.html.select !== 'undefined') {
		 this.html.select.value = self.event.eventName;
		}
	return this;
}

PeventBrickAppear.prototype.primitivePlug	= function(c) {
	 // console.log("Primitive plug ", this.root, " ->", c.root);
	 this.Render();
	 var P		= this.html.targets
	   , N		= c.Render();
	 if(N.parentElement === null) {
		 P.innerHTML = '';
		 P.appendChild( N );
		}
	 return this;
	}

PeventBrickAppear.prototype.Render	= function() {
	var self = this;
	var root = EventNodePresentation.prototype.Render.apply(this, []);
	root.classList.add('PeventBrickAppear');
	if(typeof this.html.select === 'undefined') {
		 this.divDescription.innerHTML = htmlTemplate;
		 // Select operation
		 this.html.select = this.divDescription.querySelector( 'select.operation' );
			this.html.select.onchange = function() {self.event.eventName = this.value;}
			if(self.event.eventName) {
				 this.html.select.value = self.event.eventName;
				} else {self.event.eventName = this.divDescription.querySelector( 'select.operation > option' ).value;
					   }
		// Configure drop zone
		this.html.targets	= this.divDescription.querySelector(".targets");
		this.dropZoneTargets = DragDrop.newDropZone( this.html.targets
							, { acceptedClasse	: 'SelectorNode'
							  , CSSwhenAccepted	: 'possible2drop'
							  , CSSwhenOver		: 'ready2drop'
							  , ondrop			: function(evt, draggedNode, infoObj) {
									 var Pnode = new infoObj.constructor(infoObj).init( '' );
									 self.appendChild( Pnode );
									}
							  }
							);
		} 
	
	return root;
}

// Return the constructor
return PeventBrickAppear;
});
