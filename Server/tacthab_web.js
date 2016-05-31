var ioClient		= require( 'socket.io-client' )
  , uuid			= require ('uuid' )
  , socketBus_uuid	= uuid.v4()
  , Brick			= require( "../TactHab_modules/Bricks/Brick.js" )
  , request			= require( "request" )
  ;

var socketBus 			= new Brick( "socketBus" );
socketBus.connections 	= {};
socketBus.ping			= function() {
	var i, msg;
	for(i in this.connections) {
		msg = this.connections[i];
		request.post( msg.host + '/broadcast' ).form( 
			{	login 		: msg.login,
				pass 		: msg.pass,
				title 		: "ping",
				message 	: ""
			});
	}
}
socketBus.friendlyName = "TActHab";
socketBus.getfriendlyName	= function( ) {return this.friendlyName;}
socketBus.setfriendlyName	= function(v) {this.friendlyName = v;}

socketBus.on( "ping", function(msg) {
	console.log( "socketBus send back a pong on", msg )
	request.post( msg.host + '/broadcast' ).form( 
		{	login 		: msg.login,
			pass 		: msg.pass,
			title 		: "pong",
			message 	: JSON.stringify( {
				uuid 		: socketBus_uuid, 
				friendlyName: this.friendlyName
				} )
		});
});
socketBus.on( "pong", function(msg) {
	// Remember 
	console.log( "pong from", msg );
});

socketBus.connectTo	= function( host, login, pass ) {
	var self = this;
	var id = host + "::" + login;
	if(this.connections[id]) {this.connections[id].socket.off();}
	this.connections[id] = {socket: ioClient( host ), login: login, pass: pass, host: host};
	var socket = this.connections[id].socket;
	socket.on 	( 'connect'
			   	, function() {
					 console.log("Connected to", host);
					 socket.emit( 'login'
								, {login: login, pass: pass}
								, function(res) {
									 console.log("login =>", res);
									 if(res === 'banco') {
										socket.emit	( "subscribe"
													, { id		: 'all'
													  , data	: { title	: '.*'
																  , regexp	: true }
													  }
													);
										socket.on	( 'all'
													, function(data) {
														 console.log("socketBus receives", data);
														 self.emit	( data.title
														 			, { data	: data.message,
																	 	login 	: login,
																	 	pass	: pass,
																	 	host	: host
														 			} );
														 self.emit	( "message"
														 			, { data	: data,
																	 	login 	: login,
																	 	pass	: pass,
																	 	host	: host
														 			} );
														}
													);
										}
									} // socket.emit( 'login' ... )
								);
					}
			   );
	 socket.on ( 'disconnect'
			   , function() {
					 self.connections[id].socket.off();
					 delete self.connections[id];
					}
			   );
}

module.exports = function(webServer/*, interpreter*/) {
	/*var D_CB_socketIO = {};
	webServer.registerSocketIO_CB	= function(topic, re, CB) {
		 var title = re?'*':'_', RE;
		 title += topic;
		 if(re) {
			 RE = new RegExp(re);
			 D_CB_socketIO[title] = function(data) {
				 if(RE.test(data.title)) {CB(data);}
				}
			} else {D_CB_socketIO[title] = function(data) {
						 if(topic === data.title) {CB(data);}
						}
				   }
		}
	webServer.unregisterSocketIO_CB	= function(topic, re, CB) {
		 var title = re?'*':'_';
		 title += topic;
		 if(CB === D_CB_socketIO[title]) {
			 delete D_CB_socketIO[title];
			}
		}*/
	 webServer.app.post	( '/thacthab_login'
						, function(req, res) {
							 console.log("/thacthab_login", req);
							 res.end();
							}
						);
	 // Init a socket.IO client to http://thacthab.herokuapp.com
	 // XXX Do something for logins...
	 webServer.app.get	( '/socketBus'
						, function(req, res) {
							res.json( {host: req.body.host, login: req.body.login} );
						});
	 webServer.app.post	( '/socketBus'
						, function(req, res) {
							console.log("/socketBus", req.body);
							socketBus.connectTo(req.body.host, req.body.login, req.body.pass);
							res.json( {brickId: "socketBus"} );
						});
};