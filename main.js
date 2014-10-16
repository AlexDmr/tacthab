require = require('amdrequire');
/*require.config({
      basePath		: __dirname
    , publicPath	: __dirname
});*/
console.log('__dirname:', __dirname);

var xml = require("xmldom");
require	( [ './TactHab_modules/programNodes/Putils.js'
		  , './TactHab_modules/programNodes/Pnode.js'
		  , './TactHab_modules/UpnpServer/UpnpServer.js'
		  , './TactHab_modules/Bricks/BrickUPnP_MediaRenderer.js'
		  , './TactHab_modules/webServer/webServer.js'
		  ]
		, function( Putils, Pnode, UpnpServer
		          , BrickUPnP_MediaRenderer
				  , webServer
				  ) {
Putils.mapping['Pnode'].prototype.CB_setState = function(node, prev, next) {
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
			 webServer.fs.readFile('./test/testEditor.html'
				  , function(err, dataObj) {
						 if(err) {
							 console.error('error reading test_evt.html', err);
							} else	{var data = new String(); data = data.concat(dataObj);
									 var doc  = webServer.domParser.parseFromString(data, 'text/html');
									 var instructionTypes = doc.getElementById('instructionTypes');
									 var D_classes = Putils.mapping['ProgramNode'].prototype.getD_classes();
									 for(var c in D_classes) {
										 var div = doc.createElement('div')
										   , C   = D_classes[c]
										   , CL  = C.prototype.getClasses();
											var classString = 'instructionType';
											for(var i in CL) {classString += ' ' + CL[i];}
											div.setAttribute('class', classString);
										 div.appendChild( doc.createTextNode(c) );
										 instructionTypes.appendChild(div);
										}
									 res.end( webServer.xmlSerializer.serializeToString(doc) );
									}
						});
			});
	
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

	webServer.oncall = function(json) {
		 if(pgTest01) {
			 var obj	= pgTest01.getNode(json.objectId)
			   , mtd	= json.method
			   , params	= JSON.parse(json.params);
			 console.log("Executing webSocket call :", json.objectId + '.' + json.method, 'with ' + json.params);
			 try {
				 obj[mtd].apply(obj, params);
				} catch(err) {console.error('  error', err);}
			}
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
				if(pgTest01) {
					 var pg = pgTest01;
					 res.writeHead(200, {'Content-type': 'application/json; charset=utf-8'});
					 var str_prg = JSON.stringify( pg.serialize() );
					 console.log("========================> Sending:\n", str_prg);
					 res.end( str_prg );
					} else  {console.log("No program available...");
							 res.end();
							}
			}
		);
		
	webServer.app.post( '/loadProgram'
		, function(req, res) {
			 if(req.body.program) {
				 console.log("Loading program\n", req.body.program);
				 var pg = pgTest01 = Putils.unserialize( JSON.parse(req.body.program) );
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
														} else	{var data = new String(); data = data.concat(dataObj);
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
								} else	{var data = new String(); data = data.concat(dataObj);
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

