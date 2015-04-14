define	( [ './PnodePresentation.js'
		  , '../DragDrop.js'
		  , '../utils.js'
		  ]
		, function(PnodePresentation, DragDrop, utils) {

// linking CSS
var css = document.createElement('link');
	css.setAttribute('rel' , 'stylesheet');
	css.setAttribute('href', 'js/Presentations/HTML_templates/PForbidPresentation.css');
	document.body.appendChild(css);
	
var htmlTemplate = null;
utils.XHR( 'GET', 'js/Presentations/HTML_templates/PForbidPresentation.html'
		 , function() {htmlTemplate = this.responseText;}
		 );

		
var PForbidPresentation = function() {
	// console.log(this);
	PnodePresentation.prototype.constructor.apply(this, []);
	return this;
}

PForbidPresentation.prototype = new PnodePresentation();
PForbidPresentation.prototype.className = 'PForbidNode';

PForbidPresentation.prototype.init = function(PnodeID, parent, children) {
	PnodePresentation.prototype.init.apply(this, [parent, children]);
	this.PnodeID = PnodeID;
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

PForbidPresentation.prototype.serialize	= function() {
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
	return;
	if(this.html.programs && this.filter.programs) {
		 this.html.programs.innerHTML = "";
		 this.html.programs.appendChild( this.filter.programs.Render() );
		 DragDrop.deleteDropZone( this.dropZoneProgramsId );
		}
	if(this.html.objects && this.filter.objects) {
		 this.html.objects.innerHTML = "";
		 this.html.objects.appendChild ( this.filter.objects.Render () );
		 DragDrop.deleteDropZone( this.dropZoneObjectsId );
		}
	if(this.html.select_HiddenExpose) {
		 this.html.select_HiddenExpose.querySelector( 'option.'+this.filter.HideExpose ).setAttribute('selected', 'selected');
		}
}

PForbidPresentation.prototype.Render	= function() {
	var self = this;
	var root = PnodePresentation.prototype.Render.apply(this, []);
	root.classList.add('PForbidPresentation');
	if(this.html.programs === null) {
		 this.divDescription.innerHTML = htmlTemplate;
		 /*
		 this.html.select_HiddenExpose = document.createElement('select');
			this.html.select_HiddenExpose.classList.add( 'HideExpose' );
			this.html.select_HiddenExpose.innerHTML = '<option class="hide" value="hide">Hide elements</option><option class="expose" value="expose">Expose elements</option>';
			this.html.select_HiddenExpose.onchange = function() {
														 self.filter.HideExpose = self.html.select_HiddenExpose.value;
														}
			this.divDescription.appendChild( this.html.select_HiddenExpose );

		// Drop zone for objects to be hidden/exposed
		 this.html.objects = document.createElement('span');
			this.html.objects.classList.add('objects');
			this.html.objects.innerHTML = "Insert a \"Objects Selector\" here";
			this.divDescription.appendChild( this.html.objects );
			this.dropZoneObjectsId = DragDrop.newDropZone( this.html.objects
									, { acceptedClasse	: ['SelectorNode']
									  , CSSwhenAccepted	: 'possible2drop'
									  , CSSwhenOver		: 'ready2drop'
									  , ondrop			: function(evt, draggedNode, infoObj) {
											 self.filter.objects = new infoObj.constructor(infoObj).init( '' );
											 self.updateHTML_programs_and_objects();
											}
									  }
									);

		// label 
		 this.html.label = document.createElement('span');
			this.html.label.classList.add( 'labelHide' );
			this.html.label.innerHTML = " for programs ";
			this.divDescription.appendChild( this.html.label );

		// Drop zone for programs for which objects will be hidden/exposed
		 this.html.programs = document.createElement('span');
			this.html.programs.classList.add('programs');
			this.html.programs.innerHTML = "Insert a \"Program Selector\" here";
			this.divDescription.appendChild( this.html.programs );
			this.dropZoneProgramsId = DragDrop.newDropZone( this.html.programs
									, { acceptedClasse	: ['SelectorNode', 'Program']
									  , CSSwhenAccepted	: 'possible2drop'
									  , CSSwhenOver		: 'ready2drop'
									  , ondrop			: function(evt, draggedNode, infoObj) {
											 self.filter.programs = new infoObj.constructor(infoObj).init( '' );
											 self.updateHTML_programs_and_objects();
											}
									  }
									);
		 */
		} 
	this.updateHTML_programs_and_objects();
	return root;
}

// Return the constructor
return PForbidPresentation;
});
