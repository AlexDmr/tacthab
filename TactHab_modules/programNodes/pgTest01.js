define ([ './program.js'
		, './parallel.js'
		, './action.js'
		, './sequence.js'
		, './Pevent.js'
		, './Pwhen.js'
		]
		, function(ProgramNode, ParalleNode, ActionNode, SequenceNode, EventNode, WhenNode) {
/*var pgRoot	= new ProgramNode();
var act1	= new ActionNode(pgRoot, console, console.log, ['act1']);
var para1	= new ParalleNode(pgRoot);
var act2	= new ActionNode(para1, console, console.log, ['act2']);
var act3	= new ActionNode(para1, console, console.log, ['act3']);
var act4	= new ActionNode(pgRoot, console, console.log, ['act4']);
var seq1	= new SequenceNode(pgRoot);
var act5	= new ActionNode(seq1, console, console.log, ['act5']);
var evt1	= new EventNode().setName('evt1');
var actE1	= new ActionNode(null, console, console.log, ['actE1']);
var when1	= new WhenNode(seq1, evt1, actE1, false);
var act6	= new ActionNode(seq1, console, console.log, ['act6']);
*/

var Putils = {
	  mapping		: { 'ProgramNode'	: ProgramNode
					  , 'ParalleNode'	: ParalleNode
					  , 'ActionNode'	: ActionNode
					  , 'SequenceNode'	: SequenceNode
					  , 'EventNode'		: EventNode
					  , 'WhenNode'		: WhenNode
					  }
	, unserialize	: function(json) {
		 var classe	= this.mapping[json.className];
		 var parent	= new classe(null), child;
		 if(classe) {
			 for(var i=0; i<json.children.length; i++) {
				 child = this.unserialize( json.children[i] );
				 parent.
				}
			}
		}
};

return Putils;
});

className":"ProgramNode","PnodeID":"toto","children":[{"className":"ActionNode","PnodeID":"","children":[]}]}