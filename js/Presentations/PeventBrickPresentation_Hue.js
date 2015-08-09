var PeventBrickPresentation	= require( './PeventBrickPresentation.js' )
  // , DragDrop				= require( '../DragDrop.js' )
  // , utils					= require( '../utils.js' )
  ;

var PeventBrickPresentation_Hue = function() {
	PeventBrickPresentation.prototype.constructor.apply(this, []);
	return this;
}

PeventBrickPresentation_Hue.prototype = Object.create( PeventBrickPresentation.prototype ); // new PeventBrickPresentation();
PeventBrickPresentation_Hue.prototype.constructor	= PeventBrickPresentation_Hue;
PeventBrickPresentation_Hue.prototype.className		= 'PeventBrick';

PeventBrickPresentation_Hue.prototype.Render	= function() {
	// var self = this;
	var root = PeventBrickPresentation.prototype.Render.apply(this, []);
	root.classList.add('PeventBrickPresentation_Hue');
	// Add possible events
	this.html.selectEvent.innerHTML = '';
	var events = [ {name : 'on'		, action : ''}
				 , {name : 'off'	, action : ''}
				 ];
	for(var i=0; i<events.length; i++) {
		 var event  = events[i];
		 var option = document.createElement('option');
		 option.setAttribute('value', i);
		 option.appendChild( document.createTextNode(event.name) );
		 this.html.selectEvent.appendChild( option );
		}
	this.html.selectEvent.onchange = function() {
		 // var i = parseInt(this.value);
		 // var event = events[i];
		 // XXX register event information to be serialized...
		}
	return root;
}

// Return the constructor
module.exports = PeventBrickPresentation_Hue;

