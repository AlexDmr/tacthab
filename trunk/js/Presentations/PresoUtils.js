define	( [ './ProgramNodePresentation.js'
		  , './ParallelNodePresentation.js'
		  , './ActionNodePresentation.js'
		  , './SequenceNodePresentation.js'
		  , './EventNodePresentation.js'
		  , './WhenNodePresentation.js'
		  , './PcontrolBrickPresentation.js'
		  // Média Renderer
		  , './UPnP/MediaRendererInstructions/MR_Play_NodePresentation.js'
		  , './UPnP/MediaRendererInstructions/MR_Pause_NodePresentation.js'
		  , './UPnP/MediaRendererInstructions/MR_Stop_NodePresentation.js'
		  , './UPnP/MediaRendererInstructions/MR_load_NodePresentation.js'
		  // Hue
		  , './PeventBrickPresentation_Hue.js'
		  ]
		, function( ProgramNodePresentation
				  , ParallelNodePresentation
				  , ActionNodePresentation
				  , SequenceNodePresentation
				  , EventNodePresentation
				  , WhenNodePresentation
				  , PcontrolBrickPresentation
				  // Media Renderer
				  , MR_Play_NodePresentation
				  , MR_Pause_NodePresentation
				  , MR_Stop_NodePresentation
				  , MR_load_NodePresentation
				  // Hue
				  , PeventBrickPresentation_Hue
				  ) {
var PresoUtils = {
	  mapping		: { 'ProgramNode'	: ProgramNodePresentation
					  , 'ParalleNode'	: ParallelNodePresentation
					  , 'ActionNode'	: ActionNodePresentation
					  , 'SequenceNode'	: SequenceNodePresentation
					  , 'EventNode'		: EventNodePresentation
					  , 'WhenNode'		: WhenNodePresentation
					  , 'PcontrolBrick'	: PcontrolBrickPresentation
					  // MediaRenderer
					  , 'MR_Play_NodePresentation'	: MR_Play_NodePresentation
					  , 'MR_load_NodePresentation'	: MR_load_NodePresentation
					  , 'MR_Pause_NodePresentation'	: MR_Pause_NodePresentation
					  , 'MR_Stop_NodePresentation'	: MR_Stop_NodePresentation
					  // Hue
					  , 'PeventBrickPresentation_Hue'	: PeventBrickPresentation_Hue
					  }
	, get			: function(className) {
		 return this.mapping[className];
		}
	, unserialize	: function(json, cb) {
		 console.log("json.subType : ", json.subType);
		 var classe	= this.mapping[ json.subType || json.className ];
		 var parent	= new classe().init();
		 parent.unserialize(json, PresoUtils);
		 return parent;
		}
};

return PresoUtils;
});
