var Pnode	= require( '../TactHab_modules/programNodes/Pnode.js' )
  , Putils	= require( '../TactHab_modules/programNodes/Putils.js' )
  ;

  
module.exports = function(webServer) {
	webServer.app.post( '/saveProgram'
					  , function(req, res) {
							 var fileName	= req.body.fileName || 'default'
							   , programId	= req.query.programId || webServer.pgRootId
							   , prog = Pnode.prototype.getNode(programId)
							   , L_programs = [prog];
							 if(!prog) {res.end(); return;}
							 var serialization = { pgRootId : programId
												 , programs	: []
												 };
							 while(L_programs.length) {
								 prog = L_programs[0];
								 L_programs = L_programs.splice(1);
								 L_programs = L_programs.concat( prog.getSubPrograms() );
								 if(prog) {serialization.programs.push( prog.serialize() );}
								}
							 webServer.fs.writeFile( webServer.rootPath + '/savedPrograms/' + fileName + '.prog'
												   , JSON.stringify(serialization)
												   , function(err) {
														 if(err) {res.writeHead(500);
																  res.end( "error" + err );
																 } else {res.writeHead(200);
																		 res.end();
																		}
														}
												   );
							}
					  );
	function Remap(json, Map) {
		 var i;
		 for(i in json) {
			 if( Map[json[i]] ) {
				 json[i] = Map[json[i]];
				} else {if(typeof json[i] === 'object') {Remap(json[i], Map);}}
			}
		}
	webServer.app.post( '/loadProgramFromDisk'
					  , function(req, res) {
							 var fileName	= req.body.fileName || 'default';
							 console.log("Reading program from file", fileName);
							 // XXX serialize root program and all sub-programs
							 var prog		= Pnode.prototype.getNode(webServer.pgRootId)
							   , L_programs = [];
							 if(prog) {L_programs.push(prog);}
							 while(L_programs.length) {
								 prog = L_programs[0];
								 L_programs = L_programs.splice(1);
								 if(prog) {
									  L_programs = L_programs.concat( prog.getSubPrograms() );
									  console.log("\tdisposing", prog.id);
									  prog.dispose();
									 }
								}
							 webServer.fs.readFile( webServer.rootPath + '/savedPrograms/' + fileName + '.prog'
												  , function(err, data) {
														 if(err) {res.writeHead(500);
																  res.end( "error" + err );
																 } else {var i, pg;
																		 try {
																			 var json = JSON.parse(data), parent;
																			 console.log("File contains", json.programs.length, "programs");
																			 // Allocating programs ? XXX
																			 var Map = {}, pipoNode;
																			 for(i=0; i<json.programs.length; i++) {
																				 pipoNode = (new Pnode()).init();
																				 Map[ json.programs[i].PnodeID ] = pipoNode.id;
																				 console.log("\t", json.programs[i].PnodeID, '=>', pipoNode.id);
																				}
																			 Remap(json, Map);
																			 // 
																			 for(i=0; i<json.programs.length; i++) {
																				 pg = Putils.unserialize( json.programs[i] );
																				 var previousProg = Pnode.prototype.getNode( json.programs[i].PnodeID );
																				 if(previousProg) {
																					 parent = previousProg.parent;
																					} else {parent = null;}
																				 pg.substituteIdBy( json.programs[i].PnodeID );
																				 pg.setParent( parent );
																				 console.log('-----------', i, 'Identification of program', pg.id, '/', json.programs[i].PnodeID);
																				 if(pg.parent) {console.log('-----------   | parent:', pg.parent.id);} else {console.log('-----------   | this is a root');}
																				}
																			 webServer.pgRootId = json.pgRootId;
																			 console.log("Root program is", webServer.pgRootId);
																			 pg = Pnode.prototype.getNode(webServer.pgRootId);
																			 var jsonPg = pg.serialize();
																			 console.log("Serialization done...");
																			 var str =  JSON.stringify( jsonPg );
																			 res.writeHead(200, {'Content-type': 'application/json; charset=utf-8'});
																			 res.end( str );
																			} catch(err2) {console.error("\terror reading file", fileName);
																						  console.trace(err2);
																						  res.writeHead(500);
																						  res.end( "Error processing data file", err2 );
																						 }
																		}
														}
												  );
							}
					  );

					
webServer.app.get( '/loadProgram'
	, function(req, res) {
			console.log("GET loadProgram :", req.query.programId, 'with program root', webServer.pgRootId);
			var programId = req.query.programId;
			if(programId === undefined) {programId = webServer.pgRootId || null;}
			if(programId) {
				 var pg = Pnode.prototype.getNode(programId);
				 console.log("\tparent:", pg.parent?pg.parent.id:'NONE');
				 res.writeHead(200, {'Content-type': 'application/json; charset=utf-8'});
				 var str_prg = '';
				 if(pg) {
					 console.log("\tparent node:", pg.parent?pg.parent.id:'NONE');
					 str_prg = JSON.stringify( pg.serialize() );
					 // console.log("========================> Sending:\n", str_prg);
					} else {console.log("\tImpossible to find the program identified by", programId);}
				 res.end( str_prg );
				} else  {console.log("No program available...");
						 res.writeHead(200, {'Content-type': 'application/json; charset=utf-8'});
						 res.end('');
						}
		}
	);
	
	webServer.app.post( '/loadProgram'
		, function(req, res) {
			 var parent = null, previousProgram = null;
			 console.log("POST /loadProgram : Saving program...");
			 console.log("\treq.body:", req.body);
			 // console.log("\treq.headers:", req.headers);
			 console.log("\treq.body.programId:", req.body.programId);
			 console.log("\treq.body.program  :", req.body.program?"PRESENT":"ABSENT");
			 if(req.body.programId) {
				 previousProgram = Pnode.prototype.getNode(req.body.programId);
				 if(previousProgram) {parent = previousProgram.parent;
									  console.log("\tThere was a previous parent that was", parent?"NON NULL":"NULL");
									 }
				}
			 if(req.body.program) {
				 console.log("\tdo saving...");
				 var pg = Putils.unserialize( JSON.parse(req.body.program) );
				 // Substitute id?
				 if(previousProgram) {
					 console.log( "\tSubstitute program", previousProgram.id, "by the new one");
					 pg.substituteIdBy( previousProgram.id );
					 try {previousProgram.dispose(); 
						 } catch(err) {console.trace("Error when disposing previous program", previousProgram.id, err);}
					}
				 pg.setParent(parent);
				 if(webServer.pgRootId === '' && parent === null) {webServer.pgRootId = pg.id;
														 console.log("\tNow pgRootId =", webServer.pgRootId);
														}
				 res.writeHead(200, {'Content-type': 'application/json; charset=utf-8'});
				 var str_prg = JSON.stringify( pg.serialize() );
				 // console.log("|n=======================> Sending:\n", str_prg, "\n");
				 res.end( str_prg );
				}
			}
		);
  // Program editor
	webServer.app.get( '/editor'
		, function(req, res) {
			 var programId = req.query.programId;
			 console.log("Program editor for", programId || 'a new program');
			 webServer.fs.readFile('./test/testEditor.html'
				  , function(err, dataObj) {
						 if(err) {
							 console.error('error reading test_evt.html', err);
							} else	{var data = ''; data = data.concat(dataObj);
									 if(programId) {
										 console.log("Add an input hidden for the program identifier");
										 var doc	= webServer.domParser.parseFromString(data, 'text/html');
											var body	= doc.getElementsByTagName('body')[0];
											var inputHidden = doc.createElement('input');
											inputHidden.setAttribute('type' , 'hidden'    );
											inputHidden.setAttribute('id'   , 'programId' );
											inputHidden.setAttribute('value', programId   );
											body.appendChild( inputHidden );
										 data = webServer.xmlSerializer.serializeToString(doc);
										}
									 // console.log(data);
									 res.end( data );
									}
						});
			});
};