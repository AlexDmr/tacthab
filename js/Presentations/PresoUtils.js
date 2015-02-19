define	( [ './ProgramNodePresentation.js'
		  , './ParallelNodePresentation.js'
		  , './ActionNodePresentation.js'
		  , './SequenceNodePresentation.js'
		  , './EventNodePresentation.js'
		  , './WhenNodePresentation.js'
		  , './PcontrolBrickPresentation.js'
		  // Variables
		  , './Program_DefinitionPresentation.js'
		  , './Var_DefinitionPresentation.js'
		  , './SelectorNodePresentation.js'
		  , './MR_Instance_SelectorNodePresentation.js'
		  , './Var_UsePresentation.js'
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
				  // Variables
				  , Program_DefinitionPresentation
				  , Var_DefinitionPresentation
				  , SelectorNodePresentation
				  , MR_Instance_SelectorNodePresentation
				  , Var_UsePresentation
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
					  , 'SequenceNode'	: SequenceNodePresentation	, 'SequenceNodePresentation'	: SequenceNodePresentation
					  , 'EventNode'		: EventNodePresentation
					  , 'WhenNode'		: WhenNodePresentation
					  , 'PcontrolBrick'	: PcontrolBrickPresentation
					  // Variables
					  , 'Program_DefinitionPresentation'		: Program_DefinitionPresentation
					  , 'Var_DefinitionPresentation'			: Var_DefinitionPresentation
					  , 'SelectorNodePresentation'				: SelectorNodePresentation
					  , 'MR_Instance_SelectorNodePresentation'	: MR_Instance_SelectorNodePresentation
					  , 'Var_UsePresentation'					: Var_UsePresentation
					  // MediaRenderer
					  , 'MR_Play_NodePresentation'	: MR_Play_NodePresentation
					  , 'MR_load_NodePresentation'	: MR_load_NodePresentation
					  , 'MR_Pause_NodePresentation'	: MR_Pause_NodePresentation
					  , 'MR_Stop_NodePresentation'	: MR_Stop_NodePresentation
					  // Hue
					  , 'PeventBrickPresentation_Hue'	: PeventBrickPresentation_Hue
					  }
	, get			: function(className) {
		 var classe	= this.mapping[ className ];
		 if(!classe) {
			 console.error('This dependency has not been loaded yet :', className);
			}
		 return this.mapping[className];
		}
	, unserialize	: function(json, cb) {
		 // console.log("json.subType : ", json.subType);
		 var Cname	= json.subType || json.className;
		 var classe	= this.get( Cname );
		 if(classe) {
			 var parent	= new classe().init();
			 parent.unserialize(json, PresoUtils);
			} else {console.error( "Unknown class to unserialize:\n\tsubtype:"
								 , json.subType, "\nclassName:", json.className
								 );
				   }
		 return parent;
		}
};

return PresoUtils;
});
