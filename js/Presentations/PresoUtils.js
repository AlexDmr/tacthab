define	( [ './ProgramNodePresentation.js'
		  , './ParallelNodePresentation.js'
		  , './ActionNodePresentation.js'
		  , './SequenceNodePresentation.js'
		  , './EventNodePresentation.js'
		  , './WhenNodePresentation.js'
		  ]
		, function( ProgramNodePresentation
				  , ParallelNodePresentation
				  , ActionNodePresentation
				  , SequenceNodePresentation
				  , EventNodePresentation
				  , WhenNodePresentation
				  ) {
var PresoUtils = {
	  mapping		: { 'ProgramNode'	: ProgramNodePresentation
					  , 'ParalleNode'	: ParallelNodePresentation
					  , 'ActionNode'	: ActionNodePresentation
					  , 'SequenceNode'	: SequenceNodePresentation
					  , 'EventNode'		: EventNodePresentation
					  , 'WhenNode'		: WhenNodePresentation
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
