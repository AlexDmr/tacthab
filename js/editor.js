define	( [ './DragDrop.js'
		  , './utils.js'
		  , './Presentations/PresoUtils.js'
		  , './Presentations/PnodePresentation.js'
		  , './async.js'
		  ]
		, function( DragDrop, utils, PresoUtils
				  , PnodePresentation
				  , async
				  , BrickUPnP_MediaRenderer
				  ) {

var editor = {
	  htmlNodeTypes		: null
	, htmlNodeProgram	: null
	, createDragNode		: function(name, config) {
		 var div = document.createElement('div');
			div.appendChild( document.createTextNode(name) );
			div.setAttribute('class', "instructionType Pnode Implemented");
			if(typeof config.nodeType === "string") {config.nodeType = [config.nodeType];}
			for(var i=0; i<config.nodeType.length; i++) {
				 div.classList.add( config.nodeType[i] );
				}
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
		 return {root: details, details: details, summary: summary, appendChild: function(c) {details.appendChild(c); return this;}}
		}
	, init	: function(classNodeTypes, htmlNodeProgram, socket) {
		 console.log('Editor init', classNodeTypes, htmlNodeProgram);
		 this.htmlNodeProgram = htmlNodeProgram;
		 var self = this;
		 this.socket = socket;
		 socket.on( 'updateState'
				  , function(json) {
						 // console.log('updateState : ', json);
						 var obj = PnodePresentation.prototype.getPnode(json.objectId);
						 // console.log("\t=> obj :", obj);
						 if(obj) {
							 obj.setState(json.prevState, json.nextState);
							}
						});
		 
		 // console.log('async:', async);
		 // Configure html
		 this.htmlNodeTypes = document.getElementById('instructionTypes');
		 
		 // Control flow instructions
		 this.createCateg("Controls"	).appendChild( this.createDragNode( 'Program'
													 , { constructor	: PresoUtils.get('ProgramNode')
													   , nodeType		: ['ProgramNode', 'instruction']
													   } )
										).appendChild( this.createDragNode( 'Parrallel'
													 , { constructor	: PresoUtils.get('ParalleNode')
													   , nodeType		: ['ParalleNode', 'instruction']
													   } )
										).appendChild( this.createDragNode( 'Sequence'
													 , { constructor	: PresoUtils.get('SequenceNode')
													   , nodeType		: ['SequenceNode', 'instruction']
													   } )
										).appendChild( this.createDragNode( 'When'
													 , { constructor	: PresoUtils.get('WhenNode')
													   , nodeType		: ['WhenNode', 'instruction']
													   } )
										).appendChild( this.createDragNode( 'Event'
													 , { constructor	: PresoUtils.get('EventNode')
													   , nodeType		: 'EventNode'
													   , isNotType		: ['Pnode', 'instruction']
													   } )
										).appendChild( this.createDragNode( 'Controller'
													 , { constructor	: PresoUtils.get('PcontrolBrick')
													   , nodeType		: ['PcontrolBrick']
													   } )
										).appendChild( this.createDragNode( 'Filter (hide/expose)'
													 , { constructor	: PresoUtils.get('PfilterPresentation')
													   , nodeType		: ['PfilterNode', 'instruction']
													   } )
										).appendChild( this.createDragNode( 'Forbid/allow action'
													 , { constructor	: PresoUtils.get('PForbidPresentation')
													   , nodeType		: ['PForbidNode', 'instruction']
													   } )
										);
		
		
		 // Create new draggable for programs
		 this.program_categ =
		 this.createCateg("Programs").appendChild( this.createDragNode( 'New sub-program'
													 , { constructor	: PresoUtils.get('Program_DefinitionPresentation')
													   , nodeType		: 'DefinitionNode'
													   } )
										).appendChild( this.createDragNode( 'Start/Stop program'
													 , { constructor	: PresoUtils.get('PprogramActionPresentation')
													   , nodeType		: ['ActionNode', 'instruction']
													   } )
										);
										
		 // Create new draggable for variables
		 this.variables_categ = 
		 this.createCateg("Variables").appendChild( this.createDragNode( 'New variable'
													 , { constructor	: PresoUtils.get('Var_DefinitionPresentation')
													   , nodeType		: 'DefinitionNode'
													   } )
										);
		 // Create new draggable for MediaRenderer
		 this.MR_categ = 
		 this.createCateg("MediaRenderer").appendChild( this.createDragNode( 'Load'
													 , { constructor	: PresoUtils.get('MR_load_NodePresentation')
													   , nodeType		: ['ActionNode', 'instruction']
													   } )
										).appendChild( this.createDragNode( 'Play'
													 , { constructor	: PresoUtils.get('MR_Play_NodePresentation')
													   , nodeType		: ['ActionNode', 'instruction']
													   } )
										).appendChild( this.createDragNode( 'Pause'
													 , { constructor	: PresoUtils.get('MR_Pause_NodePresentation')
													   , nodeType		: ['ActionNode', 'instruction']
													   } )
										).appendChild( this.createDragNode( 'Stop'
													 , { constructor	: PresoUtils.get('MR_Stop_NodePresentation')
													   , nodeType		: ['ActionNode', 'instruction']
													   } )
										).appendChild( this.createDragNode( 'Every media renderers'
													 , { constructor	: PresoUtils.get('Pselector_ObjTypePresentation')
													   , nodeType		: ['SelectorNode', 'BrickUPnP_MediaRenderer']
													   , objectsType	: 'BrickUPnP_MediaRenderer'
													   } )
										).appendChild( this.createDragNode( 'Every media servers'
													 , { constructor	: PresoUtils.get('Pselector_ObjTypePresentation')
													   , nodeType		: ['SelectorNode', 'BrickUPnP_MediaServer']
													   , objectsType	: 'BrickUPnP_MediaServer'
													   } )
										);
		 
		 // Create new draggable for BrickFhem
		 this.Fhem_categ = this.createCateg("Fhem");

		 // Create new draggable for BrickFhem
		 this.openHAB_categ = this.createCateg("openHAB");
		 
		 // Create new draggable for Hue
		 this.createCateg("Hue lamp").appendChild( this.createDragNode( 'on...'
												 , { constructor	: PresoUtils.get('PeventBrickPresentation_Hue')
												   , nodeType		: 'EventNode'
												   , isNotType		: 'Pnode'
												   } )
									);

		 // Create new draggable for HTTP and socketIO
		 this.createCateg("External").appendChild( this.createDragNode( 'on socketIO...'
												 , { constructor	: PresoUtils.get('PeventFromSocketIOPresentation')
												   , nodeType		: 'EventNode'
												   , isNotType		: 'Pnode'
												   } )
									).appendChild( this.createDragNode( 'Event on something ...'
												 , { constructor	: PresoUtils.get('PeventBrickPresentation')
												   , nodeType		: ['EventNode']
												   } )
									).appendChild( this.createDragNode( 'HTTP request'
												 , { constructor	: PresoUtils.get('PactionHTTP')
												   , nodeType		: ['ActionNode', 'instruction']
												   } )
									).appendChild( this.createDragNode( 'Brick appear/disappear'
												 , { constructor	: PresoUtils.get('PeventBrickAppear')
												   , nodeType		: ['EventNode']
												   } )
									);


		 // Process variables and bricks
		 var variables = {};
		 var inputHidden = document.getElementById('programId');
		 if(inputHidden) {variables.nodeId = inputHidden.value;}
		 utils.XHR( 'POST', '/getContext'
				  , { variables	: variables
					, onload	: function() {
						 var json = JSON.parse( this.responseText ); 
						 console.log('/getContext of ', variables.nodeId, ':', json );
						 var i, brick, variable;
						 // Bricks
						 for(i in json.bricks) {
							 brick = json.bricks[i];
							 if(brick.type.indexOf('BrickUPnP_MediaRenderer') !== -1) {
								 self.MR_categ.appendChild( self.createDragNode( brick.name
													   , { constructor	: PresoUtils.get('MR_Instance_SelectorNodePresentation')
													     , nodeType		: brick.type.concat( ['SelectorNode'] )
														 , id			: brick.id
														 , uuid			: brick.id
														 , name			: brick.name
													     } )
													   );
								}
							 if(brick.type.indexOf('BrickFhem') !== -1) {
								 self.Fhem_categ.appendChild( self.createDragNode( brick.name
													   , { constructor	: PresoUtils.get('basicBrickPresentation')
													     , nodeType		: brick.type.concat( ['SelectorNode'] )
														 , id			: brick.id
														 , uuid			: brick.id
														 , name			: brick.name
													     } )
													   );
								}
							 if(brick.type.indexOf('BrickOpenHAB_item') !== -1) {
								 self.openHAB_categ.appendChild( self.createDragNode( brick.name
													   , { constructor	: PresoUtils.get('basicBrickPresentation')
													     , nodeType		: brick.type.concat( ['SelectorNode'] )
														 , id			: brick.id
														 , uuid			: brick.id
														 , name			: brick.name
													     } )
													   );
								}
								
							}
						 // Variables
						 for(i in json.variables) {
							 variable = json.variables[i];
							 // console.log("New variable", variable.id, variable.name);
							 if(variable.type.indexOf('BrickUPnP_MediaRenderer') !== -1) {
								 self.MR_categ.appendChild( self.createDragNode( variable.name
													   , { constructor	: PresoUtils.get('Var_UsePresentation')
													     , nodeType		: variable.type.concat( ['SelectorNode', 'variable'] )
														 , id			: variable.id
														 , name			: variable.name
													     } )
													   );
								} else 
							 if(variable.type.indexOf("Program") !== -1) {
								 var categ_pg = self.createCateg(variable.name);
								 self.program_categ.appendChild( categ_pg.root );
								 categ_pg.appendChild( self.createDragNode ( variable.name
																		   , { constructor	: PresoUtils.get('Program_UsePresentation')
																			 , nodeType		: variable.type.concat( ['SelectorNode', 'program'] )
																			 , id			: variable.id
																			 , name			: variable.name
																			 } )
													 );
								 // Make a call to retrieve exposed API for this program
								 utils.call	( variable.programId, 'getExposedAPI_serialized', []
											, function(categ_pg, variable) {
												 return function(api) {
													 console.log("Add", api, "to", categ_pg);
													 for(var t in api) {
														 if(api[t].length) {
															 var subCateg = self.createCateg(t);
															 categ_pg.appendChild( subCateg.root );
															 for(var i=0; i<api[t].length; i++) {
																 function createSubCateg(t, i) {
																	 subCateg.appendChild( self.createDragNode ( api[t][i].name
																											   , { constructor	: PresoUtils.get('Program_ExposedAPI_elementPresentation')
																												 , nodeType		: api[t][i].type.concat( ['SelectorNode', t] )
																												 , variableTypes: api[t][i].type.concat( ['SelectorNode', t] )
																												 , id			: variable.id	// id du program
																												 , variableId	: api[t][i].id	// id de la variable
																												 , name			: variable.name	// nom du programme
																												 , variableName	: api[t][i].name// nom de la variable
																												 } )
																						 );
																	}
																 createSubCateg(t, i);
																}
															}															 
														}
													}
												}(categ_pg, variable)
											);
								 
								} else {self.variables_categ.appendChild( self.createDragNode( variable.name
																							 , { constructor	: PresoUtils.get('Var_UsePresentation')
																							   , nodeType		: variable.type//.concat( ['SelectorNode', 'program'] )
																							   , id				: variable.id
																							   , name			: variable.name
																							   } 
																							 )
																	    );
										// console.log("New variable", variable.id, variable.name, ':', variable.type);
									   }
							}
						}
				    }
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
		   , bt_stop	= document.getElementById('stopProgram')
		   , bt_save	= document.getElementById('DiskSaveToServer')
		   , bt_dskLoad	= document.getElementById('DiskLoadFromServer');
		 bt_save.onclick = function() {
								 var inputHidden = document.getElementById('programId');
								 if(!inputHidden) {console.error("no program to save"); return;}
								 utils.XHR( 'POST', '/saveProgram'
										  , { variables	: { pgRootId	: inputHidden.value
														  , fileName	: document.getElementById('fileName').value || 'bonGrosTest'
														  }
											, onload	: function() {
												 if(this.status === 200) {
													  console.log('program saved');
													} else {console.error("Error saving program:", this.responseText);}
												}
											}
										  );
								}
		 bt_dskLoad.onclick = function() {
								 utils.XHR( 'POST', '/loadProgramFromDisk'
										  , { variables	: { fileName	: document.getElementById('fileName').value || 'bonGrosTest'
														  }
											, onload	: function() {
												 if(this.status === 200) {
													 console.log('Loading program...');
													 var json = JSON.parse( this.responseText );
													 self.loadProgram(json);
													} else {console.error("Error retrieving program:", this.responseText);}
												}
											}
										  );
								}
		 bt_load.onclick = function() {
								 var inputHidden = document.getElementById('programId');
								 var ressource = '/loadProgram';
								 if(inputHidden) {
									 ressource += '?programId=' + encodeURIComponent( inputHidden.value );
									}
								 utils.XHR( 'GET', ressource
										  , { onload	: function() {
												 // console.log('getting program from server, server sent:', this);
												 if(this.responseText !== '') {
													 var json = JSON.parse( this.responseText );
													 self.loadProgram(json);
													}
												}
											}
										  );
								};
		 bt_load.onclick(); // Direct call !
		 
		 bt_send.addEventListener( 'click'
								 , function() {
									 var variables		= {program: JSON.stringify(self.rootProgram.serialize())};
									 var inputHidden	= document.getElementById('programId');
									 if(inputHidden) {variables.programId = inputHidden.value;}
									 utils.XHR( 'POST', '/loadProgram'
											  , { variables	: variables
												, onload	: function() {
													 // console.log('loadProgram, server sent:', this);
													 var json = JSON.parse( this.responseText );
													 self.loadProgram(json);
													}
												}
											  );
									}
								 , false );
		 bt_start.addEventListener( 'click'
								  , function() {
										var inputHidden = document.getElementById('programId');
										if(inputHidden) {utils.XHR( 'POST', '/Start'
																  , {variables: {programId: inputHidden.value}}
																  ); }
										}
								  , false );
		 bt_stop.addEventListener ( 'click'
								  , function() {
										var inputHidden = document.getElementById('programId');
										if(inputHidden) {utils.XHR( 'POST', '/Stop'
																  , {variables: {programId: inputHidden.value}}
																  ); }
										}
								  , false );
		}
	, sendProgram	: function() {
		
		}
	, loadProgram	: function(json) {
		 var prog = PresoUtils.unserialize( json );
		 // Unplug previous program if it exists
		 // console.log('Unplug program');
		 this.htmlNodeProgram.innerText = '';
		 // Plug the new one
		 // console.log('Plug parsed program');
		 this.rootProgram = prog;
		 this.htmlNodeProgram.appendChild( prog.Render() );
		 var inputHidden = document.getElementById('programId');
		 if(inputHidden === null) {
			 console.log("Create a new hidden input for program",  prog.PnodeID);
			 inputHidden = document.createElement('input');
			 inputHidden.setAttribute('type' , 'hidden');
			 inputHidden.setAttribute('id'   , 'programId');
			 inputHidden.setAttribute('value', prog.PnodeID);
			 document.body.appendChild( inputHidden );
			}
		 inputHidden.setAttribute('value', prog.PnodeID);
		}
};

return editor;
});