var ioClient	= require( 'socket.io-client' )
  ;

module.exports = function(webServer) {
	webServer.registerSocketIO_CB	= function(topic, re, CB) {
		 var title = re?'*':'_', RE;
		 title += topic;
		 if(re) {
			 RE = new RegExp(re);
			 this.D_CB_socketIO[title] = function(data) {
				 if(RE.test(data.title)) {CB(data);}
				}
			} else {this.D_CB_socketIO[title] = function(data) {
						 if(topic === data.title) {CB(data);}
						}
				   }
		 // this.socketioClient.on(topic, CB);
		}
	webServer.unregisterSocketIO_CB	= function(topic, re, CB) {
		 // this.socketioClient.removeListener(topic, CB);
		 var title = re?'*':'_';
		 title += topic;
		 if(CB === this.D_CB_socketIO[title]) {
			 delete this.D_CB_socketIO[title];
			}
		}
	 webServer.app.post	( '/thacthab_login'
						, function(req, res) {
							}
						);
	 // Init a socket.IO client to http://thacthab.herokuapp.com
	 // XXX Do something for logins...
	 var logPass = {};
	 var socket = webServer.socketioClient = ioClient( "https://thacthab.herokuapp.com" );
	 if(logPass.thacthab) {
		 socket.off();
		 socket.on ( 'connect'
				   , function() {
						 console.log("Connected to https://thacthab.herokuapp.com");
						 socket.emit( 'login'
									, {login: logPass.thacthab.login, pass: logPass.thacthab.pass}
									, function(res) {
										 console.log("login =>", res);
										 if(res === 'banco') {
											 socket.emit( "subscribe"
														, { id		: 'all'
														  , data	: { title	: '.*'
																	  , regexp	: true
																	  }
														  }
														);
											 socket.on	( 'all'
														, function(data) {
															 console.log("receive", data);
															 // Process message into several variables
															 try {var obj = JSON.parse(data.message);
																  for(var att in obj) {
																	 if(typeof data[att] === 'undefined') {data[att] = obj[att];}
																	}
																 } catch(err) {console.error("Error processing message from websocket:", err)}
															 // Callbacks...
															 for(var i in webServer.D_CB_socketIO) {
																 webServer.D_CB_socketIO[i](data);
																}
															}
														);
											}
										}
									);
						}
				   );
		 socket.on ( 'disconnect'
				   , function() {
						 console.log("Disconnected from https://thacthab.herokuapp.com");
						}
				   );
		}

};