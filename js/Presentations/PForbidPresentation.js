var PnodePresentation	= require( './PnodePresentation.js' )
  , DragDrop			= require( '../DragDrop.js' )
  , utils				= require( '../utils.js' )
  , htmlTemplate		= require( './HTML_templates/PForbidPresentation.html' )
  ;


// linking CSS
require( "./HTML_templates/PForbidPresentation.css" );
// var css = document.createElement('link');
	// css.setAttribute('rel' , 'stylesheet');
	// css.setAttribute('href', 'js/Presentations/HTML_templates/PForbidPresentation.css');
	// document.body.appendChild(css);
	
// var htmlTemplate = null;
// utils.XHR( 'GET', 'js/Presentations/HTML_templates/PForbidPresentation.html'
		 // , function() {htmlTemplate = this.responseText;}
		 // );

		
var PForbidPresentation = function() {
	// console.log(this);
	PnodePresentation.prototype.constructor.apply(this, []);
	return this;
}

PForbidPresentation.prototype = Object.create( PnodePresentation.prototype ); // new PnodePresentation();
PForbidPresentation.prototype.constructor	= PForbidPresentation;
PForbidPresentation.prototype.className		= 'PForbidNode';

PForbidPresentation.prototype.init = function(PnodeID, parent, children) {
	PnodePresentation.prototype.init.apply(this, [PnodeID, parent, children]);
	this.forbid		= { programs	: null
					  , objects		: null
					  , mtdName		: ''
					  , parameters	: []
					  , forbidden	: true
					  };
	this.html		= { programs	: null
					  , objects		: null
					  };
	return this;
}

PForbidPresentation.prototype.serialize		= function() {
	var json = PnodePresentation.prototype.serialize.apply(this, []);
	// Describe action here
	json.subType	= 'PForbidPresentation';
	json.forbid = { forbidden	: this.forbid.forbidden
				  , action		: this.forbid.action
				  , parameters	: this.forbid.parameters
				  }
	if(this.forbid.programs) {json.forbid.programs = this.forbid.programs.serialize();}
	if(this.forbid.objects ) {json.forbid.objects  = this.forbid.objects.serialize ();}
	return json;
}


PForbidPresentation.prototype.unserialize	= function(json, PresoUtils) {
	// Describe action here
	PnodePresentation.prototype.unserialize.apply(this, [json, PresoUtils]);
	if(json.forbid.programs) {this.forbid.programs = PresoUtils.unserialize(json.forbid.programs);}
	if(json.forbid.objects ) {this.forbid.objects  = PresoUtils.unserialize(json.forbid.objects );}
	this.forbid.forbidden	= json.forbid.forbidden;
	this.forbid.action		= json.forbid.action;
	this.forbid.parameters	= json.forbid.parameters;
	this.updateHTML_programs_and_objects();
	return this;
}
//
// XXX à changer ici pour prendre en compte les bons attributs
PForbidPresentation.prototype.updateHTML_programs_and_objects = function() {
	var self = this;
	if(this.html.programs && this.forbid.programs) {
		 this.html.programs.innerHTML = "";
		 this.html.programs.appendChild( this.forbid.programs.Render() );
		 DragDrop.deleteDropZone( this.dropZoneProgramsId );
		}
	if(this.html.objects && this.forbid.objects) {
		 this.html.objects.innerHTML = "";
		 this.html.objects.appendChild ( this.forbid.objects.Render () );
		 DragDrop.deleteDropZone( this.dropZoneObjectsId );
		}
	if(this.html.selectForbidden) {
		 this.html.selectForbidden.querySelector( 'option[value='+this.forbid.forbidden+']' ).setAttribute('selected', 'selected');
		}
	if(this.html.selectActions && this.forbid.objects) {
		 // call for possible actions and update the select.
		 if(this.PnodeID) {
			 utils.call	( this.PnodeID, 'getESA', []
						, function(esa) {
							 var i, option;
							 // console.log("esa", esa);
							 self.html.selectActions.innerHTML = '';
							 for(i in esa.actions) {
								 option = document.createElement('option');
									option.value = i;
									option.appendChild( document.createTextNode(i) );
								 self.html.selectActions.appendChild( option );
								}
							 if(self.forbid.action) {
								 self.html.selectActions.value = self.forbid.action;
								} else {self.forbid.action = option.value;}
							}
						)
			}
		}
}

PForbidPresentation.prototype.Render	= function() {
	var self = this;
	var root = PnodePresentation.prototype.Render.apply(this, []);
	root.classList.add('PForbidPresentation');
	if(this.html.programs === null) {
		 this.divDescription.innerHTML = htmlTemplate;
		
		// Select actions to be forbidden/allowed
		 this.html.selectActions	= this.divDescription.querySelector('select.actions');
		 this.html.selectActions.onchange = function() {self.forbid.action = self.html.selectActions.value;}
		 
		// Select forbidden/allowed
		 this.html.selectForbidden	= this.divDescription.querySelector('select.forbidden');
			this.html.selectForbidden.onchange = function() {
													 self.forbid.forbidden = (self.html.selectForbidden.value === 'true');
													}

		// Drop zone for objects to be forbidden/allowed
		 this.html.objects			= this.divDescription.querySelector('.targets');
		 this.dropZoneObjectsId = DragDrop.newDropZone( this.html.objects
									, { acceptedClasse	: ['SelectorNode']
									  , CSSwhenAccepted	: 'possible2drop'
									  , CSSwhenOver		: 'ready2drop'
									  , ondrop			: function(evt, draggedNode, infoObj) {
											 var Pnode = new infoObj.constructor().init	( undefined	// PnodeID
																						, undefined	// parent
																						, undefined	// children
																						, infoObj
																						);
											 self.forbid.objects = Pnode; // new infoObj.constructor(infoObj).init( '' );
											 self.updateHTML_programs_and_objects();
											}
									  }
									);

		// Drop zone for programs for which objects will be hidden/exposed
		 this.html.programs			= this.divDescription.querySelector('.programs');
			this.dropZoneProgramsId = DragDrop.newDropZone( this.html.programs
									, { acceptedClasse	: ['SelectorNode', 'Program']
									  , CSSwhenAccepted	: 'possible2drop'
									  , CSSwhenOver		: 'ready2drop'
									  , ondrop			: function(evt, draggedNode, infoObj) {
											 var Pnode = new infoObj.constructor().init	( undefined	// PnodeID
																						, undefined	// parent
																						, undefined	// children
																						, infoObj
																						);
											 self.forbid.programs = Pnode; //new infoObj.constructor(infoObj).init( '' );
											 self.updateHTML_programs_and_objects();
											}
									  }
									);
		} 
	this.updateHTML_programs_and_objects();
	return root;
}

// Return the constructor
module.exports = PForbidPresentation;

