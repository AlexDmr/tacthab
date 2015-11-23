var Pnode	= require( '../TactHab_modules/programNodes/Pnode.js' )
  , Brick	= require( '../TactHab_modules/Bricks/Brick.js' )
  ;


module.exports = function(webServer) {
	var pipoPgRoot = webServer.pipoPgRoot, getContext, getDescription;
	
	function getObject(id) {
		 if(id === 'webServer') {return webServer;}
		 var obj = Pnode.prototype.getNode(id);
		 if(!obj) {obj = Brick.prototype.getBrickFromId(id);}		 
		 return obj;
		}
		
	Pnode.prototype.CB_setState = function(node, prev, next) {
		 webServer.emit('updateState', {objectId: node.id, prevState: 'state_'+prev, nextState: 'state_'+next});
		};
	webServer.app.post( '/getDescription'
					  , getDescription = function(req, res) {
							var brickId = req.body.brickId
							  , brick	= Brick.prototype.getBrickFromId( brickId )
							  , json	= brick?brick.getDescription():{}
							  ;
							if(!brick) {console.error("/getDescription : unknown brick", brickId);}
							res.json( json );
							}
					  );	
	webServer.app.get ( '/getDescription', getDescription);
	webServer.app.post( '/getContext'
					  , getContext = function(req, res) {
							var nodeId = req.body.nodeId; 
							var json;
							var node =  Pnode.prototype.getNode( nodeId ) 
									 || Pnode.prototype.getNode( webServer.pgRootId )
									 || pipoPgRoot;
							if(node) {
								 try {var context			= node.getContextDescription()
										, contextFiltered	= {bricks: {}, variables: context.variables};
									  for(var i in context.bricks) {
										 if( context.bricks[i].id !== "ProtoBrick"
										   &&context.bricks[i].id !== "webServer"
										   ) {contextFiltered.bricks[i] = context.bricks[i];}  
										}
									  json = contextFiltered;
									 } catch(err) {console.error("ERROR: getContextDescription", err, node);
												   json = {}
												  }
								 // console.log("/getContext", node.id, "\n", json);
								} else {json = {};}
							res.json(json);
							}
					  );
	webServer.app.get ( '/getContext', getContext);
	webServer.app.post( '/Start'
					  , function(req, res) {
							 if(req.body.programId) {
								 var obj = Pnode.prototype.getNode(req.body.programId);
								 if(obj) {console.log("Start program", obj.id);
										  obj.Start();
										  console.log("\tstart done...");
										 } else {console.error("No program corresponding to id", req.body.programId);}
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
			} else	{console.error('No object identified by ', json.objectId);
					 res = {error : 'No object identified by ' + json.objectId + '.'};
					}
		 return res;
		}
	webServer.app.post( '/call'
					  , function(req, res) {
							 var obj	= getObject(req.body.objectId); //Pnode.prototype.getNode(req.body.objectId)
							 if(obj) {
								 var mtd	= req.body.method
								   , params	= JSON.parse(req.body.params);
								 console.log("Executing HTTP call :", req.body.objectId + '.' + req.body.method, 'with ' + req.body.params);
								 try {obj[mtd].apply(obj, params);} catch(err) {console.error("\terror", err);}
								}
							 res.end();
						} );
};