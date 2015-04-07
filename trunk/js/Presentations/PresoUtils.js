define	( [ './ProgramNodePresentation.js'
		  , './ParallelNodePresentation.js'
		  , './ActionNodePresentation.js'
		  , './SequenceNodePresentation.js'
		  , './EventNodePresentation.js'
		  , './PeventFromSocketIOPresentation.js'
		  , './WhenNodePresentation.js'
		  , './PcontrolBrickPresentation.js'
		  , './PfilterPresentation.js'
		  , './PeventBrickPresentation.js'
		  , './PeventBrickAppear.js'
		  , './basicBrickPresentation.js'
		  , './Pselector_ObjTypePresentation'
		  // Variables and programs
		  , './Program_UsePresentation.js'
		  , './Program_DefinitionPresentation.js'
		  , './Var_DefinitionPresentation.js'
		  , './SelectorNodePresentation.js'
		  , './MR_Instance_SelectorNodePresentation.js'
		  , './Var_UsePresentation.js'
		  , './PprogramActionPresentation.js'
		  , './Program_ExposedAPI_elementPresentation.js'
		  // Média Renderer
		  , './UPnP/MediaRendererInstructions/MR_Play_NodePresentation.js'
		  , './UPnP/MediaRendererInstructions/MR_Pause_NodePresentation.js'
		  , './UPnP/MediaRendererInstructions/MR_Stop_NodePresentation.js'
		  , './UPnP/MediaRendererInstructions/MR_load_NodePresentation.js'
		  // Hue
		  , './PeventBrickPresentation_Hue.js'
		  // HTTP
		  , './PactionHTTP.js'
		  ]
		, function( ProgramNodePresentation
				  , ParallelNodePresentation
				  , ActionNodePresentation
				  , SequenceNodePresentation
				  , EventNodePresentation
				  , PeventFromSocketIOPresentation
				  , WhenNodePresentation
				  , PcontrolBrickPresentation
				  , PfilterPresentation
				  , PeventBrickPresentation
				  , PeventBrickAppear
				  , basicBrickPresentation
				  , Pselector_ObjTypePresentation
				  // Variables
				  , Program_UsePresentation
				  , Program_DefinitionPresentation
				  , Var_DefinitionPresentation
				  , SelectorNodePresentation
				  , MR_Instance_SelectorNodePresentation
				  , Var_UsePresentation
				  , PprogramActionPresentation
				  , Program_ExposedAPI_elementPresentation
				  // Media Renderer
				  , MR_Play_NodePresentation
				  , MR_Pause_NodePresentation
				  , MR_Stop_NodePresentation
				  , MR_load_NodePresentation
				  // Hue
				  , PeventBrickPresentation_Hue
				  // HTTP
				  , PactionHTTP
				  ) {
var PresoUtils = {
	  mapping		: { 'ProgramNode'							: ProgramNodePresentation
					  , 'ParalleNode'							: ParallelNodePresentation
					  , 'ActionNode'							: ActionNodePresentation
					  , 'SequenceNode'							: SequenceNodePresentation	, 'SequenceNodePresentation'	: SequenceNodePresentation
					  , 'EventNode'								: EventNodePresentation		, 'EventNodePresentation'		: EventNodePresentation
					  , 'PeventFromSocketIOPresentation'		: PeventFromSocketIOPresentation
					  , 'WhenNode'								: WhenNodePresentation		, 'WhenNodePresentation'		: WhenNodePresentation
					  , 'PcontrolBrick'							: PcontrolBrickPresentation
					  , 'PfilterPresentation'					: PfilterPresentation
					  , 'PeventBrickPresentation'				: PeventBrickPresentation
					  , 'PeventBrickAppear'						: PeventBrickAppear
					  , 'basicBrickPresentation'				: basicBrickPresentation
					  , 'Pselector_ObjTypePresentation'			: Pselector_ObjTypePresentation
					  // Variables
					  , 'Program_UsePresentation'				: Program_UsePresentation
					  , 'Program_DefinitionPresentation'		: Program_DefinitionPresentation
					  , 'Var_DefinitionPresentation'			: Var_DefinitionPresentation
					  , 'SelectorNodePresentation'				: SelectorNodePresentation
					  , 'MR_Instance_SelectorNodePresentation'	: MR_Instance_SelectorNodePresentation
					  , 'Var_UsePresentation'					: Var_UsePresentation
					  , 'PprogramActionPresentation'			: PprogramActionPresentation
					  , 'Program_ExposedAPI_elementPresentation': Program_ExposedAPI_elementPresentation
					  // MediaRenderer
					  , 'MR_Play_NodePresentation'				: MR_Play_NodePresentation
					  , 'MR_load_NodePresentation'				: MR_load_NodePresentation
					  , 'MR_Pause_NodePresentation'				: MR_Pause_NodePresentation
					  , 'MR_Stop_NodePresentation'				: MR_Stop_NodePresentation
					  // Hue
					  , 'PeventBrickPresentation_Hue'			: PeventBrickPresentation_Hue
					  // HTTP
					  , 'PactionHTTP'							: PactionHTTP
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
		 var parent;
		 var Cname	= json.subType || json.className;
		 var classe	= this.get( Cname );
		 if(classe) {
			 parent	= new classe().init();
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
