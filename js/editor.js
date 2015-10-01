var DragDrop				= require( './DragDrop.js' )
  , utils					= require( './utils.js' )
  , PresoUtils				= require( './Presentations/PresoUtils.js' )
  , PnodePresentation		= require( './Presentations/PnodePresentation.js' )
  // , async					= require( './async.js' )
  // , BrickUPnP_MediaRenderer	= require(  )
  , inputHidden				= null
  ;

utils.initIO();

function createSubCateg(editor, subCateg, variable, api, t, i) {
	 subCateg.appendChild( editor.createDragNode ( api[t][i].name
											     , { constructor	: PresoUtils.get('Program_ExposedAPI_elementPresentation')
												   , nodeType		: api[t][i].type.concat( ['SelectorNode', t] )
												   , variableTypes	: api[t][i].type.concat( ['SelectorNode', t] )
												   , id				: variable.id	// id du program
												   , variableId		: api[t][i].id	// id de la variable
												   , name			: variable.name	// nom du programme
												   , variableName	: api[t][i].name// nom de la variable
												   }
												 )
						 );
	}
function CB_subCateg(editor, categ_pg, variable) {
	 return function(api) {
		 var subCateg;
		 console.log("Add", api, "to", categ_pg);
		 for(var t in api) {
			 if(api[t].length) {
				 subCateg = editor.createCateg(t);
				 categ_pg.appendChild( subCateg.root );
				 for(var i=0; i<api[t].length; i++) {
					 createSubCateg(editor, subCateg, variable, api, t, i);
					}
				}															 
			}
		}
	}
	
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
													 , { constructor	: PresoUtils.get('ParallelNode')
													   , nodeType		: ['ParallelNode', 'instruction']
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
										).appendChild( this.createDragNode( 'New text'
													 , { constructor	: PresoUtils.get('Pselector_TextPresentation')
													   , nodeType		: 'SelectorNode'
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
		 this.openHAB_categ = 
		 this.createCateg("openHAB"		).appendChild(	(this.openHab_instructions	= 
														 this.createCateg("Instructions").appendChild( this.createDragNode( 'Do action On/Off'
																									 , { constructor	: PresoUtils.get('openHab_Action_OnOff')
																									   , nodeType		: ['ActionNode', 'instruction']
																									   , objectsType	: 'openHab_Action_OnOff'
																									   } )
																						).appendChild( this.createDragNode( 'on event On/Off'
																									 , { constructor	: PresoUtils.get('openHab_Event_OnOff')
																									   , nodeType		: ['EventNode']
																									   , objectsType	: 'openHab_Event_OnOff'
																									   } )
																						).appendChild( this.createDragNode( 'Do action Open/Close'
																									 , { constructor	: PresoUtils.get('openHab_Action_Contact')
																									   , nodeType		: ['ActionNode', 'instruction']
																									   , objectsType	: 'openHab_Action_Contact'
																									   } )
																						).appendChild( this.createDragNode( 'on event Open/Close'
																									 , { constructor	: PresoUtils.get('openHab_Event_Contact')
																									   , nodeType		: ['EventNode']
																									   , objectsType	: 'openHab_Event_Contact'
																									   } )
																						).appendChild( this.createDragNode( 'Do action RollerShutter'
																									 , { constructor	: PresoUtils.get('openHab_Action_RollerShutter')
																									   , nodeType		: ['ActionNode', 'instruction']
																									   , objectsType	: 'openHab_Action_RollerShutter'
																									   } )
																						).appendChild( this.createDragNode( 'on event RollerShutter'
																									 , { constructor	: PresoUtils.get('openHab_Event_RollerShutter')
																									   , nodeType		: ['EventNode']
																									   , objectsType	: 'openHab_Event_RollerShutter'
																									   } )
																						).appendChild( this.createDragNode( 'Change Color'
																									 , { constructor	: PresoUtils.get('openHab_Action_Color')
																									   , nodeType		: ['ActionNode', 'instruction']
																									   , objectsType	: 'openHab_Action_Color'
																									   } )
																						).appendChild( this.createDragNode( 'Color changed'
																									 , { constructor	: PresoUtils.get('openHab_Event_Color')
																									   , nodeType		: ['EventNode']
																									   , objectsType	: 'openHab_Event_Color'
																									   } )
																						).appendChild( this.createDragNode( 'Change String'
																									 , { constructor	: PresoUtils.get('openHab_Action_String')
																									   , nodeType		: ['ActionNode', 'instruction']
																									   , objectsType	: 'openHab_Action_String'
																									   } )
																						).appendChild( this.createDragNode( 'String changed'
																									 , { constructor	: PresoUtils.get('openHab_Event_String')
																									   , nodeType		: ['EventNode']
																									   , objectsType	: 'openHab_Event_String'
																									   } )
																						).appendChild( this.createDragNode( 'Change Number'
																									 , { constructor	: PresoUtils.get('openHab_Action_Number')
																									   , nodeType		: ['ActionNode', 'instruction']
																									   , objectsType	: 'openHab_Action_Number'
																									   } )
																						).appendChild( this.createDragNode( 'Number changed'
																									 , { constructor	: PresoUtils.get('openHab_Event_Number')
																									   , nodeType		: ['EventNode']
																									   , objectsType	: 'openHab_Event_Number'
																									   } )
																									 )
														).root
										).appendChild( (this.openHab_colors			= this.createCateg("BrickOpenHAB_Color")			).root
										).appendChild( (this.openHab_contacts		= this.createCateg("BrickOpenHAB_Contact")			).root
										).appendChild( (this.openHab_datetimes		= this.createCateg("BrickOpenHAB_DateTime")			).root
										).appendChild( (this.openHab_dimmers		= this.createCateg("BrickOpenHAB_Dimmer")			).root
										).appendChild( (this.openHab_numbers		= this.createCateg("BrickOpenHAB_Number")			).root
										).appendChild( (this.openHab_rollershutters	= this.createCateg("BrickOpenHAB_RollerShutter")	).root
										).appendChild( (this.openHab_strings		= this.createCateg("BrickOpenHAB_String")			).root
										).appendChild( (this.openHab_switchs		= this.createCateg("BrickOpenHAB_Switch")			).root
										);
		 
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
		 inputHidden = document.getElementById('programId');
		 if(inputHidden) {variables.nodeId = inputHidden.value;}
		 utils.XHR( 'POST', '/getContext'
				  , { variables	: variables
					, onload	: function() {
						 var json = JSON.parse( this.responseText ); 
						 console.log('/getContext of ', variables.nodeId, ':', json );
						 var i, brick, variable, item;
						 // Bricks
						 for(i in json.bricks) {
							 brick = json.bricks[i];
							 if(brick.type.indexOf('BrickUPnP_MediaRenderer') !== -1) {
								 self.MR_categ.appendChild	( self.createDragNode( brick.name
															, { constructor	: PresoUtils.get('MR_Instance_SelectorNodePresentation')
															  , nodeType	: brick.type.concat( ['SelectorNode'] )
															  , id			: brick.id
															  , uuid		: brick.id
															  , name		: brick.name
															  } )
															);
								}
							 if(brick.type.indexOf('BrickFhem') !== -1) {
								 self.Fhem_categ.appendChild( self.createDragNode( brick.name
															, { constructor	: PresoUtils.get('basicBrickPresentation')
															  , nodeType	: brick.type.concat( ['SelectorNode'] )
															  , id			: brick.id
															  , uuid		: brick.id
															  , name		: brick.name
															  } )
															);
								}
							 if(brick.type.indexOf('BrickOpenHAB_item') !== -1) {
								 item = self.createDragNode	( brick.name
															, { constructor	: PresoUtils.get('basicBrickPresentation')
															  , nodeType	: brick.type.concat( ['SelectorNode'] )
															  , id			: brick.id
															  , uuid		: brick.id
															  , name		: brick.name
															  }
															);
								 if(brick.type.indexOf("BrickOpenHAB_Switch")			>= 0) {self.openHab_switchs.appendChild		  (item);}
								 if(brick.type.indexOf("BrickOpenHAB_String")			>= 0) {self.openHab_strings.appendChild		  (item);}
								 if(brick.type.indexOf("BrickOpenHAB_RollerShutter")	>= 0) {self.openHab_rollershutters.appendChild(item);}
								 if(brick.type.indexOf("BrickOpenHAB_Number")			>= 0) {self.openHab_numbers.appendChild		  (item);}
								 if(brick.type.indexOf("BrickOpenHAB_Dimmer")			>= 0) {self.openHab_dimmers.appendChild		  (item);}
								 if(brick.type.indexOf("BrickOpenHAB_DateTime")			>= 0) {self.openHab_datetimes.appendChild	  (item);}
								 if(brick.type.indexOf("BrickOpenHAB_Contact")			>= 0) {self.openHab_contacts.appendChild	  (item);}
								 if(brick.type.indexOf("BrickOpenHAB_Color")			>= 0) {self.openHab_colors.appendChild		  (item);}
								 if(!item.parentNode) {console.error("Unknown openHab brick type:", brick);}
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
											, CB_subCateg(self, categ_pg, variable)
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
								 // var inputHidden = document.getElementById('programId'); // Already defined
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
								 // var inputHidden = document.getElementById('programId'); // Already defined
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
									 var variablesSend		= {program: JSON.stringify(self.rootProgram.serialize())};
									 // var inputHidden	= document.getElementById('programId'); // Already defined
									 if(inputHidden) {variablesSend.programId = inputHidden.value;}
									 utils.XHR( 'POST', '/loadProgram'
											  , { variables	: variablesSend
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
										// var inputHidden = document.getElementById('programId'); // Already defined
										if(inputHidden) {utils.XHR( 'POST', '/Start'
																  , {variables: {programId: inputHidden.value}}
																  ); }
										}
								  , false );
		 bt_stop.addEventListener ( 'click'
								  , function() {
										// var inputHidden = document.getElementById('programId'); // Already defined
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
		 // var inputHidden = document.getElementById('programId');
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

module.exports = editor;
