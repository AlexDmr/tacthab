define	( [ './DragDrop.js'
		  , './utils.js'
		  , './Presentations/PresoUtils.js'
		  , './Presentations/PnodePresentation.js'		   
		  , './Presentations/ProgramNodePresentation.js'		   
		  , './Presentations/SequenceNodePresentation.js'		   
		  , './Presentations/ParallelNodePresentation.js'	
		  , './Presentations/ActionNodePresentation.js'
		  , './Presentations/WhenNodePresentation.js'
		  , './Presentations/EventNodePresentation.js'
		  , './Presentations/PcontrolBrickPresentation.js'
		  // Add Hierarchical list here ?
		  ]
		, function( DragDrop, utils, PresoUtils
				  , PnodePresentation
				  , ProgramNodePresentation
				  , SequenceNodePresentation
				  , ParallelNodePresentation
				  , ActionNodePresentation
				  , WhenNodePresentation
				  , EventNodePresentation
				  , PcontrolBrickPresentation
				  ) {
var editor = {
	  htmlNodeTypes		: null
	, htmlNodeProgram	: null
	, init	: function(classNodeTypes, htmlNodeProgram, socket) {
		 console.log('Editor init', classNodeTypes, htmlNodeProgram);
		 this.htmlNodeProgram = htmlNodeProgram;
		 var self = this;
		 this.socket = socket;
		 socket.on( 'updateState'
				  , function(json) {
						 console.log('updateState : ', json);
						 var obj = PnodePresentation.prototype.getPnode(json.objectId);
						 console.log('obj :', obj);
						 obj.setState(json.prevState, json.nextState);
						});
		 var T  = [ {class: ParallelNodePresentation	, nodeType: 'ParallelNode'}
				  , {class: SequenceNodePresentation	, nodeType: 'SequenceNode'}
				  , {class: ProgramNodePresentation		, nodeType: 'ProgramNode'}
				  , {class: ActionNodePresentation		, nodeType: 'ActionNode'}
				  , {class: WhenNodePresentation		, nodeType: 'WhenNode'}
				  , {class: EventNodePresentation		, nodeType: 'EventNode'}
				  , {class: PcontrolBrickPresentation	, nodeType: 'PcontrolBrick'}
				  ]
		   , nodeType, node;
		 this.htmlNodeTypes = htmlNodeTypes = document.getElementById('instructionTypes');
		 for(var i in T) {
			 nodeType = T[i].nodeType;
			 node = htmlNodeTypes.querySelector('.' + nodeType);
			 if(node) {
				 node.classList.add('Implemented');
				 DragDrop.newDraggable( node, {constructor: T[i].class, htmlNode: node, nodeType: nodeType} );
				}
			}
		 // Main drop zone for programs
		 DragDrop.newDropZone( htmlNodeProgram
							 , { acceptedClasse		: 'ProgramNode'
							   , CSSwhenAccepted	: 'possible2drop'
							   , CSSwhenOver		: 'ready2drop'
							   , ondrop				: function(evt, draggedNode, infoObj) {
									 var Pnode = new infoObj.constructor();
									 self.rootProgram = Pnode;
									 htmlNodeProgram.appendChild( Pnode.init('').Render() );
									}
							   }
							 );
		// Buttons to interact with the server
		 var bt_send	= document.getElementById('sendToServer')
		   , bt_load	= document.getElementById('loadFromServer')
		   , bt_start	= document.getElementById('startProgram')
		   , bt_stop	= document.getElementById('stopProgram');
		 bt_load.addEventListener( 'click'
								 , function() {
									 utils.XHR( 'GET', '/loadProgram'
											  , { onload	: function() {
													 console.log('getting program from server, server sent:', this);
													 var json = JSON.parse( this.responseText );
													 self.loadProgram(json);
													}
												}
											  );
									}
								 );
		 bt_send.addEventListener( 'click'
								 , function() {
									 utils.XHR( 'POST', '/loadProgram'
											  , { variables	: {program: JSON.stringify(self.rootProgram.serialize())}
												, onload	: function() {
													 console.log('loadProgram, server sent:', this);
													 var json = JSON.parse( this.responseText );
													 self.loadProgram(json);
													}
												}
											  );
									}
								 , false );
		 bt_start.addEventListener( 'click'
								  , function() {
									 utils.XHR( 'POST', '/Start');
									}
								  , false );
		 bt_stop.addEventListener ( 'click'
								  , function() {
									 utils.XHR( 'POST', '/Stop');
									}
								  , false );
		}
	, sendProgram	: function() {
		
		}
	, loadProgram	: function(json) {
		 var prog = PresoUtils.unserialize( json );
		 // Unplug previous program if it exists
		 console.log('Unplug program');
		 this.htmlNodeProgram.innerText = '';
		 // Plug the new one
		 console.log('Plug parsed program');
		 this.rootProgram = prog;
		 this.htmlNodeProgram.appendChild( prog.Render() );
		}
};

return editor;
});