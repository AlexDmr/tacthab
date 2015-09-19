var Factory__OpenHAB	= require( '../TactHab_modules/Bricks/Factory__OpenHAB.js' )
  ;
  
  
module.exports = function(webServer) {
	// <openHab>
	var openHAB; // glados.a4h.inrialpes.fr   8080     MQTTT: glados.a4h.inrialpes.fr  1883
	webServer.app.get ( '/openHAB'
					  , function(req, res) {
							 if(openHAB)
								res.write( JSON.stringify(openHAB.devices) );
							 res.end();
							}
					  );
	webServer.app.post( '/openHAB'
					  , function(req, res) {
							 if(  req.body.host
							   && req.body.port
							   ) {openHAB = Factory__OpenHAB.newBrick();
								  openHAB.changeIdTo( 'openHAB' );
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
								  openHAB.init( json ).then ( function(devices) {
																res.end( JSON.stringify(devices) );} 
													  ).catch( function(reasons) {res.writeHead(200, {'Content-type': 'text/plain; charset=utf-8'});
																				 res.end( "HTTP POST must contains a serverAddress and port:\n" + reasons );
																				}
															);
								} // if req.body.host
							} // function
					  ); // post

	// </openHab>
}