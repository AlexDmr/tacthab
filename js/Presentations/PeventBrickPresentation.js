define	( [ './EventNodePresentation.js'
		  , '../DragDrop.js'
		  , '../utils.js'
		  ]
		, function(EventNodePresentation, DragDrop, utils) {

// Load ressources
var htmlTemplate = null, htmlTemplateFilter = null;
utils.XHR( 'GET', 'js/Presentations/HTML_templates/PeventBrickPresentation.html'
		 , function() {htmlTemplate = this.responseText;}
		 );
utils.XHR( 'GET', 'js/Presentations/HTML_templates/PeventBrickPresentationFilter.html'
		 , function() {htmlTemplateFilter = this.responseText;}
		 );

var css = document.createElement('link');
	css.setAttribute('rel' , 'stylesheet');
	css.setAttribute('href', 'js/Presentations/HTML_templates/PeventBrickPresentation.css');
	document.head.appendChild( css );

var PeventBrickPresentation = function() {
	this.html  = {};
	EventNodePresentation.prototype.constructor.apply(this, []);
	this.event = {filters:[]};
	return this;
}

PeventBrickPresentation.prototype = new EventNodePresentation();
PeventBrickPresentation.prototype.className = 'PeventBrick';


PeventBrickPresentation.prototype.serialize = function() {
	var json = EventNodePresentation.prototype.serialize.apply(this, []);
	json.subType = 'PeventBrickPresentation';
	json.eventNode  = 	{ parameters: this.event.parameters
						, eventName	: this.event.eventName
						}
	if(this.html.filter) {
		 var L_filters = this.html.filter.querySelectorAll( 'div.FILTER' )
		   , filter;
		 for(var i=0; i<L_filters.length; i++) {
			 filter = L_filters.item(i);
			 json.event.filters.push( { attribute	: filter.querySelector('input.attribute').value
									  , operator	: filter.querySelector('select.operator').value
									  , value		: filter.querySelector('input.value'    ).value
									  } 
									);
			}
		}
	 return json;
	}

PeventBrickPresentation.prototype.unserialize	= function(json, PresoUtils) {
	// Describe action here
	EventNodePresentation.prototype.unserialize.apply(this, [json, PresoUtils]);
	this.event.objectId		= json.eventNode.objectId;
	this.event.eventName	= json.eventNode.eventName;
	return this;
}

PeventBrickPresentation.prototype.appendFilter	= function(attribute, operator, value) {
	var filter = document.createElement( 'div' );
		filter.classList.add( 'FILTER' );
		filter.innerHTML = htmlTemplateFilter;
		var del = filter.querySelector( 'input.delete' );
		del.onclick = function() {filter.parentNode.removeChild(filter); del.onclick = null;}
		if(attribute) {filter.querySelector('.attribute').value = attribute;}
		if(operator ) {filter.querySelector('.operator' ).value = operator ;}
		if(value    ) {filter.querySelector('.value'    ).value = value    ;}
	this.html.filter.appendChild( filter );
}

PeventBrickPresentation.prototype.Render	= function() {
	var self = this;
	var root = EventNodePresentation.prototype.Render.apply(this, []);
	root.classList.add('PeventBrickPresentation');
	if(typeof this.html.actionName === 'undefined') {
		// Describe the event to be observed
		this.divDescription.innerHTML = htmlTemplate;
		// Targets
		this.html.targets	= this.divDescription.querySelector(".EventNode.content > .targets");
			this.dropZoneTargets = DragDrop.newDropZone( this.html.targets
								, { acceptedClasse	: 'SelectorNode'
								  , CSSwhenAccepted	: 'possible2drop'
								  , CSSwhenOver		: 'ready2drop'
								  , ondrop			: function(evt, draggedNode, infoObj) {
										 var Pnode = new infoObj.constructor(infoObj).init( '' );
										 self.appendChild( Pnode );
										 console.log("Creation of", Pnode);
										 // Retrieve event list
										}
								  }
								);
		// Event name
		this.html.eventName	= this.divDescription.querySelector(".EventNode.content > .eventName");
			this.html.eventName.onchange = function() {self.event.eventName = self.html.eventName.value;};
			if(this.event.eventName) this.html.eventName.setAttribute('value', this.event.eventName);
		// Filter
		this.html.filter		= this.divDescription.querySelector(".EventNode.content > .filter");
		this.html.addFilter	= this.divDescription.querySelector(".filter > input.addFilter");
			this.html.addFilter.onclick	= function() {self.appendFilter();}
		 // Add filters
		 var i, filter;
		 for(i=0; i<this.event.filters.length; i++) {
			 filter = this.event.filters[i];
			 this.appendFilter( filter.attribute, filter.operator, filter.value );
			}
		}
	
	return root;
}

// Return the constructor
return PeventBrickPresentation;
});
