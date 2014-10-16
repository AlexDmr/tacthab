define ([ './Pnode.js'
		, './program.js'
		, './parallel.js'
		, './action.js'
		, './sequence.js'
		, './Pevent.js'
		, './Pwhen.js'
		, './PcontrolBrick.js'
		]
		, function( Pnode, ProgramNode, ParalleNode
				  , ActionNode, SequenceNode
				  , EventNode, WhenNode
				  , PcontrolBrick) {
var Putils = {
	  mapping		: { 'Pnode'			: Pnode
					  , 'ProgramNode'	: ProgramNode
					  , 'ParalleNode'	: ParalleNode
					  , 'ActionNode'	: ActionNode
					  , 'SequenceNode'	: SequenceNode
					  , 'EventNode'		: EventNode
					  , 'WhenNode'		: WhenNode
					  , 'PcontrolBrick'	: PcontrolBrick
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

