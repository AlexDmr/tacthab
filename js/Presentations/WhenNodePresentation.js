var PnodePresentation	= require( './PnodePresentation.js' )
  , utils				= require( '../utils.js' )
  , DragDrop			= require( '../DragDrop.js' )
  , Var_UsePresentation	= require( './Var_UsePresentation.js' )
  , str_template		= require( './HTML_templates/WhenNodePresentation.html' )
  , htmlTemplate		= document.createElement("div")
  ;

htmlTemplate.innerHTML = str_template;
require( "./HTML_templates/WhenNodePresentation.css" );
// var css = document.createElement('link');
	// css.setAttribute('rel' , 'stylesheet');
	// css.setAttribute('href', 'js/Presentations/HTML_templates/WhenNodePresentation.css');
	// document.head.appendChild( css );

var WhenNodePresentation = function() {
	PnodePresentation.prototype.constructor.apply(this, []);
	return this;
}

WhenNodePresentation.prototype = Object.create( PnodePresentation.prototype ); // new PnodePresentation();
WhenNodePresentation.prototype.constructor	= WhenNodePresentation;
WhenNodePresentation.prototype.className	= 'WhenNode';

WhenNodePresentation.prototype.init = function(PnodeID, parent, children) {
	PnodePresentation.prototype.init.apply(this, [PnodeID, parent, children]);
	this.PnodeID = PnodeID;
	this.when = { childEvent	: null
				, childReaction	: null
				, varName		: 'brick'
				, varType		: []
				};
	this.configDragVar    = { constructor	: Var_UsePresentation
							, htmlNode		: null		// this.html.variableName
							, nodeType		: []		// this.event.varType
							, id			: null		// this.event.varId
							, name			: 'brick'	// self.event.eventName
							};
	return this;
}

WhenNodePresentation.prototype.serialize	= function() {
	var json = PnodePresentation.prototype.serialize.apply(this, []);
	json.children = []; // info debug to be sure to remove children, should already be empty.
	json.when = { varName	: this.html.variableName.innerHTML };
 	if(this.when.childEvent   ) {json.when.childEvent		= this.when.childEvent.serialize   ();}
	if(this.when.childReaction) {json.when.childReaction	= this.when.childReaction.serialize();}
	json.subType		= 'WhenNodePresentation';
	return json;
}

WhenNodePresentation.prototype.unserialize	= function(json, PresoUtils) {
	PnodePresentation.prototype.unserialize.apply(this, [json, PresoUtils]);
	if(json.when.childEvent   ) {this.when.childEvent		= PresoUtils.unserialize(json.when.childEvent   ); this.appendChild(this.when.childEvent	 );}
	if(json.when.childReaction) {this.when.childReaction	= PresoUtils.unserialize(json.when.childReaction); this.appendChild(this.when.childReaction);}
	// Implicit variabe
	this.when.varName	= json.when.varName;
	this.when.varType	= json.when.varType;
	
	if(this.html.variableName) {
		 this.html.variableName.innerHTML = "";
		 this.html.variableName.appendChild( document.createTextNode(this.when.varName) );
		 for(var i=0; i<this.when.varType.length; i++) {
			 this.html.variableName.classList.add( this.when.varType[i] );
			}
		 if( this.when.varType.indexOf('Brick') === 0) {
			 this.html.divImplicitVariable.classList.add('display'); 
			} else {this.html.divImplicitVariable.classList.remove('display');}
		}

	this.configDragVar.nodeType	= this.when.varType;
	this.configDragVar.id		= json.when.varId;
	this.configDragVar.name		= json.when.varName;
	this.configDragVar.config	= { id		: this.configDragVar.id
								  , name	: this.configDragVar.name
								  };
	return this;
}

WhenNodePresentation.prototype.Render	= function() {
	var self = this;
	var root = PnodePresentation.prototype.Render.apply(this, []);
	root.classList.add("WhenNodePresentation");
	if(typeof this.html.event === "undefined") {
		 this.copyHTML(htmlTemplate, root);
		 this.html.eventDrop			= root.querySelector(".defwhen > .eventDrop");
		 this.html.event				= root.querySelector(".defwhen > .eventDrop > .event");
		 this.html.instructions			= root.querySelector(".defwhen > .instructions");
		 this.html.divImplicitVariable	= root.querySelector(".defwhen > .eventDrop > .ImplicitVariable");
		// Implicit variable
			 if( this.when && this.when.varType && this.when.varType.indexOf('Brick') === 0) {
				 this.html.divImplicitVariable.classList.add('display'); 
				} else {this.html.divImplicitVariable.classList.remove('display');}
			 // Configure variableName
			 this.html.variableName = this.html.divImplicitVariable.querySelector('.defwhen > .eventDrop > .ImplicitVariable > .variableName');
			// Draggable property
			 this.configDragVar.htmlNode = this.html.variableName;
			 DragDrop.newDraggable ( this.html.variableName
								   , this.configDragVar
								   );
		// Drag&Drop event
		this.dropZoneEventId = DragDrop.newDropZone( self.html.eventDrop
							, { acceptedClasse	: 'EventNode'
							  , CSSwhenAccepted	: 'possible2drop'
							  , CSSwhenOver		: 'ready2drop'
							  , ondrop			: function(evt, draggedNode, infoObj) {
									 self.removeChild( self.when.childEvent );
									 var Pnode = new infoObj.constructor().init	( undefined	// PnodeID
																				, undefined	// parent
																				, undefined	// children
																				, infoObj
																				);
									 self.when.childEvent = Pnode;
									 self.html.event.innerHTML = '';
									 self.appendChild(  self.when.childEvent );
									}
							  }
							);
		// Drag&Drop instructions
			this.dropZoneReactionId = DragDrop.newDropZone( this.html.instructions
								, { acceptedClasse	: [['Pnode', 'instruction']]
								  , CSSwhenAccepted	: 'possible2drop'
								  , CSSwhenOver		: 'ready2drop'
								  , ondrop			: function(evt, draggedNode, infoObj) {
										 self.removeChild( self.when.childReaction );
										 var Pnode = new infoObj.constructor().init	( undefined	// PnodeID
																					, undefined	// parent
																					, undefined	// children
																					, infoObj
																					);
										 self.when.childReaction = Pnode;
										 self.html.instructions.innerHTML = '';
										 self.appendChild( self.when.childReaction );
										}
								  }
								);
		}
	return root;
}

WhenNodePresentation.prototype.primitivePlug	= function(c) {
	if(c && c === this.when.childEvent   ) {this.html.event.innerHTML	  = '';
										    this.html.event.appendChild( c.Render() );
										   }
	if(c && c === this.when.childReaction) {this.html.instructions.innerHTML = '';
										    this.html.instructions.appendChild( c.Render() );
										   }
}

WhenNodePresentation.prototype.deletePrimitives = function() {
	var self = this;
	PnodePresentation.prototype.deletePrimitives.apply(this, []);
	if(this.html.event) {
		 this.html.event = this.html.instructions = null;
		 DragDrop.deleteDropZone( self.dropZoneEventId    );
		 DragDrop.deleteDropZone( self.dropZoneReactionId );
		}
	return this;
}





//______________________________________________________________
/* OLD */
WhenNodePresentation.prototype.RenderOLD	= function() {
	var self = this;
	var root = PnodePresentation.prototype.Render.apply(this, []);
	root.classList.add('WhenNodePresentation');
	if(!this.divChildren) {
		 this.divDescription.innerHTML = 'WhenNode:' + this.PnodeID ;
		 
		 this.divChildren = document.createElement('div');
			root.appendChild( this.divChildren );
			this.divChildren.classList.add('children');
		// Event part
		 this.divEvent		= document.createElement('div');
		 self.divEvent.innerText = ' Drop event here ';
		 this.divChildren.appendChild(this.divEvent);
			this.dropZoneEventId = DragDrop.newDropZone( self.divEvent
								, { acceptedClasse	: 'EventNode'
								  , CSSwhenAccepted	: 'possible2drop'
								  , CSSwhenOver		: 'ready2drop'
								  , ondrop			: function(evt, draggedNode, infoObj) {
										 self.removeChild( self.when.childEvent );
										 var Pnode = new infoObj.constructor().init	( undefined	// PnodeID
																					, undefined	// parent
																					, undefined	// children
																					, infoObj
																					);
										 self.when.childEvent = Pnode; //new infoObj.constructor(infoObj).init( '' );
										 self.divEvent.innerText = '';
										 self.appendChild(  self.when.childEvent );
										 // DragDrop.deleteDropZone( self.dropZoneEventId );
										}
								  }
								);
		// Implicit variable
		 this.divImplicitVariable = document.createElement('div');
		 this.divImplicitVariable.classList.add('ImplicitVariable');
		 if( this.when && this.when.varType && this.when.varType.indexOf('Brick') === 0) {
			 this.divImplicitVariable.classList.add('display'); 
			} else {this.divImplicitVariable.classList.remove('display');}
		 this.divImplicitVariable.innerHTML = '<span class="label">let the call it <div class="variableName Pnode Pselector_variable">brick</div>)</span>'
		 this.divChildren.appendChild( this.divImplicitVariable );
		 // Configure variableName
		 this.html.variableName = this.divImplicitVariable.querySelector('.variableName');
		 // Draggable property
		 self.configDragVar.htmlNode	= this.html.variableName;
		 DragDrop.newDraggable ( this.html.variableName
							   , this.configDragVar
							   );
		 // Edition mode
		 utils.HCI.makeEditable( this.html.variableName );		
		 this.html.variableName.innerHTML = "";
		 this.html.variableName.appendChild( document.createTextNode(this.when.varName) );
		 for(var i=0; i<this.when.varType.length; i++) {
			 this.html.variableName.classList.add( this.when.varType[i] );
			}

		// Reaction part
		 this.divReaction	= document.createElement('div');
		 self.divReaction.innerText = 'Reaction here';
		 this.divChildren.appendChild(this.divReaction);
			this.dropZoneReactionId = DragDrop.newDropZone( this.divReaction
								, { acceptedClasse	: [['Pnode', 'instruction']]
								  , CSSwhenAccepted	: 'possible2drop'
								  , CSSwhenOver		: 'ready2drop'
								  , ondrop			: function(evt, draggedNode, infoObj) {
										 self.removeChild( self.when.childReaction );
										 var Pnode = new infoObj.constructor().init	( undefined	// PnodeID
																					, undefined	// parent
																					, undefined	// children
																					, infoObj
																					);
										 self.when.childReaction = Pnode; //new infoObj.constructor(infoObj).init( '' );
										 self.divReaction.innerText = '';
										 self.appendChild( self.when.childReaction );
										 // DragDrop.deleteDropZone( self.dropZoneReactionId );
										}
								  }
								);
		}
	return root;
}
WhenNodePresentation.prototype.deletePrimitivesOLD = function() {
	var self = this;
	PnodePresentation.prototype.deletePrimitives.apply(this, []);
	if(this.divChildren) {
		 if(this.divChildren.parentNode) {this.divChildren.parentNode.removeChild( this.divChildren );}
		 delete this.divChildren;
		 this.divChildren = this.divEvent = this.divReaction = null;
		 DragDrop.deleteDropZone( self.dropZoneEventId    );
		 DragDrop.deleteDropZone( self.dropZoneReactionId );
		}
	return this;
}

WhenNodePresentation.prototype.primitivePlugOLD	= function(c) {
	if(c && c === this.when.childEvent   ) {this.divEvent.innerText	  = '';
										    this.divEvent.appendChild( c.Render() );
										   }
	if(c && c === this.when.childReaction) {this.divReaction.innerText = '';
										    this.divReaction.appendChild( c.Render() );
										   }
}

// Return the constructor
module.exports = WhenNodePresentation;

