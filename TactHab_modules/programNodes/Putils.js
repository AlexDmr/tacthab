define ([ './Pnode.js'
		, './program.js'
		, './parallel.js'
		, './action.js'
		, './sequence.js'
		, './Pevent.js'
		, './PeventFromSocketIO.js'
		, './Pwhen.js'
		// , './PcontrolBrick.js'
		, './PvariableDeclaration.js'
		, './PprogramDeclaration.js'
		, './PfilterNode.js'
		, './PForbidNode.js'
		, './PeventBrick.js'
		, './PeventBrickAppear.js'
		// Selectors
		, './Pselector_ObjInstance.js'
		, './Pselector_variable.js'
		, './Pselector_program.js'
		, './Pselector_ObjType.js'
		// Traditionnal variable types
		, './Pselector_Text.js'
		]
		, function( Pnode, ProgramNode, ParalleNode
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
				  ) {
var Putils = {
	  mapping		: { 'Pnode'					: Pnode
					  , 'ProgramNode'			: ProgramNode
					  , 'ParalleNode'			: ParalleNode
					  , 'ActionNode'			: ActionNode
					  , 'SequenceNode'			: SequenceNode
					  , 'EventNode'				: EventNode
					  , 'PeventFromSocketIO'	: PeventFromSocketIO
					  , 'WhenNode'				: WhenNode
					  // , 'PcontrolBrick'			: PcontrolBrick
					  , 'PvariableDeclaration'	: PvariableDeclaration
					  , 'PfilterNode'			: PfilterNode
					  , 'PForbidNode'			: PForbidNode
					  , 'PeventBrick'			: PeventBrick
					  , 'PeventBrickAppear'		: PeventBrickAppear
					  , 'PprogramDeclaration'	: PprogramDeclaration
					  , 'Pselector_ObjInstance'	: Pselector_ObjInstance
					  , 'Pselector_variable'	: Pselector_variable
					  , 'Pselector_program'		: Pselector_program
					  , 'Pselector_ObjType'		: Pselector_ObjType
					  , 'Pselector_Text'		: Pselector_Text
					  }
	, unserialize	: function(json) {
		 var classe	= this.mapping[json.className];
		 var parent	= new classe();
		 parent.init();
		 parent.unserialize(json, this);
		 return parent;
		}
};

return Putils;
});
