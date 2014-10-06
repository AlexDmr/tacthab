define	( [ ]
		, function() { //(fs, express, bodyParser, xmldom, multer) {
var fs			= require( 'fs-extra' );
var express		= require( 'express' );
var bodyParser	= require( 'body-parser' );
var xmldom		= require( 'xmldom' );
var multer		= require( 'multer' );
var io			= require( 'socket.io' );
var smtp		= require( 'smtp-protocol' );

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
	, mailServer	: {
		  init		: function(port) {
			 var self = this;
			 var server = this.server = smtp.createServer(function (req) {
				req.on('to', function (to, ack) {
					var domain = to.split('@')[1] || 'localhost';
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
	, addClient: function(socket) {
		 this.clients[socket.id] = {socket: socket};
		}
	, removeClient: function(socket) {
		 if(this.clients[socket.id]) {delete this.clients[socket.id];}
		}
	, emit			: function(name, json) {
		 for(var i in this.clients) {
			 this.clients[i].socket.emit(name, json);
			}
		}
	, oncall		: null
	, init			: function(staticPath, HTTP_port) {
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
								  , function(call) {
										 if(self.oncall) {self.oncall(call);}
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
						 
						 res.end();
					  } );
		 
		}
	, wordPressEvent				: function(user, pass, title, categs) {
		 for(var i in this.CB_wordPressEvent) {
			 var ok = true;
			 for(var c=0; c<categs.length; c++) {
				 if( this.CB_wordPressEvent.categs.indexOf(categs[c]) === -1 ) {
					 ok = false; 
					 break;
					}
				}
			 if(ok) {
				 // Call the callback
				 try {
					this.CB_wordPressEvent.CB(user, pass, title, categs);
					} catch(err) {console.error('wordPress event error : ', user, pass, "\ntitle:", title, "\ncategs:", categs, "\nerror:", err);}
				}
			}
		}
	, CB_wordPressEvent				: {}
	, subscribe_to_wordPressEvent	: function(CB, user, categs) {
		 this.CB_wordPressEvent[user] = {user: user, CB: CB, categs: categs};
		 return this;
		}
};

return webServer;

}); // END