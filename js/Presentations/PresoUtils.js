var PresoUtils = {
	  mapping		: { 'ProgramNode'							: require( './ProgramNodePresentation.js' )
					  , 'ParalleNode'							: require( './ParallelNodePresentation.js' )
					  , 'ActionNode'							: require( './ActionNodePresentation.js' )
					  , 'SequenceNode'							: require( './SequenceNodePresentation.js' )	, 'SequenceNodePresentation'	: require( './SequenceNodePresentation.js' )
					  , 'EventNode'								: require( './EventNodePresentation.js' )		, 'EventNodePresentation'		: require( './EventNodePresentation.js' )
					  , 'PeventFromSocketIOPresentation'		: require( './PeventFromSocketIOPresentation.js' )
					  , 'WhenNode'								: require( './WhenNodePresentation.js' )		, 'WhenNodePresentation'		: require( './WhenNodePresentation.js' )
					  , 'PcontrolBrick'							: require( './PcontrolBrickPresentation.js' )
					  , 'PfilterPresentation'					: require( './PfilterPresentation.js' )
					  , 'PForbidPresentation'					: require( './PForbidPresentation.js' )
					  , 'PeventBrickPresentation'				: require( './PeventBrickPresentation.js' )
					  , 'PeventBrickAppear'						: require( './PeventBrickAppear.js' )
					  , 'basicBrickPresentation'				: require( './basicBrickPresentation.js' )
					  , 'Pselector_ObjTypePresentation'			: require( './Pselector_ObjTypePresentation' )
					  // OpenHab
					  , 'openHab_Action_OnOff'					: require( './openHab/openHab_Action_OnOff.js' )
					  , 'openHab_Event_OnOff'					: require( './openHab/openHab_Event_OnOff.js' )
					  // Variables
					  , 'Program_UsePresentation'				: require( './Program_UsePresentation.js' )
					  , 'Program_DefinitionPresentation'		: require( './Program_DefinitionPresentation.js' )
					  , 'Var_DefinitionPresentation'			: require( './Var_DefinitionPresentation.js' )
					  , 'SelectorNodePresentation'				: require( './SelectorNodePresentation.js' )
					  , 'MR_Instance_SelectorNodePresentation'	: require( './MR_Instance_SelectorNodePresentation.js' )
					  , 'Var_UsePresentation'					: require( './Var_UsePresentation.js' )
					  , 'PprogramActionPresentation'			: require( './PprogramActionPresentation.js' )
					  , 'Program_ExposedAPI_elementPresentation': require( './Program_ExposedAPI_elementPresentation.js' )
					  // General type variables
					  , 'Pselector_TextPresentation'			: require( './Pselector_TextPresentation.js' )
					  // MediaRenderer
					  , 'MR_Play_NodePresentation'				: require( './UPnP/MediaRendererInstructions/MR_Play_NodePresentation.js' )
					  , 'MR_load_NodePresentation'				: require( './UPnP/MediaRendererInstructions/MR_load_NodePresentation.js' )
					  , 'MR_Pause_NodePresentation'				: require( './UPnP/MediaRendererInstructions/MR_Pause_NodePresentation.js' )
					  , 'MR_Stop_NodePresentation'				: require( './UPnP/MediaRendererInstructions/MR_Stop_NodePresentation.js' )
					  // Hue
					  , 'PeventBrickPresentation_Hue'			: require( './PeventBrickPresentation_Hue.js' )
					  // HTTP
					  , 'PactionHTTP'							: require( './PactionHTTP.js' )
					  }
	, get			: function(className) {
		 var classe	= this.mapping[ className ];
		 if(!classe) {
			 console.error('This dependency has not been loaded yet :', className);
			 try {throw new Error(""); //this.mapping[ className ] = require( className );
				 } catch(err) {console.error("Impossible to post-load dependency", className)}
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

module.exports = PresoUtils;

