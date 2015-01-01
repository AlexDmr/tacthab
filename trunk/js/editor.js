define	( [ './DragDrop.js'
		  , './utils.js'
		  , './Presentations/PresoUtils.js'
		  , './Presentations/PnodePresentation.js'
		  , './async.js'
		  ]
		, function( DragDrop, utils, PresoUtils
				  , PnodePresentation
				  , async
				  ) {
var editor = {
	  htmlNodeTypes		: null
	, htmlNodeProgram	: null
	, createDragNode		: function(name, config) {
		 var div = document.createElement('div');
			div.appendChild( document.createTextNode(name) );
			div.setAttribute('class', "instructionType Pnode Implemented");
			div.classList.add( config.nodeType );
			if(config.isNotType) {div.classList.remove( config.isNotType );}
		 DragDrop.newDraggable( div
							  , { constructor	: config.constructor
							    , htmlNode		: div
								, nodeType		: config.nodeType
								, config		: config
								}
							  );
		 return div;
		}
	, createCateg	: function(name) {
		 var details	= document.createElement('details');
		 var summary	= document.createElement('summary');
			details.appendChild( summary );
			summary.innerHTML = name;
		 this.htmlNodeTypes.appendChild( details );
		 return {details: details, summary: summary, appendChild: function(c) {details.appendChild(c); return this;}}
		}
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
		 
		 console.log('async:', async);
		 // Configure html
		 this.htmlNodeTypes = document.getElementById('instructionTypes');
		 
		 // Control flow instructions
		 this.createCateg("Controls"	).appendChild( this.createDragNode( 'Program'
													 , { constructor	: PresoUtils.get('ProgramNode')
													   , nodeType		: 'ProgramNode'
													   } )
										).appendChild( this.createDragNode( 'Parrallel'
													 , { constructor	: PresoUtils.get('ParalleNode')
													   , nodeType		: 'ParalleNode'
													   } )
										).appendChild( this.createDragNode( 'Sequence'
													 , { constructor	: PresoUtils.get('SequenceNode')
													   , nodeType		: 'SequenceNode'
													   } )
										).appendChild( this.createDragNode( 'When'
													 , { constructor	: PresoUtils.get('WhenNode')
													   , nodeType		: 'WhenNode'
													   } )
										).appendChild( this.createDragNode( 'Event'
													 , { constructor	: PresoUtils.get('EventNode')
													   , nodeType		: 'EventNode'
													   , isNotType		: 'Pnode'
													   } )
										).appendChild( this.createDragNode( 'Controller'
													 , { constructor	: PresoUtils.get('PcontrolBrick')
													   , nodeType		: 'PcontrolBrick'
													   } )
										);
		 // Create new draggable for variables
		 this.createCateg("Variables").appendChild( this.createDragNode( 'Define new one'
													 , { constructor	: PresoUtils.get('Var_DefinitionPresentation')
													   , nodeType		: 'DefinitionNode'
													   } )
										).appendChild( this.createDragNode( 'Play'
													 , { constructor	: PresoUtils.get('MR_load_NodePresentation')
													   , nodeType		: 'ActionNode'
													   } )
										);
		 // Create new draggable for MediaRenderer
		 this.createCateg("MediaRenderer").appendChild( this.createDragNode( 'Load'
													 , { constructor	: PresoUtils.get('MR_load_NodePresentation')
													   , nodeType		: 'ActionNode'
													   } )
										).appendChild( this.createDragNode( 'Play'
													 , { constructor	: PresoUtils.get('MR_Play_NodePresentation')
													   , nodeType		: 'ActionNode'
													   } )
										).appendChild( this.createDragNode( 'Pause'
													 , { constructor	: PresoUtils.get('MR_Pause_NodePresentation')
													   , nodeType		: 'ActionNode'
													   } )
										).appendChild( this.createDragNode( 'Stop'
													 , { constructor	: PresoUtils.get('MR_Stop_NodePresentation')
													   , nodeType		: 'ActionNode'
													   } )
										);
		 // Create new draggable for Hue
		 this.createCateg("Hue lamp").appendChild( this.createDragNode( 'on...'
												 , { constructor	: PresoUtils.get('PeventBrickPresentation_Hue')
												   , nodeType		: 'EventNode'
												   , isNotType		: 'Pnode'
												   } )
									);
													   
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