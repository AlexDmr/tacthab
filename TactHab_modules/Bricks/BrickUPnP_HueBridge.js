var BrickUPnP			= require( './BrickUPnP.js' )
  , BrickUPnP_HueLamp	= require( './BrickUPnP_HueLamp.js' )
  , BrickUPnPFactory	= require( './BrickUPnPFactory.js' )
  // , UpnpServer			= require( '../UpnpServer/UpnpServer.js' )
  , request				= require( 'request' )
  ;
  
var BrickUPnP_HueBridge = function(id) {
	 BrickUPnP.prototype.constructor.apply(this, [id]);
	 console.log( "BrickUPnP", this.brickId);
	 this.authorizedConnection = false;
	 this.Lamps = {};
	 return this;
	}
	
BrickUPnP_HueBridge.prototype = Object.create(BrickUPnP.prototype); //new BrickUPnP(); BrickUPnP_HueBridge.prototype.unreference();
BrickUPnP_HueBridge.prototype.constructor	= BrickUPnP_HueBridge;
BrickUPnP_HueBridge.prototype.getTypeName	= function() {return "BrickUPnP_HueBridge";}
BrickUPnP_HueBridge.prototype.getTypes		= function() {var L=BrickUPnP.prototype.getTypes(); L.push(BrickUPnP_HueBridge.prototype.getTypeName()); return L;}

BrickUPnP_HueBridge.prototype.connect		= function() {
	 var self = this;
	 request( { url		: self.prefixHTTP + '/api/TActHab8888'
			  , method	: "GET"
			  }
			, function(error, IncomingMessage, responseText) {
				 if(error) {
					 console.error("Error with GET /api/TActHab8888", error);
					 setTimeout	( function() {self.connect();}
								, 5000 );
					} else {//console.log('GET /api/TActHab8888 : ', response, response.length);
							var response = [];
							try {response = JSON.parse( responseText );
								} catch(err) {console.error("Error while parsing JSON response from Hue bridge", err, "\n", responseText);}
							if( response.length
							  &&response.length === 1
							  &&response[0].error
							  ) {request( { url		: self.prefixHTTP + '/api'
										  , method	: "POST"
										  , body	: '{"devicetype":"TActHab8888","username":"TActHab8888"}'
										  }
										, function(error2, IncomingMessage2, responseText2) {
											 if(error2) {
												 console.error("Error with POST /api", error);
												} else {var response2 = JSON.parse( responseText2 );
														console.log('POST /api : ', response2);
														if( response2.length
														  &&response2.length === 1
														  ) {if(response2[0].error) {
																 console.log("Press Hue link button");
																 setTimeout	( function() {self.connect();}
																			, 5000 );
																}
															 if(response2[0].success) {
																 console.log("Hue bridge connected...");
																 self.authorizedConnection = true;
																}
															}
													   }
											}
										);
								 
								} else	{//console.log('Authorized to be connected to Hue bridge !');
										 var i, keys, key, lampHueId;
										 self.authorizedConnection = true;
										 // Get the state of lamps.
										 self.HueConfig = response.config;
										 for(i in response.lights) {
											 var lamp = response.lights[i];
											 self.updateLamp(i, lamp);
											}
										 // XXX Check lamp that are no more present
										 keys = Object.keys(self.Lamps);
										 for(i in keys) {
											 key		= keys[i];
											 lampHueId	= self.Lamps[key].lampHueId;
											 if(typeof response.lights[lampHueId] === 'undefined') {
												 console.log("SUB BrickUPnP_HueLamp", key);
												 self.Lamps[key].dispose();
												 delete self.Lamps[key];
												}
											}
										 // Check again
										 setTimeout	( function() {self.connect();}
													, 15000 );

										}
							
						   }
				}
			);
	}
BrickUPnP_HueBridge.prototype.init			= function(device) {
	 // var self = this;
	 BrickUPnP.prototype.init.apply(this, [device]);
	 this.prefixHTTP = 'http://' + device.host + ':' + device.port;
	 console.log("init Hue bridge ", this.prefixHTTP);
	 this.connect();
	 return this;
	}
BrickUPnP_HueBridge.prototype.updateLamp	= function(lampHueId, lampJS) {
	 var uuidLamp = this.UPnP.uuid + ":" + lampHueId;
	 var brick = this.getBrickFromId(uuidLamp);
	 if(brick) {
		 brick.update(lampJS);
		} else	{// Create a brick representing this lamp
				 brick = new BrickUPnP_HueLamp(this, lampHueId, lampJS);
				 brick.changeIdTo(uuidLamp);
				 this.Lamps[uuidLamp] = brick;
				 console.log("ADD BrickUPnP_HueLamp", uuidLamp);
				 // console.log(lampJS);
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

module.exports = Factory__BrickUPnP_HueBridge;
