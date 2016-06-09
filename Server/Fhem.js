var FhemBridge	= require( '../TactHab_modules/Bricks/Factory__Fhem.js' )
  , Brick		= require( '../TactHab_modules/Bricks/Brick.js' )
  ;
  
  
module.exports = function(webServer) {
	// <openHab>
	var bridges = [];
	webServer.app.get ( '/Fhem'
					  , function(req, res) {
							 res.json( bridges );
							}
					  );
	webServer.app.post( '/Fhem'
					  , function(req, res) {
							 console.log("/openHab POST", req.body);
							 if(  req.body.host
							   && req.body.port
							   ) {	console.log( "There is a host and a port" );
									// Does an openHab brick already listen to this server ?
									var host	= req.body.host
								      , port	= parseInt( req.body.port )
								      ;
									var bricks = Brick.prototype.getBricks( function(b) {
																	 return b.getTypeName
																		 && b.getTypeName() === "FhemBridge"
																		 && b.config.host	=== host
																		 && (	b.config.port	=== req.body.port
																		 	|| 	b.config.port	=== parseInt( req.body.port )
																		 	)
																		 ;
																	}
															  );
									// If yes...
									if(Object.keys(bricks).length > 0) {
										var id = Object.keys(bricks)[0];
										res.json( bricks[id].getDescription() );
								  		console.log( "Fhem bridge already exists at brick", id);
									} else {
									  // If no...
										var bridge = new FhemBridge(host, port);
										bridges.push( bridge );
										res.json( bridge.getDescription() );
									}
								} else {// if req.body...
									res.json( {error: "missing host and/or port"} );
								}
							} // function
					  ); // post

	// </openHab>
}
