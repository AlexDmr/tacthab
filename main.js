/*require = require('amdrequire');
require.config({
      basePath		: __dirname
    , publicPath	: __dirname
});*/
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
		  , './TactHab_modules/webServer/webServer.js'
		  , './TactHab_modules/programNodes/program.js'
		  // Extracteur
		  , 'request'
		  , 'xmldom'
		  ]
		, function( Putils, Pnode, UpnpServer
		          , Brick, BrickUPnP_MediaRenderer, BrickUPnP_MediaServer
				  , BrickUPnP_HueBridge
				  , webServer
				  , ProgramNode
				  , request
				  , xmldom
				  ) {
	// var DOMParser = xmldom.DOMParser;
	// console.log("On se casse!"); return;
	Putils.mapping.Pnode.prototype.CB_setState = function(node, prev, next) {
		 webServer.emit('updateState', {objectId: node.id, prevState: 'state_'+prev, nextState: 'state_'+next});
		}

	
		// console.log('pgTest01 is a ', pgTest01, "\n-------------------------\n", 'webServer is a ', webServer);
	console.log('webServer.init(',__dirname,',8888)');
	webServer.init(__dirname, '8888');
	UpnpServer.init();
	
	/*pgTest01.serialize();
	pgTest01.Start();*/
	var pgTest01 = null;
	// Configure server
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
	webServer.app.post( '/proxy'
		, function(req, res) {
			 var URL = req.body.url;
			 console.log("Proxy for ", URL);
			 request(URL, function (error, response, body) {
				  if (!error && response.statusCode == 200) {
					 // Parse webpage
					 res.writeHead(200);
					 res.end( body );
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
							var node = Pnode.prototype.getNode( nodeId ) || pgTest01 || pipoPgRoot;
							if(node) {
								 json = JSON.stringify( node.getContextDescription() );
								} else {json = JSON.stringify( {} );}
							res.end(json);
							} );
	webServer.app.post( '/Start'
					  , function(req, res) {
						 if(pgTest01) {pgTest01.Start();}
						 res.end();
						} );
	webServer.app.post( '/Stop'
					  , function(req, res) {
						 if(pgTest01) {pgTest01.Stop();}
						 res.end();
						} );

	function getObject(id) {
		 var obj = null;
		 if(!obj && pgTest01) {obj = pgTest01.getNode(id);}
		 if(!obj) {obj = Brick.prototype.getBrickFromId(id);}		 
		 return obj;
		}
	webServer.oncall = function(json, fctCB) {
		 var obj	= getObject(json.objectId)
		   , mtd	= json.method
		   , params	= JSON.parse(json.params)
		   , res	= null;
		 console.log("Executing webSocket call :", json.objectId + '.' + json.method, 'with ' + json.params);
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
						 if(pgTest01) {
							 var obj	= pgTest01.getNode(req.body.objectId)
							   , mtd	= req.body.method
							   , params	= JSON.parse(req.body.params);
							 console.log("Executing HTTP call :", req.body.objectId + '.' + req.body.method, 'with ' + req.body.params);
							 obj[mtd].apply(obj, params);
							}
						 res.end();
						} );
						
	webServer.app.get( '/loadProgram'
		, function(req, res) {
				var programId = req.query.programId;
				if(!programId && pgTest01) {programId = pgTest01.id;}
				if(programId) {
					 var pg = Pnode.prototype.getNode(programId);
					 res.writeHead(200, {'Content-type': 'application/json; charset=utf-8'});
					 var str_prg = '';
					 if(pg) {
						 str_prg = JSON.stringify( pg.serialize() );
						 console.log("========================> Sending:\n", str_prg);
						}
					 res.end( str_prg );
					} else  {console.log("No program available...");
							 res.writeHead(200, {'Content-type': 'application/json; charset=utf-8'});
							 res.end('');
							}
			}
		);
		
	webServer.app.post( '/loadProgram'
		, function(req, res) {
			 var parent = null;
			 if(req.body.programId) {
				 var node = Pnode.prototype.getNode(req.body.programId);
				 if(node) {parent = node.parent;}
				}
			 if(req.body.program) {
				 console.log("Loading program\n", req.body.program);
				 var pg = Putils.unserialize( JSON.parse(req.body.program) );
				 pg.setParent(parent);
				 if(pgTest01 === null && parent === null) {pgTest01 = pg;}
				 res.writeHead(200, {'Content-type': 'application/json; charset=utf-8'});
				 var str_prg = JSON.stringify( pg.serialize() );
				 console.log("========================> Sending:\n", str_prg);
				 res.end( str_prg );
				}
			}
		);

	// Event simulation
	webServer.app.get( '/evt'
					 , function(req, res) {
						 res.writeHead	(200, {'Content-type': 'text/html; charset=utf-8'} );
						 webServer.fs.readFile('./test/testEvt.html'
											  , function(err, dataObj) {
													 if(err) {
														 console.error('error reading test_evt.html', err);
														} else	{var data = ''; data = data.concat(dataObj);
																 var doc  = webServer.domParser.parseFromString(data, 'text/html');
																 var body = doc.getElementsByTagName('body')[0];
																 var L = []
																   , node;
																 if(pgTest01) {L.push(pgTest01);}
																 while(L.length) {
																	 node = L.splice(0, 1)[0];
																	 for(var i in node.children) {L.push( node.children[i] );}
																	 if(node.isInstanceOf('EventNode')) {
																		 var bt = doc.createElement('button');
																		 bt.setAttribute('id', node.id);
																		 bt.setAttribute('onclick', "testEvt.utils.XHR('POST', '/evt', {'variables': {'id':'"+node.id+"'}})");
																		 bt.appendChild( doc.createTextNode(node.name) );
																		 body.appendChild(bt);
																		}
																	}
																 res.end( webServer.xmlSerializer.serializeToString(doc) );
																}
													}
											  );
						}
					 );
	webServer.app.post( '/evt'
					  , function(req, res) {
						 console.log( "Trigger event", req.body.id);
						 res.end();
						 if(pgTest01) {
							 pgTest01.getNode(req.body.id).triggerEvent();
							}
						}
					  );
	
	webServer.app.get	( '/testUPnP'
						, function(req, res) {
							 webServer.fs.readFile('./test/UPnP/index.html'
								  , function(err, dataObj) {
										 if(err) {
											 console.error('error reading test_evt.html', err);
											 res.writeHead(500, {'Content-type': 'application/json; charset=utf-8'});
											 res.write( "Error reading file ./test/testEditor.html\n" );
											 res.end( err );
											} else	{var data = ''; data = data.concat(dataObj);
													 res.end( data );
													}
										});
						});
						
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
	webServer.app.get	( '/get_MediaDLNA'
						, function(req, res) {
							 var L = {MediaRenderer:[], MediaServer:[]};
							 var L_Bricks, i;
							 L_Bricks = BrickUPnP_MediaRenderer.getBricks();
							 for(i=0; i<L_Bricks.length; i++) {
								 L.MediaRenderer.push( getDescrFromBrick(L_Bricks[i]) );
								}
							 L_Bricks = BrickUPnP_MediaServer.getBricks();
							 for(i=0; i<L_Bricks.length; i++) {
								 L.MediaServer.push  ( getDescrFromBrick(L_Bricks[i]) );
								}
							 
							 res.end( JSON.stringify(L) );
							}
						);
	webServer.app.get	( '/remoteControler'
		, function(req, res) {
			 if(req.query.idControler) {
				 var idControler = req.query.idControler;
				 webServer.fs.readFile('./test/testRemoteControler.html'
					  , function(err, dataObj) {
							 if(err) {
								 console.error('error reading test_evt.html', err);
								 res.writeHead(500, {'Content-type': 'application/json; charset=utf-8'});
								 res.write( "Error reading file ./test/testEditor.html\n" );
								 res.end( err );
								} else	{var data = ''; data = data.concat(dataObj);
										 var doc  = webServer.domParser.parseFromString(data, 'text/html');
										 var span_idControler = doc.getElementById('idControler');
										 span_idControler.appendChild( doc.createTextNode(idControler) );
										 
										 var controlBrick = Pnode.prototype.getNode(idControler);
										 if(controlBrick) {
											 var context = controlBrick.getContext();
											 var section_context = doc.getElementById('context');
											 section_context.appendChild(
												 doc.createTextNode( JSON.stringify(context) )
												);
											 res.end( webServer.xmlSerializer.serializeToString(doc) );
											} else	{res.writeHead(400, {'Content-type': 'application/json; charset=utf-8'});
													 res.end("There is no controler identified by " + idControler);
													}
										}
							});
				}
			}
		);

	
});

