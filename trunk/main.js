console.log('__dirname:', __dirname);
var requirejs = require('requirejs');

requirejs.config({
    //Pass the top-level main.js/index.js require
    //function to requirejs so that node modules
    //are loaded relative to the top-level JS file.
    nodeRequire: require
});



// var xml = require("xmldom");
requirejs( [ './TactHab_modules/programNodes/Putils.js'
		  , './TactHab_modules/programNodes/Pnode.js'
		  , './TactHab_modules/UpnpServer/UpnpServer.js'
		  , './TactHab_modules/Bricks/Brick.js'
		  , './TactHab_modules/Bricks/BrickUPnP_MediaRenderer.js'
		  , './TactHab_modules/Bricks/BrickUPnP_MediaServer.js'
		  , './TactHab_modules/Bricks/BrickUPnP_HueBridge.js'
		  , './TactHab_modules/Bricks/Factory__Fhem.js'
		  , './TactHab_modules/webServer/webServer.js'
		  , './TactHab_modules/programNodes/program.js'
		  // Extracteur
		  , 'request'
		  , 'xmldom'
		  // OAuth
		  , 'passport'
		  , 'passport-google'
		  ]
		, function( Putils, Pnode, UpnpServer
		          , Brick, BrickUPnP_MediaRenderer, BrickUPnP_MediaServer
				  , BrickUPnP_HueBridge
				  , Factory__Fhem
				  , webServer
				  , ProgramNode
				  , request
				  , xmldom
				  , passport
				  , passportGoogle
				  ) {
	// var DOMParser = xmldom.DOMParser;
	// console.log("On se casse!"); return;
	Putils.mapping.Pnode.prototype.CB_setState = function(node, prev, next) {
		 webServer.emit('updateState', {objectId: node.id, prevState: 'state_'+prev, nextState: 'state_'+next});
		}

	console.log('webServer.init(',__dirname,',8888)');
	webServer.init(__dirname, '8888');
	UpnpServer.init();
	
	var pgRootId = '';
	var rootPath = __dirname.slice();
	// Configure server
	webServer.app.post( '/saveProgram'
					  , function(req, res) {
							 var fileName	= req.body.fileName || 'default';
							 var programId	= req.query.programId || pgRootId;
							 // XXX serialize root program and all sub-programs
							 var  prog = Pnode.prototype.getNode(programId)
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
							 webServer.fs.writeFile( rootPath + '/savedPrograms/' + fileName + '.prog'
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
	webServer.app.post( '/loadProgramFromDisk'
					  , function(req, res) {
							 var fileName	= req.body.fileName || 'default';
							 console.log("Reading program from file", fileName);
							 // XXX serialize root program and all sub-programs
							 var  prog = Pnode.prototype.getNode(pgRootId)
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
							 webServer.fs.readFile( rootPath + '/savedPrograms/' + fileName + '.prog'
												  , function(err, data) {
														 if(err) {res.writeHead(500);
																  res.end( "error" + err );
																 } else {var i, pg;
																		 try {
																			 var json = JSON.parse(data), parent;
																			 console.log("File contains", json.programs.length, "programs");
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
																			 pgRootId = json.pgRootId;
																			 console.log("Root program is", pgRootId);
																			 pg = Pnode.prototype.getNode(pgRootId);
																			 var str =  JSON.stringify( pg.serialize() );
																			 res.writeHead(200, {'Content-type': 'application/json; charset=utf-8'});
																			 res.end( str );
																			} catch(err) {console.error("\terror reading file", fileName);
																						  res.writeHead(500);
																						  res.end( "Error processing data file", err );
																						 }
																		}
														}
												  );
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
	
	// _______________________________________________________________________________________________
	webServer.app.all( '/proxy'
		, function(req, res) {
			 var URL = req.body.url || req.query.url;
			 var binary = req.body.binary || req.query.binary || false;
			 // console.log("Proxy for ", URL);
			 var query = {url: URL};
			 if(binary) query.encoding = 'binary';
			 request(query, function (error, response, body) {
				  if (!error && response.statusCode == 200) {
					 // Parse webpage
					 // console.log( response.headers );
					 res.writeHead(200, { 'content-type'	: response.headers['Content-Type'] || response.headers['content-type'] 
										// , 'content-length'	: response.headers['content-length']
										} );
					 if(binary) {res.end( body, 'binary' );} else {res.end(body);}
					} else {res.writeHead(400);
							res.end();
						   }
				});
			});
	
	var pipoPgRoot = new ProgramNode();
	webServer.app.post( '/getContext'
					  , function(req, res) {
							var nodeId = req.body.nodeId; 
							var json;
							var node =  Pnode.prototype.getNode( nodeId ) 
									 || Pnode.prototype.getNode( pgRootId )
									 || pipoPgRoot;
							if(node) {
								 json = JSON.stringify( node.getContextDescription() );
								 // console.log("/getContext", node.id, "\n", json);
								} else {json = JSON.stringify( {} );}
							res.end(json);
							} );
	webServer.app.post( '/Start'
					  , function(req, res) {
							 if(req.body.programId) {
								 var obj = Pnode.prototype.getNode(req.body.programId);
								 if(obj) {console.log("Start program", obj.id); obj.Start();console.log("\tstart done...");}
								} else {console.log("Start : no program specified");}
							 res.end();
							}
					  );
	webServer.app.post( '/Stop'
					  , function(req, res) {
							 if(req.body.programId) {
								 var obj = Pnode.prototype.getNode(req.body.programId);
								 if(obj) {obj.Stop ();}
								} else {console.log("Stop  : no program specified");}
							 res.end();
							}
					  );

	function getObject(id) {
		 var obj = Pnode.prototype.getNode(id);
		 if(!obj) {obj = Brick.prototype.getBrickFromId(id);}		 
		 return obj;
		}
	webServer.oncall = function(json, fctCB) {
		 var obj	= getObject(json.objectId)
		   , mtd	= json.method
		   , params	= JSON.parse(json.params)
		   , res	= null;
		 // console.log("Executing webSocket call :", json.objectId + '.' + json.method, 'with ' + json.params);
		 if(obj) {
			 try {
				 params.push(fctCB);
				 res = obj[mtd].apply(obj, params);
				} catch(err) {console.error('  error', err);
							  res = {error : err};
							 }
			} else	{console.error('No object identified by', json.objectId);
					 res = {error : 'No object identified by' + json.objectId};
					}
		 return res;
		}
	webServer.app.post( '/call'
					  , function(req, res) {
							 var obj	= Pnode.prototype.getNode(req.body.objectId)
							 if(obj) {
								 var mtd	= req.body.method
								   , params	= JSON.parse(req.body.params);
								 console.log("Executing HTTP call :", req.body.objectId + '.' + req.body.method, 'with ' + req.body.params);
								 try {obj[mtd].apply(obj, params);} catch(err) {console.error("\terror", err);}
								}
							 res.end();
						} );
						
	webServer.app.get( '/loadProgram'
		, function(req, res) {
				 console.log("loadProgram :", req.query.programId, 'with program root', pgRootId);
				var programId = req.query.programId;
				if(programId === undefined) {programId = pgRootId || null;}
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
			 if(req.body.programId) {
				 previousProgram = Pnode.prototype.getNode(req.body.programId);
				 if(previousProgram) {parent = previousProgram.parent;}
				}
			 if(req.body.program) {
				 // console.log("Loading program\n", req.body.program);
				 var pg = Putils.unserialize( JSON.parse(req.body.program) );
				 // Substitute id?
				 if(previousProgram) {
					 console.log( "Substitute program", previousProgram.id, "by the new one");
					 pg.substituteIdBy( previousProgram.id );
					 previousProgram.dispose(); 
					}
				 pg.setParent(parent);
				 if(pgRootId === '' && parent === null) {pgRootId = pg.id; console.log("Now pgRootId =", pgRootId);}
				 res.writeHead(200, {'Content-type': 'application/json; charset=utf-8'});
				 var str_prg = JSON.stringify( pg.serialize() );
				 // console.log("|n=======================> Sending:\n", str_prg, "\n");
				 res.end( str_prg );
				}
			}
		);
/* XXX OBSOLETE ?
	function getDescrFromBrick(brick) {
		 var res  = { id	: brick.brickId
					, uuid	: brick.UPnP.uuid
					, name	: brick.UPnP.friendlyName
					}
		 if(brick.L_icons && brick.L_icons.length>0) {
			 var icon   = brick.L_icons.item(0);
			 res.iconURL = "http://" + brick.UPnP.host + ":" + brick.UPnP.port;
			 var path    = icon.getElementsByTagName('url')[0].textContent;
			 // console.log(path, path[0], path[0] === '/');
			 if(path[0] === '/') {
				res.iconURL += path;
				} else {res.iconURL += '/' + path;}
			}
		 return res;
		}
*/
	// OAuth identification
	/*var GoogleStrategy = passportGoogle.Strategy;
	passport.use(new GoogleStrategy( { returnURL: 'http://localhost:8888/'
									 , realm	: 'http://www.example.com/'
									 }
								   , function(identifier, profile, done) {
										User.findOrCreate( { openId: identifier }
														 , function(err, user) {
																 done(err, user);
																}
														 );
										}
								   )
				);
	*/
});

