var EventNodePresentation	= require( './EventNodePresentation.js' )
  , DragDrop				= require( '../DragDrop.js' )
  , utils					= require( '../utils.js' )
  ;
				  // , htmlTemplate, htmlTemplateFilter

// Load ressources

// XXX Try direct loading
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
	EventNodePresentation.apply(this, []);
	return this;
}

PeventBrickPresentation.prototype = Object.create( EventNodePresentation.prototype ); // new EventNodePresentation();
PeventBrickPresentation.prototype.constructor	= PeventBrickPresentation;
PeventBrickPresentation.prototype.className		= 'PeventBrick';

PeventBrickPresentation.prototype.init		= function(PnodeID, parent, children) {
	EventNodePresentation.prototype.init.apply(this, [PnodeID, parent, children]);
	this.event = {filters:[]};
	return this;
}

PeventBrickPresentation.prototype.serialize = function() {
	var json = EventNodePresentation.prototype.serialize.apply(this, []);
	json.subType = 'PeventBrickPresentation';
	json.eventNode  = 	{ parameters: this.event.parameters
						, eventName	: this.event.eventName
						, filters	: []
						};
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

PeventBrickPresentation.prototype.primitivePlug	= function(c) {
	 // console.log("Primitive plug ", this.root, " ->", c.root);
	 this.Render();
	 var P		= this.html.targets
	   , N		= c.Render()
	   , self	= this
	   , i, e, eventName, option;
	 if(N.parentElement === null) {
		 P.innerHTML = '';
		 P.appendChild( N );
		 if(this.children[0].PnodeID) {
			 console.log("Call ESA for", this.children[0].PnodeID);
			 utils.call( c.PnodeID, 'getESA', []
					   , function(esa) {
							 console.log(esa);
							 console.log("---ESA:", esa);
							 if(esa.error) {return;}
							 var events = {};
							 for(i in esa) {
								 for(e=0; e<esa[i].events.length; e++) {
									 eventName = esa[i].events[e];
									 if(typeof events[eventName] === 'undefined') {
										 events[eventName] = true;
										 option = document.createElement('option');
										 option.setAttribute('value', eventName);
										 option.appendChild( document.createTextNode(eventName) );
										 self.html.eventName.appendChild( option );
										 if(!self.event.eventName) {self.event.eventName = eventName;}
										}
									}
								}
							}
					   );
			}
		}
	 return this;
	}

PeventBrickPresentation.prototype.Render	= function() {
	var self = this;
	var root = EventNodePresentation.prototype.Render.apply(this, []);
	root.classList.add('PeventBrickPresentation');
	if(typeof this.html.targets === 'undefined') {
		// Describe the event to be observed
		this.divDescription.innerHTML = htmlTemplate;
		// Targets
		this.html.targets	= this.divDescription.querySelector(".EventNode.content > .targets");
			this.dropZoneTargets = DragDrop.newDropZone( this.html.targets
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
		// Event name
		this.html.eventName	= this.divDescription.querySelector(".EventNode.content > .eventName");
			this.html.eventName.onchange = function() {self.event.eventName = self.html.eventName.value;};
			if(this.event.eventName) {this.html.eventName.setAttribute('value', this.event.eventName);}
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
		 // Add children?
		 for(i=0; i<this.children.length; i++) {
			 this.primitivePlug(this.children[i]);
			}
		}
	
	return root;
}

// Return the constructor
module.exports = PeventBrickPresentation;

