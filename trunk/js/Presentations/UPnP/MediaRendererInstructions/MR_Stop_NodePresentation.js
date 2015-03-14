define	( [ './MR_Play_NodePresentation.js'
		  , '../../../utils.js'
		  ]
		, function(MR_Play_NodePresentation, utils) {
	// 
	var MR_Stop_NodePresentation = function() {
		 MR_Play_NodePresentation.apply(this, []);
		 this.action.method	= 'Stop';
		 return this;
		}
	
	MR_Stop_NodePresentation.prototype = new MR_Play_NodePresentation();
	MR_Stop_NodePresentation.prototype.serialize = function() {
		 // this.action.method	= 'Stop';
		 var json = MR_Play_NodePresentation.prototype.serialize.apply(this, []);
		 json.subType = 'MR_Stop_NodePresentation';
		 return json;
		}
	MR_Stop_NodePresentation.prototype.Render = function() {
		 var self = this;
		 var root = MR_Play_NodePresentation.prototype.Render.apply(this,[]);
		 this.html.actionName.innerHTML = "Stop";
		 return root;
		}
	
	return MR_Stop_NodePresentation;
});
