var EventNodePresentation	= require( '../EventNodePresentation.js' )
  // , utils					= require( '../../../utils.js' )
  // , DragDrop				= require( '../../../DragDrop.js' )
  ;
  
// 
var openHab_Event = function() {
	 EventNodePresentation.apply(this, []);
	 this.eventFilter = { att	: "value"
						, op	: "equal"
						, val	: ""
						}
	 this.eventNode =	{ eventName	: 'state'
						, filters	: [this.eventFilter]
						};
	 return this;
	}

openHab_Event.prototype = Object.create( EventNodePresentation.prototype );
openHab_Event.prototype.constructor			= openHab_Event;
EventNodePresentation.prototype.className	= 'PeventBrick';

openHab_Event.prototype.init		= function(PnodeID, parent, children) {
	 EventNodePresentation.prototype.init.apply(this, [PnodeID, parent, children]);
	 return this;
	}

openHab_Event.prototype.serialize = function() {
	 var json = EventNodePresentation.prototype.serialize.apply(this, []);
	 json.subType = 'openHab_Event';
	 json.eventNode = this.eventNode;
	 return json;
	}

openHab_Event.prototype.unserialize = function(json, PresoUtils) {
	 EventNodePresentation.prototype.unserialize.apply(this, [json, PresoUtils]);
	 this.eventNode		= json.eventNode;
	 this.eventFilter	= json.eventNode.filters[0];
	 return json;
	}
	
openHab_Event.prototype.Render = function() {
	 // var self = this;
	 var root = EventNodePresentation.prototype.Render.apply(this, []);
	 root.classList.add( "openHab_Event" );
	 this.html.img_symbol.setAttribute("src", "js/Presentations/openHab/templates/Event_openhab-logo-square.png");
	 return root;
	}

module.exports = openHab_Event;


