define	( [ 'fs-extra'
		  , 'express'
		  , 'body-parser'
		  , 'xmldom'
		  , 'multer'
		  , 'socket.io'
		  , 'socket.io-client'
		  , 'smtp-protocol'
		  , 'request'
		  , 'path'
		  ]
		, function( fs, express, bodyParser, xmldom, multer
				  , io, ioClient
				  , smtp
				  , request
				  , path
				  ) {

var TLS_SSL =	{ key	: fs.readFileSync( path.join('MM.pem'		 ))
				, cert	: fs.readFileSync( path.join('certificat.pem'))
				};	
					
var webServer = {
	  fs			: fs
	, express		: express
	, bodyParser	: bodyParser
	, xmldom		: xmldom
	, DOMParser		: xmldom.DOMParser
	, XMLSerializer	: xmldom.XMLSerializer
	, multer		: multer
	, app			: null
	, CB_addClient	: null
	, CB_subClient	: null
	, D_CB_socketIO	: {}
	, mailServer	: {
		  init		: function(port) {
			 // var self = this;
			 var server = this.server = smtp.createServer(function (req) {
				req.on('to', function (to, ack) {
					// var domain = to.split('@')[1] || 'localhost';
					console.log('mail sent to:', to);
					ack.accept();
					// if (domain === 'localhost') ack.accept()
					// else ack.reject()
				});

				req.on('message', function (stream, ack) {
					console.log('from: ' + req.from);
					console.log('to: ' + req.to);

					stream.pipe(process.stdout, { end : false });
					ack.accept();
				});
			 });

			 server.listen(port);
			 console.log("Mail server running on port", port);
			}
		}
	, addClient		: function(socket) {
		 this.clients[socket.id] = {socket: socket};
		}
	, removeClient	: function(socket) {
		 if(this.clients[socket.id]) {delete this.clients[socket.id];}
		}
	, emit			: function(name, json) {
		 for(var i in this.clients) {
			 this.clients[i].socket.emit(name, json);
			}
		}
	, oncall		: null
	, init			: function(staticPath, HTTP_port, logPass) {
		 var self = this;
		 this.mailServer.init(25);
		 
		 this.domParser		= new this.DOMParser();
		 this.xmlSerializer	= new this.XMLSerializer();
		 this.app	  = this.express();
		 console.log('HTTP (port:', HTTP_port, ') served from', staticPath);
		 this.server  = this.app.use( this.express.static(staticPath) )
								.use( this.bodyParser.urlencoded({ extended: false }) )
								.use( this.bodyParser.json() )
								.use( this.multer({ dest: './uploads/'}) )
								.listen( HTTP_port ) ;
		 this.clients = {};
		 this.io	= io;
		 this.io	= this.io.listen( this.server, { log: false } );
		 this.io.on	( 'connection'
					, function (socket) {
						webServer.addClient(socket);
						socket.on ( 'disconnect'
								  , function() {webServer.removeClient(socket);} );
						socket.on ( 'call'
								  , function(call, fctCB) {
										 if(self.oncall) {
											 var res = self.oncall(call, fctCB);
											 if( res !== undefined
											   &&fctCB ) {
												 fctCB( res );
												}
											}
										} );
						}
					);
		
		 // Init IFTTT wrapper based on wordPress pipo server
		 this.app.post( '/wordPress'
					  , function(req, res) {
						 var user	= req.body.user
						   , pass	= req.body.pass
						   , title	= req.body.title
						   , categs	= req.body.categories || [];
						 console.log( "HTTP POST /wordPress\n"
									, "\n\t-user   :", user
									, "\n\t-pass   :", pass
									, "\n\t-title  :", title
									, "\n\t-categs :", categs
									);
						 res.end();
					  } );
		 // Init a socket.IO client to http://thacthab.herokuapp.com
		 var socket = this.socketioClient = ioClient( "https://thacthab.herokuapp.com" );
		 if(logPass.thacthab) {
			 this.socketioClient.on( 'connect'
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
																			 for(var i in self.D_CB_socketIO) {self.D_CB_socketIO[i](data);}
																			}
																		);
															}
														}
													);
										}
								   );
			 this.socketioClient.on( 'disconnect'
								   , function() {
										 console.log("Disconnected from https://thacthab.herokuapp.com");
										}
								   );
			}
		}
	, registerSocketIO_CB			: function(topic, re, CB) {
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
	, unregisterSocketIO_CB			: function(topic, re, CB) {
		 // this.socketioClient.removeListener(topic, CB);
		 var title = re?'*':'_';
		 title += topic;
		 delete this.D_CB_socketIO[title];
		}
	, wordPressEvent				: function(user, pass, title, categs) {
		 for(var i in this.CB_wordPressEvent) {
			 var ok = true;
			 for(var c=0; c<categs.length; c++) {
				 if( this.CB_wordPressEvent[i].categs.indexOf(categs[c]) === -1 ) {
					 ok = false; 
					 break;
					}
				}
			 if(ok) {
				 // Call the callback
				 try {
					this.CB_wordPressEvent[i].CB(user, pass, title, categs);
					} catch(err) {console.error('wordPress event error : ', user, pass, "\ntitle:", title, "\ncategs:", categs, "\nerror:", err);}
				}
			}
		}
	, CB_wordPressEvent				: {}
	, subscribe_to_wordPressEvent	: function(CB, user, categs) {
		 this.CB_wordPressEvent[user] = {user: user, CB: CB, categs: categs};
		 return this;
		}
	, httpRequestJSONstringified	: function(json, CB_success, CB_error) {
		 // console.log("httpRequestJSONstringified", json);
		 // var json = JSON.parse(str);
		 // console.log("json:", json);
		 this.httpRequest( json.url
						 , json.method
						 , json.headers
						 , json.body
						 , CB_success, CB_error
						 );
		}
	, httpRequest					: function(url, method, headers, body, CB_success, CB_error) {
		 var options = { url	: url
					   , body	: body
					   , method	: method
					   , headers: headers
					   };
		 if(url.indexOf('https://') === 0) {
			 options.agentOptions = { cert				: TLS_SSL.cert
									, key				: TLS_SSL.key
									// , passphrase		: 'password'
									, securityOptions	: 'SSL_OP_NO_SSLv3'
									};
			}
		 // console.log("httpRequest");
		 request( options
				, function(error, response, body) {
						 if(  error 
						   || response.statusCode < 200
						   || response.statusCode >= 300 ) {
							    console.error(error, response?response.statusCode:'NO response');
							    return CB_error( {error: error, statusCode: response.statusCode, body: body} );
							   }
						 // Success
						 CB_success( {success: body} );
						}
				);
		}
	, brickId			: 'webServer'	// 
	, getDescription	: function() {
		 return {type:'webServer', id:'webServer',name:'webServer'};
		}
};

return webServer;

}); // END