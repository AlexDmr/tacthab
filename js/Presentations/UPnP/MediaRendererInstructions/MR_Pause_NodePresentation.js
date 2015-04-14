define	( [ './MR_Play_NodePresentation.js'
		  , '../../../utils.js'
		  ]
		, function(MR_Play_NodePresentation, utils) {
	// 
	var MR_Pause_NodePresentation = function() {
		 MR_Play_NodePresentation.apply(this, []);
		 return this;
		}
	
	MR_Pause_NodePresentation.prototype = new MR_Play_NodePresentation();
	
	MR_Pause_NodePresentation.prototype.init		= function(PnodeID, parent, children) {
		 MR_Play_NodePresentation.prototype.init.apply(this, [PnodeID, parent, children]);
		 this.action.method	= 'Pause';
		 return this;
		}
		
	MR_Pause_NodePresentation.prototype.serialize	= function() {
		 var json = MR_Play_NodePresentation.prototype.serialize.apply(this, []);
		 json.subType = 'MR_Pause_NodePresentation';
		 console.log("MR_Pause_NodePresentation::serialize", json);
		 return json;
		}
		
	MR_Pause_NodePresentation.prototype.Render		= function() {
		 var self = this;
		 var root = MR_Play_NodePresentation.prototype.Render.apply(this,[]);
		 this.html.actionName.innerHTML = "Pause";
		 return root;
		}
	
	return MR_Pause_NodePresentation;
});
