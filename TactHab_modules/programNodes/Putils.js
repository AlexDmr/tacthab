/*define ([ 
		, 
		, 
		, 
		, 
		, 
		, 
		, 
		// , './PcontrolBrick.js'
		, 
		, 
		, 
		, 
		, 
		, 
		// Selectors
		, 
		, 
		, 
		, 
		// Traditionnal variable types
		, 
		]
 Pnode, ProgramNode, ParalleNode
				  , ActionNode, SequenceNode
				  , EventNode
				  , PeventFromSocketIO
				  , WhenNode
				  // , PcontrolBrick
				  , PvariableDeclaration
				  , PprogramDeclaration
				  , PfilterNode
				  , PForbidNode
				  , PeventBrick
				  , PeventBrickAppear
				  // Selectors
				  , Pselector_ObjInstance
				  , Pselector_variable
				  , Pselector_program
				  , Pselector_ObjType
				  // Traditionnal variable types
				  , Pselector_Text
				  ) {*/
var Putils = {
	  mapping		: { 'Pnode'					: require( './Pnode.js' )	// Pnode
					  , 'ProgramNode'			: require( './program.js' )	// ProgramNode
					  , 'ParallelNode'			: require( './parallel.js' )	// ParallelNode
					  , 'ActionNode'			: require( './action.js' )	// ActionNode
					  , 'SequenceNode'			: require( './sequence.js' )	// SequenceNode
					  , 'EventNode'				: require( './Pevent.js' )	// EventNode
					  , 'PeventFromSocketIO'	: require( './PeventFromSocketIO.js' )	// PeventFromSocketIO
					  , 'WhenNode'				: require( './Pwhen.js' )	// WhenNode
					  , 'PvariableDeclaration'	: require( './PvariableDeclaration.js' )	// PvariableDeclaration
					  , 'PfilterNode'			: require( './PfilterNode.js' )	// PfilterNode
					  , 'PForbidNode'			: require( './PForbidNode.js' )	// PForbidNode
					  , 'PeventBrick'			: require( './PeventBrick.js' )	// PeventBrick
					  , 'PeventBrickAppear'		: require( './PeventBrickAppear.js' )	// PeventBrickAppear
					  , 'PprogramDeclaration'	: require( './PprogramDeclaration.js' )	// PprogramDeclaration
					  , 'Pselector_ObjInstance'	: require( './Pselector_ObjInstance.js' )	// Pselector_ObjInstance
					  , 'Pselector_variable'	: require( './Pselector_variable.js' )	// Pselector_variable
					  , 'Pselector_program'		: require( './Pselector_program.js' )	// Pselector_program
					  , 'Pselector_ObjType'		: require( './Pselector_ObjType.js' )	// Pselector_ObjType
					  , 'Pselector_Text'		: require( './Pselector_Text.js' )	// Pselector_Text
					  }
	, unserialize	: function(json) {
		 var classe	= this.mapping[json.className], parent;
		 if(!classe) {
			 classe =  require( './' + json.className + '.js' ); 
			}
		 if(classe) {
			 try {parent	= new classe();
				  parent.init();
				  parent.unserialize(json, this);
				 } catch(err) {console.error( "Error unserializing", json.className, ":", err);
							   parent = undefined;
							  }
			}
		 return parent;
		}
};

module.exports = Putils;


