define	( [ './ProgramNodePresentation.js'
		  , './ParallelNodePresentation.js'
		  , './ActionNodePresentation.js'
		  , './SequenceNodePresentation.js'
		  , './EventNodePresentation.js'
		  , './WhenNodePresentation.js'
		  , './PcontrolBrickPresentation.js'
		  ]
		, function( ProgramNodePresentation
				  , ParallelNodePresentation
				  , ActionNodePresentation
				  , SequenceNodePresentation
				  , EventNodePresentation
				  , WhenNodePresentation
				  , PcontrolBrickPresentation
				  ) {
var PresoUtils = {
	  mapping		: { 'ProgramNode'	: ProgramNodePresentation
					  , 'ParalleNode'	: ParallelNodePresentation
					  , 'ActionNode'	: ActionNodePresentation
					  , 'SequenceNode'	: SequenceNodePresentation
					  , 'EventNode'		: EventNodePresentation
					  , 'WhenNode'		: WhenNodePresentation
					  , 'PcontrolBrick'	: PcontrolBrickPresentation
					  }
	, unserialize	: function(json) {
		 var classe	= this.mapping[json.className];
		 var parent	= new classe().init();
		 parent.unserialize(json, PresoUtils);
		 return parent;
		}
};

return PresoUtils;
});
