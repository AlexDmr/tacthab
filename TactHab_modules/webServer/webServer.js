var fs				= require( 'fs-extra'					)
  , express			= require( 'express'					)
  , bodyParser		= require( 'body-parser'				)
  , xmldom			= require( 'xmldom'						)
  , multer			= require( 'multer'						)
  , io				= require( 'socket.io'					)
  , request			= require( 'request'					)
  , path			= require( 'path'						)
  , https			= require( "https"						)
  // , ioClient		= require( 'socket.io-client' )
  , Brick			= require( '../Bricks/Brick.js'			)
  , ProgramNode		= require( '../programNodes/program.js'	)
  ;
  
 
var TLS_SSL =	{ key	: fs.readFileSync( path.join('MM.pem'		 ) )
				, cert	: fs.readFileSync( path.join('certificat.pem') )
				};	
// console.log( "Brick:", Brick);
// console.log( "Brick.D_brick:", Brick.D_brick);

var webServer = Brick.D_brick.webServer = {
	  fs			: fs
	, TLS_SSL		: TLS_SSL
	, express		: express
	, bodyParser	: bodyParser
	, xmldom		: xmldom
	, DOMParser		: xmldom.DOMParser
	, XMLSerializer	: xmldom.XMLSerializer
	, multer		: multer({ dest: 'uploads/' })
	, app			: null
	, CB_addClient	: null
	, CB_subClient	: null
	, D_CB_socketIO	: {}
	, pgRootId		: null
	, rootPath		: ''
	, pipoPgRoot	: (new ProgramNode()).init()
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
	, registerSocketForCall	: function(socket) {
		 var self = this;
		 socket.on( 'call'
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
	, init			: function(staticPath, HTTP_port, https_port, rootPath) { //logPass) {
		 // var self = this;
		 this.rootPath		= rootPath;
		 
		 this.domParser		= new this.DOMParser();
		 this.xmlSerializer	= new this.XMLSerializer();
		 this.app	  = this.express();
		 console.log('HTTP (port:', HTTP_port, ') served from', staticPath);
		 this.server  = this.app.use( this.express.static(staticPath) )
								.use( this.bodyParser.urlencoded({ extended: true }) )
								.use( this.bodyParser.json() )
								.use( this.multer.single() )
								.listen( HTTP_port ) ;
		 // HTTPS
		 var https_server = https.createServer(TLS_SSL, this.app).listen(https_port);
		 console.log("HTTPS server listening on port " + https_port);

		 // Socket.io and clients
		 this.clients = {};
		 function cbConnectIO (socket) {
						webServer.addClient(socket);
						socket.on ( 'disconnect'
								  , function() {webServer.removeClient(socket);} );
						webServer.registerSocketForCall(socket);
						}
		// HTTP binding
		 this.io		= io.listen( this.server, { log: false } );
		 this.io.on		( 'connection', cbConnectIO );
		// HTTPS binding
		 this.ioHTTPS	= io.listen( https_server, { log: false } );
		 this.ioHTTPS.on( 'connection', cbConnectIO );
		 
		
		 // proxy
		 webServer.app.all( '/proxy'
			, function(req, res) {
				 var URL = req.body.url || req.query.url;
				 var binary = req.body.binary || req.query.binary || false;
				 // console.log("Proxy for ", URL);
				 var query = {url: URL};
				 if(binary) query.encoding = 'binary';
				 request(query, function (error, response, body) {
					  if (!error && response.statusCode == 200) {
						 // Parse webpage
						 // console.log( response.headers );
						 res.writeHead(200, { 'content-type'	: response.headers['Content-Type'] || response.headers['content-type'] 
											// , 'content-length'	: response.headers['content-length']
											} );
						 if(binary) {res.end( body, 'binary' );} else {res.end(body);}
						} else {res.writeHead(400);
								res.end();
							   }
					});
				});

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
		 this.httpRequest( json.url
						 , json.method
						 , json.headers
						 , json.body
						 , CB_success, CB_error
						 );
		}
	, httpRequest					: function(url, method, headers, bodyMsg, CB_success, CB_error) {
		 var options = { url	: url
					   , body	: bodyMsg
					   , method	: method
					   , headers: headers
					   };
		 if(TLS_SSL && url.indexOf('https://') === 0) {
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

module.exports = webServer;
