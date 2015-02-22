define ([ './Pnode.js'
		, './program.js'
		, './parallel.js'
		, './action.js'
		, './sequence.js'
		, './Pevent.js'
		, './Pwhen.js'
		, './PcontrolBrick.js'
		, './PvariableDeclaration.js'
		, './PprogramDeclaration.js'
		, './PfilterNode.js'
		// Selectors
		, './Pselector_ObjInstance.js'
		, './Pselector_variable.js'
		]
		, function( Pnode, ProgramNode, ParalleNode
				  , ActionNode, SequenceNode
				  , EventNode, WhenNode
				  , PcontrolBrick
				  , PvariableDeclaration
				  , PprogramDeclaration
				  , PfilterNode
				  // Selectors
				  , Pselector_ObjInstance
				  , Pselector_variable
				  ) {
var Putils = {
	  mapping		: { 'Pnode'					: Pnode
					  , 'ProgramNode'			: ProgramNode
					  , 'ParalleNode'			: ParalleNode
					  , 'ActionNode'			: ActionNode
					  , 'SequenceNode'			: SequenceNode
					  , 'EventNode'				: EventNode
					  , 'WhenNode'				: WhenNode
					  , 'PcontrolBrick'			: PcontrolBrick
					  , 'PvariableDeclaration'	: PvariableDeclaration
					  , 'PfilterNode'			: PfilterNode
					  , 'PprogramDeclaration'	: PprogramDeclaration
					  , 'Pselector_ObjInstance'	: Pselector_ObjInstance
					  , 'Pselector_variable'	: Pselector_variable
					  }
	, unserialize	: function(json) {
		 var classe	= this.mapping[json.className];
		 var parent	= new classe(null);
		 parent.unserialize(json, this);
		 /** DEBUG XXXif
		 if(Pnode.prototype.getNode(json.PnodeID)) {
			 parent.substituteIdBy(json.PnodeID);
			}
		 */
		 return parent;
		}
};

return Putils;
});

