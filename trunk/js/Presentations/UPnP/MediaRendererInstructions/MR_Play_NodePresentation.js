define	( [ '../../ActionNodePresentation.js'
		  , '../../../utils.js'
		  , '../../../DragDrop.js'
		  ]
		, function(ActionNodePresentation, utils, DragDrop) {
	// 
	var MR_Play_NodePresentation = function() {
		 ActionNodePresentation.apply(this, []);
		 this.action.method	= 'Play';
		 return this;
		}
	
	MR_Play_NodePresentation.prototype = new ActionNodePresentation();
	MR_Play_NodePresentation.prototype.serialize = function() {
		 // this.action.method	= 'Play';
		 var json = ActionNodePresentation.prototype.serialize.apply(this, []);
		 json.subType = 'MR_Play_NodePresentation';
		 return json;
		}
	MR_Play_NodePresentation.prototype.Render = function() {
		 var self = this;
		 var root = ActionNodePresentation.prototype.Render.apply(this,[]);
		 this.html.actionName.innerHTML = "Play";
		 DragDrop.updateConfig(this.dropZoneSelectorId, {acceptedClasse: ['BrickUPnP_MediaRenderer']});
		 return root;
		}
	
	return MR_Play_NodePresentation;
});
