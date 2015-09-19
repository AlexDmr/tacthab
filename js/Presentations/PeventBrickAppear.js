var EventNodePresentation	= require( './EventNodePresentation.js' )
  , DragDrop				= require( '../DragDrop.js' )
  // , utils					= require( '../utils.js' )
  , strTemplate				= require( './HTML_templates/PeventBrickAppear.html' )
  , htmlTemplate			= document.createElement("div")
  ;
  
htmlTemplate.innerHTML = strTemplate;

var css = document.createElement('link');
	css.setAttribute('rel' , 'stylesheet');
	css.setAttribute('href', 'js/Presentations/HTML_templates/PeventBrickAppear.css');
	document.head.appendChild(css);
	
var PeventBrickAppear = function() {
	EventNodePresentation.prototype.constructor.apply(this, []);
	return this;
}

PeventBrickAppear.prototype = Object.create( EventNodePresentation.prototype ); // new EventNodePresentation();
PeventBrickAppear.prototype.constructor	= PeventBrickAppear;
PeventBrickAppear.prototype.className	= 'PeventBrickAppear';

PeventBrickAppear.prototype.init		= function(PnodeID, parent, children) {
	EventNodePresentation.prototype.init.apply(this, [PnodeID, parent, children]);
	return this;
}

PeventBrickAppear.prototype.serialize	= function() {
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

/*
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
*/

PeventBrickAppear.prototype.Render	= function() {
	var self = this;
	var root = EventNodePresentation.prototype.Render.apply(this, []);
	root.classList.add('PeventBrickAppear');
	if(typeof this.html.select === 'undefined') {
		 this.copyHTML(htmlTemplate, this.html.eventName);
		 // Select operation
		 this.html.select = this.html.eventName.querySelector( 'select.operation' );
			this.html.select.onchange = function() {self.event.eventName = this.value;}
			this.event.eventName = this.event.eventName || this.html.select.querySelector( 'option' ).value;
		// Configure drop zone
		DragDrop.updateConfig	( this.dropZoneSelectorId
								, { acceptedClasse: [['SelectorNode']]
								  }
								);
		}
	this.html.select.value = this.event.eventName;
	return root;
}

// Return the constructor
module.exports = PeventBrickAppear;
