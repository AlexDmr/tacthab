var Factory__OpenHAB	= require( '../TactHab_modules/Bricks/Factory__OpenHAB.js' )
  , Brick				= require( '../TactHab_modules/Bricks/Brick.js' )
  ;
  
  
module.exports = function(webServer) {
	// <openHab>
	var openHAB; // glados.a4h.inrialpes.fr   8080     MQTTT: glados.a4h.inrialpes.fr  1883
	webServer.app.get ( '/openHAB'
					  , function(req, res) {
							 if(openHAB) {res.json(openHAB.devices);} else {res.json({});}
							}
					  );
	webServer.app.post( '/openHAB'
					  , function(req, res) {
							 console.log("/openHab POST", req.body);
							 if(  req.body.host
							   && req.body.port
							   ) {console.log( "There is a host and a port" );
								  // Does an openHab brick already listen to this server ?
								  var bricks = Brick.prototype.getBricks( function(b) {
																	 return b.getTypeName
																		 && b.getTypeName() === "BrickOpenHAB"
																	     && b.openHabServer
																		 && b.openHabServer.host	=== req.body.host
																		 && b.openHabServer.port	=== parseInt( req.body.port )
																		 ;
																	}
															  );
								  // If yes...
								  if(Object.keys(bricks).length > 0) {
									   res.json( {error: "already exists"} );
									   return;
									}
								  // If no...
								  openHAB = Brick.prototype.getBrickFromId( req.body.idOpenHab );
								  console.log( "openHAB", openHAB?"still exists":"has to be created" );
								  openHAB = openHAB || Factory__OpenHAB.newBrick();
								  // openHAB.changeIdTo( 'openHAB' );
								  var json = { host	: req.body.host
											 , port	: parseInt( req.body.port )
											 , desc	: {}
											 };
								  if(  req.body.MQTT_host
									&& req.body.MQTT_port ) {json.mqtt = { host		: req.body.MQTT_host
																		 , port		: parseInt(req.body.MQTT_port)
																		 , prefix	: req.body.MQTT_prefix || 'a4h'
																		 , logMQTT	: req.body.logMQTT || false
																		 , logPath	: __dirname.replace(/\\/g, '/')
																		 };
															}
								  openHAB.init( json ).then	 ( function(devices) {res.json( openHAB.getDescription() );} 
													  ).catch( function(reasons) {res.writeHead(400, {'Content-type': 'text/plain; charset=utf-8'});
																				  res.end( "Error intializing openHab:\n" + reasons );
																				 }
															 );
								} else	{res.writeHead(400, {'Content-type': 'text/plain; charset=utf-8'});
										 res.end( "HTTP POST must contains a host and port");
										}
							} // function
					  ); // post

	// </openHab>
}