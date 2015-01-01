define ([ './Pnode.js'
		, './program.js'
		, './parallel.js'
		, './action.js'
		, './sequence.js'
		, './Pevent.js'
		, './Pwhen.js'
		, './PcontrolBrick.js'
		, './PvariableDeclaration.js'
		]
		, function( Pnode, ProgramNode, ParalleNode
				  , ActionNode, SequenceNode
				  , EventNode, WhenNode
				  , PcontrolBrick
				  , PvariableDeclaration
				  ) {
var Putils = {
	  mapping		: { 'Pnode'			: Pnode
					  , 'ProgramNode'	: ProgramNode
					  , 'ParalleNode'	: ParalleNode
					  , 'ActionNode'	: ActionNode
					  , 'SequenceNode'	: SequenceNode
					  , 'EventNode'		: EventNode
					  , 'WhenNode'		: WhenNode
					  , 'PcontrolBrick'	: PcontrolBrick
					  , 'PvariableDeclaration': PvariableDeclaration
					  }
	, unserialize	: function(json) {
		 var classe	= this.mapping[json.className];
		 var parent	= new classe(null);
		 parent.unserialize(json, this);
		 return parent;
		}
};

return Putils;
});

