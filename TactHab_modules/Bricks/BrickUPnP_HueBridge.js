define( [ './BrickUPnP.js'
		, './BrickUPnP_HueLamp.js'
		, './BrickUPnPFactory.js'
		, '../UpnpServer/UpnpServer.js'
		, 'request'
		]
	  , function( BrickUPnP, BrickUPnP_HueLamp, BrickUPnPFactory
				, UpnpServer, request ) {
	var BrickUPnP_HueBridge = function() {
		 BrickUPnP.prototype.constructor.apply(this, []);
		 this.authorizedConnection = false;
		 this.Lamps = {};
		 return this;
		}
		
	BrickUPnP_HueBridge.prototype = new BrickUPnP();
	BrickUPnP_HueBridge.prototype.constructor	= BrickUPnP_HueBridge;
	BrickUPnP_HueBridge.prototype.getTypeName	= function() {return "BrickUPnP_HueBridge";}
	BrickUPnP_HueBridge.prototype.connect		= function() {
		 var self = this;
		 request( { url		: self.prefixHTTP + '/api/TActHab8888'
				  , method	: "GET"
				  }
				, function(error, IncomingMessage, responseText) {
					 var response = JSON.parse( responseText );
					 if(error) {
						 console.error("Error with GET /api/TActHab8888", error);
						} else {//console.log('GET /api/TActHab8888 : ', response, response.length);
								if( response.length
								  &&response.length === 1
								  &&response[0].error
								  ) {request( { url		: self.prefixHTTP + '/api'
											  , method	: "POST"
											  , body	: '{"devicetype":"TActHab8888","username":"TActHab8888"}'
											  }
											, function(error, IncomingMessage, responseText) {
												 if(error) {
													 console.error("Error with POST /api", error);
													} else {var response = JSON.parse( responseText );
															console.log('POST /api : ', response);
															if( response.length
															  &&response.length === 1
															  ) {if(response[0].error) {
																	 console.log("Press Hue link button");
																	 setTimeout	( function() {self.connect();}
																				, 5000 );
																	}
																 if(response[0].success) {
																	 console.log("Hue bridge connected...");
																	 self.authorizedConnection = true;
																	}
																}
														   }
												}
											);
									 
									} else	{//console.log('Authorized to be connected to Hue bridge !');
											 self.authorizedConnection = true;
											 // Get the state of lamps.
											 self.HueConfig = response.config;
											 for(var i in response.lights) {
												 var lamp = response.lights[i];
												 self.updateLamp(i, lamp);
												}
											 // XXX Check lamp that are no more present
											 
											 // Check again
											 setTimeout	( function() {self.connect();}
														, 5000 );

											}
								
							   }
					}
				);
		}
	BrickUPnP_HueBridge.prototype.init			= function(device) {
		 var self = this;
		 BrickUPnP.prototype.init.apply(this, [device]);
		 this.prefixHTTP = 'http://' + device.host + ':' + device.port;
		 console.log("init Hue bridge ", this.prefixHTTP);
		 this.connect();
		 return this;
		}
	BrickUPnP_HueBridge.prototype.updateLamp	= function(lampHueId, lampJS) {
		 var uuidLamp = this.UPnP.uuid + ":" + lampJS.uniqueid;
		 var brick = this.getBrickFromId(uuidLamp);
		 if(brick) {
			 brick.update(lampJS);
			} else	{// Create a brick representing this lamp
					 var brick = new BrickUPnP_HueLamp(this, lampHueId, lampJS);
					 brick.changeIdTo(uuidLamp);
					 this.Lamps[uuidLamp] = brick;
					}
		}
	
	// ------------------------- Factory -------------------------
	var Factory__BrickUPnP_HueBridge = new BrickUPnPFactory(
			 'Factory__BrickUPnP_HueBridge'
			, BrickUPnP_HueBridge
			, function(device) {
				 // console.log("Is this a Hue bridge?", device.friendlyName);
				 return device.friendlyName.indexOf("Philips hue") === 0;
				}
			);
	// console.log("Factory__BrickUPnP_HueBridge");
	return Factory__BrickUPnP_HueBridge;
});