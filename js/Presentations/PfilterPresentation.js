var PnodePresentation	= require( './PnodePresentation.js' )
  , DragDrop			= require( '../DragDrop.js' )
  ;

var PfilterPresentation = function() {
	// console.log(this);
	PnodePresentation.apply(this, []);
	return this;
}

PfilterPresentation.prototype = Object.create( PnodePresentation.prototype ); // new PnodePresentation();
PfilterPresentation.prototype.constructor	= PfilterPresentation;
PfilterPresentation.prototype.className		= 'PfilterNode';

PfilterPresentation.prototype.init = function(PnodeID, parent, children) {
	PnodePresentation.prototype.init.apply(this, [PnodeID, parent, children]);
	this.PnodeID = PnodeID;
	this.filter		= { programs	: null
					  , objects		: null
					  , HideExpose	: 'hide'
					  };
	this.html		= { programs	: null
					  , objects		: null
					  };
	return this;
}
PfilterPresentation.prototype.serialize	= function() {
	var json = PnodePresentation.prototype.serialize.apply(this, []);
	// Describe action here
	json.subType	= 'PfilterPresentation';
	json.filter		= {HideExpose : this.filter.HideExpose};
	if(this.filter.programs) {json.filter.programs = this.filter.programs.serialize();}
	if(this.filter.objects ) {json.filter.objects  = this.filter.objects.serialize ();}
	return json;
}


PfilterPresentation.prototype.unserialize	= function(json, PresoUtils) {
	// Describe action here
	PnodePresentation.prototype.unserialize.apply(this, [json, PresoUtils]);
	if(json.filter.programs) {this.filter.programs = PresoUtils.unserialize(json.filter.programs);}
	if(json.filter.objects ) {this.filter.objects  = PresoUtils.unserialize(json.filter.objects );}
	this.filter.HideExpose = json.filter.HideExpose;
	this.updateHTML_programs_and_objects();
	return this;
}

PfilterPresentation.prototype.updateHTML_programs_and_objects = function() {
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

PfilterPresentation.prototype.Render	= function() {
	var self = this;
	var root = PnodePresentation.prototype.Render.apply(this, []);
	root.classList.add('PfilterNode');
	if(this.html.programs === null) {
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
											 var Pnode = new infoObj.constructor().init	( undefined	// PnodeID
																						, undefined	// parent
																						, undefined	// children
																						, infoObj
																						);
											 self.filter.objects = Pnode; //new infoObj.constructor(infoObj).init( '' );
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
											 var Pnode = new infoObj.constructor().init	( undefined	// PnodeID
																						, undefined	// parent
																						, undefined	// children
																						, infoObj
																						);
											 self.filter.programs = Pnode; //new infoObj.constructor(infoObj).init( '' );
											 self.updateHTML_programs_and_objects();
											}
									  }
									);
		} 
	this.updateHTML_programs_and_objects();
	return root;
}

// Return the constructor
module.exports = PfilterPresentation;

