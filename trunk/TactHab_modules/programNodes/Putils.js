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
		, './PeventBrick.js'
		, './PeventBrickAppear.js'
		// Selectors
		, './Pselector_ObjInstance.js'
		, './Pselector_variable.js'
		, './Pselector_program.js'
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
				  , PeventBrick
				  , PeventBrickAppear
				  // Selectors
				  , Pselector_ObjInstance
				  , Pselector_variable
				  , Pselector_program
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
					  , 'PeventBrick'			: PeventBrick
					  , 'PeventBrickAppear'		: PeventBrickAppear
					  , 'PprogramDeclaration'	: PprogramDeclaration
					  , 'Pselector_ObjInstance'	: Pselector_ObjInstance
					  , 'Pselector_variable'	: Pselector_variable
					  , 'Pselector_program'		: Pselector_program
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

