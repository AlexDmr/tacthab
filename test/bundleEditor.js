/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	/*
	require.config({
	    paths : {
	        //create alias to plugins (not needed if plugins are on the baseUrl)
	        async	: '../js/requirejs-plugins/src/async',
	        font	: '../js/requirejs-plugins/src/font',
	        goog	: '../js/requirejs-plugins/src/goog',
	        image	: '../js/requirejs-plugins/src/image',
	        json	: '../js/requirejs-plugins/src/json',
	        noext	: '../js/requirejs-plugins/src/noext',
	        mdown	: '../js/requirejs-plugins/src/mdown',
	        propertyParser		: '../js/requirejs-plugins/src/propertyParser'
	    }
	});

	*/

	var utils		= __webpack_require__( 1 )
	  , domReady	= __webpack_require__( 52 )
	  , editor		= __webpack_require__( 53 )
	  ;
	  
	  
	 domReady( function() {
		 // Editor
		 var testEvt = {};
		 testEvt.utils	= utils;
		 testEvt.editor	= editor;
		 editor.init( 'instructionType'
					, document.getElementById('program')
					, utils.io);
		});




/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	var io = __webpack_require__(//'../node_modules/socket.io/lib/client.js'
					// '../node_modules/socket.io/node_modules/socket.io-client/socket.io.js'
					2
					);

	var callId = 0;
	var utils = {
		XHR : function(method, ad, params) {
			// method	: GET or POST
			// ad		: adress of the ressource to be loaded
			// params : An object containing two possible parameters.
			//		- onload	: a function taking no argument, response will be contains in object this.
			//		- variables : an object containing a set of attribute<->value
			//		- form 		: a reference to a HTML form node
			return new Promise	( function(resolve, reject) {
									var xhr = new XMLHttpRequest();
									if(typeof params === 'function') {
										 params = {onload: params};
										}
									if( typeof params === "object" 
										&& !params.onload 
										&& !params.form 
										&& !params.variables) {params = { variables : params };}
									params = params || {};
									xhr.onloadend = function() {
														 if(params.onload) {params.onload.call(this);}
														 if	( this.status >= 400) {reject(this);} else {resolve(this);}
														}
									xhr.open(method, ad, true);
									console.log(method, ad, params);
									if(params.form || params.variables) {
										 var F = new FormData( params.form );
										 for(var i in params.variables) {
											 F.append(i, params.variables[i]);
											}
										 xhr.send( F );
										} else {xhr.send();}
									}
								);
		}
		, initIO: function() {
			 this.io = this.io || io.apply(null, arguments);
			}
		// , io	: io()
		, call	: function(objectId, method, params, cb) {
			 var call =	{ objectId	: objectId
						, method	: method
						, params	: JSON.stringify( params )
						};
			 if(cb) {
				 call.callId = callId++;
				}
			 // console.log( "Calling", call);
			 return new Promise	( function(resolve, reject) {
				 utils.io.emit	( 'call', call
								, function(data){
									 // console.log("Call", call.callId, " returns", data);
									 if(cb) {cb(data);}
									 resolve(data);
									}
								);
				});
			}
		, getUrlEncodedParameters	: function(a) {
			 if(typeof a === 'string') {
				 a = a.split('&');
				}
			 if (a === "") {return {};}
			 var b = {};
			 for (var i = 0; i < a.length; ++i) {
				var p=a[i].split('=', 2);
				if (p.length === 1) {
					 b[ decodeURIComponent(p[0]) ] = "";
					} else {b[ decodeURIComponent(p[0]) ] = decodeURIComponent(p[1].replace(/\+/g, " "));
						   }
				}
			 return b;
			}
		, HCI : { makeEditable	: function(node) {
					node.ondblclick = function(evt) {
										 // Turns text content into an input
										 var input = document.createElement('input');
										 input.value = node.innerHTML;
										 this.innerHTML = ""; this.appendChild( input );
										 input.focus();
										 input.ondblclick = function(e) {
											 var name = this.value;
											 // console.log(name);
											 node.innerHTML = ""; node.appendChild( document.createTextNode( name ) );
											 e.stopPropagation();
											}
										 input.onkeypress = function(e) {
											 if (e.which === 13) {input.ondblclick(e);}
											};
										 evt.stopPropagation();
										 evt.preventDefault();
										}

					}
				}
	};

	module.exports = utils;



/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	
	module.exports = __webpack_require__(3);


/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	
	/**
	 * Module dependencies.
	 */

	var url = __webpack_require__(4);
	var parser = __webpack_require__(7);
	var Manager = __webpack_require__(14);
	var debug = __webpack_require__(6)('socket.io-client');

	/**
	 * Module exports.
	 */

	module.exports = exports = lookup;

	/**
	 * Managers cache.
	 */

	var cache = exports.managers = {};

	/**
	 * Looks up an existing `Manager` for multiplexing.
	 * If the user summons:
	 *
	 *   `io('http://localhost/a');`
	 *   `io('http://localhost/b');`
	 *
	 * We reuse the existing instance based on same scheme/port/host,
	 * and we initialize sockets for each namespace.
	 *
	 * @api public
	 */

	function lookup(uri, opts) {
	  if (typeof uri == 'object') {
	    opts = uri;
	    uri = undefined;
	  }

	  opts = opts || {};

	  var parsed = url(uri);
	  var source = parsed.source;
	  var id = parsed.id;
	  var io;

	  if (opts.forceNew || opts['force new connection'] || false === opts.multiplex) {
	    debug('ignoring socket cache for %s', source);
	    io = Manager(source, opts);
	  } else {
	    if (!cache[id]) {
	      debug('new io instance for %s', source);
	      cache[id] = Manager(source, opts);
	    }
	    io = cache[id];
	  }

	  return io.socket(parsed.path);
	}

	/**
	 * Protocol version.
	 *
	 * @api public
	 */

	exports.protocol = parser.protocol;

	/**
	 * `connect`.
	 *
	 * @param {String} uri
	 * @api public
	 */

	exports.connect = lookup;

	/**
	 * Expose constructors for standalone build.
	 *
	 * @api public
	 */

	exports.Manager = __webpack_require__(14);
	exports.Socket = __webpack_require__(46);


/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global) {
	/**
	 * Module dependencies.
	 */

	var parseuri = __webpack_require__(5);
	var debug = __webpack_require__(6)('socket.io-client:url');

	/**
	 * Module exports.
	 */

	module.exports = url;

	/**
	 * URL parser.
	 *
	 * @param {String} url
	 * @param {Object} An object meant to mimic window.location.
	 *                 Defaults to window.location.
	 * @api public
	 */

	function url(uri, loc){
	  var obj = uri;

	  // default to window.location
	  var loc = loc || global.location;
	  if (null == uri) uri = loc.protocol + '//' + loc.host;

	  // relative path support
	  if ('string' == typeof uri) {
	    if ('/' == uri.charAt(0)) {
	      if ('/' == uri.charAt(1)) {
	        uri = loc.protocol + uri;
	      } else {
	        uri = loc.hostname + uri;
	      }
	    }

	    if (!/^(https?|wss?):\/\//.test(uri)) {
	      debug('protocol-less url %s', uri);
	      if ('undefined' != typeof loc) {
	        uri = loc.protocol + '//' + uri;
	      } else {
	        uri = 'https://' + uri;
	      }
	    }

	    // parse
	    debug('parse %s', uri);
	    obj = parseuri(uri);
	  }

	  // make sure we treat `localhost:80` and `localhost` equally
	  if (!obj.port) {
	    if (/^(http|ws)$/.test(obj.protocol)) {
	      obj.port = '80';
	    }
	    else if (/^(http|ws)s$/.test(obj.protocol)) {
	      obj.port = '443';
	    }
	  }

	  obj.path = obj.path || '/';

	  // define unique id
	  obj.id = obj.protocol + '://' + obj.host + ':' + obj.port;
	  // define href
	  obj.href = obj.protocol + '://' + obj.host + (loc && loc.port == obj.port ? '' : (':' + obj.port));

	  return obj;
	}

	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },
/* 5 */
/***/ function(module, exports) {

	/**
	 * Parses an URI
	 *
	 * @author Steven Levithan <stevenlevithan.com> (MIT license)
	 * @api private
	 */

	var re = /^(?:(?![^:@]+:[^:@\/]*@)(http|https|ws|wss):\/\/)?((?:(([^:@]*)(?::([^:@]*))?)?@)?((?:[a-f0-9]{0,4}:){2,7}[a-f0-9]{0,4}|[^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/;

	var parts = [
	    'source', 'protocol', 'authority', 'userInfo', 'user', 'password', 'host'
	  , 'port', 'relative', 'path', 'directory', 'file', 'query', 'anchor'
	];

	module.exports = function parseuri(str) {
	  var m = re.exec(str || '')
	    , uri = {}
	    , i = 14;

	  while (i--) {
	    uri[parts[i]] = m[i] || '';
	  }

	  return uri;
	};


/***/ },
/* 6 */
/***/ function(module, exports) {

	
	/**
	 * Expose `debug()` as the module.
	 */

	module.exports = debug;

	/**
	 * Create a debugger with the given `name`.
	 *
	 * @param {String} name
	 * @return {Type}
	 * @api public
	 */

	function debug(name) {
	  if (!debug.enabled(name)) return function(){};

	  return function(fmt){
	    fmt = coerce(fmt);

	    var curr = new Date;
	    var ms = curr - (debug[name] || curr);
	    debug[name] = curr;

	    fmt = name
	      + ' '
	      + fmt
	      + ' +' + debug.humanize(ms);

	    // This hackery is required for IE8
	    // where `console.log` doesn't have 'apply'
	    window.console
	      && console.log
	      && Function.prototype.apply.call(console.log, console, arguments);
	  }
	}

	/**
	 * The currently active debug mode names.
	 */

	debug.names = [];
	debug.skips = [];

	/**
	 * Enables a debug mode by name. This can include modes
	 * separated by a colon and wildcards.
	 *
	 * @param {String} name
	 * @api public
	 */

	debug.enable = function(name) {
	  try {
	    localStorage.debug = name;
	  } catch(e){}

	  var split = (name || '').split(/[\s,]+/)
	    , len = split.length;

	  for (var i = 0; i < len; i++) {
	    name = split[i].replace('*', '.*?');
	    if (name[0] === '-') {
	      debug.skips.push(new RegExp('^' + name.substr(1) + '$'));
	    }
	    else {
	      debug.names.push(new RegExp('^' + name + '$'));
	    }
	  }
	};

	/**
	 * Disable debug output.
	 *
	 * @api public
	 */

	debug.disable = function(){
	  debug.enable('');
	};

	/**
	 * Humanize the given `ms`.
	 *
	 * @param {Number} m
	 * @return {String}
	 * @api private
	 */

	debug.humanize = function(ms) {
	  var sec = 1000
	    , min = 60 * 1000
	    , hour = 60 * min;

	  if (ms >= hour) return (ms / hour).toFixed(1) + 'h';
	  if (ms >= min) return (ms / min).toFixed(1) + 'm';
	  if (ms >= sec) return (ms / sec | 0) + 's';
	  return ms + 'ms';
	};

	/**
	 * Returns true if the given mode name is enabled, false otherwise.
	 *
	 * @param {String} name
	 * @return {Boolean}
	 * @api public
	 */

	debug.enabled = function(name) {
	  for (var i = 0, len = debug.skips.length; i < len; i++) {
	    if (debug.skips[i].test(name)) {
	      return false;
	    }
	  }
	  for (var i = 0, len = debug.names.length; i < len; i++) {
	    if (debug.names[i].test(name)) {
	      return true;
	    }
	  }
	  return false;
	};

	/**
	 * Coerce `val`.
	 */

	function coerce(val) {
	  if (val instanceof Error) return val.stack || val.message;
	  return val;
	}

	// persist

	try {
	  if (window.localStorage) debug.enable(localStorage.debug);
	} catch(e){}


/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	
	/**
	 * Module dependencies.
	 */

	var debug = __webpack_require__(6)('socket.io-parser');
	var json = __webpack_require__(8);
	var isArray = __webpack_require__(10);
	var Emitter = __webpack_require__(11);
	var binary = __webpack_require__(12);
	var isBuf = __webpack_require__(13);

	/**
	 * Protocol version.
	 *
	 * @api public
	 */

	exports.protocol = 4;

	/**
	 * Packet types.
	 *
	 * @api public
	 */

	exports.types = [
	  'CONNECT',
	  'DISCONNECT',
	  'EVENT',
	  'BINARY_EVENT',
	  'ACK',
	  'BINARY_ACK',
	  'ERROR'
	];

	/**
	 * Packet type `connect`.
	 *
	 * @api public
	 */

	exports.CONNECT = 0;

	/**
	 * Packet type `disconnect`.
	 *
	 * @api public
	 */

	exports.DISCONNECT = 1;

	/**
	 * Packet type `event`.
	 *
	 * @api public
	 */

	exports.EVENT = 2;

	/**
	 * Packet type `ack`.
	 *
	 * @api public
	 */

	exports.ACK = 3;

	/**
	 * Packet type `error`.
	 *
	 * @api public
	 */

	exports.ERROR = 4;

	/**
	 * Packet type 'binary event'
	 *
	 * @api public
	 */

	exports.BINARY_EVENT = 5;

	/**
	 * Packet type `binary ack`. For acks with binary arguments.
	 *
	 * @api public
	 */

	exports.BINARY_ACK = 6;

	/**
	 * Encoder constructor.
	 *
	 * @api public
	 */

	exports.Encoder = Encoder;

	/**
	 * Decoder constructor.
	 *
	 * @api public
	 */

	exports.Decoder = Decoder;

	/**
	 * A socket.io Encoder instance
	 *
	 * @api public
	 */

	function Encoder() {}

	/**
	 * Encode a packet as a single string if non-binary, or as a
	 * buffer sequence, depending on packet type.
	 *
	 * @param {Object} obj - packet object
	 * @param {Function} callback - function to handle encodings (likely engine.write)
	 * @return Calls callback with Array of encodings
	 * @api public
	 */

	Encoder.prototype.encode = function(obj, callback){
	  debug('encoding packet %j', obj);

	  if (exports.BINARY_EVENT == obj.type || exports.BINARY_ACK == obj.type) {
	    encodeAsBinary(obj, callback);
	  }
	  else {
	    var encoding = encodeAsString(obj);
	    callback([encoding]);
	  }
	};

	/**
	 * Encode packet as string.
	 *
	 * @param {Object} packet
	 * @return {String} encoded
	 * @api private
	 */

	function encodeAsString(obj) {
	  var str = '';
	  var nsp = false;

	  // first is type
	  str += obj.type;

	  // attachments if we have them
	  if (exports.BINARY_EVENT == obj.type || exports.BINARY_ACK == obj.type) {
	    str += obj.attachments;
	    str += '-';
	  }

	  // if we have a namespace other than `/`
	  // we append it followed by a comma `,`
	  if (obj.nsp && '/' != obj.nsp) {
	    nsp = true;
	    str += obj.nsp;
	  }

	  // immediately followed by the id
	  if (null != obj.id) {
	    if (nsp) {
	      str += ',';
	      nsp = false;
	    }
	    str += obj.id;
	  }

	  // json data
	  if (null != obj.data) {
	    if (nsp) str += ',';
	    str += json.stringify(obj.data);
	  }

	  debug('encoded %j as %s', obj, str);
	  return str;
	}

	/**
	 * Encode packet as 'buffer sequence' by removing blobs, and
	 * deconstructing packet into object with placeholders and
	 * a list of buffers.
	 *
	 * @param {Object} packet
	 * @return {Buffer} encoded
	 * @api private
	 */

	function encodeAsBinary(obj, callback) {

	  function writeEncoding(bloblessData) {
	    var deconstruction = binary.deconstructPacket(bloblessData);
	    var pack = encodeAsString(deconstruction.packet);
	    var buffers = deconstruction.buffers;

	    buffers.unshift(pack); // add packet info to beginning of data list
	    callback(buffers); // write all the buffers
	  }

	  binary.removeBlobs(obj, writeEncoding);
	}

	/**
	 * A socket.io Decoder instance
	 *
	 * @return {Object} decoder
	 * @api public
	 */

	function Decoder() {
	  this.reconstructor = null;
	}

	/**
	 * Mix in `Emitter` with Decoder.
	 */

	Emitter(Decoder.prototype);

	/**
	 * Decodes an ecoded packet string into packet JSON.
	 *
	 * @param {String} obj - encoded packet
	 * @return {Object} packet
	 * @api public
	 */

	Decoder.prototype.add = function(obj) {
	  var packet;
	  if ('string' == typeof obj) {
	    packet = decodeString(obj);
	    if (exports.BINARY_EVENT == packet.type || exports.BINARY_ACK == packet.type) { // binary packet's json
	      this.reconstructor = new BinaryReconstructor(packet);

	      // no attachments, labeled binary but no binary data to follow
	      if (this.reconstructor.reconPack.attachments === 0) {
	        this.emit('decoded', packet);
	      }
	    } else { // non-binary full packet
	      this.emit('decoded', packet);
	    }
	  }
	  else if (isBuf(obj) || obj.base64) { // raw binary data
	    if (!this.reconstructor) {
	      throw new Error('got binary data when not reconstructing a packet');
	    } else {
	      packet = this.reconstructor.takeBinaryData(obj);
	      if (packet) { // received final buffer
	        this.reconstructor = null;
	        this.emit('decoded', packet);
	      }
	    }
	  }
	  else {
	    throw new Error('Unknown type: ' + obj);
	  }
	};

	/**
	 * Decode a packet String (JSON data)
	 *
	 * @param {String} str
	 * @return {Object} packet
	 * @api private
	 */

	function decodeString(str) {
	  var p = {};
	  var i = 0;

	  // look up type
	  p.type = Number(str.charAt(0));
	  if (null == exports.types[p.type]) return error();

	  // look up attachments if type binary
	  if (exports.BINARY_EVENT == p.type || exports.BINARY_ACK == p.type) {
	    var buf = '';
	    while (str.charAt(++i) != '-') {
	      buf += str.charAt(i);
	      if (i == str.length) break;
	    }
	    if (buf != Number(buf) || str.charAt(i) != '-') {
	      throw new Error('Illegal attachments');
	    }
	    p.attachments = Number(buf);
	  }

	  // look up namespace (if any)
	  if ('/' == str.charAt(i + 1)) {
	    p.nsp = '';
	    while (++i) {
	      var c = str.charAt(i);
	      if (',' == c) break;
	      p.nsp += c;
	      if (i == str.length) break;
	    }
	  } else {
	    p.nsp = '/';
	  }

	  // look up id
	  var next = str.charAt(i + 1);
	  if ('' !== next && Number(next) == next) {
	    p.id = '';
	    while (++i) {
	      var c = str.charAt(i);
	      if (null == c || Number(c) != c) {
	        --i;
	        break;
	      }
	      p.id += str.charAt(i);
	      if (i == str.length) break;
	    }
	    p.id = Number(p.id);
	  }

	  // look up json data
	  if (str.charAt(++i)) {
	    try {
	      p.data = json.parse(str.substr(i));
	    } catch(e){
	      return error();
	    }
	  }

	  debug('decoded %s as %j', str, p);
	  return p;
	}

	/**
	 * Deallocates a parser's resources
	 *
	 * @api public
	 */

	Decoder.prototype.destroy = function() {
	  if (this.reconstructor) {
	    this.reconstructor.finishedReconstruction();
	  }
	};

	/**
	 * A manager of a binary event's 'buffer sequence'. Should
	 * be constructed whenever a packet of type BINARY_EVENT is
	 * decoded.
	 *
	 * @param {Object} packet
	 * @return {BinaryReconstructor} initialized reconstructor
	 * @api private
	 */

	function BinaryReconstructor(packet) {
	  this.reconPack = packet;
	  this.buffers = [];
	}

	/**
	 * Method to be called when binary data received from connection
	 * after a BINARY_EVENT packet.
	 *
	 * @param {Buffer | ArrayBuffer} binData - the raw binary data received
	 * @return {null | Object} returns null if more binary data is expected or
	 *   a reconstructed packet object if all buffers have been received.
	 * @api private
	 */

	BinaryReconstructor.prototype.takeBinaryData = function(binData) {
	  this.buffers.push(binData);
	  if (this.buffers.length == this.reconPack.attachments) { // done with buffer list
	    var packet = binary.reconstructPacket(this.reconPack, this.buffers);
	    this.finishedReconstruction();
	    return packet;
	  }
	  return null;
	};

	/**
	 * Cleans up binary packet reconstruction variables.
	 *
	 * @api private
	 */

	BinaryReconstructor.prototype.finishedReconstruction = function() {
	  this.reconPack = null;
	  this.buffers = [];
	};

	function error(data){
	  return {
	    type: exports.ERROR,
	    data: 'parser error'
	  };
	}


/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;/*! JSON v3.2.6 | http://bestiejs.github.io/json3 | Copyright 2012-2013, Kit Cambridge | http://kit.mit-license.org */
	;(function (window) {
	  // Convenience aliases.
	  var getClass = {}.toString, isProperty, forEach, undef;

	  // Detect the `define` function exposed by asynchronous module loaders. The
	  // strict `define` check is necessary for compatibility with `r.js`.
	  var isLoader = "function" === "function" && __webpack_require__(9);

	  // Detect native implementations.
	  var nativeJSON = typeof JSON == "object" && JSON;

	  // Set up the JSON 3 namespace, preferring the CommonJS `exports` object if
	  // available.
	  var JSON3 = typeof exports == "object" && exports && !exports.nodeType && exports;

	  if (JSON3 && nativeJSON) {
	    // Explicitly delegate to the native `stringify` and `parse`
	    // implementations in CommonJS environments.
	    JSON3.stringify = nativeJSON.stringify;
	    JSON3.parse = nativeJSON.parse;
	  } else {
	    // Export for web browsers, JavaScript engines, and asynchronous module
	    // loaders, using the global `JSON` object if available.
	    JSON3 = window.JSON = nativeJSON || {};
	  }

	  // Test the `Date#getUTC*` methods. Based on work by @Yaffle.
	  var isExtended = new Date(-3509827334573292);
	  try {
	    // The `getUTCFullYear`, `Month`, and `Date` methods return nonsensical
	    // results for certain dates in Opera >= 10.53.
	    isExtended = isExtended.getUTCFullYear() == -109252 && isExtended.getUTCMonth() === 0 && isExtended.getUTCDate() === 1 &&
	      // Safari < 2.0.2 stores the internal millisecond time value correctly,
	      // but clips the values returned by the date methods to the range of
	      // signed 32-bit integers ([-2 ** 31, 2 ** 31 - 1]).
	      isExtended.getUTCHours() == 10 && isExtended.getUTCMinutes() == 37 && isExtended.getUTCSeconds() == 6 && isExtended.getUTCMilliseconds() == 708;
	  } catch (exception) {}

	  // Internal: Determines whether the native `JSON.stringify` and `parse`
	  // implementations are spec-compliant. Based on work by Ken Snyder.
	  function has(name) {
	    if (has[name] !== undef) {
	      // Return cached feature test result.
	      return has[name];
	    }

	    var isSupported;
	    if (name == "bug-string-char-index") {
	      // IE <= 7 doesn't support accessing string characters using square
	      // bracket notation. IE 8 only supports this for primitives.
	      isSupported = "a"[0] != "a";
	    } else if (name == "json") {
	      // Indicates whether both `JSON.stringify` and `JSON.parse` are
	      // supported.
	      isSupported = has("json-stringify") && has("json-parse");
	    } else {
	      var value, serialized = '{"a":[1,true,false,null,"\\u0000\\b\\n\\f\\r\\t"]}';
	      // Test `JSON.stringify`.
	      if (name == "json-stringify") {
	        var stringify = JSON3.stringify, stringifySupported = typeof stringify == "function" && isExtended;
	        if (stringifySupported) {
	          // A test function object with a custom `toJSON` method.
	          (value = function () {
	            return 1;
	          }).toJSON = value;
	          try {
	            stringifySupported =
	              // Firefox 3.1b1 and b2 serialize string, number, and boolean
	              // primitives as object literals.
	              stringify(0) === "0" &&
	              // FF 3.1b1, b2, and JSON 2 serialize wrapped primitives as object
	              // literals.
	              stringify(new Number()) === "0" &&
	              stringify(new String()) == '""' &&
	              // FF 3.1b1, 2 throw an error if the value is `null`, `undefined`, or
	              // does not define a canonical JSON representation (this applies to
	              // objects with `toJSON` properties as well, *unless* they are nested
	              // within an object or array).
	              stringify(getClass) === undef &&
	              // IE 8 serializes `undefined` as `"undefined"`. Safari <= 5.1.7 and
	              // FF 3.1b3 pass this test.
	              stringify(undef) === undef &&
	              // Safari <= 5.1.7 and FF 3.1b3 throw `Error`s and `TypeError`s,
	              // respectively, if the value is omitted entirely.
	              stringify() === undef &&
	              // FF 3.1b1, 2 throw an error if the given value is not a number,
	              // string, array, object, Boolean, or `null` literal. This applies to
	              // objects with custom `toJSON` methods as well, unless they are nested
	              // inside object or array literals. YUI 3.0.0b1 ignores custom `toJSON`
	              // methods entirely.
	              stringify(value) === "1" &&
	              stringify([value]) == "[1]" &&
	              // Prototype <= 1.6.1 serializes `[undefined]` as `"[]"` instead of
	              // `"[null]"`.
	              stringify([undef]) == "[null]" &&
	              // YUI 3.0.0b1 fails to serialize `null` literals.
	              stringify(null) == "null" &&
	              // FF 3.1b1, 2 halts serialization if an array contains a function:
	              // `[1, true, getClass, 1]` serializes as "[1,true,],". FF 3.1b3
	              // elides non-JSON values from objects and arrays, unless they
	              // define custom `toJSON` methods.
	              stringify([undef, getClass, null]) == "[null,null,null]" &&
	              // Simple serialization test. FF 3.1b1 uses Unicode escape sequences
	              // where character escape codes are expected (e.g., `\b` => `\u0008`).
	              stringify({ "a": [value, true, false, null, "\x00\b\n\f\r\t"] }) == serialized &&
	              // FF 3.1b1 and b2 ignore the `filter` and `width` arguments.
	              stringify(null, value) === "1" &&
	              stringify([1, 2], null, 1) == "[\n 1,\n 2\n]" &&
	              // JSON 2, Prototype <= 1.7, and older WebKit builds incorrectly
	              // serialize extended years.
	              stringify(new Date(-8.64e15)) == '"-271821-04-20T00:00:00.000Z"' &&
	              // The milliseconds are optional in ES 5, but required in 5.1.
	              stringify(new Date(8.64e15)) == '"+275760-09-13T00:00:00.000Z"' &&
	              // Firefox <= 11.0 incorrectly serializes years prior to 0 as negative
	              // four-digit years instead of six-digit years. Credits: @Yaffle.
	              stringify(new Date(-621987552e5)) == '"-000001-01-01T00:00:00.000Z"' &&
	              // Safari <= 5.1.5 and Opera >= 10.53 incorrectly serialize millisecond
	              // values less than 1000. Credits: @Yaffle.
	              stringify(new Date(-1)) == '"1969-12-31T23:59:59.999Z"';
	          } catch (exception) {
	            stringifySupported = false;
	          }
	        }
	        isSupported = stringifySupported;
	      }
	      // Test `JSON.parse`.
	      if (name == "json-parse") {
	        var parse = JSON3.parse;
	        if (typeof parse == "function") {
	          try {
	            // FF 3.1b1, b2 will throw an exception if a bare literal is provided.
	            // Conforming implementations should also coerce the initial argument to
	            // a string prior to parsing.
	            if (parse("0") === 0 && !parse(false)) {
	              // Simple parsing test.
	              value = parse(serialized);
	              var parseSupported = value["a"].length == 5 && value["a"][0] === 1;
	              if (parseSupported) {
	                try {
	                  // Safari <= 5.1.2 and FF 3.1b1 allow unescaped tabs in strings.
	                  parseSupported = !parse('"\t"');
	                } catch (exception) {}
	                if (parseSupported) {
	                  try {
	                    // FF 4.0 and 4.0.1 allow leading `+` signs and leading
	                    // decimal points. FF 4.0, 4.0.1, and IE 9-10 also allow
	                    // certain octal literals.
	                    parseSupported = parse("01") !== 1;
	                  } catch (exception) {}
	                }
	                if (parseSupported) {
	                  try {
	                    // FF 4.0, 4.0.1, and Rhino 1.7R3-R4 allow trailing decimal
	                    // points. These environments, along with FF 3.1b1 and 2,
	                    // also allow trailing commas in JSON objects and arrays.
	                    parseSupported = parse("1.") !== 1;
	                  } catch (exception) {}
	                }
	              }
	            }
	          } catch (exception) {
	            parseSupported = false;
	          }
	        }
	        isSupported = parseSupported;
	      }
	    }
	    return has[name] = !!isSupported;
	  }

	  if (!has("json")) {
	    // Common `[[Class]]` name aliases.
	    var functionClass = "[object Function]";
	    var dateClass = "[object Date]";
	    var numberClass = "[object Number]";
	    var stringClass = "[object String]";
	    var arrayClass = "[object Array]";
	    var booleanClass = "[object Boolean]";

	    // Detect incomplete support for accessing string characters by index.
	    var charIndexBuggy = has("bug-string-char-index");

	    // Define additional utility methods if the `Date` methods are buggy.
	    if (!isExtended) {
	      var floor = Math.floor;
	      // A mapping between the months of the year and the number of days between
	      // January 1st and the first of the respective month.
	      var Months = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334];
	      // Internal: Calculates the number of days between the Unix epoch and the
	      // first day of the given month.
	      var getDay = function (year, month) {
	        return Months[month] + 365 * (year - 1970) + floor((year - 1969 + (month = +(month > 1))) / 4) - floor((year - 1901 + month) / 100) + floor((year - 1601 + month) / 400);
	      };
	    }

	    // Internal: Determines if a property is a direct property of the given
	    // object. Delegates to the native `Object#hasOwnProperty` method.
	    if (!(isProperty = {}.hasOwnProperty)) {
	      isProperty = function (property) {
	        var members = {}, constructor;
	        if ((members.__proto__ = null, members.__proto__ = {
	          // The *proto* property cannot be set multiple times in recent
	          // versions of Firefox and SeaMonkey.
	          "toString": 1
	        }, members).toString != getClass) {
	          // Safari <= 2.0.3 doesn't implement `Object#hasOwnProperty`, but
	          // supports the mutable *proto* property.
	          isProperty = function (property) {
	            // Capture and break the object's prototype chain (see section 8.6.2
	            // of the ES 5.1 spec). The parenthesized expression prevents an
	            // unsafe transformation by the Closure Compiler.
	            var original = this.__proto__, result = property in (this.__proto__ = null, this);
	            // Restore the original prototype chain.
	            this.__proto__ = original;
	            return result;
	          };
	        } else {
	          // Capture a reference to the top-level `Object` constructor.
	          constructor = members.constructor;
	          // Use the `constructor` property to simulate `Object#hasOwnProperty` in
	          // other environments.
	          isProperty = function (property) {
	            var parent = (this.constructor || constructor).prototype;
	            return property in this && !(property in parent && this[property] === parent[property]);
	          };
	        }
	        members = null;
	        return isProperty.call(this, property);
	      };
	    }

	    // Internal: A set of primitive types used by `isHostType`.
	    var PrimitiveTypes = {
	      'boolean': 1,
	      'number': 1,
	      'string': 1,
	      'undefined': 1
	    };

	    // Internal: Determines if the given object `property` value is a
	    // non-primitive.
	    var isHostType = function (object, property) {
	      var type = typeof object[property];
	      return type == 'object' ? !!object[property] : !PrimitiveTypes[type];
	    };

	    // Internal: Normalizes the `for...in` iteration algorithm across
	    // environments. Each enumerated key is yielded to a `callback` function.
	    forEach = function (object, callback) {
	      var size = 0, Properties, members, property;

	      // Tests for bugs in the current environment's `for...in` algorithm. The
	      // `valueOf` property inherits the non-enumerable flag from
	      // `Object.prototype` in older versions of IE, Netscape, and Mozilla.
	      (Properties = function () {
	        this.valueOf = 0;
	      }).prototype.valueOf = 0;

	      // Iterate over a new instance of the `Properties` class.
	      members = new Properties();
	      for (property in members) {
	        // Ignore all properties inherited from `Object.prototype`.
	        if (isProperty.call(members, property)) {
	          size++;
	        }
	      }
	      Properties = members = null;

	      // Normalize the iteration algorithm.
	      if (!size) {
	        // A list of non-enumerable properties inherited from `Object.prototype`.
	        members = ["valueOf", "toString", "toLocaleString", "propertyIsEnumerable", "isPrototypeOf", "hasOwnProperty", "constructor"];
	        // IE <= 8, Mozilla 1.0, and Netscape 6.2 ignore shadowed non-enumerable
	        // properties.
	        forEach = function (object, callback) {
	          var isFunction = getClass.call(object) == functionClass, property, length;
	          var hasProperty = !isFunction && typeof object.constructor != 'function' && isHostType(object, 'hasOwnProperty') ? object.hasOwnProperty : isProperty;
	          for (property in object) {
	            // Gecko <= 1.0 enumerates the `prototype` property of functions under
	            // certain conditions; IE does not.
	            if (!(isFunction && property == "prototype") && hasProperty.call(object, property)) {
	              callback(property);
	            }
	          }
	          // Manually invoke the callback for each non-enumerable property.
	          for (length = members.length; property = members[--length]; hasProperty.call(object, property) && callback(property));
	        };
	      } else if (size == 2) {
	        // Safari <= 2.0.4 enumerates shadowed properties twice.
	        forEach = function (object, callback) {
	          // Create a set of iterated properties.
	          var members = {}, isFunction = getClass.call(object) == functionClass, property;
	          for (property in object) {
	            // Store each property name to prevent double enumeration. The
	            // `prototype` property of functions is not enumerated due to cross-
	            // environment inconsistencies.
	            if (!(isFunction && property == "prototype") && !isProperty.call(members, property) && (members[property] = 1) && isProperty.call(object, property)) {
	              callback(property);
	            }
	          }
	        };
	      } else {
	        // No bugs detected; use the standard `for...in` algorithm.
	        forEach = function (object, callback) {
	          var isFunction = getClass.call(object) == functionClass, property, isConstructor;
	          for (property in object) {
	            if (!(isFunction && property == "prototype") && isProperty.call(object, property) && !(isConstructor = property === "constructor")) {
	              callback(property);
	            }
	          }
	          // Manually invoke the callback for the `constructor` property due to
	          // cross-environment inconsistencies.
	          if (isConstructor || isProperty.call(object, (property = "constructor"))) {
	            callback(property);
	          }
	        };
	      }
	      return forEach(object, callback);
	    };

	    // Public: Serializes a JavaScript `value` as a JSON string. The optional
	    // `filter` argument may specify either a function that alters how object and
	    // array members are serialized, or an array of strings and numbers that
	    // indicates which properties should be serialized. The optional `width`
	    // argument may be either a string or number that specifies the indentation
	    // level of the output.
	    if (!has("json-stringify")) {
	      // Internal: A map of control characters and their escaped equivalents.
	      var Escapes = {
	        92: "\\\\",
	        34: '\\"',
	        8: "\\b",
	        12: "\\f",
	        10: "\\n",
	        13: "\\r",
	        9: "\\t"
	      };

	      // Internal: Converts `value` into a zero-padded string such that its
	      // length is at least equal to `width`. The `width` must be <= 6.
	      var leadingZeroes = "000000";
	      var toPaddedString = function (width, value) {
	        // The `|| 0` expression is necessary to work around a bug in
	        // Opera <= 7.54u2 where `0 == -0`, but `String(-0) !== "0"`.
	        return (leadingZeroes + (value || 0)).slice(-width);
	      };

	      // Internal: Double-quotes a string `value`, replacing all ASCII control
	      // characters (characters with code unit values between 0 and 31) with
	      // their escaped equivalents. This is an implementation of the
	      // `Quote(value)` operation defined in ES 5.1 section 15.12.3.
	      var unicodePrefix = "\\u00";
	      var quote = function (value) {
	        var result = '"', index = 0, length = value.length, isLarge = length > 10 && charIndexBuggy, symbols;
	        if (isLarge) {
	          symbols = value.split("");
	        }
	        for (; index < length; index++) {
	          var charCode = value.charCodeAt(index);
	          // If the character is a control character, append its Unicode or
	          // shorthand escape sequence; otherwise, append the character as-is.
	          switch (charCode) {
	            case 8: case 9: case 10: case 12: case 13: case 34: case 92:
	              result += Escapes[charCode];
	              break;
	            default:
	              if (charCode < 32) {
	                result += unicodePrefix + toPaddedString(2, charCode.toString(16));
	                break;
	              }
	              result += isLarge ? symbols[index] : charIndexBuggy ? value.charAt(index) : value[index];
	          }
	        }
	        return result + '"';
	      };

	      // Internal: Recursively serializes an object. Implements the
	      // `Str(key, holder)`, `JO(value)`, and `JA(value)` operations.
	      var serialize = function (property, object, callback, properties, whitespace, indentation, stack) {
	        var value, className, year, month, date, time, hours, minutes, seconds, milliseconds, results, element, index, length, prefix, result;
	        try {
	          // Necessary for host object support.
	          value = object[property];
	        } catch (exception) {}
	        if (typeof value == "object" && value) {
	          className = getClass.call(value);
	          if (className == dateClass && !isProperty.call(value, "toJSON")) {
	            if (value > -1 / 0 && value < 1 / 0) {
	              // Dates are serialized according to the `Date#toJSON` method
	              // specified in ES 5.1 section 15.9.5.44. See section 15.9.1.15
	              // for the ISO 8601 date time string format.
	              if (getDay) {
	                // Manually compute the year, month, date, hours, minutes,
	                // seconds, and milliseconds if the `getUTC*` methods are
	                // buggy. Adapted from @Yaffle's `date-shim` project.
	                date = floor(value / 864e5);
	                for (year = floor(date / 365.2425) + 1970 - 1; getDay(year + 1, 0) <= date; year++);
	                for (month = floor((date - getDay(year, 0)) / 30.42); getDay(year, month + 1) <= date; month++);
	                date = 1 + date - getDay(year, month);
	                // The `time` value specifies the time within the day (see ES
	                // 5.1 section 15.9.1.2). The formula `(A % B + B) % B` is used
	                // to compute `A modulo B`, as the `%` operator does not
	                // correspond to the `modulo` operation for negative numbers.
	                time = (value % 864e5 + 864e5) % 864e5;
	                // The hours, minutes, seconds, and milliseconds are obtained by
	                // decomposing the time within the day. See section 15.9.1.10.
	                hours = floor(time / 36e5) % 24;
	                minutes = floor(time / 6e4) % 60;
	                seconds = floor(time / 1e3) % 60;
	                milliseconds = time % 1e3;
	              } else {
	                year = value.getUTCFullYear();
	                month = value.getUTCMonth();
	                date = value.getUTCDate();
	                hours = value.getUTCHours();
	                minutes = value.getUTCMinutes();
	                seconds = value.getUTCSeconds();
	                milliseconds = value.getUTCMilliseconds();
	              }
	              // Serialize extended years correctly.
	              value = (year <= 0 || year >= 1e4 ? (year < 0 ? "-" : "+") + toPaddedString(6, year < 0 ? -year : year) : toPaddedString(4, year)) +
	                "-" + toPaddedString(2, month + 1) + "-" + toPaddedString(2, date) +
	                // Months, dates, hours, minutes, and seconds should have two
	                // digits; milliseconds should have three.
	                "T" + toPaddedString(2, hours) + ":" + toPaddedString(2, minutes) + ":" + toPaddedString(2, seconds) +
	                // Milliseconds are optional in ES 5.0, but required in 5.1.
	                "." + toPaddedString(3, milliseconds) + "Z";
	            } else {
	              value = null;
	            }
	          } else if (typeof value.toJSON == "function" && ((className != numberClass && className != stringClass && className != arrayClass) || isProperty.call(value, "toJSON"))) {
	            // Prototype <= 1.6.1 adds non-standard `toJSON` methods to the
	            // `Number`, `String`, `Date`, and `Array` prototypes. JSON 3
	            // ignores all `toJSON` methods on these objects unless they are
	            // defined directly on an instance.
	            value = value.toJSON(property);
	          }
	        }
	        if (callback) {
	          // If a replacement function was provided, call it to obtain the value
	          // for serialization.
	          value = callback.call(object, property, value);
	        }
	        if (value === null) {
	          return "null";
	        }
	        className = getClass.call(value);
	        if (className == booleanClass) {
	          // Booleans are represented literally.
	          return "" + value;
	        } else if (className == numberClass) {
	          // JSON numbers must be finite. `Infinity` and `NaN` are serialized as
	          // `"null"`.
	          return value > -1 / 0 && value < 1 / 0 ? "" + value : "null";
	        } else if (className == stringClass) {
	          // Strings are double-quoted and escaped.
	          return quote("" + value);
	        }
	        // Recursively serialize objects and arrays.
	        if (typeof value == "object") {
	          // Check for cyclic structures. This is a linear search; performance
	          // is inversely proportional to the number of unique nested objects.
	          for (length = stack.length; length--;) {
	            if (stack[length] === value) {
	              // Cyclic structures cannot be serialized by `JSON.stringify`.
	              throw TypeError();
	            }
	          }
	          // Add the object to the stack of traversed objects.
	          stack.push(value);
	          results = [];
	          // Save the current indentation level and indent one additional level.
	          prefix = indentation;
	          indentation += whitespace;
	          if (className == arrayClass) {
	            // Recursively serialize array elements.
	            for (index = 0, length = value.length; index < length; index++) {
	              element = serialize(index, value, callback, properties, whitespace, indentation, stack);
	              results.push(element === undef ? "null" : element);
	            }
	            result = results.length ? (whitespace ? "[\n" + indentation + results.join(",\n" + indentation) + "\n" + prefix + "]" : ("[" + results.join(",") + "]")) : "[]";
	          } else {
	            // Recursively serialize object members. Members are selected from
	            // either a user-specified list of property names, or the object
	            // itself.
	            forEach(properties || value, function (property) {
	              var element = serialize(property, value, callback, properties, whitespace, indentation, stack);
	              if (element !== undef) {
	                // According to ES 5.1 section 15.12.3: "If `gap` {whitespace}
	                // is not the empty string, let `member` {quote(property) + ":"}
	                // be the concatenation of `member` and the `space` character."
	                // The "`space` character" refers to the literal space
	                // character, not the `space` {width} argument provided to
	                // `JSON.stringify`.
	                results.push(quote(property) + ":" + (whitespace ? " " : "") + element);
	              }
	            });
	            result = results.length ? (whitespace ? "{\n" + indentation + results.join(",\n" + indentation) + "\n" + prefix + "}" : ("{" + results.join(",") + "}")) : "{}";
	          }
	          // Remove the object from the traversed object stack.
	          stack.pop();
	          return result;
	        }
	      };

	      // Public: `JSON.stringify`. See ES 5.1 section 15.12.3.
	      JSON3.stringify = function (source, filter, width) {
	        var whitespace, callback, properties, className;
	        if (typeof filter == "function" || typeof filter == "object" && filter) {
	          if ((className = getClass.call(filter)) == functionClass) {
	            callback = filter;
	          } else if (className == arrayClass) {
	            // Convert the property names array into a makeshift set.
	            properties = {};
	            for (var index = 0, length = filter.length, value; index < length; value = filter[index++], ((className = getClass.call(value)), className == stringClass || className == numberClass) && (properties[value] = 1));
	          }
	        }
	        if (width) {
	          if ((className = getClass.call(width)) == numberClass) {
	            // Convert the `width` to an integer and create a string containing
	            // `width` number of space characters.
	            if ((width -= width % 1) > 0) {
	              for (whitespace = "", width > 10 && (width = 10); whitespace.length < width; whitespace += " ");
	            }
	          } else if (className == stringClass) {
	            whitespace = width.length <= 10 ? width : width.slice(0, 10);
	          }
	        }
	        // Opera <= 7.54u2 discards the values associated with empty string keys
	        // (`""`) only if they are used directly within an object member list
	        // (e.g., `!("" in { "": 1})`).
	        return serialize("", (value = {}, value[""] = source, value), callback, properties, whitespace, "", []);
	      };
	    }

	    // Public: Parses a JSON source string.
	    if (!has("json-parse")) {
	      var fromCharCode = String.fromCharCode;

	      // Internal: A map of escaped control characters and their unescaped
	      // equivalents.
	      var Unescapes = {
	        92: "\\",
	        34: '"',
	        47: "/",
	        98: "\b",
	        116: "\t",
	        110: "\n",
	        102: "\f",
	        114: "\r"
	      };

	      // Internal: Stores the parser state.
	      var Index, Source;

	      // Internal: Resets the parser state and throws a `SyntaxError`.
	      var abort = function() {
	        Index = Source = null;
	        throw SyntaxError();
	      };

	      // Internal: Returns the next token, or `"$"` if the parser has reached
	      // the end of the source string. A token may be a string, number, `null`
	      // literal, or Boolean literal.
	      var lex = function () {
	        var source = Source, length = source.length, value, begin, position, isSigned, charCode;
	        while (Index < length) {
	          charCode = source.charCodeAt(Index);
	          switch (charCode) {
	            case 9: case 10: case 13: case 32:
	              // Skip whitespace tokens, including tabs, carriage returns, line
	              // feeds, and space characters.
	              Index++;
	              break;
	            case 123: case 125: case 91: case 93: case 58: case 44:
	              // Parse a punctuator token (`{`, `}`, `[`, `]`, `:`, or `,`) at
	              // the current position.
	              value = charIndexBuggy ? source.charAt(Index) : source[Index];
	              Index++;
	              return value;
	            case 34:
	              // `"` delimits a JSON string; advance to the next character and
	              // begin parsing the string. String tokens are prefixed with the
	              // sentinel `@` character to distinguish them from punctuators and
	              // end-of-string tokens.
	              for (value = "@", Index++; Index < length;) {
	                charCode = source.charCodeAt(Index);
	                if (charCode < 32) {
	                  // Unescaped ASCII control characters (those with a code unit
	                  // less than the space character) are not permitted.
	                  abort();
	                } else if (charCode == 92) {
	                  // A reverse solidus (`\`) marks the beginning of an escaped
	                  // control character (including `"`, `\`, and `/`) or Unicode
	                  // escape sequence.
	                  charCode = source.charCodeAt(++Index);
	                  switch (charCode) {
	                    case 92: case 34: case 47: case 98: case 116: case 110: case 102: case 114:
	                      // Revive escaped control characters.
	                      value += Unescapes[charCode];
	                      Index++;
	                      break;
	                    case 117:
	                      // `\u` marks the beginning of a Unicode escape sequence.
	                      // Advance to the first character and validate the
	                      // four-digit code point.
	                      begin = ++Index;
	                      for (position = Index + 4; Index < position; Index++) {
	                        charCode = source.charCodeAt(Index);
	                        // A valid sequence comprises four hexdigits (case-
	                        // insensitive) that form a single hexadecimal value.
	                        if (!(charCode >= 48 && charCode <= 57 || charCode >= 97 && charCode <= 102 || charCode >= 65 && charCode <= 70)) {
	                          // Invalid Unicode escape sequence.
	                          abort();
	                        }
	                      }
	                      // Revive the escaped character.
	                      value += fromCharCode("0x" + source.slice(begin, Index));
	                      break;
	                    default:
	                      // Invalid escape sequence.
	                      abort();
	                  }
	                } else {
	                  if (charCode == 34) {
	                    // An unescaped double-quote character marks the end of the
	                    // string.
	                    break;
	                  }
	                  charCode = source.charCodeAt(Index);
	                  begin = Index;
	                  // Optimize for the common case where a string is valid.
	                  while (charCode >= 32 && charCode != 92 && charCode != 34) {
	                    charCode = source.charCodeAt(++Index);
	                  }
	                  // Append the string as-is.
	                  value += source.slice(begin, Index);
	                }
	              }
	              if (source.charCodeAt(Index) == 34) {
	                // Advance to the next character and return the revived string.
	                Index++;
	                return value;
	              }
	              // Unterminated string.
	              abort();
	            default:
	              // Parse numbers and literals.
	              begin = Index;
	              // Advance past the negative sign, if one is specified.
	              if (charCode == 45) {
	                isSigned = true;
	                charCode = source.charCodeAt(++Index);
	              }
	              // Parse an integer or floating-point value.
	              if (charCode >= 48 && charCode <= 57) {
	                // Leading zeroes are interpreted as octal literals.
	                if (charCode == 48 && ((charCode = source.charCodeAt(Index + 1)), charCode >= 48 && charCode <= 57)) {
	                  // Illegal octal literal.
	                  abort();
	                }
	                isSigned = false;
	                // Parse the integer component.
	                for (; Index < length && ((charCode = source.charCodeAt(Index)), charCode >= 48 && charCode <= 57); Index++);
	                // Floats cannot contain a leading decimal point; however, this
	                // case is already accounted for by the parser.
	                if (source.charCodeAt(Index) == 46) {
	                  position = ++Index;
	                  // Parse the decimal component.
	                  for (; position < length && ((charCode = source.charCodeAt(position)), charCode >= 48 && charCode <= 57); position++);
	                  if (position == Index) {
	                    // Illegal trailing decimal.
	                    abort();
	                  }
	                  Index = position;
	                }
	                // Parse exponents. The `e` denoting the exponent is
	                // case-insensitive.
	                charCode = source.charCodeAt(Index);
	                if (charCode == 101 || charCode == 69) {
	                  charCode = source.charCodeAt(++Index);
	                  // Skip past the sign following the exponent, if one is
	                  // specified.
	                  if (charCode == 43 || charCode == 45) {
	                    Index++;
	                  }
	                  // Parse the exponential component.
	                  for (position = Index; position < length && ((charCode = source.charCodeAt(position)), charCode >= 48 && charCode <= 57); position++);
	                  if (position == Index) {
	                    // Illegal empty exponent.
	                    abort();
	                  }
	                  Index = position;
	                }
	                // Coerce the parsed value to a JavaScript number.
	                return +source.slice(begin, Index);
	              }
	              // A negative sign may only precede numbers.
	              if (isSigned) {
	                abort();
	              }
	              // `true`, `false`, and `null` literals.
	              if (source.slice(Index, Index + 4) == "true") {
	                Index += 4;
	                return true;
	              } else if (source.slice(Index, Index + 5) == "false") {
	                Index += 5;
	                return false;
	              } else if (source.slice(Index, Index + 4) == "null") {
	                Index += 4;
	                return null;
	              }
	              // Unrecognized token.
	              abort();
	          }
	        }
	        // Return the sentinel `$` character if the parser has reached the end
	        // of the source string.
	        return "$";
	      };

	      // Internal: Parses a JSON `value` token.
	      var get = function (value) {
	        var results, hasMembers;
	        if (value == "$") {
	          // Unexpected end of input.
	          abort();
	        }
	        if (typeof value == "string") {
	          if ((charIndexBuggy ? value.charAt(0) : value[0]) == "@") {
	            // Remove the sentinel `@` character.
	            return value.slice(1);
	          }
	          // Parse object and array literals.
	          if (value == "[") {
	            // Parses a JSON array, returning a new JavaScript array.
	            results = [];
	            for (;; hasMembers || (hasMembers = true)) {
	              value = lex();
	              // A closing square bracket marks the end of the array literal.
	              if (value == "]") {
	                break;
	              }
	              // If the array literal contains elements, the current token
	              // should be a comma separating the previous element from the
	              // next.
	              if (hasMembers) {
	                if (value == ",") {
	                  value = lex();
	                  if (value == "]") {
	                    // Unexpected trailing `,` in array literal.
	                    abort();
	                  }
	                } else {
	                  // A `,` must separate each array element.
	                  abort();
	                }
	              }
	              // Elisions and leading commas are not permitted.
	              if (value == ",") {
	                abort();
	              }
	              results.push(get(value));
	            }
	            return results;
	          } else if (value == "{") {
	            // Parses a JSON object, returning a new JavaScript object.
	            results = {};
	            for (;; hasMembers || (hasMembers = true)) {
	              value = lex();
	              // A closing curly brace marks the end of the object literal.
	              if (value == "}") {
	                break;
	              }
	              // If the object literal contains members, the current token
	              // should be a comma separator.
	              if (hasMembers) {
	                if (value == ",") {
	                  value = lex();
	                  if (value == "}") {
	                    // Unexpected trailing `,` in object literal.
	                    abort();
	                  }
	                } else {
	                  // A `,` must separate each object member.
	                  abort();
	                }
	              }
	              // Leading commas are not permitted, object property names must be
	              // double-quoted strings, and a `:` must separate each property
	              // name and value.
	              if (value == "," || typeof value != "string" || (charIndexBuggy ? value.charAt(0) : value[0]) != "@" || lex() != ":") {
	                abort();
	              }
	              results[value.slice(1)] = get(lex());
	            }
	            return results;
	          }
	          // Unexpected token encountered.
	          abort();
	        }
	        return value;
	      };

	      // Internal: Updates a traversed object member.
	      var update = function(source, property, callback) {
	        var element = walk(source, property, callback);
	        if (element === undef) {
	          delete source[property];
	        } else {
	          source[property] = element;
	        }
	      };

	      // Internal: Recursively traverses a parsed JSON object, invoking the
	      // `callback` function for each value. This is an implementation of the
	      // `Walk(holder, name)` operation defined in ES 5.1 section 15.12.2.
	      var walk = function (source, property, callback) {
	        var value = source[property], length;
	        if (typeof value == "object" && value) {
	          // `forEach` can't be used to traverse an array in Opera <= 8.54
	          // because its `Object#hasOwnProperty` implementation returns `false`
	          // for array indices (e.g., `![1, 2, 3].hasOwnProperty("0")`).
	          if (getClass.call(value) == arrayClass) {
	            for (length = value.length; length--;) {
	              update(value, length, callback);
	            }
	          } else {
	            forEach(value, function (property) {
	              update(value, property, callback);
	            });
	          }
	        }
	        return callback.call(source, property, value);
	      };

	      // Public: `JSON.parse`. See ES 5.1 section 15.12.2.
	      JSON3.parse = function (source, callback) {
	        var result, value;
	        Index = 0;
	        Source = "" + source;
	        result = get(lex());
	        // If a JSON string contains multiple tokens, it is invalid.
	        if (lex() != "$") {
	          abort();
	        }
	        // Reset the parser state.
	        Index = Source = null;
	        return callback && getClass.call(callback) == functionClass ? walk((value = {}, value[""] = result, value), "", callback) : result;
	      };
	    }
	  }

	  // Export for asynchronous module loaders.
	  if (isLoader) {
	    !(__WEBPACK_AMD_DEFINE_RESULT__ = function () {
	      return JSON3;
	    }.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	  }
	}(this));


/***/ },
/* 9 */
/***/ function(module, exports) {

	/* WEBPACK VAR INJECTION */(function(__webpack_amd_options__) {module.exports = __webpack_amd_options__;

	/* WEBPACK VAR INJECTION */}.call(exports, {}))

/***/ },
/* 10 */
/***/ function(module, exports) {

	module.exports = Array.isArray || function (arr) {
	  return Object.prototype.toString.call(arr) == '[object Array]';
	};


/***/ },
/* 11 */
/***/ function(module, exports) {

	
	/**
	 * Expose `Emitter`.
	 */

	module.exports = Emitter;

	/**
	 * Initialize a new `Emitter`.
	 *
	 * @api public
	 */

	function Emitter(obj) {
	  if (obj) return mixin(obj);
	};

	/**
	 * Mixin the emitter properties.
	 *
	 * @param {Object} obj
	 * @return {Object}
	 * @api private
	 */

	function mixin(obj) {
	  for (var key in Emitter.prototype) {
	    obj[key] = Emitter.prototype[key];
	  }
	  return obj;
	}

	/**
	 * Listen on the given `event` with `fn`.
	 *
	 * @param {String} event
	 * @param {Function} fn
	 * @return {Emitter}
	 * @api public
	 */

	Emitter.prototype.on =
	Emitter.prototype.addEventListener = function(event, fn){
	  this._callbacks = this._callbacks || {};
	  (this._callbacks[event] = this._callbacks[event] || [])
	    .push(fn);
	  return this;
	};

	/**
	 * Adds an `event` listener that will be invoked a single
	 * time then automatically removed.
	 *
	 * @param {String} event
	 * @param {Function} fn
	 * @return {Emitter}
	 * @api public
	 */

	Emitter.prototype.once = function(event, fn){
	  var self = this;
	  this._callbacks = this._callbacks || {};

	  function on() {
	    self.off(event, on);
	    fn.apply(this, arguments);
	  }

	  on.fn = fn;
	  this.on(event, on);
	  return this;
	};

	/**
	 * Remove the given callback for `event` or all
	 * registered callbacks.
	 *
	 * @param {String} event
	 * @param {Function} fn
	 * @return {Emitter}
	 * @api public
	 */

	Emitter.prototype.off =
	Emitter.prototype.removeListener =
	Emitter.prototype.removeAllListeners =
	Emitter.prototype.removeEventListener = function(event, fn){
	  this._callbacks = this._callbacks || {};

	  // all
	  if (0 == arguments.length) {
	    this._callbacks = {};
	    return this;
	  }

	  // specific event
	  var callbacks = this._callbacks[event];
	  if (!callbacks) return this;

	  // remove all handlers
	  if (1 == arguments.length) {
	    delete this._callbacks[event];
	    return this;
	  }

	  // remove specific handler
	  var cb;
	  for (var i = 0; i < callbacks.length; i++) {
	    cb = callbacks[i];
	    if (cb === fn || cb.fn === fn) {
	      callbacks.splice(i, 1);
	      break;
	    }
	  }
	  return this;
	};

	/**
	 * Emit `event` with the given args.
	 *
	 * @param {String} event
	 * @param {Mixed} ...
	 * @return {Emitter}
	 */

	Emitter.prototype.emit = function(event){
	  this._callbacks = this._callbacks || {};
	  var args = [].slice.call(arguments, 1)
	    , callbacks = this._callbacks[event];

	  if (callbacks) {
	    callbacks = callbacks.slice(0);
	    for (var i = 0, len = callbacks.length; i < len; ++i) {
	      callbacks[i].apply(this, args);
	    }
	  }

	  return this;
	};

	/**
	 * Return array of callbacks for `event`.
	 *
	 * @param {String} event
	 * @return {Array}
	 * @api public
	 */

	Emitter.prototype.listeners = function(event){
	  this._callbacks = this._callbacks || {};
	  return this._callbacks[event] || [];
	};

	/**
	 * Check if this emitter has `event` handlers.
	 *
	 * @param {String} event
	 * @return {Boolean}
	 * @api public
	 */

	Emitter.prototype.hasListeners = function(event){
	  return !! this.listeners(event).length;
	};


/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global) {/*global Blob,File*/

	/**
	 * Module requirements
	 */

	var isArray = __webpack_require__(10);
	var isBuf = __webpack_require__(13);

	/**
	 * Replaces every Buffer | ArrayBuffer in packet with a numbered placeholder.
	 * Anything with blobs or files should be fed through removeBlobs before coming
	 * here.
	 *
	 * @param {Object} packet - socket.io event packet
	 * @return {Object} with deconstructed packet and list of buffers
	 * @api public
	 */

	exports.deconstructPacket = function(packet){
	  var buffers = [];
	  var packetData = packet.data;

	  function _deconstructPacket(data) {
	    if (!data) return data;

	    if (isBuf(data)) {
	      var placeholder = { _placeholder: true, num: buffers.length };
	      buffers.push(data);
	      return placeholder;
	    } else if (isArray(data)) {
	      var newData = new Array(data.length);
	      for (var i = 0; i < data.length; i++) {
	        newData[i] = _deconstructPacket(data[i]);
	      }
	      return newData;
	    } else if ('object' == typeof data && !(data instanceof Date)) {
	      var newData = {};
	      for (var key in data) {
	        newData[key] = _deconstructPacket(data[key]);
	      }
	      return newData;
	    }
	    return data;
	  }

	  var pack = packet;
	  pack.data = _deconstructPacket(packetData);
	  pack.attachments = buffers.length; // number of binary 'attachments'
	  return {packet: pack, buffers: buffers};
	};

	/**
	 * Reconstructs a binary packet from its placeholder packet and buffers
	 *
	 * @param {Object} packet - event packet with placeholders
	 * @param {Array} buffers - binary buffers to put in placeholder positions
	 * @return {Object} reconstructed packet
	 * @api public
	 */

	exports.reconstructPacket = function(packet, buffers) {
	  var curPlaceHolder = 0;

	  function _reconstructPacket(data) {
	    if (data && data._placeholder) {
	      var buf = buffers[data.num]; // appropriate buffer (should be natural order anyway)
	      return buf;
	    } else if (isArray(data)) {
	      for (var i = 0; i < data.length; i++) {
	        data[i] = _reconstructPacket(data[i]);
	      }
	      return data;
	    } else if (data && 'object' == typeof data) {
	      for (var key in data) {
	        data[key] = _reconstructPacket(data[key]);
	      }
	      return data;
	    }
	    return data;
	  }

	  packet.data = _reconstructPacket(packet.data);
	  packet.attachments = undefined; // no longer useful
	  return packet;
	};

	/**
	 * Asynchronously removes Blobs or Files from data via
	 * FileReader's readAsArrayBuffer method. Used before encoding
	 * data as msgpack. Calls callback with the blobless data.
	 *
	 * @param {Object} data
	 * @param {Function} callback
	 * @api private
	 */

	exports.removeBlobs = function(data, callback) {
	  function _removeBlobs(obj, curKey, containingObject) {
	    if (!obj) return obj;

	    // convert any blob
	    if ((global.Blob && obj instanceof Blob) ||
	        (global.File && obj instanceof File)) {
	      pendingBlobs++;

	      // async filereader
	      var fileReader = new FileReader();
	      fileReader.onload = function() { // this.result == arraybuffer
	        if (containingObject) {
	          containingObject[curKey] = this.result;
	        }
	        else {
	          bloblessData = this.result;
	        }

	        // if nothing pending its callback time
	        if(! --pendingBlobs) {
	          callback(bloblessData);
	        }
	      };

	      fileReader.readAsArrayBuffer(obj); // blob -> arraybuffer
	    } else if (isArray(obj)) { // handle array
	      for (var i = 0; i < obj.length; i++) {
	        _removeBlobs(obj[i], i, obj);
	      }
	    } else if (obj && 'object' == typeof obj && !isBuf(obj)) { // and object
	      for (var key in obj) {
	        _removeBlobs(obj[key], key, obj);
	      }
	    }
	  }

	  var pendingBlobs = 0;
	  var bloblessData = data;
	  _removeBlobs(bloblessData);
	  if (!pendingBlobs) {
	    callback(bloblessData);
	  }
	};

	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },
/* 13 */
/***/ function(module, exports) {

	/* WEBPACK VAR INJECTION */(function(global) {
	module.exports = isBuf;

	/**
	 * Returns true if obj is a buffer or an arraybuffer.
	 *
	 * @api private
	 */

	function isBuf(obj) {
	  return (global.Buffer && global.Buffer.isBuffer(obj)) ||
	         (global.ArrayBuffer && obj instanceof ArrayBuffer);
	}

	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },
/* 14 */
/***/ function(module, exports, __webpack_require__) {

	
	/**
	 * Module dependencies.
	 */

	var url = __webpack_require__(4);
	var eio = __webpack_require__(15);
	var Socket = __webpack_require__(46);
	var Emitter = __webpack_require__(11);
	var parser = __webpack_require__(7);
	var on = __webpack_require__(48);
	var bind = __webpack_require__(49);
	var object = __webpack_require__(50);
	var debug = __webpack_require__(6)('socket.io-client:manager');
	var indexOf = __webpack_require__(43);
	var Backoff = __webpack_require__(51);

	/**
	 * Module exports
	 */

	module.exports = Manager;

	/**
	 * `Manager` constructor.
	 *
	 * @param {String} engine instance or engine uri/opts
	 * @param {Object} options
	 * @api public
	 */

	function Manager(uri, opts){
	  if (!(this instanceof Manager)) return new Manager(uri, opts);
	  if (uri && ('object' == typeof uri)) {
	    opts = uri;
	    uri = undefined;
	  }
	  opts = opts || {};

	  opts.path = opts.path || '/socket.io';
	  this.nsps = {};
	  this.subs = [];
	  this.opts = opts;
	  this.reconnection(opts.reconnection !== false);
	  this.reconnectionAttempts(opts.reconnectionAttempts || Infinity);
	  this.reconnectionDelay(opts.reconnectionDelay || 1000);
	  this.reconnectionDelayMax(opts.reconnectionDelayMax || 5000);
	  this.randomizationFactor(opts.randomizationFactor || 0.5);
	  this.backoff = new Backoff({
	    min: this.reconnectionDelay(),
	    max: this.reconnectionDelayMax(),
	    jitter: this.randomizationFactor()
	  });
	  this.timeout(null == opts.timeout ? 20000 : opts.timeout);
	  this.readyState = 'closed';
	  this.uri = uri;
	  this.connected = [];
	  this.encoding = false;
	  this.packetBuffer = [];
	  this.encoder = new parser.Encoder();
	  this.decoder = new parser.Decoder();
	  this.autoConnect = opts.autoConnect !== false;
	  if (this.autoConnect) this.open();
	}

	/**
	 * Propagate given event to sockets and emit on `this`
	 *
	 * @api private
	 */

	Manager.prototype.emitAll = function() {
	  this.emit.apply(this, arguments);
	  for (var nsp in this.nsps) {
	    this.nsps[nsp].emit.apply(this.nsps[nsp], arguments);
	  }
	};

	/**
	 * Update `socket.id` of all sockets
	 *
	 * @api private
	 */

	Manager.prototype.updateSocketIds = function(){
	  for (var nsp in this.nsps) {
	    this.nsps[nsp].id = this.engine.id;
	  }
	};

	/**
	 * Mix in `Emitter`.
	 */

	Emitter(Manager.prototype);

	/**
	 * Sets the `reconnection` config.
	 *
	 * @param {Boolean} true/false if it should automatically reconnect
	 * @return {Manager} self or value
	 * @api public
	 */

	Manager.prototype.reconnection = function(v){
	  if (!arguments.length) return this._reconnection;
	  this._reconnection = !!v;
	  return this;
	};

	/**
	 * Sets the reconnection attempts config.
	 *
	 * @param {Number} max reconnection attempts before giving up
	 * @return {Manager} self or value
	 * @api public
	 */

	Manager.prototype.reconnectionAttempts = function(v){
	  if (!arguments.length) return this._reconnectionAttempts;
	  this._reconnectionAttempts = v;
	  return this;
	};

	/**
	 * Sets the delay between reconnections.
	 *
	 * @param {Number} delay
	 * @return {Manager} self or value
	 * @api public
	 */

	Manager.prototype.reconnectionDelay = function(v){
	  if (!arguments.length) return this._reconnectionDelay;
	  this._reconnectionDelay = v;
	  this.backoff && this.backoff.setMin(v);
	  return this;
	};

	Manager.prototype.randomizationFactor = function(v){
	  if (!arguments.length) return this._randomizationFactor;
	  this._randomizationFactor = v;
	  this.backoff && this.backoff.setJitter(v);
	  return this;
	};

	/**
	 * Sets the maximum delay between reconnections.
	 *
	 * @param {Number} delay
	 * @return {Manager} self or value
	 * @api public
	 */

	Manager.prototype.reconnectionDelayMax = function(v){
	  if (!arguments.length) return this._reconnectionDelayMax;
	  this._reconnectionDelayMax = v;
	  this.backoff && this.backoff.setMax(v);
	  return this;
	};

	/**
	 * Sets the connection timeout. `false` to disable
	 *
	 * @return {Manager} self or value
	 * @api public
	 */

	Manager.prototype.timeout = function(v){
	  if (!arguments.length) return this._timeout;
	  this._timeout = v;
	  return this;
	};

	/**
	 * Starts trying to reconnect if reconnection is enabled and we have not
	 * started reconnecting yet
	 *
	 * @api private
	 */

	Manager.prototype.maybeReconnectOnOpen = function() {
	  // Only try to reconnect if it's the first time we're connecting
	  if (!this.reconnecting && this._reconnection && this.backoff.attempts === 0) {
	    // keeps reconnection from firing twice for the same reconnection loop
	    this.reconnect();
	  }
	};


	/**
	 * Sets the current transport `socket`.
	 *
	 * @param {Function} optional, callback
	 * @return {Manager} self
	 * @api public
	 */

	Manager.prototype.open =
	Manager.prototype.connect = function(fn){
	  debug('readyState %s', this.readyState);
	  if (~this.readyState.indexOf('open')) return this;

	  debug('opening %s', this.uri);
	  this.engine = eio(this.uri, this.opts);
	  var socket = this.engine;
	  var self = this;
	  this.readyState = 'opening';
	  this.skipReconnect = false;

	  // emit `open`
	  var openSub = on(socket, 'open', function() {
	    self.onopen();
	    fn && fn();
	  });

	  // emit `connect_error`
	  var errorSub = on(socket, 'error', function(data){
	    debug('connect_error');
	    self.cleanup();
	    self.readyState = 'closed';
	    self.emitAll('connect_error', data);
	    if (fn) {
	      var err = new Error('Connection error');
	      err.data = data;
	      fn(err);
	    } else {
	      // Only do this if there is no fn to handle the error
	      self.maybeReconnectOnOpen();
	    }
	  });

	  // emit `connect_timeout`
	  if (false !== this._timeout) {
	    var timeout = this._timeout;
	    debug('connect attempt will timeout after %d', timeout);

	    // set timer
	    var timer = setTimeout(function(){
	      debug('connect attempt timed out after %d', timeout);
	      openSub.destroy();
	      socket.close();
	      socket.emit('error', 'timeout');
	      self.emitAll('connect_timeout', timeout);
	    }, timeout);

	    this.subs.push({
	      destroy: function(){
	        clearTimeout(timer);
	      }
	    });
	  }

	  this.subs.push(openSub);
	  this.subs.push(errorSub);

	  return this;
	};

	/**
	 * Called upon transport open.
	 *
	 * @api private
	 */

	Manager.prototype.onopen = function(){
	  debug('open');

	  // clear old subs
	  this.cleanup();

	  // mark as open
	  this.readyState = 'open';
	  this.emit('open');

	  // add new subs
	  var socket = this.engine;
	  this.subs.push(on(socket, 'data', bind(this, 'ondata')));
	  this.subs.push(on(this.decoder, 'decoded', bind(this, 'ondecoded')));
	  this.subs.push(on(socket, 'error', bind(this, 'onerror')));
	  this.subs.push(on(socket, 'close', bind(this, 'onclose')));
	};

	/**
	 * Called with data.
	 *
	 * @api private
	 */

	Manager.prototype.ondata = function(data){
	  this.decoder.add(data);
	};

	/**
	 * Called when parser fully decodes a packet.
	 *
	 * @api private
	 */

	Manager.prototype.ondecoded = function(packet) {
	  this.emit('packet', packet);
	};

	/**
	 * Called upon socket error.
	 *
	 * @api private
	 */

	Manager.prototype.onerror = function(err){
	  debug('error', err);
	  this.emitAll('error', err);
	};

	/**
	 * Creates a new socket for the given `nsp`.
	 *
	 * @return {Socket}
	 * @api public
	 */

	Manager.prototype.socket = function(nsp){
	  var socket = this.nsps[nsp];
	  if (!socket) {
	    socket = new Socket(this, nsp);
	    this.nsps[nsp] = socket;
	    var self = this;
	    socket.on('connect', function(){
	      socket.id = self.engine.id;
	      if (!~indexOf(self.connected, socket)) {
	        self.connected.push(socket);
	      }
	    });
	  }
	  return socket;
	};

	/**
	 * Called upon a socket close.
	 *
	 * @param {Socket} socket
	 */

	Manager.prototype.destroy = function(socket){
	  var index = indexOf(this.connected, socket);
	  if (~index) this.connected.splice(index, 1);
	  if (this.connected.length) return;

	  this.close();
	};

	/**
	 * Writes a packet.
	 *
	 * @param {Object} packet
	 * @api private
	 */

	Manager.prototype.packet = function(packet){
	  debug('writing packet %j', packet);
	  var self = this;

	  if (!self.encoding) {
	    // encode, then write to engine with result
	    self.encoding = true;
	    this.encoder.encode(packet, function(encodedPackets) {
	      for (var i = 0; i < encodedPackets.length; i++) {
	        self.engine.write(encodedPackets[i]);
	      }
	      self.encoding = false;
	      self.processPacketQueue();
	    });
	  } else { // add packet to the queue
	    self.packetBuffer.push(packet);
	  }
	};

	/**
	 * If packet buffer is non-empty, begins encoding the
	 * next packet in line.
	 *
	 * @api private
	 */

	Manager.prototype.processPacketQueue = function() {
	  if (this.packetBuffer.length > 0 && !this.encoding) {
	    var pack = this.packetBuffer.shift();
	    this.packet(pack);
	  }
	};

	/**
	 * Clean up transport subscriptions and packet buffer.
	 *
	 * @api private
	 */

	Manager.prototype.cleanup = function(){
	  var sub;
	  while (sub = this.subs.shift()) sub.destroy();

	  this.packetBuffer = [];
	  this.encoding = false;

	  this.decoder.destroy();
	};

	/**
	 * Close the current socket.
	 *
	 * @api private
	 */

	Manager.prototype.close =
	Manager.prototype.disconnect = function(){
	  this.skipReconnect = true;
	  this.backoff.reset();
	  this.readyState = 'closed';
	  this.engine && this.engine.close();
	};

	/**
	 * Called upon engine close.
	 *
	 * @api private
	 */

	Manager.prototype.onclose = function(reason){
	  debug('close');
	  this.cleanup();
	  this.backoff.reset();
	  this.readyState = 'closed';
	  this.emit('close', reason);
	  if (this._reconnection && !this.skipReconnect) {
	    this.reconnect();
	  }
	};

	/**
	 * Attempt a reconnection.
	 *
	 * @api private
	 */

	Manager.prototype.reconnect = function(){
	  if (this.reconnecting || this.skipReconnect) return this;

	  var self = this;

	  if (this.backoff.attempts >= this._reconnectionAttempts) {
	    debug('reconnect failed');
	    this.backoff.reset();
	    this.emitAll('reconnect_failed');
	    this.reconnecting = false;
	  } else {
	    var delay = this.backoff.duration();
	    debug('will wait %dms before reconnect attempt', delay);

	    this.reconnecting = true;
	    var timer = setTimeout(function(){
	      if (self.skipReconnect) return;

	      debug('attempting reconnect');
	      self.emitAll('reconnect_attempt', self.backoff.attempts);
	      self.emitAll('reconnecting', self.backoff.attempts);

	      // check again for the case socket closed in above events
	      if (self.skipReconnect) return;

	      self.open(function(err){
	        if (err) {
	          debug('reconnect attempt error');
	          self.reconnecting = false;
	          self.reconnect();
	          self.emitAll('reconnect_error', err.data);
	        } else {
	          debug('reconnect success');
	          self.onreconnect();
	        }
	      });
	    }, delay);

	    this.subs.push({
	      destroy: function(){
	        clearTimeout(timer);
	      }
	    });
	  }
	};

	/**
	 * Called upon successful reconnect.
	 *
	 * @api private
	 */

	Manager.prototype.onreconnect = function(){
	  var attempt = this.backoff.attempts;
	  this.reconnecting = false;
	  this.backoff.reset();
	  this.updateSocketIds();
	  this.emitAll('reconnect', attempt);
	};


/***/ },
/* 15 */
/***/ function(module, exports, __webpack_require__) {

	
	module.exports =  __webpack_require__(16);


/***/ },
/* 16 */
/***/ function(module, exports, __webpack_require__) {

	
	module.exports = __webpack_require__(17);

	/**
	 * Exports parser
	 *
	 * @api public
	 *
	 */
	module.exports.parser = __webpack_require__(25);


/***/ },
/* 17 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global) {/**
	 * Module dependencies.
	 */

	var transports = __webpack_require__(18);
	var Emitter = __webpack_require__(11);
	var debug = __webpack_require__(37)('engine.io-client:socket');
	var index = __webpack_require__(43);
	var parser = __webpack_require__(25);
	var parseuri = __webpack_require__(44);
	var parsejson = __webpack_require__(45);
	var parseqs = __webpack_require__(35);

	/**
	 * Module exports.
	 */

	module.exports = Socket;

	/**
	 * Noop function.
	 *
	 * @api private
	 */

	function noop(){}

	/**
	 * Socket constructor.
	 *
	 * @param {String|Object} uri or options
	 * @param {Object} options
	 * @api public
	 */

	function Socket(uri, opts){
	  if (!(this instanceof Socket)) return new Socket(uri, opts);

	  opts = opts || {};

	  if (uri && 'object' == typeof uri) {
	    opts = uri;
	    uri = null;
	  }

	  if (uri) {
	    uri = parseuri(uri);
	    opts.host = uri.host;
	    opts.secure = uri.protocol == 'https' || uri.protocol == 'wss';
	    opts.port = uri.port;
	    if (uri.query) opts.query = uri.query;
	  }

	  this.secure = null != opts.secure ? opts.secure :
	    (global.location && 'https:' == location.protocol);

	  if (opts.host) {
	    var pieces = opts.host.split(':');
	    opts.hostname = pieces.shift();
	    if (pieces.length) {
	      opts.port = pieces.pop();
	    } else if (!opts.port) {
	      // if no port is specified manually, use the protocol default
	      opts.port = this.secure ? '443' : '80';
	    }
	  }

	  this.agent = opts.agent || false;
	  this.hostname = opts.hostname ||
	    (global.location ? location.hostname : 'localhost');
	  this.port = opts.port || (global.location && location.port ?
	       location.port :
	       (this.secure ? 443 : 80));
	  this.query = opts.query || {};
	  if ('string' == typeof this.query) this.query = parseqs.decode(this.query);
	  this.upgrade = false !== opts.upgrade;
	  this.path = (opts.path || '/engine.io').replace(/\/$/, '') + '/';
	  this.forceJSONP = !!opts.forceJSONP;
	  this.jsonp = false !== opts.jsonp;
	  this.forceBase64 = !!opts.forceBase64;
	  this.enablesXDR = !!opts.enablesXDR;
	  this.timestampParam = opts.timestampParam || 't';
	  this.timestampRequests = opts.timestampRequests;
	  this.transports = opts.transports || ['polling', 'websocket'];
	  this.readyState = '';
	  this.writeBuffer = [];
	  this.callbackBuffer = [];
	  this.policyPort = opts.policyPort || 843;
	  this.rememberUpgrade = opts.rememberUpgrade || false;
	  this.binaryType = null;
	  this.onlyBinaryUpgrades = opts.onlyBinaryUpgrades;

	  // SSL options for Node.js client
	  this.pfx = opts.pfx || null;
	  this.key = opts.key || null;
	  this.passphrase = opts.passphrase || null;
	  this.cert = opts.cert || null;
	  this.ca = opts.ca || null;
	  this.ciphers = opts.ciphers || null;
	  this.rejectUnauthorized = opts.rejectUnauthorized || null;

	  this.open();
	}

	Socket.priorWebsocketSuccess = false;

	/**
	 * Mix in `Emitter`.
	 */

	Emitter(Socket.prototype);

	/**
	 * Protocol version.
	 *
	 * @api public
	 */

	Socket.protocol = parser.protocol; // this is an int

	/**
	 * Expose deps for legacy compatibility
	 * and standalone browser access.
	 */

	Socket.Socket = Socket;
	Socket.Transport = __webpack_require__(24);
	Socket.transports = __webpack_require__(18);
	Socket.parser = __webpack_require__(25);

	/**
	 * Creates transport of the given type.
	 *
	 * @param {String} transport name
	 * @return {Transport}
	 * @api private
	 */

	Socket.prototype.createTransport = function (name) {
	  debug('creating transport "%s"', name);
	  var query = clone(this.query);

	  // append engine.io protocol identifier
	  query.EIO = parser.protocol;

	  // transport name
	  query.transport = name;

	  // session id if we already have one
	  if (this.id) query.sid = this.id;

	  var transport = new transports[name]({
	    agent: this.agent,
	    hostname: this.hostname,
	    port: this.port,
	    secure: this.secure,
	    path: this.path,
	    query: query,
	    forceJSONP: this.forceJSONP,
	    jsonp: this.jsonp,
	    forceBase64: this.forceBase64,
	    enablesXDR: this.enablesXDR,
	    timestampRequests: this.timestampRequests,
	    timestampParam: this.timestampParam,
	    policyPort: this.policyPort,
	    socket: this,
	    pfx: this.pfx,
	    key: this.key,
	    passphrase: this.passphrase,
	    cert: this.cert,
	    ca: this.ca,
	    ciphers: this.ciphers,
	    rejectUnauthorized: this.rejectUnauthorized
	  });

	  return transport;
	};

	function clone (obj) {
	  var o = {};
	  for (var i in obj) {
	    if (obj.hasOwnProperty(i)) {
	      o[i] = obj[i];
	    }
	  }
	  return o;
	}

	/**
	 * Initializes transport to use and starts probe.
	 *
	 * @api private
	 */
	Socket.prototype.open = function () {
	  var transport;
	  if (this.rememberUpgrade && Socket.priorWebsocketSuccess && this.transports.indexOf('websocket') != -1) {
	    transport = 'websocket';
	  } else if (0 == this.transports.length) {
	    // Emit error on next tick so it can be listened to
	    var self = this;
	    setTimeout(function() {
	      self.emit('error', 'No transports available');
	    }, 0);
	    return;
	  } else {
	    transport = this.transports[0];
	  }
	  this.readyState = 'opening';

	  // Retry with the next transport if the transport is disabled (jsonp: false)
	  var transport;
	  try {
	    transport = this.createTransport(transport);
	  } catch (e) {
	    this.transports.shift();
	    this.open();
	    return;
	  }

	  transport.open();
	  this.setTransport(transport);
	};

	/**
	 * Sets the current transport. Disables the existing one (if any).
	 *
	 * @api private
	 */

	Socket.prototype.setTransport = function(transport){
	  debug('setting transport %s', transport.name);
	  var self = this;

	  if (this.transport) {
	    debug('clearing existing transport %s', this.transport.name);
	    this.transport.removeAllListeners();
	  }

	  // set up transport
	  this.transport = transport;

	  // set up transport listeners
	  transport
	  .on('drain', function(){
	    self.onDrain();
	  })
	  .on('packet', function(packet){
	    self.onPacket(packet);
	  })
	  .on('error', function(e){
	    self.onError(e);
	  })
	  .on('close', function(){
	    self.onClose('transport close');
	  });
	};

	/**
	 * Probes a transport.
	 *
	 * @param {String} transport name
	 * @api private
	 */

	Socket.prototype.probe = function (name) {
	  debug('probing transport "%s"', name);
	  var transport = this.createTransport(name, { probe: 1 })
	    , failed = false
	    , self = this;

	  Socket.priorWebsocketSuccess = false;

	  function onTransportOpen(){
	    if (self.onlyBinaryUpgrades) {
	      var upgradeLosesBinary = !this.supportsBinary && self.transport.supportsBinary;
	      failed = failed || upgradeLosesBinary;
	    }
	    if (failed) return;

	    debug('probe transport "%s" opened', name);
	    transport.send([{ type: 'ping', data: 'probe' }]);
	    transport.once('packet', function (msg) {
	      if (failed) return;
	      if ('pong' == msg.type && 'probe' == msg.data) {
	        debug('probe transport "%s" pong', name);
	        self.upgrading = true;
	        self.emit('upgrading', transport);
	        if (!transport) return;
	        Socket.priorWebsocketSuccess = 'websocket' == transport.name;

	        debug('pausing current transport "%s"', self.transport.name);
	        self.transport.pause(function () {
	          if (failed) return;
	          if ('closed' == self.readyState) return;
	          debug('changing transport and sending upgrade packet');

	          cleanup();

	          self.setTransport(transport);
	          transport.send([{ type: 'upgrade' }]);
	          self.emit('upgrade', transport);
	          transport = null;
	          self.upgrading = false;
	          self.flush();
	        });
	      } else {
	        debug('probe transport "%s" failed', name);
	        var err = new Error('probe error');
	        err.transport = transport.name;
	        self.emit('upgradeError', err);
	      }
	    });
	  }

	  function freezeTransport() {
	    if (failed) return;

	    // Any callback called by transport should be ignored since now
	    failed = true;

	    cleanup();

	    transport.close();
	    transport = null;
	  }

	  //Handle any error that happens while probing
	  function onerror(err) {
	    var error = new Error('probe error: ' + err);
	    error.transport = transport.name;

	    freezeTransport();

	    debug('probe transport "%s" failed because of error: %s', name, err);

	    self.emit('upgradeError', error);
	  }

	  function onTransportClose(){
	    onerror("transport closed");
	  }

	  //When the socket is closed while we're probing
	  function onclose(){
	    onerror("socket closed");
	  }

	  //When the socket is upgraded while we're probing
	  function onupgrade(to){
	    if (transport && to.name != transport.name) {
	      debug('"%s" works - aborting "%s"', to.name, transport.name);
	      freezeTransport();
	    }
	  }

	  //Remove all listeners on the transport and on self
	  function cleanup(){
	    transport.removeListener('open', onTransportOpen);
	    transport.removeListener('error', onerror);
	    transport.removeListener('close', onTransportClose);
	    self.removeListener('close', onclose);
	    self.removeListener('upgrading', onupgrade);
	  }

	  transport.once('open', onTransportOpen);
	  transport.once('error', onerror);
	  transport.once('close', onTransportClose);

	  this.once('close', onclose);
	  this.once('upgrading', onupgrade);

	  transport.open();

	};

	/**
	 * Called when connection is deemed open.
	 *
	 * @api public
	 */

	Socket.prototype.onOpen = function () {
	  debug('socket open');
	  this.readyState = 'open';
	  Socket.priorWebsocketSuccess = 'websocket' == this.transport.name;
	  this.emit('open');
	  this.flush();

	  // we check for `readyState` in case an `open`
	  // listener already closed the socket
	  if ('open' == this.readyState && this.upgrade && this.transport.pause) {
	    debug('starting upgrade probes');
	    for (var i = 0, l = this.upgrades.length; i < l; i++) {
	      this.probe(this.upgrades[i]);
	    }
	  }
	};

	/**
	 * Handles a packet.
	 *
	 * @api private
	 */

	Socket.prototype.onPacket = function (packet) {
	  if ('opening' == this.readyState || 'open' == this.readyState) {
	    debug('socket receive: type "%s", data "%s"', packet.type, packet.data);

	    this.emit('packet', packet);

	    // Socket is live - any packet counts
	    this.emit('heartbeat');

	    switch (packet.type) {
	      case 'open':
	        this.onHandshake(parsejson(packet.data));
	        break;

	      case 'pong':
	        this.setPing();
	        break;

	      case 'error':
	        var err = new Error('server error');
	        err.code = packet.data;
	        this.emit('error', err);
	        break;

	      case 'message':
	        this.emit('data', packet.data);
	        this.emit('message', packet.data);
	        break;
	    }
	  } else {
	    debug('packet received with socket readyState "%s"', this.readyState);
	  }
	};

	/**
	 * Called upon handshake completion.
	 *
	 * @param {Object} handshake obj
	 * @api private
	 */

	Socket.prototype.onHandshake = function (data) {
	  this.emit('handshake', data);
	  this.id = data.sid;
	  this.transport.query.sid = data.sid;
	  this.upgrades = this.filterUpgrades(data.upgrades);
	  this.pingInterval = data.pingInterval;
	  this.pingTimeout = data.pingTimeout;
	  this.onOpen();
	  // In case open handler closes socket
	  if  ('closed' == this.readyState) return;
	  this.setPing();

	  // Prolong liveness of socket on heartbeat
	  this.removeListener('heartbeat', this.onHeartbeat);
	  this.on('heartbeat', this.onHeartbeat);
	};

	/**
	 * Resets ping timeout.
	 *
	 * @api private
	 */

	Socket.prototype.onHeartbeat = function (timeout) {
	  clearTimeout(this.pingTimeoutTimer);
	  var self = this;
	  self.pingTimeoutTimer = setTimeout(function () {
	    if ('closed' == self.readyState) return;
	    self.onClose('ping timeout');
	  }, timeout || (self.pingInterval + self.pingTimeout));
	};

	/**
	 * Pings server every `this.pingInterval` and expects response
	 * within `this.pingTimeout` or closes connection.
	 *
	 * @api private
	 */

	Socket.prototype.setPing = function () {
	  var self = this;
	  clearTimeout(self.pingIntervalTimer);
	  self.pingIntervalTimer = setTimeout(function () {
	    debug('writing ping packet - expecting pong within %sms', self.pingTimeout);
	    self.ping();
	    self.onHeartbeat(self.pingTimeout);
	  }, self.pingInterval);
	};

	/**
	* Sends a ping packet.
	*
	* @api public
	*/

	Socket.prototype.ping = function () {
	  this.sendPacket('ping');
	};

	/**
	 * Called on `drain` event
	 *
	 * @api private
	 */

	Socket.prototype.onDrain = function() {
	  for (var i = 0; i < this.prevBufferLen; i++) {
	    if (this.callbackBuffer[i]) {
	      this.callbackBuffer[i]();
	    }
	  }

	  this.writeBuffer.splice(0, this.prevBufferLen);
	  this.callbackBuffer.splice(0, this.prevBufferLen);

	  // setting prevBufferLen = 0 is very important
	  // for example, when upgrading, upgrade packet is sent over,
	  // and a nonzero prevBufferLen could cause problems on `drain`
	  this.prevBufferLen = 0;

	  if (this.writeBuffer.length == 0) {
	    this.emit('drain');
	  } else {
	    this.flush();
	  }
	};

	/**
	 * Flush write buffers.
	 *
	 * @api private
	 */

	Socket.prototype.flush = function () {
	  if ('closed' != this.readyState && this.transport.writable &&
	    !this.upgrading && this.writeBuffer.length) {
	    debug('flushing %d packets in socket', this.writeBuffer.length);
	    this.transport.send(this.writeBuffer);
	    // keep track of current length of writeBuffer
	    // splice writeBuffer and callbackBuffer on `drain`
	    this.prevBufferLen = this.writeBuffer.length;
	    this.emit('flush');
	  }
	};

	/**
	 * Sends a message.
	 *
	 * @param {String} message.
	 * @param {Function} callback function.
	 * @return {Socket} for chaining.
	 * @api public
	 */

	Socket.prototype.write =
	Socket.prototype.send = function (msg, fn) {
	  this.sendPacket('message', msg, fn);
	  return this;
	};

	/**
	 * Sends a packet.
	 *
	 * @param {String} packet type.
	 * @param {String} data.
	 * @param {Function} callback function.
	 * @api private
	 */

	Socket.prototype.sendPacket = function (type, data, fn) {
	  if ('closing' == this.readyState || 'closed' == this.readyState) {
	    return;
	  }

	  var packet = { type: type, data: data };
	  this.emit('packetCreate', packet);
	  this.writeBuffer.push(packet);
	  this.callbackBuffer.push(fn);
	  this.flush();
	};

	/**
	 * Closes the connection.
	 *
	 * @api private
	 */

	Socket.prototype.close = function () {
	  if ('opening' == this.readyState || 'open' == this.readyState) {
	    this.readyState = 'closing';

	    var self = this;

	    function close() {
	      self.onClose('forced close');
	      debug('socket closing - telling transport to close');
	      self.transport.close();
	    }

	    function cleanupAndClose() {
	      self.removeListener('upgrade', cleanupAndClose);
	      self.removeListener('upgradeError', cleanupAndClose);
	      close();
	    }

	    function waitForUpgrade() {
	      // wait for upgrade to finish since we can't send packets while pausing a transport
	      self.once('upgrade', cleanupAndClose);
	      self.once('upgradeError', cleanupAndClose);
	    }

	    if (this.writeBuffer.length) {
	      this.once('drain', function() {
	        if (this.upgrading) {
	          waitForUpgrade();
	        } else {
	          close();
	        }
	      });
	    } else if (this.upgrading) {
	      waitForUpgrade();
	    } else {
	      close();
	    }
	  }

	  return this;
	};

	/**
	 * Called upon transport error
	 *
	 * @api private
	 */

	Socket.prototype.onError = function (err) {
	  debug('socket error %j', err);
	  Socket.priorWebsocketSuccess = false;
	  this.emit('error', err);
	  this.onClose('transport error', err);
	};

	/**
	 * Called upon transport close.
	 *
	 * @api private
	 */

	Socket.prototype.onClose = function (reason, desc) {
	  if ('opening' == this.readyState || 'open' == this.readyState || 'closing' == this.readyState) {
	    debug('socket close with reason: "%s"', reason);
	    var self = this;

	    // clear timers
	    clearTimeout(this.pingIntervalTimer);
	    clearTimeout(this.pingTimeoutTimer);

	    // clean buffers in next tick, so developers can still
	    // grab the buffers on `close` event
	    setTimeout(function() {
	      self.writeBuffer = [];
	      self.callbackBuffer = [];
	      self.prevBufferLen = 0;
	    }, 0);

	    // stop event from firing again for transport
	    this.transport.removeAllListeners('close');

	    // ensure transport won't stay open
	    this.transport.close();

	    // ignore further transport communication
	    this.transport.removeAllListeners();

	    // set ready state
	    this.readyState = 'closed';

	    // clear session id
	    this.id = null;

	    // emit close event
	    this.emit('close', reason, desc);
	  }
	};

	/**
	 * Filters upgrades, returning only those matching client transports.
	 *
	 * @param {Array} server upgrades
	 * @api private
	 *
	 */

	Socket.prototype.filterUpgrades = function (upgrades) {
	  var filteredUpgrades = [];
	  for (var i = 0, j = upgrades.length; i<j; i++) {
	    if (~index(this.transports, upgrades[i])) filteredUpgrades.push(upgrades[i]);
	  }
	  return filteredUpgrades;
	};

	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },
/* 18 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global) {/**
	 * Module dependencies
	 */

	var XMLHttpRequest = __webpack_require__(19);
	var XHR = __webpack_require__(22);
	var JSONP = __webpack_require__(40);
	var websocket = __webpack_require__(41);

	/**
	 * Export transports.
	 */

	exports.polling = polling;
	exports.websocket = websocket;

	/**
	 * Polling transport polymorphic constructor.
	 * Decides on xhr vs jsonp based on feature detection.
	 *
	 * @api private
	 */

	function polling(opts){
	  var xhr;
	  var xd = false;
	  var xs = false;
	  var jsonp = false !== opts.jsonp;

	  if (global.location) {
	    var isSSL = 'https:' == location.protocol;
	    var port = location.port;

	    // some user agents have empty `location.port`
	    if (!port) {
	      port = isSSL ? 443 : 80;
	    }

	    xd = opts.hostname != location.hostname || port != opts.port;
	    xs = opts.secure != isSSL;
	  }

	  opts.xdomain = xd;
	  opts.xscheme = xs;
	  xhr = new XMLHttpRequest(opts);

	  if ('open' in xhr && !opts.forceJSONP) {
	    return new XHR(opts);
	  } else {
	    if (!jsonp) throw new Error('JSONP disabled');
	    return new JSONP(opts);
	  }
	}

	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },
/* 19 */
/***/ function(module, exports, __webpack_require__) {

	// browser shim for xmlhttprequest module
	var hasCORS = __webpack_require__(20);

	module.exports = function(opts) {
	  var xdomain = opts.xdomain;

	  // scheme must be same when usign XDomainRequest
	  // http://blogs.msdn.com/b/ieinternals/archive/2010/05/13/xdomainrequest-restrictions-limitations-and-workarounds.aspx
	  var xscheme = opts.xscheme;

	  // XDomainRequest has a flow of not sending cookie, therefore it should be disabled as a default.
	  // https://github.com/Automattic/engine.io-client/pull/217
	  var enablesXDR = opts.enablesXDR;

	  // XMLHttpRequest can be disabled on IE
	  try {
	    if ('undefined' != typeof XMLHttpRequest && (!xdomain || hasCORS)) {
	      return new XMLHttpRequest();
	    }
	  } catch (e) { }

	  // Use XDomainRequest for IE8 if enablesXDR is true
	  // because loading bar keeps flashing when using jsonp-polling
	  // https://github.com/yujiosaka/socke.io-ie8-loading-example
	  try {
	    if ('undefined' != typeof XDomainRequest && !xscheme && enablesXDR) {
	      return new XDomainRequest();
	    }
	  } catch (e) { }

	  if (!xdomain) {
	    try {
	      return new ActiveXObject('Microsoft.XMLHTTP');
	    } catch(e) { }
	  }
	}


/***/ },
/* 20 */
/***/ function(module, exports, __webpack_require__) {

	
	/**
	 * Module dependencies.
	 */

	var global = __webpack_require__(21);

	/**
	 * Module exports.
	 *
	 * Logic borrowed from Modernizr:
	 *
	 *   - https://github.com/Modernizr/Modernizr/blob/master/feature-detects/cors.js
	 */

	try {
	  module.exports = 'XMLHttpRequest' in global &&
	    'withCredentials' in new global.XMLHttpRequest();
	} catch (err) {
	  // if XMLHttp support is disabled in IE then it will throw
	  // when trying to create
	  module.exports = false;
	}


/***/ },
/* 21 */
/***/ function(module, exports) {

	
	/**
	 * Returns `this`. Execute this without a "context" (i.e. without it being
	 * attached to an object of the left-hand side), and `this` points to the
	 * "global" scope of the current JS execution.
	 */

	module.exports = (function () { return this; })();


/***/ },
/* 22 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global) {/**
	 * Module requirements.
	 */

	var XMLHttpRequest = __webpack_require__(19);
	var Polling = __webpack_require__(23);
	var Emitter = __webpack_require__(11);
	var inherit = __webpack_require__(36);
	var debug = __webpack_require__(37)('engine.io-client:polling-xhr');

	/**
	 * Module exports.
	 */

	module.exports = XHR;
	module.exports.Request = Request;

	/**
	 * Empty function
	 */

	function empty(){}

	/**
	 * XHR Polling constructor.
	 *
	 * @param {Object} opts
	 * @api public
	 */

	function XHR(opts){
	  Polling.call(this, opts);

	  if (global.location) {
	    var isSSL = 'https:' == location.protocol;
	    var port = location.port;

	    // some user agents have empty `location.port`
	    if (!port) {
	      port = isSSL ? 443 : 80;
	    }

	    this.xd = opts.hostname != global.location.hostname ||
	      port != opts.port;
	    this.xs = opts.secure != isSSL;
	  }
	}

	/**
	 * Inherits from Polling.
	 */

	inherit(XHR, Polling);

	/**
	 * XHR supports binary
	 */

	XHR.prototype.supportsBinary = true;

	/**
	 * Creates a request.
	 *
	 * @param {String} method
	 * @api private
	 */

	XHR.prototype.request = function(opts){
	  opts = opts || {};
	  opts.uri = this.uri();
	  opts.xd = this.xd;
	  opts.xs = this.xs;
	  opts.agent = this.agent || false;
	  opts.supportsBinary = this.supportsBinary;
	  opts.enablesXDR = this.enablesXDR;

	  // SSL options for Node.js client
	  opts.pfx = this.pfx;
	  opts.key = this.key;
	  opts.passphrase = this.passphrase;
	  opts.cert = this.cert;
	  opts.ca = this.ca;
	  opts.ciphers = this.ciphers;
	  opts.rejectUnauthorized = this.rejectUnauthorized;

	  return new Request(opts);
	};

	/**
	 * Sends data.
	 *
	 * @param {String} data to send.
	 * @param {Function} called upon flush.
	 * @api private
	 */

	XHR.prototype.doWrite = function(data, fn){
	  var isBinary = typeof data !== 'string' && data !== undefined;
	  var req = this.request({ method: 'POST', data: data, isBinary: isBinary });
	  var self = this;
	  req.on('success', fn);
	  req.on('error', function(err){
	    self.onError('xhr post error', err);
	  });
	  this.sendXhr = req;
	};

	/**
	 * Starts a poll cycle.
	 *
	 * @api private
	 */

	XHR.prototype.doPoll = function(){
	  debug('xhr poll');
	  var req = this.request();
	  var self = this;
	  req.on('data', function(data){
	    self.onData(data);
	  });
	  req.on('error', function(err){
	    self.onError('xhr poll error', err);
	  });
	  this.pollXhr = req;
	};

	/**
	 * Request constructor
	 *
	 * @param {Object} options
	 * @api public
	 */

	function Request(opts){
	  this.method = opts.method || 'GET';
	  this.uri = opts.uri;
	  this.xd = !!opts.xd;
	  this.xs = !!opts.xs;
	  this.async = false !== opts.async;
	  this.data = undefined != opts.data ? opts.data : null;
	  this.agent = opts.agent;
	  this.isBinary = opts.isBinary;
	  this.supportsBinary = opts.supportsBinary;
	  this.enablesXDR = opts.enablesXDR;

	  // SSL options for Node.js client
	  this.pfx = opts.pfx;
	  this.key = opts.key;
	  this.passphrase = opts.passphrase;
	  this.cert = opts.cert;
	  this.ca = opts.ca;
	  this.ciphers = opts.ciphers;
	  this.rejectUnauthorized = opts.rejectUnauthorized;

	  this.create();
	}

	/**
	 * Mix in `Emitter`.
	 */

	Emitter(Request.prototype);

	/**
	 * Creates the XHR object and sends the request.
	 *
	 * @api private
	 */

	Request.prototype.create = function(){
	  var opts = { agent: this.agent, xdomain: this.xd, xscheme: this.xs, enablesXDR: this.enablesXDR };

	  // SSL options for Node.js client
	  opts.pfx = this.pfx;
	  opts.key = this.key;
	  opts.passphrase = this.passphrase;
	  opts.cert = this.cert;
	  opts.ca = this.ca;
	  opts.ciphers = this.ciphers;
	  opts.rejectUnauthorized = this.rejectUnauthorized;

	  var xhr = this.xhr = new XMLHttpRequest(opts);
	  var self = this;

	  try {
	    debug('xhr open %s: %s', this.method, this.uri);
	    xhr.open(this.method, this.uri, this.async);
	    if (this.supportsBinary) {
	      // This has to be done after open because Firefox is stupid
	      // http://stackoverflow.com/questions/13216903/get-binary-data-with-xmlhttprequest-in-a-firefox-extension
	      xhr.responseType = 'arraybuffer';
	    }

	    if ('POST' == this.method) {
	      try {
	        if (this.isBinary) {
	          xhr.setRequestHeader('Content-type', 'application/octet-stream');
	        } else {
	          xhr.setRequestHeader('Content-type', 'text/plain;charset=UTF-8');
	        }
	      } catch (e) {}
	    }

	    // ie6 check
	    if ('withCredentials' in xhr) {
	      xhr.withCredentials = true;
	    }

	    if (this.hasXDR()) {
	      xhr.onload = function(){
	        self.onLoad();
	      };
	      xhr.onerror = function(){
	        self.onError(xhr.responseText);
	      };
	    } else {
	      xhr.onreadystatechange = function(){
	        if (4 != xhr.readyState) return;
	        if (200 == xhr.status || 1223 == xhr.status) {
	          self.onLoad();
	        } else {
	          // make sure the `error` event handler that's user-set
	          // does not throw in the same tick and gets caught here
	          setTimeout(function(){
	            self.onError(xhr.status);
	          }, 0);
	        }
	      };
	    }

	    debug('xhr data %s', this.data);
	    xhr.send(this.data);
	  } catch (e) {
	    // Need to defer since .create() is called directly fhrom the constructor
	    // and thus the 'error' event can only be only bound *after* this exception
	    // occurs.  Therefore, also, we cannot throw here at all.
	    setTimeout(function() {
	      self.onError(e);
	    }, 0);
	    return;
	  }

	  if (global.document) {
	    this.index = Request.requestsCount++;
	    Request.requests[this.index] = this;
	  }
	};

	/**
	 * Called upon successful response.
	 *
	 * @api private
	 */

	Request.prototype.onSuccess = function(){
	  this.emit('success');
	  this.cleanup();
	};

	/**
	 * Called if we have data.
	 *
	 * @api private
	 */

	Request.prototype.onData = function(data){
	  this.emit('data', data);
	  this.onSuccess();
	};

	/**
	 * Called upon error.
	 *
	 * @api private
	 */

	Request.prototype.onError = function(err){
	  this.emit('error', err);
	  this.cleanup(true);
	};

	/**
	 * Cleans up house.
	 *
	 * @api private
	 */

	Request.prototype.cleanup = function(fromError){
	  if ('undefined' == typeof this.xhr || null === this.xhr) {
	    return;
	  }
	  // xmlhttprequest
	  if (this.hasXDR()) {
	    this.xhr.onload = this.xhr.onerror = empty;
	  } else {
	    this.xhr.onreadystatechange = empty;
	  }

	  if (fromError) {
	    try {
	      this.xhr.abort();
	    } catch(e) {}
	  }

	  if (global.document) {
	    delete Request.requests[this.index];
	  }

	  this.xhr = null;
	};

	/**
	 * Called upon load.
	 *
	 * @api private
	 */

	Request.prototype.onLoad = function(){
	  var data;
	  try {
	    var contentType;
	    try {
	      contentType = this.xhr.getResponseHeader('Content-Type').split(';')[0];
	    } catch (e) {}
	    if (contentType === 'application/octet-stream') {
	      data = this.xhr.response;
	    } else {
	      if (!this.supportsBinary) {
	        data = this.xhr.responseText;
	      } else {
	        data = 'ok';
	      }
	    }
	  } catch (e) {
	    this.onError(e);
	  }
	  if (null != data) {
	    this.onData(data);
	  }
	};

	/**
	 * Check if it has XDomainRequest.
	 *
	 * @api private
	 */

	Request.prototype.hasXDR = function(){
	  return 'undefined' !== typeof global.XDomainRequest && !this.xs && this.enablesXDR;
	};

	/**
	 * Aborts the request.
	 *
	 * @api public
	 */

	Request.prototype.abort = function(){
	  this.cleanup();
	};

	/**
	 * Aborts pending requests when unloading the window. This is needed to prevent
	 * memory leaks (e.g. when using IE) and to ensure that no spurious error is
	 * emitted.
	 */

	if (global.document) {
	  Request.requestsCount = 0;
	  Request.requests = {};
	  if (global.attachEvent) {
	    global.attachEvent('onunload', unloadHandler);
	  } else if (global.addEventListener) {
	    global.addEventListener('beforeunload', unloadHandler, false);
	  }
	}

	function unloadHandler() {
	  for (var i in Request.requests) {
	    if (Request.requests.hasOwnProperty(i)) {
	      Request.requests[i].abort();
	    }
	  }
	}

	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },
/* 23 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Module dependencies.
	 */

	var Transport = __webpack_require__(24);
	var parseqs = __webpack_require__(35);
	var parser = __webpack_require__(25);
	var inherit = __webpack_require__(36);
	var debug = __webpack_require__(37)('engine.io-client:polling');

	/**
	 * Module exports.
	 */

	module.exports = Polling;

	/**
	 * Is XHR2 supported?
	 */

	var hasXHR2 = (function() {
	  var XMLHttpRequest = __webpack_require__(19);
	  var xhr = new XMLHttpRequest({ xdomain: false });
	  return null != xhr.responseType;
	})();

	/**
	 * Polling interface.
	 *
	 * @param {Object} opts
	 * @api private
	 */

	function Polling(opts){
	  var forceBase64 = (opts && opts.forceBase64);
	  if (!hasXHR2 || forceBase64) {
	    this.supportsBinary = false;
	  }
	  Transport.call(this, opts);
	}

	/**
	 * Inherits from Transport.
	 */

	inherit(Polling, Transport);

	/**
	 * Transport name.
	 */

	Polling.prototype.name = 'polling';

	/**
	 * Opens the socket (triggers polling). We write a PING message to determine
	 * when the transport is open.
	 *
	 * @api private
	 */

	Polling.prototype.doOpen = function(){
	  this.poll();
	};

	/**
	 * Pauses polling.
	 *
	 * @param {Function} callback upon buffers are flushed and transport is paused
	 * @api private
	 */

	Polling.prototype.pause = function(onPause){
	  var pending = 0;
	  var self = this;

	  this.readyState = 'pausing';

	  function pause(){
	    debug('paused');
	    self.readyState = 'paused';
	    onPause();
	  }

	  if (this.polling || !this.writable) {
	    var total = 0;

	    if (this.polling) {
	      debug('we are currently polling - waiting to pause');
	      total++;
	      this.once('pollComplete', function(){
	        debug('pre-pause polling complete');
	        --total || pause();
	      });
	    }

	    if (!this.writable) {
	      debug('we are currently writing - waiting to pause');
	      total++;
	      this.once('drain', function(){
	        debug('pre-pause writing complete');
	        --total || pause();
	      });
	    }
	  } else {
	    pause();
	  }
	};

	/**
	 * Starts polling cycle.
	 *
	 * @api public
	 */

	Polling.prototype.poll = function(){
	  debug('polling');
	  this.polling = true;
	  this.doPoll();
	  this.emit('poll');
	};

	/**
	 * Overloads onData to detect payloads.
	 *
	 * @api private
	 */

	Polling.prototype.onData = function(data){
	  var self = this;
	  debug('polling got data %s', data);
	  var callback = function(packet, index, total) {
	    // if its the first message we consider the transport open
	    if ('opening' == self.readyState) {
	      self.onOpen();
	    }

	    // if its a close packet, we close the ongoing requests
	    if ('close' == packet.type) {
	      self.onClose();
	      return false;
	    }

	    // otherwise bypass onData and handle the message
	    self.onPacket(packet);
	  };

	  // decode payload
	  parser.decodePayload(data, this.socket.binaryType, callback);

	  // if an event did not trigger closing
	  if ('closed' != this.readyState) {
	    // if we got data we're not polling
	    this.polling = false;
	    this.emit('pollComplete');

	    if ('open' == this.readyState) {
	      this.poll();
	    } else {
	      debug('ignoring poll - transport state "%s"', this.readyState);
	    }
	  }
	};

	/**
	 * For polling, send a close packet.
	 *
	 * @api private
	 */

	Polling.prototype.doClose = function(){
	  var self = this;

	  function close(){
	    debug('writing close packet');
	    self.write([{ type: 'close' }]);
	  }

	  if ('open' == this.readyState) {
	    debug('transport open - closing');
	    close();
	  } else {
	    // in case we're trying to close while
	    // handshaking is in progress (GH-164)
	    debug('transport not open - deferring close');
	    this.once('open', close);
	  }
	};

	/**
	 * Writes a packets payload.
	 *
	 * @param {Array} data packets
	 * @param {Function} drain callback
	 * @api private
	 */

	Polling.prototype.write = function(packets){
	  var self = this;
	  this.writable = false;
	  var callbackfn = function() {
	    self.writable = true;
	    self.emit('drain');
	  };

	  var self = this;
	  parser.encodePayload(packets, this.supportsBinary, function(data) {
	    self.doWrite(data, callbackfn);
	  });
	};

	/**
	 * Generates uri for connection.
	 *
	 * @api private
	 */

	Polling.prototype.uri = function(){
	  var query = this.query || {};
	  var schema = this.secure ? 'https' : 'http';
	  var port = '';

	  // cache busting is forced
	  if (false !== this.timestampRequests) {
	    query[this.timestampParam] = +new Date + '-' + Transport.timestamps++;
	  }

	  if (!this.supportsBinary && !query.sid) {
	    query.b64 = 1;
	  }

	  query = parseqs.encode(query);

	  // avoid port if default for schema
	  if (this.port && (('https' == schema && this.port != 443) ||
	     ('http' == schema && this.port != 80))) {
	    port = ':' + this.port;
	  }

	  // prepend ? to query
	  if (query.length) {
	    query = '?' + query;
	  }

	  return schema + '://' + this.hostname + port + this.path + query;
	};


/***/ },
/* 24 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Module dependencies.
	 */

	var parser = __webpack_require__(25);
	var Emitter = __webpack_require__(11);

	/**
	 * Module exports.
	 */

	module.exports = Transport;

	/**
	 * Transport abstract constructor.
	 *
	 * @param {Object} options.
	 * @api private
	 */

	function Transport (opts) {
	  this.path = opts.path;
	  this.hostname = opts.hostname;
	  this.port = opts.port;
	  this.secure = opts.secure;
	  this.query = opts.query;
	  this.timestampParam = opts.timestampParam;
	  this.timestampRequests = opts.timestampRequests;
	  this.readyState = '';
	  this.agent = opts.agent || false;
	  this.socket = opts.socket;
	  this.enablesXDR = opts.enablesXDR;

	  // SSL options for Node.js client
	  this.pfx = opts.pfx;
	  this.key = opts.key;
	  this.passphrase = opts.passphrase;
	  this.cert = opts.cert;
	  this.ca = opts.ca;
	  this.ciphers = opts.ciphers;
	  this.rejectUnauthorized = opts.rejectUnauthorized;
	}

	/**
	 * Mix in `Emitter`.
	 */

	Emitter(Transport.prototype);

	/**
	 * A counter used to prevent collisions in the timestamps used
	 * for cache busting.
	 */

	Transport.timestamps = 0;

	/**
	 * Emits an error.
	 *
	 * @param {String} str
	 * @return {Transport} for chaining
	 * @api public
	 */

	Transport.prototype.onError = function (msg, desc) {
	  var err = new Error(msg);
	  err.type = 'TransportError';
	  err.description = desc;
	  this.emit('error', err);
	  return this;
	};

	/**
	 * Opens the transport.
	 *
	 * @api public
	 */

	Transport.prototype.open = function () {
	  if ('closed' == this.readyState || '' == this.readyState) {
	    this.readyState = 'opening';
	    this.doOpen();
	  }

	  return this;
	};

	/**
	 * Closes the transport.
	 *
	 * @api private
	 */

	Transport.prototype.close = function () {
	  if ('opening' == this.readyState || 'open' == this.readyState) {
	    this.doClose();
	    this.onClose();
	  }

	  return this;
	};

	/**
	 * Sends multiple packets.
	 *
	 * @param {Array} packets
	 * @api private
	 */

	Transport.prototype.send = function(packets){
	  if ('open' == this.readyState) {
	    this.write(packets);
	  } else {
	    throw new Error('Transport not open');
	  }
	};

	/**
	 * Called upon open
	 *
	 * @api private
	 */

	Transport.prototype.onOpen = function () {
	  this.readyState = 'open';
	  this.writable = true;
	  this.emit('open');
	};

	/**
	 * Called with data.
	 *
	 * @param {String} data
	 * @api private
	 */

	Transport.prototype.onData = function(data){
	  var packet = parser.decodePacket(data, this.socket.binaryType);
	  this.onPacket(packet);
	};

	/**
	 * Called with a decoded packet.
	 */

	Transport.prototype.onPacket = function (packet) {
	  this.emit('packet', packet);
	};

	/**
	 * Called upon close.
	 *
	 * @api private
	 */

	Transport.prototype.onClose = function () {
	  this.readyState = 'closed';
	  this.emit('close');
	};


/***/ },
/* 25 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global) {/**
	 * Module dependencies.
	 */

	var keys = __webpack_require__(26);
	var hasBinary = __webpack_require__(27);
	var sliceBuffer = __webpack_require__(29);
	var base64encoder = __webpack_require__(30);
	var after = __webpack_require__(31);
	var utf8 = __webpack_require__(32);

	/**
	 * Check if we are running an android browser. That requires us to use
	 * ArrayBuffer with polling transports...
	 *
	 * http://ghinda.net/jpeg-blob-ajax-android/
	 */

	var isAndroid = navigator.userAgent.match(/Android/i);

	/**
	 * Check if we are running in PhantomJS.
	 * Uploading a Blob with PhantomJS does not work correctly, as reported here:
	 * https://github.com/ariya/phantomjs/issues/11395
	 * @type boolean
	 */
	var isPhantomJS = /PhantomJS/i.test(navigator.userAgent);

	/**
	 * When true, avoids using Blobs to encode payloads.
	 * @type boolean
	 */
	var dontSendBlobs = isAndroid || isPhantomJS;

	/**
	 * Current protocol version.
	 */

	exports.protocol = 3;

	/**
	 * Packet types.
	 */

	var packets = exports.packets = {
	    open:     0    // non-ws
	  , close:    1    // non-ws
	  , ping:     2
	  , pong:     3
	  , message:  4
	  , upgrade:  5
	  , noop:     6
	};

	var packetslist = keys(packets);

	/**
	 * Premade error packet.
	 */

	var err = { type: 'error', data: 'parser error' };

	/**
	 * Create a blob api even for blob builder when vendor prefixes exist
	 */

	var Blob = __webpack_require__(34);

	/**
	 * Encodes a packet.
	 *
	 *     <packet type id> [ <data> ]
	 *
	 * Example:
	 *
	 *     5hello world
	 *     3
	 *     4
	 *
	 * Binary is encoded in an identical principle
	 *
	 * @api private
	 */

	exports.encodePacket = function (packet, supportsBinary, utf8encode, callback) {
	  if ('function' == typeof supportsBinary) {
	    callback = supportsBinary;
	    supportsBinary = false;
	  }

	  if ('function' == typeof utf8encode) {
	    callback = utf8encode;
	    utf8encode = null;
	  }

	  var data = (packet.data === undefined)
	    ? undefined
	    : packet.data.buffer || packet.data;

	  if (global.ArrayBuffer && data instanceof ArrayBuffer) {
	    return encodeArrayBuffer(packet, supportsBinary, callback);
	  } else if (Blob && data instanceof global.Blob) {
	    return encodeBlob(packet, supportsBinary, callback);
	  }

	  // might be an object with { base64: true, data: dataAsBase64String }
	  if (data && data.base64) {
	    return encodeBase64Object(packet, callback);
	  }

	  // Sending data as a utf-8 string
	  var encoded = packets[packet.type];

	  // data fragment is optional
	  if (undefined !== packet.data) {
	    encoded += utf8encode ? utf8.encode(String(packet.data)) : String(packet.data);
	  }

	  return callback('' + encoded);

	};

	function encodeBase64Object(packet, callback) {
	  // packet data is an object { base64: true, data: dataAsBase64String }
	  var message = 'b' + exports.packets[packet.type] + packet.data.data;
	  return callback(message);
	}

	/**
	 * Encode packet helpers for binary types
	 */

	function encodeArrayBuffer(packet, supportsBinary, callback) {
	  if (!supportsBinary) {
	    return exports.encodeBase64Packet(packet, callback);
	  }

	  var data = packet.data;
	  var contentArray = new Uint8Array(data);
	  var resultBuffer = new Uint8Array(1 + data.byteLength);

	  resultBuffer[0] = packets[packet.type];
	  for (var i = 0; i < contentArray.length; i++) {
	    resultBuffer[i+1] = contentArray[i];
	  }

	  return callback(resultBuffer.buffer);
	}

	function encodeBlobAsArrayBuffer(packet, supportsBinary, callback) {
	  if (!supportsBinary) {
	    return exports.encodeBase64Packet(packet, callback);
	  }

	  var fr = new FileReader();
	  fr.onload = function() {
	    packet.data = fr.result;
	    exports.encodePacket(packet, supportsBinary, true, callback);
	  };
	  return fr.readAsArrayBuffer(packet.data);
	}

	function encodeBlob(packet, supportsBinary, callback) {
	  if (!supportsBinary) {
	    return exports.encodeBase64Packet(packet, callback);
	  }

	  if (dontSendBlobs) {
	    return encodeBlobAsArrayBuffer(packet, supportsBinary, callback);
	  }

	  var length = new Uint8Array(1);
	  length[0] = packets[packet.type];
	  var blob = new Blob([length.buffer, packet.data]);

	  return callback(blob);
	}

	/**
	 * Encodes a packet with binary data in a base64 string
	 *
	 * @param {Object} packet, has `type` and `data`
	 * @return {String} base64 encoded message
	 */

	exports.encodeBase64Packet = function(packet, callback) {
	  var message = 'b' + exports.packets[packet.type];
	  if (Blob && packet.data instanceof Blob) {
	    var fr = new FileReader();
	    fr.onload = function() {
	      var b64 = fr.result.split(',')[1];
	      callback(message + b64);
	    };
	    return fr.readAsDataURL(packet.data);
	  }

	  var b64data;
	  try {
	    b64data = String.fromCharCode.apply(null, new Uint8Array(packet.data));
	  } catch (e) {
	    // iPhone Safari doesn't let you apply with typed arrays
	    var typed = new Uint8Array(packet.data);
	    var basic = new Array(typed.length);
	    for (var i = 0; i < typed.length; i++) {
	      basic[i] = typed[i];
	    }
	    b64data = String.fromCharCode.apply(null, basic);
	  }
	  message += global.btoa(b64data);
	  return callback(message);
	};

	/**
	 * Decodes a packet. Changes format to Blob if requested.
	 *
	 * @return {Object} with `type` and `data` (if any)
	 * @api private
	 */

	exports.decodePacket = function (data, binaryType, utf8decode) {
	  // String data
	  if (typeof data == 'string' || data === undefined) {
	    if (data.charAt(0) == 'b') {
	      return exports.decodeBase64Packet(data.substr(1), binaryType);
	    }

	    if (utf8decode) {
	      try {
	        data = utf8.decode(data);
	      } catch (e) {
	        return err;
	      }
	    }
	    var type = data.charAt(0);

	    if (Number(type) != type || !packetslist[type]) {
	      return err;
	    }

	    if (data.length > 1) {
	      return { type: packetslist[type], data: data.substring(1) };
	    } else {
	      return { type: packetslist[type] };
	    }
	  }

	  var asArray = new Uint8Array(data);
	  var type = asArray[0];
	  var rest = sliceBuffer(data, 1);
	  if (Blob && binaryType === 'blob') {
	    rest = new Blob([rest]);
	  }
	  return { type: packetslist[type], data: rest };
	};

	/**
	 * Decodes a packet encoded in a base64 string
	 *
	 * @param {String} base64 encoded message
	 * @return {Object} with `type` and `data` (if any)
	 */

	exports.decodeBase64Packet = function(msg, binaryType) {
	  var type = packetslist[msg.charAt(0)];
	  if (!global.ArrayBuffer) {
	    return { type: type, data: { base64: true, data: msg.substr(1) } };
	  }

	  var data = base64encoder.decode(msg.substr(1));

	  if (binaryType === 'blob' && Blob) {
	    data = new Blob([data]);
	  }

	  return { type: type, data: data };
	};

	/**
	 * Encodes multiple messages (payload).
	 *
	 *     <length>:data
	 *
	 * Example:
	 *
	 *     11:hello world2:hi
	 *
	 * If any contents are binary, they will be encoded as base64 strings. Base64
	 * encoded strings are marked with a b before the length specifier
	 *
	 * @param {Array} packets
	 * @api private
	 */

	exports.encodePayload = function (packets, supportsBinary, callback) {
	  if (typeof supportsBinary == 'function') {
	    callback = supportsBinary;
	    supportsBinary = null;
	  }

	  var isBinary = hasBinary(packets);

	  if (supportsBinary && isBinary) {
	    if (Blob && !dontSendBlobs) {
	      return exports.encodePayloadAsBlob(packets, callback);
	    }

	    return exports.encodePayloadAsArrayBuffer(packets, callback);
	  }

	  if (!packets.length) {
	    return callback('0:');
	  }

	  function setLengthHeader(message) {
	    return message.length + ':' + message;
	  }

	  function encodeOne(packet, doneCallback) {
	    exports.encodePacket(packet, !isBinary ? false : supportsBinary, true, function(message) {
	      doneCallback(null, setLengthHeader(message));
	    });
	  }

	  map(packets, encodeOne, function(err, results) {
	    return callback(results.join(''));
	  });
	};

	/**
	 * Async array map using after
	 */

	function map(ary, each, done) {
	  var result = new Array(ary.length);
	  var next = after(ary.length, done);

	  var eachWithIndex = function(i, el, cb) {
	    each(el, function(error, msg) {
	      result[i] = msg;
	      cb(error, result);
	    });
	  };

	  for (var i = 0; i < ary.length; i++) {
	    eachWithIndex(i, ary[i], next);
	  }
	}

	/*
	 * Decodes data when a payload is maybe expected. Possible binary contents are
	 * decoded from their base64 representation
	 *
	 * @param {String} data, callback method
	 * @api public
	 */

	exports.decodePayload = function (data, binaryType, callback) {
	  if (typeof data != 'string') {
	    return exports.decodePayloadAsBinary(data, binaryType, callback);
	  }

	  if (typeof binaryType === 'function') {
	    callback = binaryType;
	    binaryType = null;
	  }

	  var packet;
	  if (data == '') {
	    // parser error - ignoring payload
	    return callback(err, 0, 1);
	  }

	  var length = ''
	    , n, msg;

	  for (var i = 0, l = data.length; i < l; i++) {
	    var chr = data.charAt(i);

	    if (':' != chr) {
	      length += chr;
	    } else {
	      if ('' == length || (length != (n = Number(length)))) {
	        // parser error - ignoring payload
	        return callback(err, 0, 1);
	      }

	      msg = data.substr(i + 1, n);

	      if (length != msg.length) {
	        // parser error - ignoring payload
	        return callback(err, 0, 1);
	      }

	      if (msg.length) {
	        packet = exports.decodePacket(msg, binaryType, true);

	        if (err.type == packet.type && err.data == packet.data) {
	          // parser error in individual packet - ignoring payload
	          return callback(err, 0, 1);
	        }

	        var ret = callback(packet, i + n, l);
	        if (false === ret) return;
	      }

	      // advance cursor
	      i += n;
	      length = '';
	    }
	  }

	  if (length != '') {
	    // parser error - ignoring payload
	    return callback(err, 0, 1);
	  }

	};

	/**
	 * Encodes multiple messages (payload) as binary.
	 *
	 * <1 = binary, 0 = string><number from 0-9><number from 0-9>[...]<number
	 * 255><data>
	 *
	 * Example:
	 * 1 3 255 1 2 3, if the binary contents are interpreted as 8 bit integers
	 *
	 * @param {Array} packets
	 * @return {ArrayBuffer} encoded payload
	 * @api private
	 */

	exports.encodePayloadAsArrayBuffer = function(packets, callback) {
	  if (!packets.length) {
	    return callback(new ArrayBuffer(0));
	  }

	  function encodeOne(packet, doneCallback) {
	    exports.encodePacket(packet, true, true, function(data) {
	      return doneCallback(null, data);
	    });
	  }

	  map(packets, encodeOne, function(err, encodedPackets) {
	    var totalLength = encodedPackets.reduce(function(acc, p) {
	      var len;
	      if (typeof p === 'string'){
	        len = p.length;
	      } else {
	        len = p.byteLength;
	      }
	      return acc + len.toString().length + len + 2; // string/binary identifier + separator = 2
	    }, 0);

	    var resultArray = new Uint8Array(totalLength);

	    var bufferIndex = 0;
	    encodedPackets.forEach(function(p) {
	      var isString = typeof p === 'string';
	      var ab = p;
	      if (isString) {
	        var view = new Uint8Array(p.length);
	        for (var i = 0; i < p.length; i++) {
	          view[i] = p.charCodeAt(i);
	        }
	        ab = view.buffer;
	      }

	      if (isString) { // not true binary
	        resultArray[bufferIndex++] = 0;
	      } else { // true binary
	        resultArray[bufferIndex++] = 1;
	      }

	      var lenStr = ab.byteLength.toString();
	      for (var i = 0; i < lenStr.length; i++) {
	        resultArray[bufferIndex++] = parseInt(lenStr[i]);
	      }
	      resultArray[bufferIndex++] = 255;

	      var view = new Uint8Array(ab);
	      for (var i = 0; i < view.length; i++) {
	        resultArray[bufferIndex++] = view[i];
	      }
	    });

	    return callback(resultArray.buffer);
	  });
	};

	/**
	 * Encode as Blob
	 */

	exports.encodePayloadAsBlob = function(packets, callback) {
	  function encodeOne(packet, doneCallback) {
	    exports.encodePacket(packet, true, true, function(encoded) {
	      var binaryIdentifier = new Uint8Array(1);
	      binaryIdentifier[0] = 1;
	      if (typeof encoded === 'string') {
	        var view = new Uint8Array(encoded.length);
	        for (var i = 0; i < encoded.length; i++) {
	          view[i] = encoded.charCodeAt(i);
	        }
	        encoded = view.buffer;
	        binaryIdentifier[0] = 0;
	      }

	      var len = (encoded instanceof ArrayBuffer)
	        ? encoded.byteLength
	        : encoded.size;

	      var lenStr = len.toString();
	      var lengthAry = new Uint8Array(lenStr.length + 1);
	      for (var i = 0; i < lenStr.length; i++) {
	        lengthAry[i] = parseInt(lenStr[i]);
	      }
	      lengthAry[lenStr.length] = 255;

	      if (Blob) {
	        var blob = new Blob([binaryIdentifier.buffer, lengthAry.buffer, encoded]);
	        doneCallback(null, blob);
	      }
	    });
	  }

	  map(packets, encodeOne, function(err, results) {
	    return callback(new Blob(results));
	  });
	};

	/*
	 * Decodes data when a payload is maybe expected. Strings are decoded by
	 * interpreting each byte as a key code for entries marked to start with 0. See
	 * description of encodePayloadAsBinary
	 *
	 * @param {ArrayBuffer} data, callback method
	 * @api public
	 */

	exports.decodePayloadAsBinary = function (data, binaryType, callback) {
	  if (typeof binaryType === 'function') {
	    callback = binaryType;
	    binaryType = null;
	  }

	  var bufferTail = data;
	  var buffers = [];

	  var numberTooLong = false;
	  while (bufferTail.byteLength > 0) {
	    var tailArray = new Uint8Array(bufferTail);
	    var isString = tailArray[0] === 0;
	    var msgLength = '';

	    for (var i = 1; ; i++) {
	      if (tailArray[i] == 255) break;

	      if (msgLength.length > 310) {
	        numberTooLong = true;
	        break;
	      }

	      msgLength += tailArray[i];
	    }

	    if(numberTooLong) return callback(err, 0, 1);

	    bufferTail = sliceBuffer(bufferTail, 2 + msgLength.length);
	    msgLength = parseInt(msgLength);

	    var msg = sliceBuffer(bufferTail, 0, msgLength);
	    if (isString) {
	      try {
	        msg = String.fromCharCode.apply(null, new Uint8Array(msg));
	      } catch (e) {
	        // iPhone Safari doesn't let you apply to typed arrays
	        var typed = new Uint8Array(msg);
	        msg = '';
	        for (var i = 0; i < typed.length; i++) {
	          msg += String.fromCharCode(typed[i]);
	        }
	      }
	    }

	    buffers.push(msg);
	    bufferTail = sliceBuffer(bufferTail, msgLength);
	  }

	  var total = buffers.length;
	  buffers.forEach(function(buffer, i) {
	    callback(exports.decodePacket(buffer, binaryType, true), i, total);
	  });
	};

	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },
/* 26 */
/***/ function(module, exports) {

	
	/**
	 * Gets the keys for an object.
	 *
	 * @return {Array} keys
	 * @api private
	 */

	module.exports = Object.keys || function keys (obj){
	  var arr = [];
	  var has = Object.prototype.hasOwnProperty;

	  for (var i in obj) {
	    if (has.call(obj, i)) {
	      arr.push(i);
	    }
	  }
	  return arr;
	};


/***/ },
/* 27 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global) {
	/*
	 * Module requirements.
	 */

	var isArray = __webpack_require__(28);

	/**
	 * Module exports.
	 */

	module.exports = hasBinary;

	/**
	 * Checks for binary data.
	 *
	 * Right now only Buffer and ArrayBuffer are supported..
	 *
	 * @param {Object} anything
	 * @api public
	 */

	function hasBinary(data) {

	  function _hasBinary(obj) {
	    if (!obj) return false;

	    if ( (global.Buffer && global.Buffer.isBuffer(obj)) ||
	         (global.ArrayBuffer && obj instanceof ArrayBuffer) ||
	         (global.Blob && obj instanceof Blob) ||
	         (global.File && obj instanceof File)
	        ) {
	      return true;
	    }

	    if (isArray(obj)) {
	      for (var i = 0; i < obj.length; i++) {
	          if (_hasBinary(obj[i])) {
	              return true;
	          }
	      }
	    } else if (obj && 'object' == typeof obj) {
	      if (obj.toJSON) {
	        obj = obj.toJSON();
	      }

	      for (var key in obj) {
	        if (Object.prototype.hasOwnProperty.call(obj, key) && _hasBinary(obj[key])) {
	          return true;
	        }
	      }
	    }

	    return false;
	  }

	  return _hasBinary(data);
	}

	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },
/* 28 */
/***/ function(module, exports) {

	module.exports = Array.isArray || function (arr) {
	  return Object.prototype.toString.call(arr) == '[object Array]';
	};


/***/ },
/* 29 */
/***/ function(module, exports) {

	/**
	 * An abstraction for slicing an arraybuffer even when
	 * ArrayBuffer.prototype.slice is not supported
	 *
	 * @api public
	 */

	module.exports = function(arraybuffer, start, end) {
	  var bytes = arraybuffer.byteLength;
	  start = start || 0;
	  end = end || bytes;

	  if (arraybuffer.slice) { return arraybuffer.slice(start, end); }

	  if (start < 0) { start += bytes; }
	  if (end < 0) { end += bytes; }
	  if (end > bytes) { end = bytes; }

	  if (start >= bytes || start >= end || bytes === 0) {
	    return new ArrayBuffer(0);
	  }

	  var abv = new Uint8Array(arraybuffer);
	  var result = new Uint8Array(end - start);
	  for (var i = start, ii = 0; i < end; i++, ii++) {
	    result[ii] = abv[i];
	  }
	  return result.buffer;
	};


/***/ },
/* 30 */
/***/ function(module, exports) {

	/*
	 * base64-arraybuffer
	 * https://github.com/niklasvh/base64-arraybuffer
	 *
	 * Copyright (c) 2012 Niklas von Hertzen
	 * Licensed under the MIT license.
	 */
	(function(chars){
	  "use strict";

	  exports.encode = function(arraybuffer) {
	    var bytes = new Uint8Array(arraybuffer),
	    i, len = bytes.length, base64 = "";

	    for (i = 0; i < len; i+=3) {
	      base64 += chars[bytes[i] >> 2];
	      base64 += chars[((bytes[i] & 3) << 4) | (bytes[i + 1] >> 4)];
	      base64 += chars[((bytes[i + 1] & 15) << 2) | (bytes[i + 2] >> 6)];
	      base64 += chars[bytes[i + 2] & 63];
	    }

	    if ((len % 3) === 2) {
	      base64 = base64.substring(0, base64.length - 1) + "=";
	    } else if (len % 3 === 1) {
	      base64 = base64.substring(0, base64.length - 2) + "==";
	    }

	    return base64;
	  };

	  exports.decode =  function(base64) {
	    var bufferLength = base64.length * 0.75,
	    len = base64.length, i, p = 0,
	    encoded1, encoded2, encoded3, encoded4;

	    if (base64[base64.length - 1] === "=") {
	      bufferLength--;
	      if (base64[base64.length - 2] === "=") {
	        bufferLength--;
	      }
	    }

	    var arraybuffer = new ArrayBuffer(bufferLength),
	    bytes = new Uint8Array(arraybuffer);

	    for (i = 0; i < len; i+=4) {
	      encoded1 = chars.indexOf(base64[i]);
	      encoded2 = chars.indexOf(base64[i+1]);
	      encoded3 = chars.indexOf(base64[i+2]);
	      encoded4 = chars.indexOf(base64[i+3]);

	      bytes[p++] = (encoded1 << 2) | (encoded2 >> 4);
	      bytes[p++] = ((encoded2 & 15) << 4) | (encoded3 >> 2);
	      bytes[p++] = ((encoded3 & 3) << 6) | (encoded4 & 63);
	    }

	    return arraybuffer;
	  };
	})("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/");


/***/ },
/* 31 */
/***/ function(module, exports) {

	module.exports = after

	function after(count, callback, err_cb) {
	    var bail = false
	    err_cb = err_cb || noop
	    proxy.count = count

	    return (count === 0) ? callback() : proxy

	    function proxy(err, result) {
	        if (proxy.count <= 0) {
	            throw new Error('after called too many times')
	        }
	        --proxy.count

	        // after first error, rest are passed to err_cb
	        if (err) {
	            bail = true
	            callback(err)
	            // future error callbacks will go to error handler
	            callback = err_cb
	        } else if (proxy.count === 0 && !bail) {
	            callback(null, result)
	        }
	    }
	}

	function noop() {}


/***/ },
/* 32 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;/* WEBPACK VAR INJECTION */(function(module, global) {/*! https://mths.be/utf8js v2.0.0 by @mathias */
	;(function(root) {

		// Detect free variables `exports`
		var freeExports = typeof exports == 'object' && exports;

		// Detect free variable `module`
		var freeModule = typeof module == 'object' && module &&
			module.exports == freeExports && module;

		// Detect free variable `global`, from Node.js or Browserified code,
		// and use it as `root`
		var freeGlobal = typeof global == 'object' && global;
		if (freeGlobal.global === freeGlobal || freeGlobal.window === freeGlobal) {
			root = freeGlobal;
		}

		/*--------------------------------------------------------------------------*/

		var stringFromCharCode = String.fromCharCode;

		// Taken from https://mths.be/punycode
		function ucs2decode(string) {
			var output = [];
			var counter = 0;
			var length = string.length;
			var value;
			var extra;
			while (counter < length) {
				value = string.charCodeAt(counter++);
				if (value >= 0xD800 && value <= 0xDBFF && counter < length) {
					// high surrogate, and there is a next character
					extra = string.charCodeAt(counter++);
					if ((extra & 0xFC00) == 0xDC00) { // low surrogate
						output.push(((value & 0x3FF) << 10) + (extra & 0x3FF) + 0x10000);
					} else {
						// unmatched surrogate; only append this code unit, in case the next
						// code unit is the high surrogate of a surrogate pair
						output.push(value);
						counter--;
					}
				} else {
					output.push(value);
				}
			}
			return output;
		}

		// Taken from https://mths.be/punycode
		function ucs2encode(array) {
			var length = array.length;
			var index = -1;
			var value;
			var output = '';
			while (++index < length) {
				value = array[index];
				if (value > 0xFFFF) {
					value -= 0x10000;
					output += stringFromCharCode(value >>> 10 & 0x3FF | 0xD800);
					value = 0xDC00 | value & 0x3FF;
				}
				output += stringFromCharCode(value);
			}
			return output;
		}

		function checkScalarValue(codePoint) {
			if (codePoint >= 0xD800 && codePoint <= 0xDFFF) {
				throw Error(
					'Lone surrogate U+' + codePoint.toString(16).toUpperCase() +
					' is not a scalar value'
				);
			}
		}
		/*--------------------------------------------------------------------------*/

		function createByte(codePoint, shift) {
			return stringFromCharCode(((codePoint >> shift) & 0x3F) | 0x80);
		}

		function encodeCodePoint(codePoint) {
			if ((codePoint & 0xFFFFFF80) == 0) { // 1-byte sequence
				return stringFromCharCode(codePoint);
			}
			var symbol = '';
			if ((codePoint & 0xFFFFF800) == 0) { // 2-byte sequence
				symbol = stringFromCharCode(((codePoint >> 6) & 0x1F) | 0xC0);
			}
			else if ((codePoint & 0xFFFF0000) == 0) { // 3-byte sequence
				checkScalarValue(codePoint);
				symbol = stringFromCharCode(((codePoint >> 12) & 0x0F) | 0xE0);
				symbol += createByte(codePoint, 6);
			}
			else if ((codePoint & 0xFFE00000) == 0) { // 4-byte sequence
				symbol = stringFromCharCode(((codePoint >> 18) & 0x07) | 0xF0);
				symbol += createByte(codePoint, 12);
				symbol += createByte(codePoint, 6);
			}
			symbol += stringFromCharCode((codePoint & 0x3F) | 0x80);
			return symbol;
		}

		function utf8encode(string) {
			var codePoints = ucs2decode(string);
			var length = codePoints.length;
			var index = -1;
			var codePoint;
			var byteString = '';
			while (++index < length) {
				codePoint = codePoints[index];
				byteString += encodeCodePoint(codePoint);
			}
			return byteString;
		}

		/*--------------------------------------------------------------------------*/

		function readContinuationByte() {
			if (byteIndex >= byteCount) {
				throw Error('Invalid byte index');
			}

			var continuationByte = byteArray[byteIndex] & 0xFF;
			byteIndex++;

			if ((continuationByte & 0xC0) == 0x80) {
				return continuationByte & 0x3F;
			}

			// If we end up here, it’s not a continuation byte
			throw Error('Invalid continuation byte');
		}

		function decodeSymbol() {
			var byte1;
			var byte2;
			var byte3;
			var byte4;
			var codePoint;

			if (byteIndex > byteCount) {
				throw Error('Invalid byte index');
			}

			if (byteIndex == byteCount) {
				return false;
			}

			// Read first byte
			byte1 = byteArray[byteIndex] & 0xFF;
			byteIndex++;

			// 1-byte sequence (no continuation bytes)
			if ((byte1 & 0x80) == 0) {
				return byte1;
			}

			// 2-byte sequence
			if ((byte1 & 0xE0) == 0xC0) {
				var byte2 = readContinuationByte();
				codePoint = ((byte1 & 0x1F) << 6) | byte2;
				if (codePoint >= 0x80) {
					return codePoint;
				} else {
					throw Error('Invalid continuation byte');
				}
			}

			// 3-byte sequence (may include unpaired surrogates)
			if ((byte1 & 0xF0) == 0xE0) {
				byte2 = readContinuationByte();
				byte3 = readContinuationByte();
				codePoint = ((byte1 & 0x0F) << 12) | (byte2 << 6) | byte3;
				if (codePoint >= 0x0800) {
					checkScalarValue(codePoint);
					return codePoint;
				} else {
					throw Error('Invalid continuation byte');
				}
			}

			// 4-byte sequence
			if ((byte1 & 0xF8) == 0xF0) {
				byte2 = readContinuationByte();
				byte3 = readContinuationByte();
				byte4 = readContinuationByte();
				codePoint = ((byte1 & 0x0F) << 0x12) | (byte2 << 0x0C) |
					(byte3 << 0x06) | byte4;
				if (codePoint >= 0x010000 && codePoint <= 0x10FFFF) {
					return codePoint;
				}
			}

			throw Error('Invalid UTF-8 detected');
		}

		var byteArray;
		var byteCount;
		var byteIndex;
		function utf8decode(byteString) {
			byteArray = ucs2decode(byteString);
			byteCount = byteArray.length;
			byteIndex = 0;
			var codePoints = [];
			var tmp;
			while ((tmp = decodeSymbol()) !== false) {
				codePoints.push(tmp);
			}
			return ucs2encode(codePoints);
		}

		/*--------------------------------------------------------------------------*/

		var utf8 = {
			'version': '2.0.0',
			'encode': utf8encode,
			'decode': utf8decode
		};

		// Some AMD build optimizers, like r.js, check for specific condition patterns
		// like the following:
		if (
			true
		) {
			!(__WEBPACK_AMD_DEFINE_RESULT__ = function() {
				return utf8;
			}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
		}	else if (freeExports && !freeExports.nodeType) {
			if (freeModule) { // in Node.js or RingoJS v0.8.0+
				freeModule.exports = utf8;
			} else { // in Narwhal or RingoJS v0.7.0-
				var object = {};
				var hasOwnProperty = object.hasOwnProperty;
				for (var key in utf8) {
					hasOwnProperty.call(utf8, key) && (freeExports[key] = utf8[key]);
				}
			}
		} else { // in Rhino or a web browser
			root.utf8 = utf8;
		}

	}(this));

	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(33)(module), (function() { return this; }())))

/***/ },
/* 33 */
/***/ function(module, exports) {

	module.exports = function(module) {
		if(!module.webpackPolyfill) {
			module.deprecate = function() {};
			module.paths = [];
			// module.parent = undefined by default
			module.children = [];
			module.webpackPolyfill = 1;
		}
		return module;
	}


/***/ },
/* 34 */
/***/ function(module, exports) {

	/* WEBPACK VAR INJECTION */(function(global) {/**
	 * Create a blob builder even when vendor prefixes exist
	 */

	var BlobBuilder = global.BlobBuilder
	  || global.WebKitBlobBuilder
	  || global.MSBlobBuilder
	  || global.MozBlobBuilder;

	/**
	 * Check if Blob constructor is supported
	 */

	var blobSupported = (function() {
	  try {
	    var a = new Blob(['hi']);
	    return a.size === 2;
	  } catch(e) {
	    return false;
	  }
	})();

	/**
	 * Check if Blob constructor supports ArrayBufferViews
	 * Fails in Safari 6, so we need to map to ArrayBuffers there.
	 */

	var blobSupportsArrayBufferView = blobSupported && (function() {
	  try {
	    var b = new Blob([new Uint8Array([1,2])]);
	    return b.size === 2;
	  } catch(e) {
	    return false;
	  }
	})();

	/**
	 * Check if BlobBuilder is supported
	 */

	var blobBuilderSupported = BlobBuilder
	  && BlobBuilder.prototype.append
	  && BlobBuilder.prototype.getBlob;

	/**
	 * Helper function that maps ArrayBufferViews to ArrayBuffers
	 * Used by BlobBuilder constructor and old browsers that didn't
	 * support it in the Blob constructor.
	 */

	function mapArrayBufferViews(ary) {
	  for (var i = 0; i < ary.length; i++) {
	    var chunk = ary[i];
	    if (chunk.buffer instanceof ArrayBuffer) {
	      var buf = chunk.buffer;

	      // if this is a subarray, make a copy so we only
	      // include the subarray region from the underlying buffer
	      if (chunk.byteLength !== buf.byteLength) {
	        var copy = new Uint8Array(chunk.byteLength);
	        copy.set(new Uint8Array(buf, chunk.byteOffset, chunk.byteLength));
	        buf = copy.buffer;
	      }

	      ary[i] = buf;
	    }
	  }
	}

	function BlobBuilderConstructor(ary, options) {
	  options = options || {};

	  var bb = new BlobBuilder();
	  mapArrayBufferViews(ary);

	  for (var i = 0; i < ary.length; i++) {
	    bb.append(ary[i]);
	  }

	  return (options.type) ? bb.getBlob(options.type) : bb.getBlob();
	};

	function BlobConstructor(ary, options) {
	  mapArrayBufferViews(ary);
	  return new Blob(ary, options || {});
	};

	module.exports = (function() {
	  if (blobSupported) {
	    return blobSupportsArrayBufferView ? global.Blob : BlobConstructor;
	  } else if (blobBuilderSupported) {
	    return BlobBuilderConstructor;
	  } else {
	    return undefined;
	  }
	})();

	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },
/* 35 */
/***/ function(module, exports) {

	/**
	 * Compiles a querystring
	 * Returns string representation of the object
	 *
	 * @param {Object}
	 * @api private
	 */

	exports.encode = function (obj) {
	  var str = '';

	  for (var i in obj) {
	    if (obj.hasOwnProperty(i)) {
	      if (str.length) str += '&';
	      str += encodeURIComponent(i) + '=' + encodeURIComponent(obj[i]);
	    }
	  }

	  return str;
	};

	/**
	 * Parses a simple querystring into an object
	 *
	 * @param {String} qs
	 * @api private
	 */

	exports.decode = function(qs){
	  var qry = {};
	  var pairs = qs.split('&');
	  for (var i = 0, l = pairs.length; i < l; i++) {
	    var pair = pairs[i].split('=');
	    qry[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1]);
	  }
	  return qry;
	};


/***/ },
/* 36 */
/***/ function(module, exports) {

	
	module.exports = function(a, b){
	  var fn = function(){};
	  fn.prototype = b.prototype;
	  a.prototype = new fn;
	  a.prototype.constructor = a;
	};

/***/ },
/* 37 */
/***/ function(module, exports, __webpack_require__) {

	
	/**
	 * This is the web browser implementation of `debug()`.
	 *
	 * Expose `debug()` as the module.
	 */

	exports = module.exports = __webpack_require__(38);
	exports.log = log;
	exports.formatArgs = formatArgs;
	exports.save = save;
	exports.load = load;
	exports.useColors = useColors;

	/**
	 * Colors.
	 */

	exports.colors = [
	  'lightseagreen',
	  'forestgreen',
	  'goldenrod',
	  'dodgerblue',
	  'darkorchid',
	  'crimson'
	];

	/**
	 * Currently only WebKit-based Web Inspectors, Firefox >= v31,
	 * and the Firebug extension (any Firefox version) are known
	 * to support "%c" CSS customizations.
	 *
	 * TODO: add a `localStorage` variable to explicitly enable/disable colors
	 */

	function useColors() {
	  // is webkit? http://stackoverflow.com/a/16459606/376773
	  return ('WebkitAppearance' in document.documentElement.style) ||
	    // is firebug? http://stackoverflow.com/a/398120/376773
	    (window.console && (console.firebug || (console.exception && console.table))) ||
	    // is firefox >= v31?
	    // https://developer.mozilla.org/en-US/docs/Tools/Web_Console#Styling_messages
	    (navigator.userAgent.toLowerCase().match(/firefox\/(\d+)/) && parseInt(RegExp.$1, 10) >= 31);
	}

	/**
	 * Map %j to `JSON.stringify()`, since no Web Inspectors do that by default.
	 */

	exports.formatters.j = function(v) {
	  return JSON.stringify(v);
	};


	/**
	 * Colorize log arguments if enabled.
	 *
	 * @api public
	 */

	function formatArgs() {
	  var args = arguments;
	  var useColors = this.useColors;

	  args[0] = (useColors ? '%c' : '')
	    + this.namespace
	    + (useColors ? ' %c' : ' ')
	    + args[0]
	    + (useColors ? '%c ' : ' ')
	    + '+' + exports.humanize(this.diff);

	  if (!useColors) return args;

	  var c = 'color: ' + this.color;
	  args = [args[0], c, 'color: inherit'].concat(Array.prototype.slice.call(args, 1));

	  // the final "%c" is somewhat tricky, because there could be other
	  // arguments passed either before or after the %c, so we need to
	  // figure out the correct index to insert the CSS into
	  var index = 0;
	  var lastC = 0;
	  args[0].replace(/%[a-z%]/g, function(match) {
	    if ('%%' === match) return;
	    index++;
	    if ('%c' === match) {
	      // we only are interested in the *last* %c
	      // (the user may have provided their own)
	      lastC = index;
	    }
	  });

	  args.splice(lastC, 0, c);
	  return args;
	}

	/**
	 * Invokes `console.log()` when available.
	 * No-op when `console.log` is not a "function".
	 *
	 * @api public
	 */

	function log() {
	  // This hackery is required for IE8,
	  // where the `console.log` function doesn't have 'apply'
	  return 'object' == typeof console
	    && 'function' == typeof console.log
	    && Function.prototype.apply.call(console.log, console, arguments);
	}

	/**
	 * Save `namespaces`.
	 *
	 * @param {String} namespaces
	 * @api private
	 */

	function save(namespaces) {
	  try {
	    if (null == namespaces) {
	      localStorage.removeItem('debug');
	    } else {
	      localStorage.debug = namespaces;
	    }
	  } catch(e) {}
	}

	/**
	 * Load `namespaces`.
	 *
	 * @return {String} returns the previously persisted debug modes
	 * @api private
	 */

	function load() {
	  var r;
	  try {
	    r = localStorage.debug;
	  } catch(e) {}
	  return r;
	}

	/**
	 * Enable namespaces listed in `localStorage.debug` initially.
	 */

	exports.enable(load());


/***/ },
/* 38 */
/***/ function(module, exports, __webpack_require__) {

	
	/**
	 * This is the common logic for both the Node.js and web browser
	 * implementations of `debug()`.
	 *
	 * Expose `debug()` as the module.
	 */

	exports = module.exports = debug;
	exports.coerce = coerce;
	exports.disable = disable;
	exports.enable = enable;
	exports.enabled = enabled;
	exports.humanize = __webpack_require__(39);

	/**
	 * The currently active debug mode names, and names to skip.
	 */

	exports.names = [];
	exports.skips = [];

	/**
	 * Map of special "%n" handling functions, for the debug "format" argument.
	 *
	 * Valid key names are a single, lowercased letter, i.e. "n".
	 */

	exports.formatters = {};

	/**
	 * Previously assigned color.
	 */

	var prevColor = 0;

	/**
	 * Previous log timestamp.
	 */

	var prevTime;

	/**
	 * Select a color.
	 *
	 * @return {Number}
	 * @api private
	 */

	function selectColor() {
	  return exports.colors[prevColor++ % exports.colors.length];
	}

	/**
	 * Create a debugger with the given `namespace`.
	 *
	 * @param {String} namespace
	 * @return {Function}
	 * @api public
	 */

	function debug(namespace) {

	  // define the `disabled` version
	  function disabled() {
	  }
	  disabled.enabled = false;

	  // define the `enabled` version
	  function enabled() {

	    var self = enabled;

	    // set `diff` timestamp
	    var curr = +new Date();
	    var ms = curr - (prevTime || curr);
	    self.diff = ms;
	    self.prev = prevTime;
	    self.curr = curr;
	    prevTime = curr;

	    // add the `color` if not set
	    if (null == self.useColors) self.useColors = exports.useColors();
	    if (null == self.color && self.useColors) self.color = selectColor();

	    var args = Array.prototype.slice.call(arguments);

	    args[0] = exports.coerce(args[0]);

	    if ('string' !== typeof args[0]) {
	      // anything else let's inspect with %o
	      args = ['%o'].concat(args);
	    }

	    // apply any `formatters` transformations
	    var index = 0;
	    args[0] = args[0].replace(/%([a-z%])/g, function(match, format) {
	      // if we encounter an escaped % then don't increase the array index
	      if (match === '%%') return match;
	      index++;
	      var formatter = exports.formatters[format];
	      if ('function' === typeof formatter) {
	        var val = args[index];
	        match = formatter.call(self, val);

	        // now we need to remove `args[index]` since it's inlined in the `format`
	        args.splice(index, 1);
	        index--;
	      }
	      return match;
	    });

	    if ('function' === typeof exports.formatArgs) {
	      args = exports.formatArgs.apply(self, args);
	    }
	    var logFn = enabled.log || exports.log || console.log.bind(console);
	    logFn.apply(self, args);
	  }
	  enabled.enabled = true;

	  var fn = exports.enabled(namespace) ? enabled : disabled;

	  fn.namespace = namespace;

	  return fn;
	}

	/**
	 * Enables a debug mode by namespaces. This can include modes
	 * separated by a colon and wildcards.
	 *
	 * @param {String} namespaces
	 * @api public
	 */

	function enable(namespaces) {
	  exports.save(namespaces);

	  var split = (namespaces || '').split(/[\s,]+/);
	  var len = split.length;

	  for (var i = 0; i < len; i++) {
	    if (!split[i]) continue; // ignore empty strings
	    namespaces = split[i].replace(/\*/g, '.*?');
	    if (namespaces[0] === '-') {
	      exports.skips.push(new RegExp('^' + namespaces.substr(1) + '$'));
	    } else {
	      exports.names.push(new RegExp('^' + namespaces + '$'));
	    }
	  }
	}

	/**
	 * Disable debug output.
	 *
	 * @api public
	 */

	function disable() {
	  exports.enable('');
	}

	/**
	 * Returns true if the given mode name is enabled, false otherwise.
	 *
	 * @param {String} name
	 * @return {Boolean}
	 * @api public
	 */

	function enabled(name) {
	  var i, len;
	  for (i = 0, len = exports.skips.length; i < len; i++) {
	    if (exports.skips[i].test(name)) {
	      return false;
	    }
	  }
	  for (i = 0, len = exports.names.length; i < len; i++) {
	    if (exports.names[i].test(name)) {
	      return true;
	    }
	  }
	  return false;
	}

	/**
	 * Coerce `val`.
	 *
	 * @param {Mixed} val
	 * @return {Mixed}
	 * @api private
	 */

	function coerce(val) {
	  if (val instanceof Error) return val.stack || val.message;
	  return val;
	}


/***/ },
/* 39 */
/***/ function(module, exports) {

	/**
	 * Helpers.
	 */

	var s = 1000;
	var m = s * 60;
	var h = m * 60;
	var d = h * 24;
	var y = d * 365.25;

	/**
	 * Parse or format the given `val`.
	 *
	 * Options:
	 *
	 *  - `long` verbose formatting [false]
	 *
	 * @param {String|Number} val
	 * @param {Object} options
	 * @return {String|Number}
	 * @api public
	 */

	module.exports = function(val, options){
	  options = options || {};
	  if ('string' == typeof val) return parse(val);
	  return options.long
	    ? long(val)
	    : short(val);
	};

	/**
	 * Parse the given `str` and return milliseconds.
	 *
	 * @param {String} str
	 * @return {Number}
	 * @api private
	 */

	function parse(str) {
	  var match = /^((?:\d+)?\.?\d+) *(ms|seconds?|s|minutes?|m|hours?|h|days?|d|years?|y)?$/i.exec(str);
	  if (!match) return;
	  var n = parseFloat(match[1]);
	  var type = (match[2] || 'ms').toLowerCase();
	  switch (type) {
	    case 'years':
	    case 'year':
	    case 'y':
	      return n * y;
	    case 'days':
	    case 'day':
	    case 'd':
	      return n * d;
	    case 'hours':
	    case 'hour':
	    case 'h':
	      return n * h;
	    case 'minutes':
	    case 'minute':
	    case 'm':
	      return n * m;
	    case 'seconds':
	    case 'second':
	    case 's':
	      return n * s;
	    case 'ms':
	      return n;
	  }
	}

	/**
	 * Short format for `ms`.
	 *
	 * @param {Number} ms
	 * @return {String}
	 * @api private
	 */

	function short(ms) {
	  if (ms >= d) return Math.round(ms / d) + 'd';
	  if (ms >= h) return Math.round(ms / h) + 'h';
	  if (ms >= m) return Math.round(ms / m) + 'm';
	  if (ms >= s) return Math.round(ms / s) + 's';
	  return ms + 'ms';
	}

	/**
	 * Long format for `ms`.
	 *
	 * @param {Number} ms
	 * @return {String}
	 * @api private
	 */

	function long(ms) {
	  return plural(ms, d, 'day')
	    || plural(ms, h, 'hour')
	    || plural(ms, m, 'minute')
	    || plural(ms, s, 'second')
	    || ms + ' ms';
	}

	/**
	 * Pluralization helper.
	 */

	function plural(ms, n, name) {
	  if (ms < n) return;
	  if (ms < n * 1.5) return Math.floor(ms / n) + ' ' + name;
	  return Math.ceil(ms / n) + ' ' + name + 's';
	}


/***/ },
/* 40 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global) {
	/**
	 * Module requirements.
	 */

	var Polling = __webpack_require__(23);
	var inherit = __webpack_require__(36);

	/**
	 * Module exports.
	 */

	module.exports = JSONPPolling;

	/**
	 * Cached regular expressions.
	 */

	var rNewline = /\n/g;
	var rEscapedNewline = /\\n/g;

	/**
	 * Global JSONP callbacks.
	 */

	var callbacks;

	/**
	 * Callbacks count.
	 */

	var index = 0;

	/**
	 * Noop.
	 */

	function empty () { }

	/**
	 * JSONP Polling constructor.
	 *
	 * @param {Object} opts.
	 * @api public
	 */

	function JSONPPolling (opts) {
	  Polling.call(this, opts);

	  this.query = this.query || {};

	  // define global callbacks array if not present
	  // we do this here (lazily) to avoid unneeded global pollution
	  if (!callbacks) {
	    // we need to consider multiple engines in the same page
	    if (!global.___eio) global.___eio = [];
	    callbacks = global.___eio;
	  }

	  // callback identifier
	  this.index = callbacks.length;

	  // add callback to jsonp global
	  var self = this;
	  callbacks.push(function (msg) {
	    self.onData(msg);
	  });

	  // append to query string
	  this.query.j = this.index;

	  // prevent spurious errors from being emitted when the window is unloaded
	  if (global.document && global.addEventListener) {
	    global.addEventListener('beforeunload', function () {
	      if (self.script) self.script.onerror = empty;
	    }, false);
	  }
	}

	/**
	 * Inherits from Polling.
	 */

	inherit(JSONPPolling, Polling);

	/*
	 * JSONP only supports binary as base64 encoded strings
	 */

	JSONPPolling.prototype.supportsBinary = false;

	/**
	 * Closes the socket.
	 *
	 * @api private
	 */

	JSONPPolling.prototype.doClose = function () {
	  if (this.script) {
	    this.script.parentNode.removeChild(this.script);
	    this.script = null;
	  }

	  if (this.form) {
	    this.form.parentNode.removeChild(this.form);
	    this.form = null;
	    this.iframe = null;
	  }

	  Polling.prototype.doClose.call(this);
	};

	/**
	 * Starts a poll cycle.
	 *
	 * @api private
	 */

	JSONPPolling.prototype.doPoll = function () {
	  var self = this;
	  var script = document.createElement('script');

	  if (this.script) {
	    this.script.parentNode.removeChild(this.script);
	    this.script = null;
	  }

	  script.async = true;
	  script.src = this.uri();
	  script.onerror = function(e){
	    self.onError('jsonp poll error',e);
	  };

	  var insertAt = document.getElementsByTagName('script')[0];
	  insertAt.parentNode.insertBefore(script, insertAt);
	  this.script = script;

	  var isUAgecko = 'undefined' != typeof navigator && /gecko/i.test(navigator.userAgent);
	  
	  if (isUAgecko) {
	    setTimeout(function () {
	      var iframe = document.createElement('iframe');
	      document.body.appendChild(iframe);
	      document.body.removeChild(iframe);
	    }, 100);
	  }
	};

	/**
	 * Writes with a hidden iframe.
	 *
	 * @param {String} data to send
	 * @param {Function} called upon flush.
	 * @api private
	 */

	JSONPPolling.prototype.doWrite = function (data, fn) {
	  var self = this;

	  if (!this.form) {
	    var form = document.createElement('form');
	    var area = document.createElement('textarea');
	    var id = this.iframeId = 'eio_iframe_' + this.index;
	    var iframe;

	    form.className = 'socketio';
	    form.style.position = 'absolute';
	    form.style.top = '-1000px';
	    form.style.left = '-1000px';
	    form.target = id;
	    form.method = 'POST';
	    form.setAttribute('accept-charset', 'utf-8');
	    area.name = 'd';
	    form.appendChild(area);
	    document.body.appendChild(form);

	    this.form = form;
	    this.area = area;
	  }

	  this.form.action = this.uri();

	  function complete () {
	    initIframe();
	    fn();
	  }

	  function initIframe () {
	    if (self.iframe) {
	      try {
	        self.form.removeChild(self.iframe);
	      } catch (e) {
	        self.onError('jsonp polling iframe removal error', e);
	      }
	    }

	    try {
	      // ie6 dynamic iframes with target="" support (thanks Chris Lambacher)
	      var html = '<iframe src="javascript:0" name="'+ self.iframeId +'">';
	      iframe = document.createElement(html);
	    } catch (e) {
	      iframe = document.createElement('iframe');
	      iframe.name = self.iframeId;
	      iframe.src = 'javascript:0';
	    }

	    iframe.id = self.iframeId;

	    self.form.appendChild(iframe);
	    self.iframe = iframe;
	  }

	  initIframe();

	  // escape \n to prevent it from being converted into \r\n by some UAs
	  // double escaping is required for escaped new lines because unescaping of new lines can be done safely on server-side
	  data = data.replace(rEscapedNewline, '\\\n');
	  this.area.value = data.replace(rNewline, '\\n');

	  try {
	    this.form.submit();
	  } catch(e) {}

	  if (this.iframe.attachEvent) {
	    this.iframe.onreadystatechange = function(){
	      if (self.iframe.readyState == 'complete') {
	        complete();
	      }
	    };
	  } else {
	    this.iframe.onload = complete;
	  }
	};

	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },
/* 41 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Module dependencies.
	 */

	var Transport = __webpack_require__(24);
	var parser = __webpack_require__(25);
	var parseqs = __webpack_require__(35);
	var inherit = __webpack_require__(36);
	var debug = __webpack_require__(37)('engine.io-client:websocket');

	/**
	 * `ws` exposes a WebSocket-compatible interface in
	 * Node, or the `WebSocket` or `MozWebSocket` globals
	 * in the browser.
	 */

	var WebSocket = __webpack_require__(42);

	/**
	 * Module exports.
	 */

	module.exports = WS;

	/**
	 * WebSocket transport constructor.
	 *
	 * @api {Object} connection options
	 * @api public
	 */

	function WS(opts){
	  var forceBase64 = (opts && opts.forceBase64);
	  if (forceBase64) {
	    this.supportsBinary = false;
	  }
	  Transport.call(this, opts);
	}

	/**
	 * Inherits from Transport.
	 */

	inherit(WS, Transport);

	/**
	 * Transport name.
	 *
	 * @api public
	 */

	WS.prototype.name = 'websocket';

	/*
	 * WebSockets support binary
	 */

	WS.prototype.supportsBinary = true;

	/**
	 * Opens socket.
	 *
	 * @api private
	 */

	WS.prototype.doOpen = function(){
	  if (!this.check()) {
	    // let probe timeout
	    return;
	  }

	  var self = this;
	  var uri = this.uri();
	  var protocols = void(0);
	  var opts = { agent: this.agent };

	  // SSL options for Node.js client
	  opts.pfx = this.pfx;
	  opts.key = this.key;
	  opts.passphrase = this.passphrase;
	  opts.cert = this.cert;
	  opts.ca = this.ca;
	  opts.ciphers = this.ciphers;
	  opts.rejectUnauthorized = this.rejectUnauthorized;

	  this.ws = new WebSocket(uri, protocols, opts);

	  if (this.ws.binaryType === undefined) {
	    this.supportsBinary = false;
	  }

	  this.ws.binaryType = 'arraybuffer';
	  this.addEventListeners();
	};

	/**
	 * Adds event listeners to the socket
	 *
	 * @api private
	 */

	WS.prototype.addEventListeners = function(){
	  var self = this;

	  this.ws.onopen = function(){
	    self.onOpen();
	  };
	  this.ws.onclose = function(){
	    self.onClose();
	  };
	  this.ws.onmessage = function(ev){
	    self.onData(ev.data);
	  };
	  this.ws.onerror = function(e){
	    self.onError('websocket error', e);
	  };
	};

	/**
	 * Override `onData` to use a timer on iOS.
	 * See: https://gist.github.com/mloughran/2052006
	 *
	 * @api private
	 */

	if ('undefined' != typeof navigator
	  && /iPad|iPhone|iPod/i.test(navigator.userAgent)) {
	  WS.prototype.onData = function(data){
	    var self = this;
	    setTimeout(function(){
	      Transport.prototype.onData.call(self, data);
	    }, 0);
	  };
	}

	/**
	 * Writes data to socket.
	 *
	 * @param {Array} array of packets.
	 * @api private
	 */

	WS.prototype.write = function(packets){
	  var self = this;
	  this.writable = false;
	  // encodePacket efficient as it uses WS framing
	  // no need for encodePayload
	  for (var i = 0, l = packets.length; i < l; i++) {
	    parser.encodePacket(packets[i], this.supportsBinary, function(data) {
	      //Sometimes the websocket has already been closed but the browser didn't
	      //have a chance of informing us about it yet, in that case send will
	      //throw an error
	      try {
	        self.ws.send(data);
	      } catch (e){
	        debug('websocket closed before onclose event');
	      }
	    });
	  }

	  function ondrain() {
	    self.writable = true;
	    self.emit('drain');
	  }
	  // fake drain
	  // defer to next tick to allow Socket to clear writeBuffer
	  setTimeout(ondrain, 0);
	};

	/**
	 * Called upon close
	 *
	 * @api private
	 */

	WS.prototype.onClose = function(){
	  Transport.prototype.onClose.call(this);
	};

	/**
	 * Closes socket.
	 *
	 * @api private
	 */

	WS.prototype.doClose = function(){
	  if (typeof this.ws !== 'undefined') {
	    this.ws.close();
	  }
	};

	/**
	 * Generates uri for connection.
	 *
	 * @api private
	 */

	WS.prototype.uri = function(){
	  var query = this.query || {};
	  var schema = this.secure ? 'wss' : 'ws';
	  var port = '';

	  // avoid port if default for schema
	  if (this.port && (('wss' == schema && this.port != 443)
	    || ('ws' == schema && this.port != 80))) {
	    port = ':' + this.port;
	  }

	  // append timestamp to URI
	  if (this.timestampRequests) {
	    query[this.timestampParam] = +new Date;
	  }

	  // communicate binary support capabilities
	  if (!this.supportsBinary) {
	    query.b64 = 1;
	  }

	  query = parseqs.encode(query);

	  // prepend ? to query
	  if (query.length) {
	    query = '?' + query;
	  }

	  return schema + '://' + this.hostname + port + this.path + query;
	};

	/**
	 * Feature detection for WebSocket.
	 *
	 * @return {Boolean} whether this transport is available.
	 * @api public
	 */

	WS.prototype.check = function(){
	  return !!WebSocket && !('__initialize' in WebSocket && this.name === WS.prototype.name);
	};


/***/ },
/* 42 */
/***/ function(module, exports) {

	
	/**
	 * Module dependencies.
	 */

	var global = (function() { return this; })();

	/**
	 * WebSocket constructor.
	 */

	var WebSocket = global.WebSocket || global.MozWebSocket;

	/**
	 * Module exports.
	 */

	module.exports = WebSocket ? ws : null;

	/**
	 * WebSocket constructor.
	 *
	 * The third `opts` options object gets ignored in web browsers, since it's
	 * non-standard, and throws a TypeError if passed to the constructor.
	 * See: https://github.com/einaros/ws/issues/227
	 *
	 * @param {String} uri
	 * @param {Array} protocols (optional)
	 * @param {Object) opts (optional)
	 * @api public
	 */

	function ws(uri, protocols, opts) {
	  var instance;
	  if (protocols) {
	    instance = new WebSocket(uri, protocols);
	  } else {
	    instance = new WebSocket(uri);
	  }
	  return instance;
	}

	if (WebSocket) ws.prototype = WebSocket.prototype;


/***/ },
/* 43 */
/***/ function(module, exports) {

	
	var indexOf = [].indexOf;

	module.exports = function(arr, obj){
	  if (indexOf) return arr.indexOf(obj);
	  for (var i = 0; i < arr.length; ++i) {
	    if (arr[i] === obj) return i;
	  }
	  return -1;
	};

/***/ },
/* 44 */
/***/ function(module, exports) {

	/**
	 * Parses an URI
	 *
	 * @author Steven Levithan <stevenlevithan.com> (MIT license)
	 * @api private
	 */

	var re = /^(?:(?![^:@]+:[^:@\/]*@)(http|https|ws|wss):\/\/)?((?:(([^:@]*)(?::([^:@]*))?)?@)?((?:[a-f0-9]{0,4}:){2,7}[a-f0-9]{0,4}|[^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/;

	var parts = [
	    'source', 'protocol', 'authority', 'userInfo', 'user', 'password', 'host', 'port', 'relative', 'path', 'directory', 'file', 'query', 'anchor'
	];

	module.exports = function parseuri(str) {
	    var src = str,
	        b = str.indexOf('['),
	        e = str.indexOf(']');

	    if (b != -1 && e != -1) {
	        str = str.substring(0, b) + str.substring(b, e).replace(/:/g, ';') + str.substring(e, str.length);
	    }

	    var m = re.exec(str || ''),
	        uri = {},
	        i = 14;

	    while (i--) {
	        uri[parts[i]] = m[i] || '';
	    }

	    if (b != -1 && e != -1) {
	        uri.source = src;
	        uri.host = uri.host.substring(1, uri.host.length - 1).replace(/;/g, ':');
	        uri.authority = uri.authority.replace('[', '').replace(']', '').replace(/;/g, ':');
	        uri.ipv6uri = true;
	    }

	    return uri;
	};


/***/ },
/* 45 */
/***/ function(module, exports) {

	/* WEBPACK VAR INJECTION */(function(global) {/**
	 * JSON parse.
	 *
	 * @see Based on jQuery#parseJSON (MIT) and JSON2
	 * @api private
	 */

	var rvalidchars = /^[\],:{}\s]*$/;
	var rvalidescape = /\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g;
	var rvalidtokens = /"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g;
	var rvalidbraces = /(?:^|:|,)(?:\s*\[)+/g;
	var rtrimLeft = /^\s+/;
	var rtrimRight = /\s+$/;

	module.exports = function parsejson(data) {
	  if ('string' != typeof data || !data) {
	    return null;
	  }

	  data = data.replace(rtrimLeft, '').replace(rtrimRight, '');

	  // Attempt to parse using the native JSON parser first
	  if (global.JSON && JSON.parse) {
	    return JSON.parse(data);
	  }

	  if (rvalidchars.test(data.replace(rvalidescape, '@')
	      .replace(rvalidtokens, ']')
	      .replace(rvalidbraces, ''))) {
	    return (new Function('return ' + data))();
	  }
	};
	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },
/* 46 */
/***/ function(module, exports, __webpack_require__) {

	
	/**
	 * Module dependencies.
	 */

	var parser = __webpack_require__(7);
	var Emitter = __webpack_require__(11);
	var toArray = __webpack_require__(47);
	var on = __webpack_require__(48);
	var bind = __webpack_require__(49);
	var debug = __webpack_require__(6)('socket.io-client:socket');
	var hasBin = __webpack_require__(27);

	/**
	 * Module exports.
	 */

	module.exports = exports = Socket;

	/**
	 * Internal events (blacklisted).
	 * These events can't be emitted by the user.
	 *
	 * @api private
	 */

	var events = {
	  connect: 1,
	  connect_error: 1,
	  connect_timeout: 1,
	  disconnect: 1,
	  error: 1,
	  reconnect: 1,
	  reconnect_attempt: 1,
	  reconnect_failed: 1,
	  reconnect_error: 1,
	  reconnecting: 1
	};

	/**
	 * Shortcut to `Emitter#emit`.
	 */

	var emit = Emitter.prototype.emit;

	/**
	 * `Socket` constructor.
	 *
	 * @api public
	 */

	function Socket(io, nsp){
	  this.io = io;
	  this.nsp = nsp;
	  this.json = this; // compat
	  this.ids = 0;
	  this.acks = {};
	  if (this.io.autoConnect) this.open();
	  this.receiveBuffer = [];
	  this.sendBuffer = [];
	  this.connected = false;
	  this.disconnected = true;
	}

	/**
	 * Mix in `Emitter`.
	 */

	Emitter(Socket.prototype);

	/**
	 * Subscribe to open, close and packet events
	 *
	 * @api private
	 */

	Socket.prototype.subEvents = function() {
	  if (this.subs) return;

	  var io = this.io;
	  this.subs = [
	    on(io, 'open', bind(this, 'onopen')),
	    on(io, 'packet', bind(this, 'onpacket')),
	    on(io, 'close', bind(this, 'onclose'))
	  ];
	};

	/**
	 * "Opens" the socket.
	 *
	 * @api public
	 */

	Socket.prototype.open =
	Socket.prototype.connect = function(){
	  if (this.connected) return this;

	  this.subEvents();
	  this.io.open(); // ensure open
	  if ('open' == this.io.readyState) this.onopen();
	  return this;
	};

	/**
	 * Sends a `message` event.
	 *
	 * @return {Socket} self
	 * @api public
	 */

	Socket.prototype.send = function(){
	  var args = toArray(arguments);
	  args.unshift('message');
	  this.emit.apply(this, args);
	  return this;
	};

	/**
	 * Override `emit`.
	 * If the event is in `events`, it's emitted normally.
	 *
	 * @param {String} event name
	 * @return {Socket} self
	 * @api public
	 */

	Socket.prototype.emit = function(ev){
	  if (events.hasOwnProperty(ev)) {
	    emit.apply(this, arguments);
	    return this;
	  }

	  var args = toArray(arguments);
	  var parserType = parser.EVENT; // default
	  if (hasBin(args)) { parserType = parser.BINARY_EVENT; } // binary
	  var packet = { type: parserType, data: args };

	  // event ack callback
	  if ('function' == typeof args[args.length - 1]) {
	    debug('emitting packet with ack id %d', this.ids);
	    this.acks[this.ids] = args.pop();
	    packet.id = this.ids++;
	  }

	  if (this.connected) {
	    this.packet(packet);
	  } else {
	    this.sendBuffer.push(packet);
	  }

	  return this;
	};

	/**
	 * Sends a packet.
	 *
	 * @param {Object} packet
	 * @api private
	 */

	Socket.prototype.packet = function(packet){
	  packet.nsp = this.nsp;
	  this.io.packet(packet);
	};

	/**
	 * Called upon engine `open`.
	 *
	 * @api private
	 */

	Socket.prototype.onopen = function(){
	  debug('transport is open - connecting');

	  // write connect packet if necessary
	  if ('/' != this.nsp) {
	    this.packet({ type: parser.CONNECT });
	  }
	};

	/**
	 * Called upon engine `close`.
	 *
	 * @param {String} reason
	 * @api private
	 */

	Socket.prototype.onclose = function(reason){
	  debug('close (%s)', reason);
	  this.connected = false;
	  this.disconnected = true;
	  delete this.id;
	  this.emit('disconnect', reason);
	};

	/**
	 * Called with socket packet.
	 *
	 * @param {Object} packet
	 * @api private
	 */

	Socket.prototype.onpacket = function(packet){
	  if (packet.nsp != this.nsp) return;

	  switch (packet.type) {
	    case parser.CONNECT:
	      this.onconnect();
	      break;

	    case parser.EVENT:
	      this.onevent(packet);
	      break;

	    case parser.BINARY_EVENT:
	      this.onevent(packet);
	      break;

	    case parser.ACK:
	      this.onack(packet);
	      break;

	    case parser.BINARY_ACK:
	      this.onack(packet);
	      break;

	    case parser.DISCONNECT:
	      this.ondisconnect();
	      break;

	    case parser.ERROR:
	      this.emit('error', packet.data);
	      break;
	  }
	};

	/**
	 * Called upon a server event.
	 *
	 * @param {Object} packet
	 * @api private
	 */

	Socket.prototype.onevent = function(packet){
	  var args = packet.data || [];
	  debug('emitting event %j', args);

	  if (null != packet.id) {
	    debug('attaching ack callback to event');
	    args.push(this.ack(packet.id));
	  }

	  if (this.connected) {
	    emit.apply(this, args);
	  } else {
	    this.receiveBuffer.push(args);
	  }
	};

	/**
	 * Produces an ack callback to emit with an event.
	 *
	 * @api private
	 */

	Socket.prototype.ack = function(id){
	  var self = this;
	  var sent = false;
	  return function(){
	    // prevent double callbacks
	    if (sent) return;
	    sent = true;
	    var args = toArray(arguments);
	    debug('sending ack %j', args);

	    var type = hasBin(args) ? parser.BINARY_ACK : parser.ACK;
	    self.packet({
	      type: type,
	      id: id,
	      data: args
	    });
	  };
	};

	/**
	 * Called upon a server acknowlegement.
	 *
	 * @param {Object} packet
	 * @api private
	 */

	Socket.prototype.onack = function(packet){
	  debug('calling ack %s with %j', packet.id, packet.data);
	  var fn = this.acks[packet.id];
	  fn.apply(this, packet.data);
	  delete this.acks[packet.id];
	};

	/**
	 * Called upon server connect.
	 *
	 * @api private
	 */

	Socket.prototype.onconnect = function(){
	  this.connected = true;
	  this.disconnected = false;
	  this.emit('connect');
	  this.emitBuffered();
	};

	/**
	 * Emit buffered events (received and emitted).
	 *
	 * @api private
	 */

	Socket.prototype.emitBuffered = function(){
	  var i;
	  for (i = 0; i < this.receiveBuffer.length; i++) {
	    emit.apply(this, this.receiveBuffer[i]);
	  }
	  this.receiveBuffer = [];

	  for (i = 0; i < this.sendBuffer.length; i++) {
	    this.packet(this.sendBuffer[i]);
	  }
	  this.sendBuffer = [];
	};

	/**
	 * Called upon server disconnect.
	 *
	 * @api private
	 */

	Socket.prototype.ondisconnect = function(){
	  debug('server disconnect (%s)', this.nsp);
	  this.destroy();
	  this.onclose('io server disconnect');
	};

	/**
	 * Called upon forced client/server side disconnections,
	 * this method ensures the manager stops tracking us and
	 * that reconnections don't get triggered for this.
	 *
	 * @api private.
	 */

	Socket.prototype.destroy = function(){
	  if (this.subs) {
	    // clean subscriptions to avoid reconnections
	    for (var i = 0; i < this.subs.length; i++) {
	      this.subs[i].destroy();
	    }
	    this.subs = null;
	  }

	  this.io.destroy(this);
	};

	/**
	 * Disconnects the socket manually.
	 *
	 * @return {Socket} self
	 * @api public
	 */

	Socket.prototype.close =
	Socket.prototype.disconnect = function(){
	  if (this.connected) {
	    debug('performing disconnect (%s)', this.nsp);
	    this.packet({ type: parser.DISCONNECT });
	  }

	  // remove socket from pool
	  this.destroy();

	  if (this.connected) {
	    // fire events
	    this.onclose('io client disconnect');
	  }
	  return this;
	};


/***/ },
/* 47 */
/***/ function(module, exports) {

	module.exports = toArray

	function toArray(list, index) {
	    var array = []

	    index = index || 0

	    for (var i = index || 0; i < list.length; i++) {
	        array[i - index] = list[i]
	    }

	    return array
	}


/***/ },
/* 48 */
/***/ function(module, exports) {

	
	/**
	 * Module exports.
	 */

	module.exports = on;

	/**
	 * Helper for subscriptions.
	 *
	 * @param {Object|EventEmitter} obj with `Emitter` mixin or `EventEmitter`
	 * @param {String} event name
	 * @param {Function} callback
	 * @api public
	 */

	function on(obj, ev, fn) {
	  obj.on(ev, fn);
	  return {
	    destroy: function(){
	      obj.removeListener(ev, fn);
	    }
	  };
	}


/***/ },
/* 49 */
/***/ function(module, exports) {

	/**
	 * Slice reference.
	 */

	var slice = [].slice;

	/**
	 * Bind `obj` to `fn`.
	 *
	 * @param {Object} obj
	 * @param {Function|String} fn or string
	 * @return {Function}
	 * @api public
	 */

	module.exports = function(obj, fn){
	  if ('string' == typeof fn) fn = obj[fn];
	  if ('function' != typeof fn) throw new Error('bind() requires a function');
	  var args = slice.call(arguments, 2);
	  return function(){
	    return fn.apply(obj, args.concat(slice.call(arguments)));
	  }
	};


/***/ },
/* 50 */
/***/ function(module, exports) {

	
	/**
	 * HOP ref.
	 */

	var has = Object.prototype.hasOwnProperty;

	/**
	 * Return own keys in `obj`.
	 *
	 * @param {Object} obj
	 * @return {Array}
	 * @api public
	 */

	exports.keys = Object.keys || function(obj){
	  var keys = [];
	  for (var key in obj) {
	    if (has.call(obj, key)) {
	      keys.push(key);
	    }
	  }
	  return keys;
	};

	/**
	 * Return own values in `obj`.
	 *
	 * @param {Object} obj
	 * @return {Array}
	 * @api public
	 */

	exports.values = function(obj){
	  var vals = [];
	  for (var key in obj) {
	    if (has.call(obj, key)) {
	      vals.push(obj[key]);
	    }
	  }
	  return vals;
	};

	/**
	 * Merge `b` into `a`.
	 *
	 * @param {Object} a
	 * @param {Object} b
	 * @return {Object} a
	 * @api public
	 */

	exports.merge = function(a, b){
	  for (var key in b) {
	    if (has.call(b, key)) {
	      a[key] = b[key];
	    }
	  }
	  return a;
	};

	/**
	 * Return length of `obj`.
	 *
	 * @param {Object} obj
	 * @return {Number}
	 * @api public
	 */

	exports.length = function(obj){
	  return exports.keys(obj).length;
	};

	/**
	 * Check if `obj` is empty.
	 *
	 * @param {Object} obj
	 * @return {Boolean}
	 * @api public
	 */

	exports.isEmpty = function(obj){
	  return 0 == exports.length(obj);
	};

/***/ },
/* 51 */
/***/ function(module, exports) {

	
	/**
	 * Expose `Backoff`.
	 */

	module.exports = Backoff;

	/**
	 * Initialize backoff timer with `opts`.
	 *
	 * - `min` initial timeout in milliseconds [100]
	 * - `max` max timeout [10000]
	 * - `jitter` [0]
	 * - `factor` [2]
	 *
	 * @param {Object} opts
	 * @api public
	 */

	function Backoff(opts) {
	  opts = opts || {};
	  this.ms = opts.min || 100;
	  this.max = opts.max || 10000;
	  this.factor = opts.factor || 2;
	  this.jitter = opts.jitter > 0 && opts.jitter <= 1 ? opts.jitter : 0;
	  this.attempts = 0;
	}

	/**
	 * Return the backoff duration.
	 *
	 * @return {Number}
	 * @api public
	 */

	Backoff.prototype.duration = function(){
	  var ms = this.ms * Math.pow(this.factor, this.attempts++);
	  if (this.jitter) {
	    var rand =  Math.random();
	    var deviation = Math.floor(rand * this.jitter * ms);
	    ms = (Math.floor(rand * 10) & 1) == 0  ? ms - deviation : ms + deviation;
	  }
	  return Math.min(ms, this.max) | 0;
	};

	/**
	 * Reset the number of attempts.
	 *
	 * @api public
	 */

	Backoff.prototype.reset = function(){
	  this.attempts = 0;
	};

	/**
	 * Set the minimum duration
	 *
	 * @api public
	 */

	Backoff.prototype.setMin = function(min){
	  this.ms = min;
	};

	/**
	 * Set the maximum duration
	 *
	 * @api public
	 */

	Backoff.prototype.setMax = function(max){
	  this.max = max;
	};

	/**
	 * Set the jitter
	 *
	 * @api public
	 */

	Backoff.prototype.setJitter = function(jitter){
	  this.jitter = jitter;
	};



/***/ },
/* 52 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;/**
	 * @license RequireJS domReady 2.0.1 Copyright (c) 2010-2012, The Dojo Foundation All Rights Reserved.
	 * Available via the MIT or new BSD license.
	 * see: http://github.com/requirejs/domReady for details
	 */
	/*jslint */
	/*global require: false, define: false, requirejs: false,
	  window: false, clearInterval: false, document: false,
	  self: false, setInterval: false */


	!(__WEBPACK_AMD_DEFINE_RESULT__ = function () {
	    'use strict';

	    var isTop, testDiv, scrollIntervalId,
	        isBrowser = typeof window !== "undefined" && window.document,
	        isPageLoaded = !isBrowser,
	        doc = isBrowser ? document : null,
	        readyCalls = [];

	    function runCallbacks(callbacks) {
	        var i;
	        for (i = 0; i < callbacks.length; i += 1) {
	            callbacks[i](doc);
	        }
	    }

	    function callReady() {
	        var callbacks = readyCalls;

	        if (isPageLoaded) {
	            //Call the DOM ready callbacks
	            if (callbacks.length) {
	                readyCalls = [];
	                runCallbacks(callbacks);
	            }
	        }
	    }

	    /**
	     * Sets the page as loaded.
	     */
	    function pageLoaded() {
	        if (!isPageLoaded) {
	            isPageLoaded = true;
	            if (scrollIntervalId) {
	                clearInterval(scrollIntervalId);
	            }

	            callReady();
	        }
	    }

	    if (isBrowser) {
	        if (document.addEventListener) {
	            //Standards. Hooray! Assumption here that if standards based,
	            //it knows about DOMContentLoaded.
	            document.addEventListener("DOMContentLoaded", pageLoaded, false);
	            window.addEventListener("load", pageLoaded, false);
	        } else if (window.attachEvent) {
	            window.attachEvent("onload", pageLoaded);

	            testDiv = document.createElement('div');
	            try {
	                isTop = window.frameElement === null;
	            } catch (e) {}

	            //DOMContentLoaded approximation that uses a doScroll, as found by
	            //Diego Perini: http://javascript.nwbox.com/IEContentLoaded/,
	            //but modified by other contributors, including jdalton
	            if (testDiv.doScroll && isTop && window.external) {
	                scrollIntervalId = setInterval(function () {
	                    try {
	                        testDiv.doScroll();
	                        pageLoaded();
	                    } catch (e) {}
	                }, 30);
	            }
	        }

	        //Check if document already complete, and if so, just trigger page load
	        //listeners. Latest webkit browsers also use "interactive", and
	        //will fire the onDOMContentLoaded before "interactive" but not after
	        //entering "interactive" or "complete". More details:
	        //http://dev.w3.org/html5/spec/the-end.html#the-end
	        //http://stackoverflow.com/questions/3665561/document-readystate-of-interactive-vs-ondomcontentloaded
	        //Hmm, this is more complicated on further use, see "firing too early"
	        //bug: https://github.com/requirejs/domReady/issues/1
	        //so removing the || document.readyState === "interactive" test.
	        //There is still a window.onload binding that should get fired if
	        //DOMContentLoaded is missed.
	        if (document.readyState === "complete") {
	            pageLoaded();
	        }
	    }

	    /** START OF PUBLIC API **/

	    /**
	     * Registers a callback for DOM ready. If DOM is already ready, the
	     * callback is called immediately.
	     * @param {Function} callback
	     */
	    function domReady(callback) {
	        if (isPageLoaded) {
	            callback(doc);
	        } else {
	            readyCalls.push(callback);
	        }
	        return domReady;
	    }

	    domReady.version = '2.0.1';

	    /**
	     * Loader Plugin API method
	     */
	    domReady.load = function (name, req, onLoad, config) {
	        if (config.isBuild) {
	            onLoad(null);
	        } else {
	            domReady(onLoad);
	        }
	    };

	    /** END OF PUBLIC API **/

	    return domReady;
	}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },
/* 53 */
/***/ function(module, exports, __webpack_require__) {

	var DragDrop				= __webpack_require__( 54 )
	  , utils					= __webpack_require__( 1 )
	  , PresoUtils				= __webpack_require__( 55 )
	  , PnodePresentation		= __webpack_require__( 57 )
	  // , async					= require( './async.js' )
	  // , BrickUPnP_MediaRenderer	= require(  )
	  , inputHidden				= null
	  ;

	utils.initIO();

	function createSubCateg(editor, subCateg, variable, api, t, i) {
		 subCateg.appendChild( editor.createDragNode ( api[t][i].name
												     , { constructor	: PresoUtils.get('Program_ExposedAPI_elementPresentation')
													   , nodeType		: api[t][i].type.concat( ['SelectorNode', t] )
													   , variableTypes	: api[t][i].type.concat( ['SelectorNode', t] )
													   , id				: variable.id	// id du program
													   , variableId		: api[t][i].id	// id de la variable
													   , name			: variable.name	// nom du programme
													   , variableName	: api[t][i].name// nom de la variable
													   }
													 )
							 );
		}
	function CB_subCateg(editor, categ_pg, variable) {
		 return function(api) {
			 var subCateg;
			 console.log("Add", api, "to", categ_pg);
			 for(var t in api) {
				 if(api[t].length) {
					 subCateg = editor.createCateg(t);
					 categ_pg.appendChild( subCateg.root );
					 for(var i=0; i<api[t].length; i++) {
						 createSubCateg(editor, subCateg, variable, api, t, i);
						}
					}															 
				}
			}
		}
		
	var editor = {
		  htmlNodeTypes		: null
		, htmlNodeProgram	: null
		, createDragNode		: function(name, config) {
			 var div = document.createElement('div');
				div.appendChild( document.createTextNode(name) );
				div.setAttribute('class', "instructionType Pnode Implemented");
				if(typeof config.nodeType === "string") {config.nodeType = [config.nodeType];}
				for(var i=0; i<config.nodeType.length; i++) {
					 div.classList.add( config.nodeType[i] );
					}
				if(config.isNotType) {div.classList.remove( config.isNotType );}
			 DragDrop.newDraggable( div
								  , { constructor	: config.constructor
								    , htmlNode		: div
									, nodeType		: config.nodeType
									, config		: config
									}
								  );
			 return div;
			}
		, createCateg	: function(name) {
			 var details	= document.createElement('details');
			 var summary	= document.createElement('summary');
				details.appendChild( summary );
				summary.innerHTML = name;
			 this.htmlNodeTypes.appendChild( details );
			 return {root: details, details: details, summary: summary, appendChild: function(c) {details.appendChild(c); return this;}}
			}
		, init	: function(classNodeTypes, htmlNodeProgram, socket) {
			 console.log('Editor init', classNodeTypes, htmlNodeProgram);
			 this.htmlNodeProgram = htmlNodeProgram;
			 var self = this;
			 this.socket = socket;
			 socket.on( 'updateState'
					  , function(json) {
							 // console.log('updateState : ', json);
							 var obj = PnodePresentation.prototype.getPnode(json.objectId);
							 // console.log("\t=> obj :", obj);
							 if(obj) {
								 obj.setState(json.prevState, json.nextState);
								}
							});
			 
			 // console.log('async:', async);
			 // Configure html
			 this.htmlNodeTypes = document.getElementById('instructionTypes');
			 
			 // Control flow instructions
			 this.createCateg("Controls"	).appendChild( this.createDragNode( 'Program'
														 , { constructor	: PresoUtils.get('ProgramNode')
														   , nodeType		: ['ProgramNode', 'instruction']
														   } )
											).appendChild( this.createDragNode( 'Parrallel'
														 , { constructor	: PresoUtils.get('ParallelNode')
														   , nodeType		: ['ParallelNode', 'instruction']
														   } )
											).appendChild( this.createDragNode( 'Sequence'
														 , { constructor	: PresoUtils.get('SequenceNode')
														   , nodeType		: ['SequenceNode', 'instruction']
														   } )
											).appendChild( this.createDragNode( 'When'
														 , { constructor	: PresoUtils.get('WhenNode')
														   , nodeType		: ['WhenNode', 'instruction']
														   } )
											).appendChild( this.createDragNode( 'Event'
														 , { constructor	: PresoUtils.get('EventNode')
														   , nodeType		: 'EventNode'
														   , isNotType		: ['Pnode', 'instruction']
														   } )
											).appendChild( this.createDragNode( 'Controller'
														 , { constructor	: PresoUtils.get('PcontrolBrick')
														   , nodeType		: ['PcontrolBrick']
														   } )
											).appendChild( this.createDragNode( 'Filter (hide/expose)'
														 , { constructor	: PresoUtils.get('PfilterPresentation')
														   , nodeType		: ['PfilterNode', 'instruction']
														   } )
											).appendChild( this.createDragNode( 'Forbid/allow action'
														 , { constructor	: PresoUtils.get('PForbidPresentation')
														   , nodeType		: ['PForbidNode', 'instruction']
														   } )
											);
			
			
			 // Create new draggable for programs
			 this.program_categ =
			 this.createCateg("Programs").appendChild( this.createDragNode( 'New sub-program'
														 , { constructor	: PresoUtils.get('Program_DefinitionPresentation')
														   , nodeType		: 'DefinitionNode'
														   } )
											).appendChild( this.createDragNode( 'Start/Stop program'
														 , { constructor	: PresoUtils.get('PprogramActionPresentation')
														   , nodeType		: ['ActionNode', 'instruction']
														   } )
											);
											
			 // Create new draggable for variables
			 this.variables_categ = 
			 this.createCateg("Variables").appendChild( this.createDragNode( 'New variable'
														 , { constructor	: PresoUtils.get('Var_DefinitionPresentation')
														   , nodeType		: 'DefinitionNode'
														   } )
											).appendChild( this.createDragNode( 'New text'
														 , { constructor	: PresoUtils.get('Pselector_TextPresentation')
														   , nodeType		: 'SelectorNode'
														   } )
											);
											
			 // Create new draggable for MediaRenderer
			 this.MR_categ = 
			 this.createCateg("MediaRenderer").appendChild( this.createDragNode( 'Load'
														 , { constructor	: PresoUtils.get('MR_load_NodePresentation')
														   , nodeType		: ['ActionNode', 'instruction']
														   } )
											).appendChild( this.createDragNode( 'Play'
														 , { constructor	: PresoUtils.get('MR_Play_NodePresentation')
														   , nodeType		: ['ActionNode', 'instruction']
														   } )
											).appendChild( this.createDragNode( 'Pause'
														 , { constructor	: PresoUtils.get('MR_Pause_NodePresentation')
														   , nodeType		: ['ActionNode', 'instruction']
														   } )
											).appendChild( this.createDragNode( 'Stop'
														 , { constructor	: PresoUtils.get('MR_Stop_NodePresentation')
														   , nodeType		: ['ActionNode', 'instruction']
														   } )
											).appendChild( this.createDragNode( 'Every media renderers'
														 , { constructor	: PresoUtils.get('Pselector_ObjTypePresentation')
														   , nodeType		: ['SelectorNode', 'BrickUPnP_MediaRenderer']
														   , objectsType	: 'BrickUPnP_MediaRenderer'
														   } )
											).appendChild( this.createDragNode( 'Every media servers'
														 , { constructor	: PresoUtils.get('Pselector_ObjTypePresentation')
														   , nodeType		: ['SelectorNode', 'BrickUPnP_MediaServer']
														   , objectsType	: 'BrickUPnP_MediaServer'
														   } )
											);
			 
			 // Create new draggable for BrickFhem
			 this.Fhem_categ = this.createCateg("Fhem");

			 // Create new draggable for BrickFhem
			 this.openHAB_categ = 
			 this.createCateg("openHAB"		).appendChild(	(this.openHab_instructions	= 
															 this.createCateg("Instructions").appendChild( this.createDragNode( 'Do action On/Off'
																										 , { constructor	: PresoUtils.get('openHab_Action_OnOff')
																										   , nodeType		: ['ActionNode', 'instruction']
																										   , objectsType	: 'openHab_Action_OnOff'
																										   } )
																							).appendChild( this.createDragNode( 'on event On/Off'
																										 , { constructor	: PresoUtils.get('openHab_Event_OnOff')
																										   , nodeType		: ['EventNode']
																										   , objectsType	: 'openHab_Event_OnOff'
																										   } )
																							).appendChild( this.createDragNode( 'Do action Open/Close'
																										 , { constructor	: PresoUtils.get('openHab_Action_Contact')
																										   , nodeType		: ['ActionNode', 'instruction']
																										   , objectsType	: 'openHab_Action_Contact'
																										   } )
																							).appendChild( this.createDragNode( 'on event Open/Close'
																										 , { constructor	: PresoUtils.get('openHab_Event_Contact')
																										   , nodeType		: ['EventNode']
																										   , objectsType	: 'openHab_Event_Contact'
																										   } )
																							).appendChild( this.createDragNode( 'Do action RollerShutter'
																										 , { constructor	: PresoUtils.get('openHab_Action_RollerShutter')
																										   , nodeType		: ['ActionNode', 'instruction']
																										   , objectsType	: 'openHab_Action_RollerShutter'
																										   } )
																							).appendChild( this.createDragNode( 'on event RollerShutter'
																										 , { constructor	: PresoUtils.get('openHab_Event_RollerShutter')
																										   , nodeType		: ['EventNode']
																										   , objectsType	: 'openHab_Event_RollerShutter'
																										   } )
																							).appendChild( this.createDragNode( 'Change Color'
																										 , { constructor	: PresoUtils.get('openHab_Action_Color')
																										   , nodeType		: ['ActionNode', 'instruction']
																										   , objectsType	: 'openHab_Action_Color'
																										   } )
																							).appendChild( this.createDragNode( 'Color changed'
																										 , { constructor	: PresoUtils.get('openHab_Event_Color')
																										   , nodeType		: ['EventNode']
																										   , objectsType	: 'openHab_Event_Color'
																										   } )
																							).appendChild( this.createDragNode( 'Change String'
																										 , { constructor	: PresoUtils.get('openHab_Action_String')
																										   , nodeType		: ['ActionNode', 'instruction']
																										   , objectsType	: 'openHab_Action_String'
																										   } )
																							).appendChild( this.createDragNode( 'String changed'
																										 , { constructor	: PresoUtils.get('openHab_Event_String')
																										   , nodeType		: ['EventNode']
																										   , objectsType	: 'openHab_Event_String'
																										   } )
																							).appendChild( this.createDragNode( 'Change Number'
																										 , { constructor	: PresoUtils.get('openHab_Action_Number')
																										   , nodeType		: ['ActionNode', 'instruction']
																										   , objectsType	: 'openHab_Action_Number'
																										   } )
																							).appendChild( this.createDragNode( 'Number changed'
																										 , { constructor	: PresoUtils.get('openHab_Event_Number')
																										   , nodeType		: ['EventNode']
																										   , objectsType	: 'openHab_Event_Number'
																										   } )
																										 )
															).root
											).appendChild( (this.openHab_colors			= this.createCateg("BrickOpenHAB_Color")			).root
											).appendChild( (this.openHab_contacts		= this.createCateg("BrickOpenHAB_Contact")			).root
											).appendChild( (this.openHab_datetimes		= this.createCateg("BrickOpenHAB_DateTime")			).root
											).appendChild( (this.openHab_dimmers		= this.createCateg("BrickOpenHAB_Dimmer")			).root
											).appendChild( (this.openHab_numbers		= this.createCateg("BrickOpenHAB_Number")			).root
											).appendChild( (this.openHab_rollershutters	= this.createCateg("BrickOpenHAB_RollerShutter")	).root
											).appendChild( (this.openHab_strings		= this.createCateg("BrickOpenHAB_String")			).root
											).appendChild( (this.openHab_switchs		= this.createCateg("BrickOpenHAB_Switch")			).root
											);
			 
			 // Create new draggable for Hue
			 this.createCateg("Hue lamp").appendChild( this.createDragNode( 'on...'
													 , { constructor	: PresoUtils.get('PeventBrickPresentation_Hue')
													   , nodeType		: 'EventNode'
													   , isNotType		: 'Pnode'
													   } )
										);

			 // Create new draggable for HTTP and socketIO
			 this.createCateg("External").appendChild( this.createDragNode( 'on socketIO...'
													 , { constructor	: PresoUtils.get('PeventFromSocketIOPresentation')
													   , nodeType		: 'EventNode'
													   , isNotType		: 'Pnode'
													   } )
										).appendChild( this.createDragNode( 'Event on something ...'
													 , { constructor	: PresoUtils.get('PeventBrickPresentation')
													   , nodeType		: ['EventNode']
													   } )
										).appendChild( this.createDragNode( 'HTTP request'
													 , { constructor	: PresoUtils.get('PactionHTTP')
													   , nodeType		: ['ActionNode', 'instruction']
													   } )
										).appendChild( this.createDragNode( 'Brick appear/disappear'
													 , { constructor	: PresoUtils.get('PeventBrickAppear')
													   , nodeType		: ['EventNode']
													   } )
										);


			 // Process variables and bricks
			 var variables = {};
			 inputHidden = document.getElementById('programId');
			 if(inputHidden) {variables.nodeId = inputHidden.value;}
			 utils.XHR( 'POST', '/getContext'
					  , { variables	: variables
						, onload	: function() {
							 var json = JSON.parse( this.responseText ); 
							 console.log('/getContext of ', variables.nodeId, ':', json );
							 var i, brick, variable, item;
							 // Bricks
							 for(i in json.bricks) {
								 brick = json.bricks[i];
								 if(brick.type.indexOf('BrickUPnP_MediaRenderer') !== -1) {
									 self.MR_categ.appendChild	( self.createDragNode( brick.name
																, { constructor	: PresoUtils.get('MR_Instance_SelectorNodePresentation')
																  , nodeType	: brick.type.concat( ['SelectorNode'] )
																  , id			: brick.id
																  , uuid		: brick.id
																  , name		: brick.name
																  } )
																);
									}
								 if(brick.type.indexOf('BrickFhem') !== -1) {
									 self.Fhem_categ.appendChild( self.createDragNode( brick.name
																, { constructor	: PresoUtils.get('basicBrickPresentation')
																  , nodeType	: brick.type.concat( ['SelectorNode'] )
																  , id			: brick.id
																  , uuid		: brick.id
																  , name		: brick.name
																  } )
																);
									}
								 if(brick.type.indexOf('BrickOpenHAB_item') !== -1) {
									 item = self.createDragNode	( brick.name
																, { constructor	: PresoUtils.get('basicBrickPresentation')
																  , nodeType	: brick.type.concat( ['SelectorNode'] )
																  , id			: brick.id
																  , uuid		: brick.id
																  , name		: brick.name
																  }
																);
									 if(brick.type.indexOf("BrickOpenHAB_Switch")			>= 0) {self.openHab_switchs.appendChild		  (item);}
									 if(brick.type.indexOf("BrickOpenHAB_String")			>= 0) {self.openHab_strings.appendChild		  (item);}
									 if(brick.type.indexOf("BrickOpenHAB_RollerShutter")	>= 0) {self.openHab_rollershutters.appendChild(item);}
									 if(brick.type.indexOf("BrickOpenHAB_Number")			>= 0) {self.openHab_numbers.appendChild		  (item);}
									 if(brick.type.indexOf("BrickOpenHAB_Dimmer")			>= 0) {self.openHab_dimmers.appendChild		  (item);}
									 if(brick.type.indexOf("BrickOpenHAB_DateTime")			>= 0) {self.openHab_datetimes.appendChild	  (item);}
									 if(brick.type.indexOf("BrickOpenHAB_Contact")			>= 0) {self.openHab_contacts.appendChild	  (item);}
									 if(brick.type.indexOf("BrickOpenHAB_Color")			>= 0) {self.openHab_colors.appendChild		  (item);}
									 if(!item.parentNode) {console.error("Unknown openHab brick type:", brick);}
									}
									
								}
							 // Variables
							 for(i in json.variables) {
								 variable = json.variables[i];
								 // console.log("New variable", variable.id, variable.name);
								 if(variable.type.indexOf('BrickUPnP_MediaRenderer') !== -1) {
									 self.MR_categ.appendChild( self.createDragNode( variable.name
														   , { constructor	: PresoUtils.get('Var_UsePresentation')
														     , nodeType		: variable.type.concat( ['SelectorNode', 'variable'] )
															 , id			: variable.id
															 , name			: variable.name
														     } )
														   );
									} else 
								 if(variable.type.indexOf("Program") !== -1) {
									 var categ_pg = self.createCateg(variable.name);
									 self.program_categ.appendChild( categ_pg.root );
									 categ_pg.appendChild( self.createDragNode ( variable.name
																			   , { constructor	: PresoUtils.get('Program_UsePresentation')
																				 , nodeType		: variable.type.concat( ['SelectorNode', 'program'] )
																				 , id			: variable.id
																				 , name			: variable.name
																				 } )
														 );
									 // Make a call to retrieve exposed API for this program
									 utils.call	( variable.programId, 'getExposedAPI_serialized', []
												, CB_subCateg(self, categ_pg, variable)
												);
									 
									} else {self.variables_categ.appendChild( self.createDragNode( variable.name
																								 , { constructor	: PresoUtils.get('Var_UsePresentation')
																								   , nodeType		: variable.type//.concat( ['SelectorNode', 'program'] )
																								   , id				: variable.id
																								   , name			: variable.name
																								   } 
																								 )
																		    );
											// console.log("New variable", variable.id, variable.name, ':', variable.type);
										   }
								}
							}
					    }
					  );
			
			 // Main drop zone for programs
			 DragDrop.newDropZone( htmlNodeProgram
								 , { acceptedClasse		: 'ProgramNode'
								   , CSSwhenAccepted	: 'possible2drop'
								   , CSSwhenOver		: 'ready2drop'
								   , ondrop				: function(evt, draggedNode, infoObj) {
										 var Pnode = new infoObj.constructor();
										 self.rootProgram = Pnode;
										 htmlNodeProgram.appendChild( Pnode.init('').Render() );
										}
								   }
								 );
			// Buttons to interact with the server
			 var bt_send	= document.getElementById('sendToServer')
			   , bt_load	= document.getElementById('loadFromServer')
			   , bt_start	= document.getElementById('startProgram')
			   , bt_stop	= document.getElementById('stopProgram')
			   , bt_save	= document.getElementById('DiskSaveToServer')
			   , bt_dskLoad	= document.getElementById('DiskLoadFromServer');
			 bt_save.onclick = function() {
									 // var inputHidden = document.getElementById('programId'); // Already defined
									 if(!inputHidden) {console.error("no program to save"); return;}
									 utils.XHR( 'POST', '/saveProgram'
											  , { variables	: { pgRootId	: inputHidden.value
															  , fileName	: document.getElementById('fileName').value || 'bonGrosTest'
															  }
												, onload	: function() {
													 if(this.status === 200) {
														  console.log('program saved');
														} else {console.error("Error saving program:", this.responseText);}
													}
												}
											  );
									}
			 bt_dskLoad.onclick = function() {
									 utils.XHR( 'POST', '/loadProgramFromDisk'
											  , { variables	: { fileName	: document.getElementById('fileName').value || 'bonGrosTest'
															  }
												, onload	: function() {
													 if(this.status === 200) {
														 console.log('Loading program...');
														 var json = JSON.parse( this.responseText );
														 self.loadProgram(json);
														} else {console.error("Error retrieving program:", this.responseText);}
													}
												}
											  );
									}
			 bt_load.onclick = function() {
									 // var inputHidden = document.getElementById('programId'); // Already defined
									 var ressource = '/loadProgram';
									 if(inputHidden) {
										 ressource += '?programId=' + encodeURIComponent( inputHidden.value );
										}
									 utils.XHR( 'GET', ressource
											  , { onload	: function() {
													 // console.log('getting program from server, server sent:', this);
													 if(this.responseText !== '') {
														 var json = JSON.parse( this.responseText );
														 self.loadProgram(json);
														}
													}
												}
											  );
									};
			 bt_load.onclick(); // Direct call !
			 
			 bt_send.addEventListener( 'click'
									 , function() {
										 var variablesSend		= {program: JSON.stringify(self.rootProgram.serialize())};
										 // var inputHidden	= document.getElementById('programId'); // Already defined
										 if(inputHidden) {variablesSend.programId = inputHidden.value;}
										 utils.XHR( 'POST', '/loadProgram'
												  , { variables	: variablesSend
													, onload	: function() {
														 // console.log('loadProgram, server sent:', this);
														 var json = JSON.parse( this.responseText );
														 self.loadProgram(json);
														}
													}
												  );
										}
									 , false );
			 bt_start.addEventListener( 'click'
									  , function() {
											// var inputHidden = document.getElementById('programId'); // Already defined
											if(inputHidden) {utils.XHR( 'POST', '/Start'
																	  , {variables: {programId: inputHidden.value}}
																	  ); }
											}
									  , false );
			 bt_stop.addEventListener ( 'click'
									  , function() {
											// var inputHidden = document.getElementById('programId'); // Already defined
											if(inputHidden) {utils.XHR( 'POST', '/Stop'
																	  , {variables: {programId: inputHidden.value}}
																	  ); }
											}
									  , false );
			}
		, sendProgram	: function() {
			
			}
		, loadProgram	: function(json) {
			 var prog = PresoUtils.unserialize( json );
			 // Unplug previous program if it exists
			 // console.log('Unplug program');
			 this.htmlNodeProgram.innerText = '';
			 // Plug the new one
			 // console.log('Plug parsed program');
			 this.rootProgram = prog;
			 this.htmlNodeProgram.appendChild( prog.Render() );
			 // var inputHidden = document.getElementById('programId');
			 if(inputHidden === null) {
				 console.log("Create a new hidden input for program",  prog.PnodeID);
				 inputHidden = document.createElement('input');
				 inputHidden.setAttribute('type' , 'hidden');
				 inputHidden.setAttribute('id'   , 'programId');
				 inputHidden.setAttribute('value', prog.PnodeID);
				 document.body.appendChild( inputHidden );
				}
			 inputHidden.setAttribute('value', prog.PnodeID);
			}
	};

	module.exports = editor;


/***/ },
/* 54 */
/***/ function(module, exports) {

	var DragDrop = {
		  draggedNode	: null
		, infoObj		: null
		, dropZones		: {}
		, dropZoneId	: 0
		, init			: function() {
			// Some initialization here
			// May be useful to handle subscribing at document level
			 // var self = this;
			}
		, updateConfig	: function(id, config) {
			 for(var i in config) {
				 this.dropZones[id].config[i] = config[i];
				}
			 return this;
			}
		, deleteDropZone: function(id) {
			 if(typeof this.dropZones[id] === 'undefined') {return;}
			 var config = this.dropZones[id].config
			   , node   = this.dropZones[id].node;
			 node.removeEventListener('dragenter'	, config.dragenter	, false);
			 node.removeEventListener('dragover'	, config.dragover	, false);
			 node.removeEventListener('drop'		, config.drop		, false);
			 node.removeEventListener('dragleave'	, config.dragleave	, false);
			 node.classList.remove(config.CSSwhenAccepted);
			 node.classList.remove(config.CSSwhenOver	 );
			 delete this.dropZones[id];
			}
		, nodeContainsClasses	: function(node, classes) { // classes is a list of list of string
			 if(node === null) {return false;}
			 for(var i=0; i<classes.length; i++) {
				 if( this.nodeContainsClassesConjonction(node, classes[i]) ) {return true;}
				}
			 return false;
			 
			}
		, nodeContainsClassesConjonction	: function(node, classes) { // classes is a list of string
			 if(node === null) {return false;}
			 for(var i=0; i<classes.length; i++) {
				 if( !node.classList.contains(classes[i]) ) {return false;}
				}
			 return true;
			}
		, newDropZone	: function(node, config ) {
			 // Config is an object containing potentially :
			 //		- acceptedClasse	: Accepted classes disjonction of conjunctions (list of list of string)
			 //		- CSSwhenAccepted	: class added to the drop zone when an accepted node is dragged
			 //		- CSSwhenOver		: class added to the drop zone when an accepted node is dragged over
			 //		- ondrop			: function triggered when an accepted dragged node is dropped on the zone
			 var self = this, i;
			 if(typeof config.acceptedClasse === 'string') {
				 config.acceptedClasse = [[config.acceptedClasse]];
				}
			 for(i in config.acceptedClasse) {
				 if(typeof config.acceptedClasse[i] === 'string') {config.acceptedClasse[i] = [config.acceptedClasse[i]];}
				}
			 // Register drop zone
			 var id = self.dropZoneId++
			 self.dropZones[id] = {node: node, config: config};

			 node.addEventListener( 'dragenter'
								  , config.dragenter = function(event) {
										 // console.log(self.draggedNode.classList);
										 if( self.nodeContainsClasses(self.draggedNode, self.dropZones[id].config.acceptedClasse) ) {
											 // console.log('enter');
											 this.classList.add( self.dropZones[id].config.CSSwhenOver );
											 event.stopPropagation();
											 event.preventDefault ();
											}
										}
								  , false );
			 node.addEventListener( 'dragover'
								  , config.dragover = function(event) {
										 if(node.classList.contains( self.dropZones[id].config.CSSwhenOver ) ) {
											 event.preventDefault();
											 event.stopPropagation();
											 event.preventDefault ();
											}
										}
								  , false );
			 node.addEventListener( 'drop'
								  , config.drop = function(event) {
										 if( node.classList.contains( self.dropZones[id].config.CSSwhenOver )
										   &&self.dropZones[id].config.ondrop ) {
											 // console.log('drop on', node);
											 self.dropZones[id].config.ondrop.apply(node, [event, self.draggedNode, self.infoObj, self]);
											 event.stopPropagation();
											 event.preventDefault ();
											}
										}
								  , false );
			 node.addEventListener( 'dragleave'
								  , config.dragleave = function(event) {
										 if( self.nodeContainsClasses(self.draggedNode, self.dropZones[id].config.acceptedClasse) ) {
											 this.classList.remove( self.dropZones[id].config.CSSwhenOver );
											 event.stopPropagation();
											 event.preventDefault ();
											}
										}
								  , false );
			 return id;
			}
		, newDraggable	: function(node, infoObj) {
			 node.setAttribute('draggable', 'true');
			 var self = this;
			 node.addEventListener( 'dragstart'
								  , function(event) {
										 event.dataTransfer.setData('text/plain', "newDraggable");
										 self.startingDrag( node, infoObj );
										 // event.preventDefault();
										 event.stopPropagation();
										}
								  , false );
			 node.addEventListener( 'dragend'
								  , function(event) {
										 self.stoppingDrag( node, infoObj );
										 event.preventDefault();
										 event.stopPropagation();
										} 
								  , false );
			}
		, startingDrag	: function(node, infoObj) {
			 var self = this;
			 // console.log('Starting to drag', node);
			 self.draggedNode	= node;
			 self.infoObj		= infoObj
			// Go through Drop zones
			 var dropNode, dropConfig;
			 for(var i in self.dropZones) {
				 dropNode	= self.dropZones[i].node;
				 dropConfig	= self.dropZones[i].config;
				 if( self.nodeContainsClasses(node, dropConfig.acceptedClasse)
				   &&dropConfig.CSSwhenAccepted ) {
					 dropNode.classList.add( dropConfig.CSSwhenAccepted );
					}
				}
			}
		, stoppingDrag	: function(node, infoObj) {
			 var self = this;
			 // console.log('Stop dragging', self.draggedNode);
			 self.draggedNode	= null;
			 self.infoObj		= null;
			// Go through Drop zones
			 var dropNode, dropConfig;
			 for(var i in self.dropZones) {
				 dropNode	= self.dropZones[i].node;
				 dropConfig	= self.dropZones[i].config;
				 dropNode.classList.remove( dropConfig.CSSwhenOver );
				 dropNode.classList.remove( dropConfig.CSSwhenAccepted );
				}
			}
	};

	module.exports = DragDrop;


/***/ },
/* 55 */
/***/ function(module, exports, __webpack_require__) {

	var PresoUtils = {
		  mapping		: { 'ProgramNode'							: __webpack_require__( 56 )
						  , 'ParallelNode'							: __webpack_require__( 67 )	, 'ParallelNodePresentation'	: __webpack_require__( 67 )
						  , 'ActionNode'							: __webpack_require__( 70 )
						  , 'SequenceNode'							: __webpack_require__( 74 )	, 'SequenceNodePresentation'	: __webpack_require__( 74 )
						  , 'EventNode'								: __webpack_require__( 75 )		, 'EventNodePresentation'		: __webpack_require__( 75 )
						  , 'PeventFromSocketIOPresentation'		: __webpack_require__( 79 )
						  , 'WhenNode'								: __webpack_require__( 84 )		, 'WhenNodePresentation'		: __webpack_require__( 84 )
						  , 'PcontrolBrick'							: __webpack_require__( 91 )
						  , 'PfilterPresentation'					: __webpack_require__( 92 )
						  , 'PForbidPresentation'					: __webpack_require__( 93 )
						  , 'PeventBrickPresentation'				: __webpack_require__( 97 )
						  , 'PeventBrickAppear'						: __webpack_require__( 98 )
						  , 'basicBrickPresentation'				: __webpack_require__( 100 )
						  , 'Pselector_ObjTypePresentation'			: __webpack_require__( 102 )
						  // OpenHab
						  , 'openHab_Action_OnOff'					: __webpack_require__( 104 )
						  , 'openHab_Event_OnOff'					: __webpack_require__( 108 )
						  , 'openHab_Action_Contact'				: __webpack_require__( 111 )
						  , 'openHab_Event_Contact'					: __webpack_require__( 113 )
						  , 'openHab_Action_Color'					: __webpack_require__( 115 )
						  , 'openHab_Event_Color'					: __webpack_require__( 117 )
						  , 'openHab_Action_String'					: __webpack_require__( 119 )
						  , 'openHab_Event_String'					: __webpack_require__( 121 )
						  , 'openHab_Action_Number'					: __webpack_require__( 123 )
						  , 'openHab_Event_Number'					: __webpack_require__( 125 )
						  , 'openHab_Action_RollerShutter'			: __webpack_require__( 127 )
						  , 'openHab_Event_RollerShutter'			: __webpack_require__( 129 )
						  
						  // Variables
						  , 'Program_UsePresentation'				: __webpack_require__( 131 )
						  , 'Program_DefinitionPresentation'		: __webpack_require__( 134 )
						  , 'Var_DefinitionPresentation'			: __webpack_require__( 135 )
						  , 'SelectorNodePresentation'				: __webpack_require__( 101 )
						  , 'MR_Instance_SelectorNodePresentation'	: __webpack_require__( 138 )
						  , 'Var_UsePresentation'					: __webpack_require__( 85 )
						  , 'PprogramActionPresentation'			: __webpack_require__( 143 )
						  , 'Program_ExposedAPI_elementPresentation': __webpack_require__( 144 )
						  // General type variables
						  , 'Pselector_TextPresentation'			: __webpack_require__( 145 )
						  // MediaRenderer
						  , 'MR_Play_NodePresentation'				: __webpack_require__( 147 )
						  , 'MR_load_NodePresentation'				: __webpack_require__( 148 )
						  , 'MR_Pause_NodePresentation'				: __webpack_require__( 149 )
						  , 'MR_Stop_NodePresentation'				: __webpack_require__( 150 )
						  // Hue
						  , 'PeventBrickPresentation_Hue'			: __webpack_require__( 151 )
						  // HTTP
						  , 'PactionHTTP'							: __webpack_require__( 152 )
						  }
		, get			: function(className) {
			 var classe	= this.mapping[ className ];
			 if(!classe) {
				 console.error('This dependency has not been loaded yet :', className);
				 try {throw new Error(""); //this.mapping[ className ] = require( className );
					 } catch(err) {console.error("Impossible to post-load dependency", className)}
				}
			 return this.mapping[className];
			}
		, unserialize	: function(json, cb) {
			 // console.log("json.subType : ", json.subType);
			 var parent;
			 var Cname	= json.subType || json.className;
			 var classe	= this.get( Cname );
			 if(classe) {
				 parent	= new classe().init();
				 parent.unserialize(json, PresoUtils);
				} else {console.error( "Unknown class to unserialize:\n\tsubtype:"
									 , json.subType, "\nclassName:", json.className
									 );
					   }
			 return parent;
			}
	};

	module.exports = PresoUtils;



/***/ },
/* 56 */
/***/ function(module, exports, __webpack_require__) {

	var PnodePresentation			= __webpack_require__( 57 )
	  , PnodeNChildPresentation		= __webpack_require__( 63 )
	  // , SequenceNodePresentation	= require( './SequenceNodePresentation.js' )
	  , ParallelNodePresentation	= __webpack_require__( 67 )
	  , DragDrop					= __webpack_require__( 54 )

	var css = document.createElement('link');
		css.setAttribute('rel' , 'stylesheet');
		css.setAttribute('href', 'js/Presentations/HTML_templates/ProgramNodePresentation.css');
		document.head.appendChild( css );

	__webpack_require__( 68 );




	var ProgramNodePresentation = function() {
		// console.log(this);
		PnodePresentation.prototype.constructor.apply(this, []);
		return this;
	}

	ProgramNodePresentation.prototype = Object.create( PnodeNChildPresentation.prototype ); //new PnodeNChildPresentation();
	ProgramNodePresentation.prototype.constructor	= ProgramNodePresentation;
	ProgramNodePresentation.prototype.className		= 'ProgramNode';

	ProgramNodePresentation.prototype.init = function(PnodeID, parent, children) {
		PnodePresentation.prototype.init.apply(this, [PnodeID, parent, children]);
		this.html.instructions	= null;
		this.html.definitions	= null;
		this.Pnodes = { instructions	: []
					  , definitions		: []
					  };
		return this;
	}

	ProgramNodePresentation.prototype.reset = function() {
		this.Pnodes.definitions		= [];
		this.Pnodes.instructions	= [];
	}

	ProgramNodePresentation.prototype.serialize	= function() {
		var children	= this.children;
		this.children	= [];
		var json = PnodePresentation.prototype.serialize.apply(this, [])
		  , i, node;
		this.children	= children;
		json.pg = { definitions : []
				  , instructions: [] };
		for(i=0; i<this.Pnodes.definitions.length; i++) {
			 node = this.Pnodes.definitions[i];
			 json.pg.definitions.push( node.serialize() );
			}
		this.Pnodes.instructions = this.Pnode_ParallelInstructions?this.Pnode_ParallelInstructions.children:[];
		for(i=0; i<this.Pnodes.instructions.length; i++) {
			 node = this.Pnodes.instructions[i];
			 json.pg.instructions.push( node.serialize() );
			}
		return json;
	}

	ProgramNodePresentation.prototype.unserialize	= function(json, PresoUtils) {
		var i, jsonNode;
		PnodePresentation.prototype.unserialize.apply(this, [json, PresoUtils]);
		this.reset();
		for(i=0; i<json.pg.definitions.length; i++) {
			 jsonNode = json.pg.definitions[i];
			 this.appendDefinitionNode ( PresoUtils.unserialize(jsonNode) );
			}
		this.Render();
		for(i=0; i<json.pg.instructions.length; i++) {
			 jsonNode = json.pg.instructions[i];
			 this.appendInstructionNode( PresoUtils.unserialize(jsonNode) );
			}
		return this;
	}


	ProgramNodePresentation.prototype.appendDefinitionNode = function(node) {
		var nodeRoot = node.Render();
		this.html.definitions.insertBefore(nodeRoot, this.divChildrenDefTxt);
		this.Pnodes.definitions.push( node );
	}

	ProgramNodePresentation.prototype.appendInstructionNode = function(node) {
		// var nodeRoot = node.Render();
		// this.html.instructions.insertBefore(nodeRoot, this.divChildrenInstTxt);
		this.Pnode_ParallelInstructions.appendChild(node);
		// this.Pnodes.instructions.push( node );
	}

	ProgramNodePresentation.prototype.Render	= function() {
		var self = this;
		var root = PnodePresentation.prototype.Render.apply(this, []);
		root.classList.add('ProgramNode');
		root.classList.add('ProgramNodePresentation');
		this.divDescription.innerText = 'ProgramNode ' + this.PnodeID + ' (presentation ' + this.uid + ')' ;
		// Render blocks for declarations and instructions
		if(this.html.instructions === null) {
			// Déclarations -------------------------------------------------------
			 this.html.definitions = document.createElement('details');
				this.html.definitions.setAttribute('open', 'open');
				this.html.definitionsSummary	= document.createElement('summary');
				this.html.definitionsSummary.innerHTML = "Definitions";
				// Drop zone
				this.divChildrenDefTxt = document.createElement('div');
				this.divChildrenDefTxt.innerText = 'Insert a Definition here';
				this.html.definitions.appendChild( this.divChildrenDefTxt );
				this.dropZoneDefId = DragDrop.newDropZone( this.divChildrenDefTxt
									, { acceptedClasse	: 'DefinitionNode'
									  , CSSwhenAccepted	: 'possible2drop'
									  , CSSwhenOver		: 'ready2drop'
									  , ondrop			: function(evt, draggedNode, infoObj) {
											 var Pnode = new infoObj.constructor().init	( undefined	// PnodeID
																						, undefined	// parent
																						, undefined	// children
																						, infoObj
																						);
											 self.appendDefinitionNode( Pnode );
											}
									  }
									);
			 this.html.definitions.appendChild(this.html.definitionsSummary);
			 
			// Instructions -------------------------------------------------------
			 this.html.instructions = document.createElement('details');
				this.html.instructions.setAttribute('open', 'open');
				this.html.instructionsSummary	= document.createElement('summary');
				this.html.instructionsSummary.innerHTML = "Instructions";
				// Drop zone
				this.Pnode_ParallelInstructions = new ParallelNodePresentation().init();
				this.html.instructions.appendChild( this.Pnode_ParallelInstructions.Render() );
				/*this.dropZoneInstId = DragDrop.newDropZone( this.divChildrenInstTxt
									, { acceptedClasse	: [['Pnode', 'instruction']]
									  , CSSwhenAccepted	: 'possible2drop'
									  , CSSwhenOver		: 'ready2drop'
									  , ondrop			: function(evt, draggedNode, infoObj) {
											 var Pnode = new infoObj.constructor().init	( undefined	// PnodeID
																						, undefined	// parent
																						, undefined	// children
																						, infoObj
																						);
											 self.appendInstructionNode( Pnode );
											}
									  }
									);*/
			 this.html.instructions.appendChild(this.html.instructionsSummary);
			 // Plug under the root
			 this.root.appendChild( this.html.definitions );
			 this.root.appendChild( this.html.instructions );
			}
		return root;
	}

	ProgramNodePresentation.prototype.deletePrimitives = function() {
		PnodePresentation.prototype.deletePrimitives.apply(this, []);
		if(this.html.instructions !== null) {
			 this.html = { instructions	: null
						 , definitions	: null};
			}
		return this;
	}

	// Return the constructor
	module.exports = ProgramNodePresentation;



/***/ },
/* 57 */
/***/ function(module, exports, __webpack_require__) {

	/** 
	 * Module defining the presentation node PnodePresentation related to program node.
	 * @module PnodePresentation_module
	 * @see module:protoPresentation
	 */
	var protoPresentation	= __webpack_require__( 58 )
	  // , DragDrop			= require( '../DragDrop.js' )
	  , domReady			= __webpack_require__( 52 )
	  ;
	var L_Pnodes = {};

	__webpack_require__( 59 );

	/**
	 * The server side identifier of a presentation node.
	 *@typedef {string} PnodeID
	*/

	/**
	 * A PnodePresentation_serialization is a json structure representing the state of a {@link PnodePresentation}
	 *@typedef {object} PnodePresentation_serialization
	 *@property {string} className name of the represented object's class.
	 *@property {PnodeID} PnodeID identifyer of the represented object.
	 *@property {PnodePresentation_serialization[]} children Array of children's seriaizations.
	*/

	/**
	 * Represents PnodePresentation a program node in the scene graph.
	 * Actual HTML bodes are generated via Render method.
	 * @class
	 * @constructor
	 * @alias module:PnodePresentation_module
	 * @augments protoPresentation
	 */
	var PnodePresentation = function() {
		// console.log(this);
		protoPresentation.prototype.constructor.apply(this, []);
		return this;
	}

	PnodePresentation.prototype = Object.create( protoPresentation.prototype ); // new protoPresentation();
	PnodePresentation.prototype.constructor	= PnodePresentation;
	PnodePresentation.prototype.className	= 'PnodePresentation';

	/**
	 * Initialization method: link the presentation with the corresponding program node identified on the server by PnodeID.
	 * @param {string} PnodeID that identify the corresponding program node on the server.
	 * @param {PnodePresentation} parent parent {@link PnodePresentation}, can be unspecified.
	 * @param {PnodePresentation[]} children children array {@link PnodePresentation}, can be unspecified.
	 */
	PnodePresentation.prototype.init = function(PnodeID, parent, children) {
		var self = this;
		protoPresentation.prototype.init.apply(this, [parent, children]);
		this.PnodeID = PnodeID;
		if(this.PnodeID) {L_Pnodes[this.PnodeID] = this;}
		this.state	= null;
		this.html	= {};
		this.contextualMenuItems = [{content: 'delete', cb: function() {self.dispose();}}];
		return this;
	}

	/**
	 * Retrieve the node identfied by id.
	 * @param {string} id that identify the presentation node (WARNING: id is not the same than PnodeId).
	 */
	PnodePresentation.prototype.getPnode = function(id) {
		return L_Pnodes[id];
	}

	/**
	 * Serialize the node in a json structure.
	 * @returns {PnodePresentation_serialization} {@link PnodePresentation_serialization} of the presentation node and its children.
	 */
	PnodePresentation.prototype.serialize	= function() {
		// JSON format
		var json = { className	: this.className
				   , PnodeID	: this.PnodeID
				   , children	: []
				   }
		for(var i=0; i<this.children.length; i++) {
			 json.children.push( this.children[i].serialize() );
			}
		return json;
	}

	/**
	 * Unserialize the state from a json object.
	 * @param {PnodePresentation_serialization} json
	 * @returns {PnodePresentation_serialization} {@link PnodePresentation_serialization} of the presentation node and its children.
	 */
	PnodePresentation.prototype.unserialize	= function(json, PresoUtils) {
		this.PnodeID = json.PnodeID;
		if(this.PnodeID) {L_Pnodes[this.PnodeID] = this;}
		this.Render();
		for(var i in json.children) {
			 this.appendChild( PresoUtils.unserialize(json.children[i]), PresoUtils );
			}
		return this;
	}

	/**
	 * Update the state of the {@link PnodePresentation}. This is done by changing the classList attribute of the HTML root node.
	 * @param {number} prev Previous state (0 or 1).
	 * @param {number} next New state (1 or 0).
	 */
	PnodePresentation.prototype.setState	= function(prev, next) {
		if(this.root) {
			 this.state = next;
			 this.root.classList.remove(prev);
			 this.root.classList.add   (next);
			}
		return this;
	}

	/**
	 * Display the contextual menu
	*/
	var root = document.createElement('div');
	domReady( function() {
		root.classList.add('contextualMenu');
		document.body.appendChild(root);
		document.addEventListener( 'click' 
								 , function() {
									  root.classList.remove("display");
									 }
								 , true
								 );
	});
							 
	PnodePresentation.prototype.displayContextMenu	= function(x, y) {
		var i, htmlItem, item;
		root.innerHTML = "";
		root.classList.add( 'display' );
		for(i=0; i<this.contextualMenuItems.length; i++) {
			 item				= this.contextualMenuItems[i];
			 htmlItem			= document.createElement('div');
			 htmlItem.innerHTML = item.content;
			 htmlItem.onclick	= item.cb.bind(this);
			 htmlItem.classList.add( 'contextualItem' );
			 root.appendChild( htmlItem );
			}
		root.style.top	= y + 'px';
		root.style.left	= x + 'px';
		if(root.parentNode) {} else {document.body.appendChild(root);}
		return this;
	}

	/**
	 * Render the HTML structure of the {@link PnodePresentation}. If the structure already exists, it is not created again.
	 * The HTML structure can be deleted via the use of {@link deletePrimitives} method.
	 * Overload {@link module:protoPresentation.Presentation#Render}
	 * @returns {object} HTML root node representing {@link PnodePresentation}.
	 */
	PnodePresentation.prototype.Render		= function() {
		var self = this;
		var root = protoPresentation.prototype.Render.apply(this, []);
		root.classList.add('Pnode');
		// React on right click
		root.addEventListener	( 'contextmenu'
								, function(e) {
									 //if(e.button === 2) {
										 self.displayContextMenu(e.pageX, e.pageY);
										 e.preventDefault();
										 e.stopPropagation();
										 return false;
										}
									//}
								, false
								);
		// React on state
		if(this.state) {root.classList.add(this.state);}
		if(!this.divDescription) {
			 // root.appendChild( document.createTextNode(this.PnodeID + ' : ') );
			 this.divDescription = document.createElement('div');
				root.appendChild( this.divDescription );
				this.divDescription.classList.add('description');
			}
		return root;
	}

	/**
	 * Delete the HTML structure of the {@link PnodePresentation} if it exists.
	 */
	PnodePresentation.prototype.deletePrimitives = function() {
		protoPresentation.prototype.deletePrimitives.apply(this, []);
		if(this.divDescription) {
			 if(this.divDescription.parentNode) {this.divDescription.parentNode.removeChild( this.divDescription );}
			 delete this.divDescription;
			 this.divDescription = null;
			}
		return this;
	}

	// Return the constructor
	module.exports = PnodePresentation;



/***/ },
/* 58 */
/***/ function(module, exports) {

	/** 
	 * Module defining the generic presentation node of scene graph..
	 * @module protoPresentation
	 */
	var uid = 0;
				 // Define the Presentation constructor
	/**
	 * Represents PnodePresentation a program node in the scene graph.
	 * Actual HTML bodes are generated via Render method.
	 * @class
	 * @constructor
	 * @alias module:protoPresentation
	 */
	var Presentation = function() {
		this.uid	= this.getUniqueId();
		Presentation.prototype.init.apply(this, [null, []]);
		// this.init(null, []);
		return  
	}

	Presentation.prototype = Object.create( {} );
	Presentation.prototype.className = 'Presentation';
	Presentation.prototype.constructor = Presentation;
	Presentation.prototype.getUniqueId = function() {
		uid++;
		return 'PresoId_' + uid;
	}

	Presentation.prototype.dispose	= function() {
		if(this.parent) {this.parent.removeChild(this);}
		while(this.children.length) {
			 this.removeChild( this.children[0] );
			}
		return this;
	}

	/**
	 * Initialization method: Plug the node to parent and children.
	 * @param {Presentation} parent parent {@link Presentation}, can be unspecified.
	 * @param {Presentation[]} children children array {@link Presentation}, can be unspecified.
	 */
	 Presentation.prototype.init = function(parent, children) {
		 this.root			= this.root || null;
		 if(this.children) {
			 for(var i=0; i<this.children.length; i++) {
				 this.removeChild(this.children[i]);
				}
			}
		 this.children 		= children  || [];
		 this.setParent( parent );
		 return this;
		}
	 // Definition of the Presentation class
	 Presentation.prototype.setParent = function(p) {
		 if(this.parent === p) {return;}
		 if(this.parent) {
			var parent = this.parent;
			this.parent = null;
			parent.removeChild(this);}
		 this.parent = p;
		 if(p) {
			 if(typeof p.appendChild === "undefined") {
				 console.error("Problem for parent", p);
				}
			 p.appendChild(this);
			}
		}
	/**
	 * Append a {@link Presentation} child.
	 * @param {Presentation} c {@link Presentation} to append.
	 */
	 Presentation.prototype.appendChild = function(c) {
		 if(this.children.indexOf(c) === -1) {
			 this.children.push(c);
			 this.primitivePlug(c);
			 c.setParent(this);
			}
		}
	/**
	 * Copy children of source to dest
	 */
	 Presentation.prototype.copyHTML = function(node_source, node_dest) {
		 node_dest.innerHTML = "";
		 for(var i=0; i<node_source.children.length; i++) {
			 node_dest.appendChild( node_source.children[i].cloneNode(true) );
			}
		}
	/**
	 * Remove a {@link Presentation} child.
	 * @param {Presentation} c {@link Presentation} to remove.
	 */
	Presentation.prototype.removeChild = function(c) {
		 var pos = this.children.indexOf(c)
		 if(pos !== -1) {
			 this.primitiveUnPlug(c);
			 this.children.splice(pos,1);
			 c.setParent(null);
			}
		}
		
	/**
	 * Render the HTML structure of the {@link Presentation}. If the structure already exists, it is not created again.
	 * The HTML structure can be deleted via the use of {@link deletePrimitives} method.
	 * @returns {object} HTML root node representing {@link Presentation}.
	 */
				 Presentation.prototype.Render			= function() {
					 if(!this.root) {
						 this.root = document.createElement('div');
						 this.root.classList.add('protoPresentation');
						 this.root.setAttribute('id', this.uid);
						 for(var i=0;i<this.children.length;i++) {
							 this.primitivePlug(this.children[i]);
							}
						}
					 return this.root;
					}
	/**
	 * Delete the HTML structure of the {@link PnodePresentation} if it exists.
	 */
				 Presentation.prototype.deletePrimitives = function() {
					 // console.log("Presentation::deletePrimitives", this);
					 if(this.root && (this.root.parentElement || this.root.parentNode)) {
						 (this.root.parentElement || this.root.parentNode).removeChild(this.root);
						 this.root = null;
						}
					 return this;
					}
	/**
	 * Force the rendering, delete primitives, render new ones and plug.
	 */
				 Presentation.prototype.forceRender		= function() {
					 var primitiveParent;
					 if(this.root) {primitiveParent = this.root.parentNode;
									this.deletePrimitives();
								   } else {primitiveParent = null;}
					 var root = this.Render();
					 if(primitiveParent) {primitiveParent.appendChild(root);}
					 return root;
					}
	/**
	 * Plug the HTML root node of c under a HTML node used in the rendering.
	 * Render method is called for both the node and c.
	 * primitivePlug is called by {@link appendChild}.
	 * @param {Presentation} c {@link Presentation} that will be rendered, its root will be plug under an HTML node rendered for this Presentation.
	 */
				 Presentation.prototype.primitivePlug	= function(c) {
					 // console.log("Primitive plug ", this.root, " ->", c.root);
					 var P = this.Render(),
					     N = c.Render();
					 if(N.parentElement === null) {P.appendChild(N);}
					}
	/**
	 * Unplug the HTML root node of c that should have for parent a HTML node of the Presentation.
	 * primitiveUnPlug is called by {@link removeChild}.
	 * @param {Presentation} c {@link Presentation} which root has for parent a HTML node rendered by this Presentation.
	 */
	 Presentation.prototype.primitiveUnPlug	= function(c) {
		 if(c.root && c.root.parentNode   ) {c.root.parentNode.removeChild(c.root);}
		 if(c.root && c.root.parentElement) {c.root.parentElement.removeChild(c.root);}
		 return this;
		}
	 Presentation.prototype.setName			= function(name) {}
	/**
	 * List all the descendants Presentation nodes.
	 * @returns {Presentation[]} Array of all {@link Presentation} that have this node for ancestor.
	 */
	 Presentation.prototype.getDescendants	= function() {
		 var L = [this], L_rep = [], n;
		 while(L.length) {
			 n = L[0];
			 L_rep.push( L.splice(0,1)[0] );
			 for(var i=0; i<n.children.length; i++) {L.push( n.children[i] );}
			}
		 return L_rep;
		}

	 // Return the reference to the Presentation constructor
	module.exports = Presentation;


/***/ },
/* 59 */
/***/ function(module, exports) {

	// removed by extract-text-webpack-plugin

/***/ },
/* 60 */,
/* 61 */,
/* 62 */,
/* 63 */
/***/ function(module, exports, __webpack_require__) {

	var PnodePresentation	= __webpack_require__( 57 )
	  , DragDrop			= __webpack_require__( 54 )
	  , str_template		= __webpack_require__( 64 )
	  , htmlTemplate		= document.createElement("div")
	  , htmlSeparator		= document.createElement("div")
	  , htmlSeparatorSuffix	= document.createElement("div")
	  ;

	htmlTemplate.innerHTML	= str_template;
	htmlSeparator.classList.add("separator");
	htmlSeparator.innerHTML	= '<div class="top"></div><div class="middle"></div><div class="bottom"></div>';

	htmlSeparatorSuffix = htmlSeparator.cloneNode(true);
	htmlSeparatorSuffix.classList.add("suffix");
	htmlSeparatorSuffix.querySelector(".middle").innerHTML = '<div class="left"></div><div class="right"></div>';


	// var css = document.createElement('link');
		// css.setAttribute('rel' , 'stylesheet');
		// css.setAttribute('href', 'js/Presentations/HTML_templates/PnodeNChildPresentation.css');
		// document.head.appendChild( css );

	__webpack_require__( 65 );

	var PnodeNChildPresentation = function() {
		// console.log(this);
		PnodePresentation.apply(this, []);
		return this;
	}

	PnodeNChildPresentation.prototype = Object.create( PnodePresentation.prototype );
	PnodeNChildPresentation.prototype.constructor	= PnodeNChildPresentation;
	PnodeNChildPresentation.prototype.className		= 'PnodeNChildPresentation';

	PnodeNChildPresentation.prototype.init = function(PnodeID, parent, children) {
		PnodePresentation.prototype.init.apply(this, [PnodeID, parent, children]);
		return this;
	}


	PnodeNChildPresentation.prototype.Render	= function() {
		var self = this;
		var root = PnodePresentation.prototype.Render.apply(this, []);
		root.classList.add('PnodeNChildPresentation');
		root.classList.add('Pnode');
		if(typeof this.html.content === "undefined") {
			 this.copyHTML(htmlTemplate, root);
			 this.html.content	= root.querySelector(".content");
			 this.html.lastOne	= root.querySelector(".content .lastOne");
			 this.encapsulate(this.html.lastOne)
			 this.html.D_encaps	= {};
			 this.dropZoneId = DragDrop.newDropZone( this.html.lastOne
								, { acceptedClasse	: [['Pnode', 'instruction']]
								  , CSSwhenAccepted	: 'possible2drop'
								  , CSSwhenOver		: 'ready2drop'
								  , ondrop			: function(evt, draggedNode, infoObj) {
										 var Pnode = new infoObj.constructor().init	( undefined	// PnodeID
																					, undefined	// parent
																					, undefined	// children
																					, infoObj
																					);
										 self.appendChild( Pnode );
										}
								  }
								);
			}
		return root;
	}

	PnodeNChildPresentation.prototype.encapsulate	= function(c) {
		var c_root
		  , parent
		  , encaps	= document.createElement( "div" )
		  , content	= document.createElement( "div" )
		  ;
		if(c.Render) {c_root = c.Render();} else {c_root = c;}
		parent = c_root.parentNode;
		if(parent) {parent.removeChild(c_root);}
		
		content.appendChild( c_root );
		content.classList.add( "container" );
		encaps.classList.add("child");
		encaps.appendChild( htmlSeparator.cloneNode(true) );
		encaps.appendChild( content );
		var suffix = htmlSeparatorSuffix.cloneNode(true);
		encaps.appendChild( suffix );
		
		if(parent) {parent.appendChild(encaps);}
		
		return encaps;
	}



	PnodeNChildPresentation.prototype.primitivePlug	= function(c) {
		this.Render();
		// Where is c in children ?
		var pos		= this.children.indexOf(c)
		  , nextOne	= this.html.content.children[pos]
		  , encaps	= this.encapsulate(c)
		  ;
		 
		this.html.content.insertBefore(encaps, nextOne);
		if(c.uid) {this.html.D_encaps[ c.uid ] = encaps;}
			
		return this;
	}

	PnodeNChildPresentation.prototype.primitiveUnPlug	= function(c) {
		 PnodePresentation.prototype.primitiveUnPlug.apply(this, [c]);
		 var encaps = this.html.D_encaps[c.uid];
		 if(encaps) {
			 encaps.parentNode.removeChild( encaps );
			 delete this.html.D_encaps[c.uid];
			}
		 return this;
	 }
	 
	 
	PnodeNChildPresentation.prototype.deletePrimitives = function() {
		PnodePresentation.prototype.deletePrimitives.apply(this, []);
		if(this.dropZoneId) {
			 DragDrop.deleteDropZone( this.dropZoneId );
			 this.dropZoneId = null;
			}
		return this;
	}



	// OLD_________________________________________________________________________________________________________
	PnodeNChildPresentation.prototype.RenderOLD	= function() {
		var self = this;
		var root = PnodePresentation.prototype.Render.apply(this, []);
		root.classList.add('Pnode');
		this.divDescription.innerText = 'PnodeNChild ' + this.PnodeID + ' (presentation ' + this.uid + ')' ;
		if(!this.divChildren) {
			this.divChildren = document.createElement('div');
				root.appendChild( this.divChildren );
				this.divChildren.classList.add('children');
				this.divChildrenTxt = document.createElement('div');
				this.divChildrenTxt.innerText = 'Insert a Pnode here';
				this.divChildren.appendChild( this.divChildrenTxt );
				this.dropZoneId = DragDrop.newDropZone( this.divChildrenTxt
									, { acceptedClasse	: [['Pnode', 'instruction']]
									  , CSSwhenAccepted	: 'possible2drop'
									  , CSSwhenOver		: 'ready2drop'
									  , ondrop			: function(evt, draggedNode, infoObj) {
											 var Pnode = new infoObj.constructor().init	( undefined	// PnodeID
																						, undefined	// parent
																						, undefined	// children
																						, infoObj
																						);
											 self.appendChild( Pnode );
											}
									  }
									);
			}
		return root;
	}

	PnodeNChildPresentation.prototype.deletePrimitivesOLD = function() {
		PnodePresentation.prototype.deletePrimitives.apply(this, []);
		if(this.divChildren) {
			 DragDrop.deleteDropZone( this.dropZoneId );
			 if(this.divChildren.parentNode) {this.divChildren.parentNode.removeChild( this.divChildren );}
			 this.divChildren = this.divChildrenTxt = this.dropZoneId = null;
			}
		return this;
	}

	PnodeNChildPresentation.prototype.primitivePlugOLD	= function(c) {
		 // console.log("Primitive plug ", this.root, " ->", c.root);
		 this.Render();
		 var P = this.divChildren,
			 N = c.Render();
		 if(N.parentElement === null) {P.insertBefore(N, this.divChildrenTxt);}
		return this;
	}

	// Return the constructor
	module.exports = PnodeNChildPresentation;



/***/ },
/* 64 */
/***/ function(module, exports) {

	module.exports = "<div class=\"prefix\"></div>\r\n<div class=\"content\">\r\n\t<div class=\"lastOne Pnode ActionNodePresentation\">Drop node</div>\r\n</div>\r\n<div class=\"suffix\"></div>\r\n"

/***/ },
/* 65 */
/***/ function(module, exports) {

	// removed by extract-text-webpack-plugin

/***/ },
/* 66 */,
/* 67 */
/***/ function(module, exports, __webpack_require__) {

	var PnodeNChildPresentation = __webpack_require__( 63 );

	var ParallelNodePresentation = function() {
		PnodeNChildPresentation.prototype.constructor.apply(this, []);
		return this;
	}

	ParallelNodePresentation.prototype = Object.create( PnodeNChildPresentation.prototype ); // new PnodeNChildPresentation();
	ParallelNodePresentation.prototype.constructor	= ParallelNodePresentation;
	ParallelNodePresentation.prototype.className	= 'ParallelNode';

	ParallelNodePresentation.prototype.init = function(PnodeID, parent, children) {
		PnodeNChildPresentation.prototype.init.apply(this, [PnodeID, parent, children]);
		return this;
	}

	ParallelNodePresentation.prototype.serialize = function() {
		 var json = PnodeNChildPresentation.prototype.serialize.apply(this, []);
		 json.subType = 'ParallelNodePresentation';
		 return json;
		}
	ParallelNodePresentation.prototype.Render	= function() {
		// var self = this;
		var root = PnodeNChildPresentation.prototype.Render.apply(this, []);
		root.classList.add('ParallelNode');
		root.classList.add('ParallelNodePresentation');
		// this.divDescription.innerText = 'ParallelNode ' + this.PnodeID + ' (presentation ' + this.uid + ')' ;
		return root;
	}

	// Return the constructor
	module.exports = ParallelNodePresentation;



/***/ },
/* 68 */
/***/ function(module, exports) {

	// removed by extract-text-webpack-plugin

/***/ },
/* 69 */,
/* 70 */
/***/ function(module, exports, __webpack_require__) {

	var PnodePresentation	= __webpack_require__( 57 )
	  , DragDrop			= __webpack_require__( 54 )
	  , htmlTemplateText	= __webpack_require__( 71 )
	  , utils				= __webpack_require__( 1 )
	  ;

	// var css = document.createElement('link');
	// css.setAttribute('rel' , 'stylesheet');
	// css.setAttribute('href', 'js/Presentations/HTML_templates/ActionNodePresentation.css');
	// document.head.appendChild(css);

	__webpack_require__(72);



	var htmlTemplate = document.createElement('div');
	htmlTemplate.innerHTML = htmlTemplateText;

	var ActionNodePresentation = function() {
		// console.log(this);
		PnodePresentation.prototype.constructor.apply(this, []);
		return this;
	}


	ActionNodePresentation.prototype = Object.create( PnodePresentation.prototype ); // new PnodePresentation();
	ActionNodePresentation.prototype.className = ActionNodePresentation;
	ActionNodePresentation.prototype.className = 'ActionNode';

	ActionNodePresentation.prototype.init = function(PnodeID, parent, children) {
		var self = this;
		PnodePresentation.prototype.init.apply(this, [PnodeID, parent, children]);
		this.action			= { method		: ''
							  , params		: []
							  };
		this.html			= {};
		this.contextualMenuItems.unshift	( { content	: "trigger action"
											  , cb		: function() {
															 utils.call	( self.PnodeID
																		, 'triggerDirectly'
																		, [self.action.method, self.action.params]
																		);
															}
											  }
											);
		return this;
	}

	ActionNodePresentation.prototype.serialize	= function() {
		var json = PnodePresentation.prototype.serialize.apply(this, []);
		// Describe action here
		json.subType	= 'ActionNode';
		json.ActionNode = { method		: this.action.method
						  , params		: this.action.params
						  };
		return json;
	}
	ActionNodePresentation.prototype.unserialize	= function(json, PresoUtils) {
		// Describe action here
		PnodePresentation.prototype.unserialize.apply(this, [json, PresoUtils]);
		this.action.method		= json.ActionNode.method;
		this.action.params		= json.ActionNode.params;
		console.log("ActionNodePresentation::", this.action);
		return this;
	}

	ActionNodePresentation.prototype.primitivePlug	= function(c) {
		 // console.log("Primitive plug ", this.root, " ->", c.root);
		 this.Render();
		 var P = this.html.divSelector
			, N = c.Render();
		 if(N.parentElement === null) {
			 P.innerHTML = '';
			 P.appendChild( N );
			}
		 return this;
		}

	ActionNodePresentation.prototype.Render	= function() {
		var self = this
		  , root = PnodePresentation.prototype.Render.apply(this, []);
		root.classList.add('ActionNode');
		root.classList.add('ActionNodePresentation');
		if(typeof this.html.actionName === 'undefined') {
			 this.copyHTML(htmlTemplate, root);
			 this.html.img_symbol	= root.querySelector( "img.action_symbol" );
			 this.html.actionName	= root.querySelector(".actionName");
			 this.html.divSelector	= root.querySelector(".selector");
			 this.html.actionDescr	= root.querySelector(".action_description");
			 this.html.img_symbol.setAttribute("src", "js/Presentations/HTML_templates/action_128x128.jpg");
			 this.dropZoneSelectorId = DragDrop.newDropZone	( this.html.divSelector
															, { acceptedClasse	: 'SelectorNode'
															  , CSSwhenAccepted	: 'possible2drop'
															  , CSSwhenOver		: 'ready2drop'
															  , ondrop			: function(evt, draggedNode, infoObj) {
																	 var Pnode = new infoObj.constructor().init	( undefined	// PnodeID
																												, undefined	// parent
																												, undefined	// children
																												, infoObj
																												);
																	 self.appendChild( Pnode );
																	}
															  }
															);
			}
		return root;
	}

	// Return the constructor
	module.exports = ActionNodePresentation;



/***/ },
/* 71 */
/***/ function(module, exports) {

	module.exports = "<img class=\"action_symbol\"></img>\r\n<div class=\"action_description\">\r\n\t<div class=\"actionName\">Action name</div>\r\n\t<div class=\"selector\">\r\n\t\tDrop target\r\n\t</div>\r\n</div>"

/***/ },
/* 72 */
/***/ function(module, exports) {

	// removed by extract-text-webpack-plugin

/***/ },
/* 73 */,
/* 74 */
/***/ function(module, exports, __webpack_require__) {

	var PnodeNChildPresentation	= __webpack_require__( 63 );

	var SequenceNodePresentation = function() {
		PnodeNChildPresentation.prototype.constructor.apply(this, []);
		return this;
	}

	SequenceNodePresentation.prototype = Object.create( PnodeNChildPresentation.prototype ); // new PnodeNChildPresentation();
	SequenceNodePresentation.prototype.constructor	= SequenceNodePresentation;
	SequenceNodePresentation.prototype.className	= 'SequenceNode';

	SequenceNodePresentation.prototype.init = function(PnodeID, parent, children) {
		PnodeNChildPresentation.prototype.init.apply(this, [PnodeID, parent, children]);
		return this;
	}
	SequenceNodePresentation.prototype.serialize = function() {
		 var json = PnodeNChildPresentation.prototype.serialize.apply(this, []);
		 json.subType = 'SequenceNodePresentation';
		 return json;
		}
	SequenceNodePresentation.prototype.Render	= function() {
		// var self = this;
		var root = PnodeNChildPresentation.prototype.Render.apply(this, []);
		root.classList.add('SequenceNode')
		// this.divDescription.innerText = 'SequenceNode ' + this.PnodeID + ' (presentation ' + this.uid + ')' ;
		return root;
	}
	// Return the constructor
	module.exports = SequenceNodePresentation;


/***/ },
/* 75 */
/***/ function(module, exports, __webpack_require__) {

	var PnodePresentation	= __webpack_require__( 57 )
	  , DragDrop			= __webpack_require__( 54 )
	  // , utils				= require( '../utils.js' )
	  , htmlTemplateText	= __webpack_require__( 76 )
	  ;

	// var css = document.createElement('link');
	// css.setAttribute('rel' , 'stylesheet');
	// css.setAttribute('href', 'js/Presentations/HTML_templates/EventNodePresentation.css');
	// document.head.appendChild(css);
	__webpack_require__( 77 );

	var htmlTemplate = document.createElement('div');
	htmlTemplate.innerHTML = htmlTemplateText;

	  
	// Desfining EventNodePresentation
	var EventNodePresentation = function() {
		PnodePresentation.apply(this, []);
		return this;
	}

	EventNodePresentation.prototype = Object.create( PnodePresentation.prototype ); // new PnodePresentation();
	EventNodePresentation.prototype.constructor	= EventNodePresentation;
	EventNodePresentation.prototype.className	= 'EventNode';

	EventNodePresentation.prototype.init = function(PnodeID, parent, children) {
		PnodePresentation.prototype.init.apply(this, [PnodeID, parent, children]);
		this.event = {};
		return this;
	}

	EventNodePresentation.prototype.serialize = function() {
		var json = PnodePresentation.prototype.serialize.apply(this, []);
		json.subType = 'EventNodePresentation';
		if(this.implicitVariableId) {json.implicitVariableId = this.implicitVariableId;}
		return json;
	}

	EventNodePresentation.prototype.unserialize	= function(json, PresoUtils) {
		// var self = this;
		PnodePresentation.prototype.unserialize.apply(this, [json, PresoUtils]);
		if(json.implicitVariableId) {this.implicitVariableId = json.implicitVariableId;}
		return this;
	}

	EventNodePresentation.prototype.primitivePlug	= function(c) {
		 // console.log("Primitive plug ", this.root, " ->", c.root);
		 this.Render();
		 var P = this.html.divSelector
			, N = c.Render();
		 if(N.parentElement === null) {
			 P.innerHTML = '';
			 P.appendChild( N );
			}
		 return this;
		 
		}

	EventNodePresentation.prototype.Render	= function() {
		var self = this;
		var root = PnodePresentation.prototype.Render.apply(this, []);
		root.classList.add('EventNode');
		root.classList.add("EventNodePresentation");
		root.classList.remove('Pnode');
		if(typeof this.html.eventName === 'undefined') {
			 this.copyHTML(htmlTemplate, root);
			 this.html.img_symbol	= root.querySelector( "img.event_symbol" );
			 this.html.eventName	= root.querySelector(".eventName");
			 this.html.divSelector	= root.querySelector(".selector");
			 this.html.eventDescr	= root.querySelector(".event_description");
			 this.html.img_symbol.setAttribute("src", "js/Presentations/HTML_templates/event-icon.png");
			 this.dropZoneSelectorId = DragDrop.newDropZone	( this.html.divSelector
															, { acceptedClasse	: 'SelectorNode'
															  , CSSwhenAccepted	: 'possible2drop'
															  , CSSwhenOver		: 'ready2drop'
															  , ondrop			: function(evt, draggedNode, infoObj) {
																	 var Pnode = new infoObj.constructor().init	( undefined	// PnodeID
																												, undefined	// parent
																												, undefined	// children
																												, infoObj
																												);
																	 self.appendChild( Pnode );
																	}
															  }
															);
			}
		return root;
	}

	// Return the constructor
	module.exports = EventNodePresentation;



/***/ },
/* 76 */
/***/ function(module, exports) {

	module.exports = "<img class=\"event_symbol\"></img>\r\n<div class=\"event_description event\">\r\n\t<p class=\"eventName\">Event name</p>\r\n\t<p class=\"selector\">Drop sources here</p>\r\n</div>"

/***/ },
/* 77 */
/***/ function(module, exports) {

	// removed by extract-text-webpack-plugin

/***/ },
/* 78 */,
/* 79 */
/***/ function(module, exports, __webpack_require__) {

	var EventNodePresentation	= __webpack_require__( 75 )
	  // , DragDrop				= require( '../DragDrop.js' )
	  // , utils					= require( '../utils.js' )
	  , htmlTemplate			= __webpack_require__( 80 )
	  , htmlTemplateFilter		= __webpack_require__( 81 )
	  ;

	// linking CSS
	// var css = document.createElement('link');
		// css.setAttribute('rel' , 'stylesheet');
		// css.setAttribute('href', 'js/Presentations/HTML_templates/PeventFromSocketIOPresentation.css');
		// document.body.appendChild(css);
	__webpack_require__( 82 );
		
		
	// var htmlTemplate = null, htmlTemplateFilter = null;
	// utils.XHR( 'GET', 'js/Presentations/HTML_templates/PeventFromSocketIOPresentation.html'
			 // , function() {htmlTemplate = this.responseText;}
			 // );
	// utils.XHR( 'GET', 'js/Presentations/HTML_templates/PeventFromSocketIOPresentationFilter.html'
			 // , function() {htmlTemplateFilter = this.responseText;}
			 // );

	// Defining PeventFromSocketIOPresentation
	var PeventFromSocketIOPresentation = function() {
		EventNodePresentation.prototype.constructor.apply(this, []);
		return this;
	}

	PeventFromSocketIOPresentation.prototype = Object.create( EventNodePresentation.prototype ); // new EventNodePresentation();
	PeventFromSocketIOPresentation.prototype.constructor	= PeventFromSocketIOPresentation;
	PeventFromSocketIOPresentation.prototype.className		= 'PeventFromSocketIO';

	PeventFromSocketIOPresentation.prototype.init		= function(PnodeID, parent, children) {
		EventNodePresentation.prototype.init.apply(this, [PnodeID, parent, children]);
		this.event = {topic: '', filters:[], isRegExp: false};
		return this;
	}

	PeventFromSocketIOPresentation.prototype.serialize	= function() {
		var json = EventNodePresentation.prototype.serialize.apply(this, []);
		json.subType = 'PeventFromSocketIOPresentation';
		json.event = { topic	: this.event.topic
					 , filters	: []
					 , isRegExp	: this.event.isRegExp
					 };
		if(this.html.filter) {
			 var L_filters = this.html.filter.querySelectorAll( 'div.FILTER' )
			   , filter;
			 for(var i=0; i<L_filters.length; i++) {
				 filter = L_filters.item(i);
				 json.event.filters.push( { attribute	: filter.querySelector('input.attribute').value
										  , operator	: filter.querySelector('select.operator').value
										  , value		: filter.querySelector('input.value'    ).value
										  } 
										);
				}
			}
		// console.log("PeventFromSocketIOPresentation::serialize =>", json);
		return json;
	}

	PeventFromSocketIOPresentation.prototype.unserialize	= function(json, PresoUtils) {
		// console.log("PeventFromSocketIOPresentation::unserialize", json);
		EventNodePresentation.prototype.unserialize.apply(this, [json, PresoUtils]);
		this.event = json.event;
		if(this.html.eventTopic) {
			 this.html.eventTopic.setAttribute('value', this.event.topic);
			 // Add filters
			 var i, filter;
			 for(i=0; i<this.event.filters.length; i++) {
				 filter = this.event.filters[i];
				 this.appendFilter( filter.attribute, filter.operator, filter.value );
				}
			}
		return this;
	}

	PeventFromSocketIOPresentation.prototype.appendFilter	= function(attribute, operator, value) {
		var filter = document.createElement( 'div' );
			filter.classList.add( 'FILTER' );
			filter.innerHTML = htmlTemplateFilter;
			var del = filter.querySelector( 'input.delete' );
			del.onclick = function() {filter.parentNode.removeChild(filter); del.onclick = null;}
			if(attribute) {filter.querySelector('.attribute').value = attribute;}
			if(operator ) {filter.querySelector('.operator' ).value = operator ;}
			if(value    ) {filter.querySelector('.value'    ).value = value    ;}
		this.html.filter.appendChild( filter );
	}

	PeventFromSocketIOPresentation.prototype.Render	= function() {
		var self = this;
		var root = EventNodePresentation.prototype.Render.apply(this, []);
		root.classList.add('PeventFromSocketIOPresentation');
		if(htmlTemplate && htmlTemplateFilter) {
			// Describe the event to be observed on socketIO
			this.divDescription.innerHTML = htmlTemplate;
			this.html.filter		= this.divDescription.querySelector(".eventRoot > .filter");
			this.html.eventTopic	= this.divDescription.querySelector("input.receive.topic");
				this.html.eventTopic.onkeyup = function() {self.event.topic = self.html.eventTopic.value;};
				this.html.eventTopic.setAttribute('value', this.event.topic);
			this.html.isRegExp		= this.divDescription.querySelector('input.isRegExp');
				this.html.isRegExp.checked	= this.event.isRegExp;
				this.html.isRegExp.onchange = function() {self.event.isRegExp = self.html.isRegExp.checked;}
			this.html.addFilter	= this.divDescription.querySelector(".filter > input.addFilter");
				this.html.addFilter.onclick	= function() {self.appendFilter();}
			 // Add filters
			 var i, filter;
			 for(i=0; i<this.event.filters.length; i++) {
				 filter = this.event.filters[i];
				 this.appendFilter( filter.attribute, filter.operator, filter.value );
				}
			}
		return root;
	}

	// Return the constructor
	module.exports = PeventFromSocketIOPresentation;



/***/ },
/* 80 */
/***/ function(module, exports) {

	module.exports = "<div class=\"eventRoot\">\r\n\t<span class=\"label receive topic\">socketIO receives</span>\r\n\t<input type=\"text\" class=\"receive topic\"></input>\r\n\t<span class=\"label\"> (is a regexp? </span>\r\n\t<input type=\"checkbox\" class=\"isRegExp\"></input>\r\n\t<span class=\"label\">)</span>\r\n\t<div class=\"filter\">\r\n\t\t<input type=\"button\" class=\"addFilter\" value=\"Add Filter\" />\r\n\t</div>\r\n</div>"

/***/ },
/* 81 */
/***/ function(module, exports) {

	module.exports = "<div class=\"filter\">\r\n\t<input type=\"text\" class=\"attribute\"></input>\r\n\t<select name=\"cars\", class=\"operator\">\r\n\t\t<option value=\"equal\">equal</option>\r\n\t\t<option value=\"different\">different</option>\r\n\t\t<option value=\"greater\">greater than</option>\r\n\t\t<option value=\"greaterOrEqual\">greater or equal than</option>\r\n\t\t<option value=\"lower\">lower than</option>\r\n\t\t<option value=\"lowerOrEqual\">lower or equal than</option>\r\n\t</select>\r\n\t<input type=\"text\"   class=\"value\"></input>\r\n\t<input type=\"button\" class=\"delete\" value=\"delete\"></input>\r\n</div>"

/***/ },
/* 82 */
/***/ function(module, exports) {

	// removed by extract-text-webpack-plugin

/***/ },
/* 83 */,
/* 84 */
/***/ function(module, exports, __webpack_require__) {

	var PnodePresentation	= __webpack_require__( 57 )
	  , utils				= __webpack_require__( 1 )
	  , DragDrop			= __webpack_require__( 54 )
	  , Var_UsePresentation	= __webpack_require__( 85 )
	  , str_template		= __webpack_require__( 88 )
	  , htmlTemplate		= document.createElement("div")
	  ;

	htmlTemplate.innerHTML = str_template;
	__webpack_require__( 89 );
	// var css = document.createElement('link');
		// css.setAttribute('rel' , 'stylesheet');
		// css.setAttribute('href', 'js/Presentations/HTML_templates/WhenNodePresentation.css');
		// document.head.appendChild( css );

	var WhenNodePresentation = function() {
		PnodePresentation.prototype.constructor.apply(this, []);
		return this;
	}

	WhenNodePresentation.prototype = Object.create( PnodePresentation.prototype ); // new PnodePresentation();
	WhenNodePresentation.prototype.constructor	= WhenNodePresentation;
	WhenNodePresentation.prototype.className	= 'WhenNode';

	WhenNodePresentation.prototype.init = function(PnodeID, parent, children) {
		PnodePresentation.prototype.init.apply(this, [PnodeID, parent, children]);
		this.PnodeID = PnodeID;
		this.when = { childEvent	: null
					, childReaction	: null
					, varName		: 'brick'
					, varType		: []
					};
		this.configDragVar    = { constructor	: Var_UsePresentation
								, htmlNode		: null		// this.html.variableName
								, nodeType		: []		// this.event.varType
								, id			: null		// this.event.varId
								, name			: 'brick'	// self.event.eventName
								};
		return this;
	}

	WhenNodePresentation.prototype.serialize	= function() {
		var json = PnodePresentation.prototype.serialize.apply(this, []);
		json.children = []; // info debug to be sure to remove children, should already be empty.
		json.when = { varName	: this.html.variableName.innerHTML };
	 	if(this.when.childEvent   ) {json.when.childEvent		= this.when.childEvent.serialize   ();}
		if(this.when.childReaction) {json.when.childReaction	= this.when.childReaction.serialize();}
		json.subType		= 'WhenNodePresentation';
		return json;
	}

	WhenNodePresentation.prototype.unserialize	= function(json, PresoUtils) {
		PnodePresentation.prototype.unserialize.apply(this, [json, PresoUtils]);
		if(json.when.childEvent   ) {this.when.childEvent		= PresoUtils.unserialize(json.when.childEvent   ); this.appendChild(this.when.childEvent	 );}
		if(json.when.childReaction) {this.when.childReaction	= PresoUtils.unserialize(json.when.childReaction); this.appendChild(this.when.childReaction);}
		// Implicit variabe
		this.when.varName	= json.when.varName;
		this.when.varType	= json.when.varType;
		
		if(this.html.variableName) {
			 this.html.variableName.innerHTML = "";
			 this.html.variableName.appendChild( document.createTextNode(this.when.varName) );
			 for(var i=0; i<this.when.varType.length; i++) {
				 this.html.variableName.classList.add( this.when.varType[i] );
				}
			 if( this.when.varType.indexOf('Brick') === 0) {
				 this.html.divImplicitVariable.classList.add('display'); 
				} else {this.html.divImplicitVariable.classList.remove('display');}
			}

		this.configDragVar.nodeType	= this.when.varType;
		this.configDragVar.id		= json.when.varId;
		this.configDragVar.name		= json.when.varName;
		this.configDragVar.config	= { id		: this.configDragVar.id
									  , name	: this.configDragVar.name
									  };
		return this;
	}

	WhenNodePresentation.prototype.Render	= function() {
		var self = this;
		var root = PnodePresentation.prototype.Render.apply(this, []);
		root.classList.add("WhenNodePresentation");
		if(typeof this.html.event === "undefined") {
			 this.copyHTML(htmlTemplate, root);
			 this.html.eventDrop			= root.querySelector(".defwhen > .eventDrop");
			 this.html.event				= root.querySelector(".defwhen > .eventDrop > .event");
			 this.html.instructions			= root.querySelector(".defwhen > .instructions");
			 this.html.divImplicitVariable	= root.querySelector(".defwhen > .eventDrop > .ImplicitVariable");
			// Implicit variable
				 if( this.when && this.when.varType && this.when.varType.indexOf('Brick') === 0) {
					 this.html.divImplicitVariable.classList.add('display'); 
					} else {this.html.divImplicitVariable.classList.remove('display');}
				 // Configure variableName
				 this.html.variableName = this.html.divImplicitVariable.querySelector('.defwhen > .eventDrop > .ImplicitVariable > .variableName');
				// Draggable property
				 this.configDragVar.htmlNode = this.html.variableName;
				 DragDrop.newDraggable ( this.html.variableName
									   , this.configDragVar
									   );
			// Drag&Drop event
			this.dropZoneEventId = DragDrop.newDropZone( self.html.eventDrop
								, { acceptedClasse	: 'EventNode'
								  , CSSwhenAccepted	: 'possible2drop'
								  , CSSwhenOver		: 'ready2drop'
								  , ondrop			: function(evt, draggedNode, infoObj) {
										 self.removeChild( self.when.childEvent );
										 var Pnode = new infoObj.constructor().init	( undefined	// PnodeID
																					, undefined	// parent
																					, undefined	// children
																					, infoObj
																					);
										 self.when.childEvent = Pnode;
										 self.html.event.innerHTML = '';
										 self.appendChild(  self.when.childEvent );
										}
								  }
								);
			// Drag&Drop instructions
				this.dropZoneReactionId = DragDrop.newDropZone( this.html.instructions
									, { acceptedClasse	: [['Pnode', 'instruction']]
									  , CSSwhenAccepted	: 'possible2drop'
									  , CSSwhenOver		: 'ready2drop'
									  , ondrop			: function(evt, draggedNode, infoObj) {
											 self.removeChild( self.when.childReaction );
											 var Pnode = new infoObj.constructor().init	( undefined	// PnodeID
																						, undefined	// parent
																						, undefined	// children
																						, infoObj
																						);
											 self.when.childReaction = Pnode;
											 self.html.instructions.innerHTML = '';
											 self.appendChild( self.when.childReaction );
											}
									  }
									);
			}
		return root;
	}

	WhenNodePresentation.prototype.primitivePlug	= function(c) {
		if(c && c === this.when.childEvent   ) {this.html.event.innerHTML	  = '';
											    this.html.event.appendChild( c.Render() );
											   }
		if(c && c === this.when.childReaction) {this.html.instructions.innerHTML = '';
											    this.html.instructions.appendChild( c.Render() );
											   }
	}

	WhenNodePresentation.prototype.deletePrimitives = function() {
		var self = this;
		PnodePresentation.prototype.deletePrimitives.apply(this, []);
		if(this.html.event) {
			 this.html.event = this.html.instructions = null;
			 DragDrop.deleteDropZone( self.dropZoneEventId    );
			 DragDrop.deleteDropZone( self.dropZoneReactionId );
			}
		return this;
	}





	//______________________________________________________________
	/* OLD */
	WhenNodePresentation.prototype.RenderOLD	= function() {
		var self = this;
		var root = PnodePresentation.prototype.Render.apply(this, []);
		root.classList.add('WhenNodePresentation');
		if(!this.divChildren) {
			 this.divDescription.innerHTML = 'WhenNode:' + this.PnodeID ;
			 
			 this.divChildren = document.createElement('div');
				root.appendChild( this.divChildren );
				this.divChildren.classList.add('children');
			// Event part
			 this.divEvent		= document.createElement('div');
			 self.divEvent.innerText = ' Drop event here ';
			 this.divChildren.appendChild(this.divEvent);
				this.dropZoneEventId = DragDrop.newDropZone( self.divEvent
									, { acceptedClasse	: 'EventNode'
									  , CSSwhenAccepted	: 'possible2drop'
									  , CSSwhenOver		: 'ready2drop'
									  , ondrop			: function(evt, draggedNode, infoObj) {
											 self.removeChild( self.when.childEvent );
											 var Pnode = new infoObj.constructor().init	( undefined	// PnodeID
																						, undefined	// parent
																						, undefined	// children
																						, infoObj
																						);
											 self.when.childEvent = Pnode; //new infoObj.constructor(infoObj).init( '' );
											 self.divEvent.innerText = '';
											 self.appendChild(  self.when.childEvent );
											 // DragDrop.deleteDropZone( self.dropZoneEventId );
											}
									  }
									);
			// Implicit variable
			 this.divImplicitVariable = document.createElement('div');
			 this.divImplicitVariable.classList.add('ImplicitVariable');
			 if( this.when && this.when.varType && this.when.varType.indexOf('Brick') === 0) {
				 this.divImplicitVariable.classList.add('display'); 
				} else {this.divImplicitVariable.classList.remove('display');}
			 this.divImplicitVariable.innerHTML = '<span class="label">let the call it <div class="variableName Pnode Pselector_variable">brick</div>)</span>'
			 this.divChildren.appendChild( this.divImplicitVariable );
			 // Configure variableName
			 this.html.variableName = this.divImplicitVariable.querySelector('.variableName');
			 // Draggable property
			 self.configDragVar.htmlNode	= this.html.variableName;
			 DragDrop.newDraggable ( this.html.variableName
								   , this.configDragVar
								   );
			 // Edition mode
			 utils.HCI.makeEditable( this.html.variableName );		
			 this.html.variableName.innerHTML = "";
			 this.html.variableName.appendChild( document.createTextNode(this.when.varName) );
			 for(var i=0; i<this.when.varType.length; i++) {
				 this.html.variableName.classList.add( this.when.varType[i] );
				}

			// Reaction part
			 this.divReaction	= document.createElement('div');
			 self.divReaction.innerText = 'Reaction here';
			 this.divChildren.appendChild(this.divReaction);
				this.dropZoneReactionId = DragDrop.newDropZone( this.divReaction
									, { acceptedClasse	: [['Pnode', 'instruction']]
									  , CSSwhenAccepted	: 'possible2drop'
									  , CSSwhenOver		: 'ready2drop'
									  , ondrop			: function(evt, draggedNode, infoObj) {
											 self.removeChild( self.when.childReaction );
											 var Pnode = new infoObj.constructor().init	( undefined	// PnodeID
																						, undefined	// parent
																						, undefined	// children
																						, infoObj
																						);
											 self.when.childReaction = Pnode; //new infoObj.constructor(infoObj).init( '' );
											 self.divReaction.innerText = '';
											 self.appendChild( self.when.childReaction );
											 // DragDrop.deleteDropZone( self.dropZoneReactionId );
											}
									  }
									);
			}
		return root;
	}
	WhenNodePresentation.prototype.deletePrimitivesOLD = function() {
		var self = this;
		PnodePresentation.prototype.deletePrimitives.apply(this, []);
		if(this.divChildren) {
			 if(this.divChildren.parentNode) {this.divChildren.parentNode.removeChild( this.divChildren );}
			 delete this.divChildren;
			 this.divChildren = this.divEvent = this.divReaction = null;
			 DragDrop.deleteDropZone( self.dropZoneEventId    );
			 DragDrop.deleteDropZone( self.dropZoneReactionId );
			}
		return this;
	}

	WhenNodePresentation.prototype.primitivePlugOLD	= function(c) {
		if(c && c === this.when.childEvent   ) {this.divEvent.innerText	  = '';
											    this.divEvent.appendChild( c.Render() );
											   }
		if(c && c === this.when.childReaction) {this.divReaction.innerText = '';
											    this.divReaction.appendChild( c.Render() );
											   }
	}

	// Return the constructor
	module.exports = WhenNodePresentation;



/***/ },
/* 85 */
/***/ function(module, exports, __webpack_require__) {

	var PnodePresentation	= __webpack_require__( 57 )
	  // , DragDrop			= require( '../DragDrop.js' )
	  ;
	  
	__webpack_require__( 86 );
	// var css = document.createElement('link');
		// css.setAttribute('rel' , 'stylesheet');
		// css.setAttribute('href', 'css/Var_UsePresentation.css');
		// document.head.appendChild( css );

	var Var_UsePresentation = function() {
		// console.log(this);
		PnodePresentation.prototype.constructor.apply(this, []);
		return this;
	}

	Var_UsePresentation.prototype = Object.create( PnodePresentation.prototype ); // new PnodePresentation();
	Var_UsePresentation.prototype.constructor	= Var_UsePresentation;
	Var_UsePresentation.prototype.className		= 'Pselector_variable';

	Var_UsePresentation.prototype.init = function(PnodeID, parent, children, infoObj) {
		PnodePresentation.prototype.init.apply(this, [PnodeID, parent, children, infoObj]);
		this.selector	= { variableId	: null
						  , name		: ''
						  };
		if(infoObj) {
			 this.selector.variableId	= infoObj.config.id;
			 this.selector.name			= infoObj.config.name;
			}
		return this;
	}

	Var_UsePresentation.prototype.serialize	= function() {
		var json = PnodePresentation.prototype.serialize.apply(this, []);
		// Describe action here
		json.subType	= 'Var_UsePresentation';
		json.selector = { name			: this.selector.name
						, type			: []
						, variableId	: this.selector.variableId
						};
		return json;
	}

	Var_UsePresentation.prototype.unserialize	= function(json, PresoUtils) {
		// Describe action here
		PnodePresentation.prototype.unserialize.apply(this, [json, PresoUtils]);
		this.selector.variableId	= json.selector.variableId;
		this.selector.name			= json.selector.variableName;
		if(this.html.spanVarId) {
			 this.html.spanVarId.innerHTML = '';
			 this.html.spanVarId.classList.add( this.selector.variableId );
			 this.html.spanVarId.appendChild( document.createTextNode(this.selector.name) );
			}
		return this;
	}

	Var_UsePresentation.prototype.updateType = function() {}

	Var_UsePresentation.prototype.Render	= function() {
		// var self = this;
		var root = PnodePresentation.prototype.Render.apply(this, []);
		root.classList.add('Pselector_variable');
		if(typeof this.html.spanVarId === 'undefined') {
			 this.html.spanVarId = document.createElement('span');
				this.html.spanVarId.classList.add( 'varId' );
				this.divDescription.appendChild( this.html.spanVarId );
				if(this.selector.variableId) {
					 this.html.spanVarId.classList.add( this.selector.variableId );
					 this.html.spanVarId.appendChild( document.createTextNode(this.selector.name) );
					}
			}
		return root;
	}

	// Return the constructor
	module.exports = Var_UsePresentation;



/***/ },
/* 86 */
/***/ function(module, exports) {

	// removed by extract-text-webpack-plugin

/***/ },
/* 87 */,
/* 88 */
/***/ function(module, exports) {

	module.exports = "<div class=\"arrow\">\r\n\t<div class=\"eventSymbol\"></div>\r\n\t<div class=\"defwhen\">\r\n\t\t<div class=\"eventDrop\">\r\n\t\t\t<div class=\"ImplicitVariable\">\r\n\t\t\t\tLet's call the event source <div class=\"variableName Pnode Pselector_variable\">brick</div>\r\n\t\t\t</div>\r\n\t\t\t<div class=\"event\">Drop EVENT here</div>\r\n\t\t</div>\r\n\t\t<img src=\"js/Presentations/HTML_templates/implySymbol.svg\"></img>\r\n\t\t<div class=\"instructions\">Drop REACTION here</div>\r\n\t</div>\r\n</div>\r\n\r\n"

/***/ },
/* 89 */
/***/ function(module, exports) {

	// removed by extract-text-webpack-plugin

/***/ },
/* 90 */,
/* 91 */
/***/ function(module, exports, __webpack_require__) {

	var PnodePresentation	= __webpack_require__( 57 )
	  // , DragDrop			= require( '../DragDrop.js' )
	  ;

	var PcontrolBrickPresentation = function() {
		// console.log(this);
		PnodePresentation.apply(this, []);
		return this;
	}

	PcontrolBrickPresentation.prototype = Object.create( PnodePresentation.prototype ); // new PnodePresentation();
	PcontrolBrickPresentation.prototype.constructor	= PcontrolBrickPresentation;
	PcontrolBrickPresentation.prototype.className	= 'PcontrolBrick';

	PcontrolBrickPresentation.prototype.init = function(PnodeID, parent, children) {
		PnodePresentation.prototype.init.apply(this, [PnodeID, parent, children]);
		this.PnodeID = PnodeID;
		return this;
	}
	PcontrolBrickPresentation.prototype.serialize	= function() {
		var json = PnodePresentation.prototype.serialize.apply(this, []);
		 json.subType = './PcontrolBrickPresentation.js';
		return json;
	}
	PcontrolBrickPresentation.prototype.unserialize	= function(json, PresoUtils) {
		// Describe action here
		PnodePresentation.prototype.unserialize.apply(this, [json, PresoUtils]);
		this.idControler = this.divDescription.querySelector('input').value = json.idControler;
		this.Render();
		return this;
	}

	PcontrolBrickPresentation.prototype.Render	= function() {
		// var self = this;
		var root = PnodePresentation.prototype.Render.apply(this, []);
		root.classList.add('PcontrolBrick');
		this.divDescription.innerHTML = 'Controler: ' + this.PnodeID + ' for login <input type="text"></input>' ;
		this.divDescription.querySelector('input').value = this.idControler || '';
		return root;
	}

	// Return the constructor
	module.exports = PcontrolBrickPresentation;



/***/ },
/* 92 */
/***/ function(module, exports, __webpack_require__) {

	var PnodePresentation	= __webpack_require__( 57 )
	  , DragDrop			= __webpack_require__( 54 )
	  ;

	var PfilterPresentation = function() {
		// console.log(this);
		PnodePresentation.apply(this, []);
		return this;
	}

	PfilterPresentation.prototype = Object.create( PnodePresentation.prototype ); // new PnodePresentation();
	PfilterPresentation.prototype.constructor	= PfilterPresentation;
	PfilterPresentation.prototype.className		= 'PfilterNode';

	PfilterPresentation.prototype.init = function(PnodeID, parent, children) {
		PnodePresentation.prototype.init.apply(this, [PnodeID, parent, children]);
		this.PnodeID = PnodeID;
		this.filter		= { programs	: null
						  , objects		: null
						  , HideExpose	: 'hide'
						  };
		this.html		= { programs	: null
						  , objects		: null
						  };
		return this;
	}
	PfilterPresentation.prototype.serialize	= function() {
		var json = PnodePresentation.prototype.serialize.apply(this, []);
		// Describe action here
		json.subType	= 'PfilterPresentation';
		json.filter		= {HideExpose : this.filter.HideExpose};
		if(this.filter.programs) {json.filter.programs = this.filter.programs.serialize();}
		if(this.filter.objects ) {json.filter.objects  = this.filter.objects.serialize ();}
		return json;
	}


	PfilterPresentation.prototype.unserialize	= function(json, PresoUtils) {
		// Describe action here
		PnodePresentation.prototype.unserialize.apply(this, [json, PresoUtils]);
		if(json.filter.programs) {this.filter.programs = PresoUtils.unserialize(json.filter.programs);}
		if(json.filter.objects ) {this.filter.objects  = PresoUtils.unserialize(json.filter.objects );}
		this.filter.HideExpose = json.filter.HideExpose;
		this.updateHTML_programs_and_objects();
		return this;
	}

	PfilterPresentation.prototype.updateHTML_programs_and_objects = function() {
		if(this.html.programs && this.filter.programs) {
			 this.html.programs.innerHTML = "";
			 this.html.programs.appendChild( this.filter.programs.Render() );
			 DragDrop.deleteDropZone( this.dropZoneProgramsId );
			}
		if(this.html.objects && this.filter.objects) {
			 this.html.objects.innerHTML = "";
			 this.html.objects.appendChild ( this.filter.objects.Render () );
			 DragDrop.deleteDropZone( this.dropZoneObjectsId );
			}
		if(this.html.select_HiddenExpose) {
			 this.html.select_HiddenExpose.querySelector( 'option.'+this.filter.HideExpose ).setAttribute('selected', 'selected');
			}
	}

	PfilterPresentation.prototype.Render	= function() {
		var self = this;
		var root = PnodePresentation.prototype.Render.apply(this, []);
		root.classList.add('PfilterNode');
		if(this.html.programs === null) {
			 this.html.select_HiddenExpose = document.createElement('select');
				this.html.select_HiddenExpose.classList.add( 'HideExpose' );
				this.html.select_HiddenExpose.innerHTML = '<option class="hide" value="hide">Hide elements</option><option class="expose" value="expose">Expose elements</option>';
				this.html.select_HiddenExpose.onchange = function() {
															 self.filter.HideExpose = self.html.select_HiddenExpose.value;
															}
				this.divDescription.appendChild( this.html.select_HiddenExpose );

			// Drop zone for objects to be hidden/exposed
			 this.html.objects = document.createElement('span');
				this.html.objects.classList.add('objects');
				this.html.objects.innerHTML = "Insert a \"Objects Selector\" here";
				this.divDescription.appendChild( this.html.objects );
				this.dropZoneObjectsId = DragDrop.newDropZone( this.html.objects
										, { acceptedClasse	: ['SelectorNode']
										  , CSSwhenAccepted	: 'possible2drop'
										  , CSSwhenOver		: 'ready2drop'
										  , ondrop			: function(evt, draggedNode, infoObj) {
												 var Pnode = new infoObj.constructor().init	( undefined	// PnodeID
																							, undefined	// parent
																							, undefined	// children
																							, infoObj
																							);
												 self.filter.objects = Pnode; //new infoObj.constructor(infoObj).init( '' );
												 self.updateHTML_programs_and_objects();
												}
										  }
										);

			// label 
			 this.html.label = document.createElement('span');
				this.html.label.classList.add( 'labelHide' );
				this.html.label.innerHTML = " for programs ";
				this.divDescription.appendChild( this.html.label );

			// Drop zone for programs for which objects will be hidden/exposed
			 this.html.programs = document.createElement('span');
				this.html.programs.classList.add('programs');
				this.html.programs.innerHTML = "Insert a \"Program Selector\" here";
				this.divDescription.appendChild( this.html.programs );
				this.dropZoneProgramsId = DragDrop.newDropZone( this.html.programs
										, { acceptedClasse	: ['SelectorNode', 'Program']
										  , CSSwhenAccepted	: 'possible2drop'
										  , CSSwhenOver		: 'ready2drop'
										  , ondrop			: function(evt, draggedNode, infoObj) {
												 var Pnode = new infoObj.constructor().init	( undefined	// PnodeID
																							, undefined	// parent
																							, undefined	// children
																							, infoObj
																							);
												 self.filter.programs = Pnode; //new infoObj.constructor(infoObj).init( '' );
												 self.updateHTML_programs_and_objects();
												}
										  }
										);
			} 
		this.updateHTML_programs_and_objects();
		return root;
	}

	// Return the constructor
	module.exports = PfilterPresentation;



/***/ },
/* 93 */
/***/ function(module, exports, __webpack_require__) {

	var PnodePresentation	= __webpack_require__( 57 )
	  , DragDrop			= __webpack_require__( 54 )
	  , utils				= __webpack_require__( 1 )
	  , htmlTemplate		= __webpack_require__( 94 )
	  ;


	// linking CSS
	__webpack_require__( 95 );
	// var css = document.createElement('link');
		// css.setAttribute('rel' , 'stylesheet');
		// css.setAttribute('href', 'js/Presentations/HTML_templates/PForbidPresentation.css');
		// document.body.appendChild(css);
		
	// var htmlTemplate = null;
	// utils.XHR( 'GET', 'js/Presentations/HTML_templates/PForbidPresentation.html'
			 // , function() {htmlTemplate = this.responseText;}
			 // );

			
	var PForbidPresentation = function() {
		// console.log(this);
		PnodePresentation.prototype.constructor.apply(this, []);
		return this;
	}

	PForbidPresentation.prototype = Object.create( PnodePresentation.prototype ); // new PnodePresentation();
	PForbidPresentation.prototype.constructor	= PForbidPresentation;
	PForbidPresentation.prototype.className		= 'PForbidNode';

	PForbidPresentation.prototype.init = function(PnodeID, parent, children) {
		PnodePresentation.prototype.init.apply(this, [PnodeID, parent, children]);
		this.forbid		= { programs	: null
						  , objects		: null
						  , mtdName		: ''
						  , parameters	: []
						  , forbidden	: true
						  };
		this.html		= { programs	: null
						  , objects		: null
						  };
		return this;
	}

	PForbidPresentation.prototype.serialize		= function() {
		var json = PnodePresentation.prototype.serialize.apply(this, []);
		// Describe action here
		json.subType	= 'PForbidPresentation';
		json.forbid = { forbidden	: this.forbid.forbidden
					  , action		: this.forbid.action
					  , parameters	: this.forbid.parameters
					  }
		if(this.forbid.programs) {json.forbid.programs = this.forbid.programs.serialize();}
		if(this.forbid.objects ) {json.forbid.objects  = this.forbid.objects.serialize ();}
		return json;
	}


	PForbidPresentation.prototype.unserialize	= function(json, PresoUtils) {
		// Describe action here
		PnodePresentation.prototype.unserialize.apply(this, [json, PresoUtils]);
		if(json.forbid.programs) {this.forbid.programs = PresoUtils.unserialize(json.forbid.programs);}
		if(json.forbid.objects ) {this.forbid.objects  = PresoUtils.unserialize(json.forbid.objects );}
		this.forbid.forbidden	= json.forbid.forbidden;
		this.forbid.action		= json.forbid.action;
		this.forbid.parameters	= json.forbid.parameters;
		this.updateHTML_programs_and_objects();
		return this;
	}
	//
	// XXX à changer ici pour prendre en compte les bons attributs
	PForbidPresentation.prototype.updateHTML_programs_and_objects = function() {
		var self = this;
		if(this.html.programs && this.forbid.programs) {
			 this.html.programs.innerHTML = "";
			 this.html.programs.appendChild( this.forbid.programs.Render() );
			 DragDrop.deleteDropZone( this.dropZoneProgramsId );
			}
		if(this.html.objects && this.forbid.objects) {
			 this.html.objects.innerHTML = "";
			 this.html.objects.appendChild ( this.forbid.objects.Render () );
			 DragDrop.deleteDropZone( this.dropZoneObjectsId );
			}
		if(this.html.selectForbidden) {
			 this.html.selectForbidden.querySelector( 'option[value='+this.forbid.forbidden+']' ).setAttribute('selected', 'selected');
			}
		if(this.html.selectActions && this.forbid.objects) {
			 // call for possible actions and update the select.
			 if(this.PnodeID) {
				 utils.call	( this.PnodeID, 'getESA', []
							, function(esa) {
								 var i, option;
								 // console.log("esa", esa);
								 self.html.selectActions.innerHTML = '';
								 for(i in esa.actions) {
									 option = document.createElement('option');
										option.value = i;
										option.appendChild( document.createTextNode(i) );
									 self.html.selectActions.appendChild( option );
									}
								 if(self.forbid.action) {
									 self.html.selectActions.value = self.forbid.action;
									} else {self.forbid.action = option.value;}
								}
							)
				}
			}
	}

	PForbidPresentation.prototype.Render	= function() {
		var self = this;
		var root = PnodePresentation.prototype.Render.apply(this, []);
		root.classList.add('PForbidPresentation');
		if(this.html.programs === null) {
			 this.divDescription.innerHTML = htmlTemplate;
			
			// Select actions to be forbidden/allowed
			 this.html.selectActions	= this.divDescription.querySelector('select.actions');
			 this.html.selectActions.onchange = function() {self.forbid.action = self.html.selectActions.value;}
			 
			// Select forbidden/allowed
			 this.html.selectForbidden	= this.divDescription.querySelector('select.forbidden');
				this.html.selectForbidden.onchange = function() {
														 self.forbid.forbidden = (self.html.selectForbidden.value === 'true');
														}

			// Drop zone for objects to be forbidden/allowed
			 this.html.objects			= this.divDescription.querySelector('.targets');
			 this.dropZoneObjectsId = DragDrop.newDropZone( this.html.objects
										, { acceptedClasse	: ['SelectorNode']
										  , CSSwhenAccepted	: 'possible2drop'
										  , CSSwhenOver		: 'ready2drop'
										  , ondrop			: function(evt, draggedNode, infoObj) {
												 var Pnode = new infoObj.constructor().init	( undefined	// PnodeID
																							, undefined	// parent
																							, undefined	// children
																							, infoObj
																							);
												 self.forbid.objects = Pnode; // new infoObj.constructor(infoObj).init( '' );
												 self.updateHTML_programs_and_objects();
												}
										  }
										);

			// Drop zone for programs for which objects will be hidden/exposed
			 this.html.programs			= this.divDescription.querySelector('.programs');
				this.dropZoneProgramsId = DragDrop.newDropZone( this.html.programs
										, { acceptedClasse	: ['SelectorNode', 'Program']
										  , CSSwhenAccepted	: 'possible2drop'
										  , CSSwhenOver		: 'ready2drop'
										  , ondrop			: function(evt, draggedNode, infoObj) {
												 var Pnode = new infoObj.constructor().init	( undefined	// PnodeID
																							, undefined	// parent
																							, undefined	// children
																							, infoObj
																							);
												 self.forbid.programs = Pnode; //new infoObj.constructor(infoObj).init( '' );
												 self.updateHTML_programs_and_objects();
												}
										  }
										);
			} 
		this.updateHTML_programs_and_objects();
		return root;
	}

	// Return the constructor
	module.exports = PForbidPresentation;



/***/ },
/* 94 */
/***/ function(module, exports) {

	module.exports = "<div class=\"content\">\r\n\t<span class=\"label labelPrograms\">For programs</span>\r\n\t<span class=\"programs\">[DROP PROGRAMS HERE]</span>\r\n\t<span class=\"label\">, </span>\r\n\t<select class=\"forbidden\" value=\"true\">\r\n\t\t<option value=\"true\">Forbid</option>\r\n\t\t<option value=\"false\">Allow</option>\r\n\t</select>\r\n\t<span class=\"targets\">[DROP TARGETS HERE]</span>\r\n\t<span class=\"label\">to call</span>\r\n\t<select class=\"actions\" />\r\n</div>"

/***/ },
/* 95 */
/***/ function(module, exports) {

	// removed by extract-text-webpack-plugin

/***/ },
/* 96 */,
/* 97 */
/***/ function(module, exports, __webpack_require__) {

	var EventNodePresentation	= __webpack_require__( 75 )
	  , DragDrop				= __webpack_require__( 54 )
	  , utils					= __webpack_require__( 1 )
	  ;
					  // , htmlTemplate, htmlTemplateFilter

	// Load ressources

	// XXX Try direct loading
	var htmlTemplate = null, htmlTemplateFilter = null;
	utils.XHR( 'GET', 'js/Presentations/HTML_templates/PeventBrickPresentation.html'
			 , function() {htmlTemplate = this.responseText;}
			 );
	utils.XHR( 'GET', 'js/Presentations/HTML_templates/PeventBrickPresentationFilter.html'
			 , function() {htmlTemplateFilter = this.responseText;}
			 );

	var css = document.createElement('link');
		css.setAttribute('rel' , 'stylesheet');
		css.setAttribute('href', 'js/Presentations/HTML_templates/PeventBrickPresentation.css');
		document.head.appendChild( css );

	var PeventBrickPresentation = function() {
		EventNodePresentation.apply(this, []);
		return this;
	}

	PeventBrickPresentation.prototype = Object.create( EventNodePresentation.prototype ); // new EventNodePresentation();
	PeventBrickPresentation.prototype.constructor	= PeventBrickPresentation;
	PeventBrickPresentation.prototype.className		= 'PeventBrick';

	PeventBrickPresentation.prototype.init		= function(PnodeID, parent, children) {
		EventNodePresentation.prototype.init.apply(this, [PnodeID, parent, children]);
		this.event = {filters:[]};
		return this;
	}

	PeventBrickPresentation.prototype.serialize = function() {
		var json = EventNodePresentation.prototype.serialize.apply(this, []);
		json.subType = 'PeventBrickPresentation';
		json.eventNode  = 	{ parameters: this.event.parameters
							, eventName	: this.event.eventName
							, filters	: []
							};
		if(this.html.filter) {
			 var L_filters = this.html.filter.querySelectorAll( 'div.FILTER' )
			   , filter;
			 for(var i=0; i<L_filters.length; i++) {
				 filter = L_filters.item(i);
				 json.event.filters.push( { attribute	: filter.querySelector('input.attribute').value
										  , operator	: filter.querySelector('select.operator').value
										  , value		: filter.querySelector('input.value'    ).value
										  } 
										);
				}
			}
		 return json;
		}

	PeventBrickPresentation.prototype.unserialize	= function(json, PresoUtils) {
		// Describe action here
		EventNodePresentation.prototype.unserialize.apply(this, [json, PresoUtils]);
		this.event.objectId		= json.eventNode.objectId;
		this.event.eventName	= json.eventNode.eventName;
		return this;
	}

	PeventBrickPresentation.prototype.appendFilter	= function(attribute, operator, value) {
		var filter = document.createElement( 'div' );
			filter.classList.add( 'FILTER' );
			filter.innerHTML = htmlTemplateFilter;
			var del = filter.querySelector( 'input.delete' );
			del.onclick = function() {filter.parentNode.removeChild(filter); del.onclick = null;}
			if(attribute) {filter.querySelector('.attribute').value = attribute;}
			if(operator ) {filter.querySelector('.operator' ).value = operator ;}
			if(value    ) {filter.querySelector('.value'    ).value = value    ;}
		this.html.filter.appendChild( filter );
	}

	PeventBrickPresentation.prototype.primitivePlug	= function(c) {
		 // console.log("Primitive plug ", this.root, " ->", c.root);
		 this.Render();
		 var P		= this.html.targets
		   , N		= c.Render()
		   , self	= this
		   , i, e, eventName, option;
		 if(N.parentElement === null) {
			 P.innerHTML = '';
			 P.appendChild( N );
			 if(this.children[0].PnodeID) {
				 console.log("Call ESA for", this.children[0].PnodeID);
				 utils.call( c.PnodeID, 'getESA', []
						   , function(esa) {
								 console.log(esa);
								 console.log("---ESA:", esa);
								 if(esa.error) {return;}
								 var events = {};
								 for(i in esa) {
									 for(e=0; e<esa[i].events.length; e++) {
										 eventName = esa[i].events[e];
										 if(typeof events[eventName] === 'undefined') {
											 events[eventName] = true;
											 option = document.createElement('option');
											 option.setAttribute('value', eventName);
											 option.appendChild( document.createTextNode(eventName) );
											 self.html.eventName.appendChild( option );
											 if(!self.event.eventName) {self.event.eventName = eventName;}
											}
										}
									}
								}
						   );
				}
			}
		 return this;
		}

	PeventBrickPresentation.prototype.Render	= function() {
		var self = this;
		var root = EventNodePresentation.prototype.Render.apply(this, []);
		root.classList.add('PeventBrickPresentation');
		if(typeof this.html.targets === 'undefined') {
			// Describe the event to be observed
			this.divDescription.innerHTML = htmlTemplate;
			// Targets
			this.html.targets	= this.divDescription.querySelector(".EventNode.content > .targets");
				this.dropZoneTargets = DragDrop.newDropZone( this.html.targets
									, { acceptedClasse	: 'SelectorNode'
									  , CSSwhenAccepted	: 'possible2drop'
									  , CSSwhenOver		: 'ready2drop'
									  , ondrop			: function(evt, draggedNode, infoObj) {
											 var Pnode = new infoObj.constructor().init	( undefined	// PnodeID
																						, undefined	// parent
																						, undefined	// children
																						, infoObj
																						);
											 self.appendChild( Pnode );
											}
									  }
									);
			// Event name
			this.html.eventName	= this.divDescription.querySelector(".EventNode.content > .eventName");
				this.html.eventName.onchange = function() {self.event.eventName = self.html.eventName.value;};
				if(this.event.eventName) {this.html.eventName.setAttribute('value', this.event.eventName);}
			// Filter
			this.html.filter		= this.divDescription.querySelector(".EventNode.content > .filter");
			this.html.addFilter	= this.divDescription.querySelector(".filter > input.addFilter");
				this.html.addFilter.onclick	= function() {self.appendFilter();}
			 // Add filters
			 var i, filter;
			 for(i=0; i<this.event.filters.length; i++) {
				 filter = this.event.filters[i];
				 this.appendFilter( filter.attribute, filter.operator, filter.value );
				}
			 // Add children?
			 for(i=0; i<this.children.length; i++) {
				 this.primitivePlug(this.children[i]);
				}
			}
		
		return root;
	}

	// Return the constructor
	module.exports = PeventBrickPresentation;



/***/ },
/* 98 */
/***/ function(module, exports, __webpack_require__) {

	var EventNodePresentation	= __webpack_require__( 75 )
	  , DragDrop				= __webpack_require__( 54 )
	  // , utils					= require( '../utils.js' )
	  , strTemplate				= __webpack_require__( 99 )
	  , htmlTemplate			= document.createElement("div")
	  ;
	  
	htmlTemplate.innerHTML = strTemplate;

	var css = document.createElement('link');
		css.setAttribute('rel' , 'stylesheet');
		css.setAttribute('href', 'js/Presentations/HTML_templates/PeventBrickAppear.css');
		document.head.appendChild(css);
		
	var PeventBrickAppear = function() {
		EventNodePresentation.prototype.constructor.apply(this, []);
		return this;
	}

	PeventBrickAppear.prototype = Object.create( EventNodePresentation.prototype ); // new EventNodePresentation();
	PeventBrickAppear.prototype.constructor	= PeventBrickAppear;
	PeventBrickAppear.prototype.className	= 'PeventBrickAppear';

	PeventBrickAppear.prototype.init		= function(PnodeID, parent, children) {
		EventNodePresentation.prototype.init.apply(this, [PnodeID, parent, children]);
		return this;
	}

	PeventBrickAppear.prototype.serialize	= function() {
		 var json = EventNodePresentation.prototype.serialize.apply(this, []);
		 json.subType = 'PeventBrickAppear';
		 json.eventNode  = 	{ targets	: ['ProtoBrick']
							, parameters: this.event.parameters
							, eventName	: this.event.eventName
							};
		 return json;
		}

	PeventBrickAppear.prototype.unserialize	= function(json, PresoUtils) {
		var self = this;
		
		// Describe action here
		EventNodePresentation.prototype.unserialize.apply(this, [json, PresoUtils]);
		this.event.parameters	= json.eventNode.parameters;
		this.event.eventName	= json.eventNode.eventName;
			
		if(typeof this.html.select !== 'undefined') {
			 this.html.select.value = self.event.eventName;
			}
		return this;
	}

	/*
	PeventBrickAppear.prototype.primitivePlug	= function(c) {
		 // console.log("Primitive plug ", this.root, " ->", c.root);
		 this.Render();
		 var P		= this.html.targets
		   , N		= c.Render();
		 if(N.parentElement === null) {
			 P.innerHTML = '';
			 P.appendChild( N );
			}
		 return this;
		}
	*/

	PeventBrickAppear.prototype.Render	= function() {
		var self = this;
		var root = EventNodePresentation.prototype.Render.apply(this, []);
		root.classList.add('PeventBrickAppear');
		if(typeof this.html.select === 'undefined') {
			 this.copyHTML(htmlTemplate, this.html.eventName);
			 // Select operation
			 this.html.select = this.html.eventName.querySelector( 'select.operation' );
				this.html.select.onchange = function() {self.event.eventName = this.value;}
				this.event.eventName = this.event.eventName || this.html.select.querySelector( 'option' ).value;
			// Configure drop zone
			DragDrop.updateConfig	( this.dropZoneSelectorId
									, { acceptedClasse: [['SelectorNode']]
									  }
									);
			}
		this.html.select.value = this.event.eventName;
		return root;
	}

	// Return the constructor
	module.exports = PeventBrickAppear;


/***/ },
/* 99 */
/***/ function(module, exports) {

	module.exports = "<label>a brick is \r\n<select class=\"operation\">\r\n\t<option value=\"appear\"   >Appearing</option>\r\n\t<option value=\"disappear\">Disappearing</option>\r\n</select>\r\namong\r\n</label>"

/***/ },
/* 100 */
/***/ function(module, exports, __webpack_require__) {

	var /*PnodePresentation			= require( './PnodePresentation.js' )
	  , */SelectorNodePresentation	= __webpack_require__( 101 )
	  ;

	function basicBrickPresentation() {
		SelectorNodePresentation.apply(this, []);
	}

	basicBrickPresentation.prototype = Object.create( SelectorNodePresentation.prototype ); // new SelectorNodePresentation();
	basicBrickPresentation.prototype.className = basicBrickPresentation;
	basicBrickPresentation.prototype.className = 'Pselector_ObjInstance';

	basicBrickPresentation.prototype.init	= function(PnodeID, parent, children, infoObj) {
		SelectorNodePresentation.prototype.init.apply(this, [PnodeID, parent, children, infoObj]);
		if(infoObj) {this.selector.objectId = infoObj.config.uuid;}
		return this;
	}

	basicBrickPresentation.prototype.Render = function() {
		// var self = this;
		var root = SelectorNodePresentation.prototype.Render.apply(this, []);
		// Call server for the latest description of Media Player this.selector.objectId
		root.innerHTML = "";
		root.appendChild( document.createTextNode(this.selector.name) );
		return root;
	}

	basicBrickPresentation.prototype.serialize	= function() {
		var json = SelectorNodePresentation.prototype.serialize.apply(this, []);
		// Describe action here
		json.subType	= 'basicBrickPresentation';
		json.selector.objectId	= this.selector.objectId;
		return json;
	}

	basicBrickPresentation.prototype.unserialize	= function(json, PresoUtils) {
		// Describe action here
		SelectorNodePresentation.prototype.unserialize.apply(this, [json, PresoUtils]);
		this.selector.objectId = json.selector.objectId;
		return this;
	}

	module.exports = basicBrickPresentation;


/***/ },
/* 101 */
/***/ function(module, exports, __webpack_require__) {

	var PnodePresentation = __webpack_require__( 57 );

	function SelectorNodePresentation() {
		PnodePresentation.apply(this, []);
		return this;
	}

	SelectorNodePresentation.prototype = Object.create( PnodePresentation.prototype );
	SelectorNodePresentation.prototype.constructor	= SelectorNodePresentation;
	SelectorNodePresentation.prototype.className	= 'SelectorNode';

	SelectorNodePresentation.prototype.init		= function(PnodeID, parent, children, infoObj) {
		PnodePresentation.prototype.init.apply(this, [PnodeID, parent, children, infoObj]);
		this.selector = { name: 'There should be a name here'
						, type: ['selector']
						};
		if(infoObj) {
			 this.init();
			 this.selector.name = infoObj.config.name;
			}
		return this;
	}

	SelectorNodePresentation.prototype.Render	= function() {
		var root = PnodePresentation.prototype.Render.apply(this, []);
		this.divDescription.innerHTML = '';
		this.divDescription.appendChild( document.createTextNode(this.selector.name) );
		return root;
	}

	SelectorNodePresentation.prototype.serialize	= function() {
		var json = PnodePresentation.prototype.serialize.apply(this, []);
		// Describe action here
		json.subType	= 'SelectorNodePresentation';
		json.selector = { name	: this.selector.name
						, type	: this.selector.type
						};
		return json;
	}

	SelectorNodePresentation.prototype.unserialize	= function(json, PresoUtils) {
		// Describe action here
		PnodePresentation.prototype.unserialize.apply(this, [json, PresoUtils]);
		this.selector.name	= json.selector.name;
		this.selector.type	= json.selector.type;
		return this;
	}

	module.exports = SelectorNodePresentation;


/***/ },
/* 102 */
/***/ function(module, exports, __webpack_require__) {

	var PnodePresentation	= __webpack_require__( 57 )
	  , str_template	= __webpack_require__( 103 )
	  , html_template	= document.createElement( "div" )
	  ;
	  
	html_template.innerHTML = str_template;
			
	var css = document.createElement('link');
		css.setAttribute('rel' , 'stylesheet');
		css.setAttribute('href', 'js/Presentations/HTML_templates/Pselector_ObjTypePresentation.css');
		document.head.appendChild( css );

	var Pselector_ObjTypePresentation = function() {
		// console.log(this);
		PnodePresentation.prototype.constructor.apply(this, []);
		return this;
	}

	Pselector_ObjTypePresentation.prototype = Object.create( PnodePresentation.prototype ); // new PnodePresentation();
	Pselector_ObjTypePresentation.prototype.constructor	= Pselector_ObjTypePresentation;
	Pselector_ObjTypePresentation.prototype.className	= 'Pselector_ObjType';

	Pselector_ObjTypePresentation.prototype.init = function(PnodeID, parent, children, infoObj) {
		PnodePresentation.prototype.init.apply(this, [PnodeID, parent, children, infoObj]);
		this.selector	= { objectsType	: null
						  };
		if(infoObj) {
			 this.selector.objectsType	= infoObj.config.objectsType;
			}
		return this;
	}

	Pselector_ObjTypePresentation.prototype.serialize	= function() {
		var json = PnodePresentation.prototype.serialize.apply(this, []);
		// Describe action here
		json.subType	= 'Pselector_ObjTypePresentation';
		json.selector = { objectsType	: this.selector.objectsType
						};
		return json;
	}

	Pselector_ObjTypePresentation.prototype.unserialize	= function(json, PresoUtils) {
		// Describe action here
		PnodePresentation.prototype.unserialize.apply(this, [json, PresoUtils]);
		this.selector.objectsType	= json.selector.objectsType;
		if(this.html.select) {
			 this.html.select.value = this.selector.objectsType;
			}
		return this;
	}

	Pselector_ObjTypePresentation.prototype.Render	= function() {
		var self = this
		  , root = PnodePresentation.prototype.Render.apply(this, []);
		root.classList.add('Pselector_ObjTypePresentation');
		if(typeof this.html.select === 'undefined') {
			 this.copyHTML(html_template, root);
			 this.html.select = root.querySelector('select.brickType');
			 this.html.select.onchange = function(e) {self.selector.objectsType = self.html.select.value;}
			 this.selector.objectsType = this.selector.objectsType || this.html.select.querySelector("option");
			}
		this.html.select.value = this.selector.objectsType;
		return root;
	}

	// Return the constructor
	module.exports = Pselector_ObjTypePresentation;



/***/ },
/* 103 */
/***/ function(module, exports) {

	module.exports = "<label class=\"\">all the \r\n\t<select class=\"brickType\">\r\n\t\t<option value=\"BrickUPnP_HueLamp\"\t\t>Hue lamps\t\t</option>\r\n\t\t<option value=\"BrickUPnP_MediaRenderer\"\t>Media Renderer\t</option>\r\n\t\t<option value=\"BrickUPnP_MediaServer\"\t>Media Servers\t</option>\r\n\t</select>\r\n</label>"

/***/ },
/* 104 */
/***/ function(module, exports, __webpack_require__) {

	var openHab_Action	= __webpack_require__( 105 )
	  // , utils		= require( '../../../utils.js' )
	  , DragDrop		= __webpack_require__( 54 )
	  , openHabTypes	= __webpack_require__( 106 )
	  , str_template	= __webpack_require__( 107 )
	  , html_template	= document.createElement( "div" )
	  ;
	  
	html_template.innerHTML = str_template;

	// 
	var openHab_Action_OnOff = function() {
		 openHab_Action.apply(this, []);
		 this.mustDoRender = true;
		 return this;
		}

	openHab_Action_OnOff.prototype = Object.create( openHab_Action.prototype );
	openHab_Action_OnOff.prototype.constructor = openHab_Action_OnOff;

	openHab_Action_OnOff.prototype.init		= function(PnodeID, parent, children) {
		 openHab_Action.prototype.init.apply(this, [PnodeID, parent, children]);
		 return this;
		}

	openHab_Action_OnOff.prototype.serialize = function() {
		 var json = openHab_Action.prototype.serialize.apply(this, []);
		 json.subType = 'openHab_Action_OnOff';
		 return json;
		}

	openHab_Action_OnOff.prototype.forceRender		= function() {
		this.mustDoRender = true;
		return openHab_Action.prototype.forceRender.apply(this, []);
	}

	openHab_Action_OnOff.prototype.Render = function() {
		 var self = this;
		 var root = openHab_Action.prototype.Render.apply(this,[]);
		 if(this.mustDoRender) {
			 this.mustDoRender = false;
			 root.classList.add( "openHab_Action_OnOff" );
			 this.copyHTML(html_template, this.html.actionName);
			 this.html.OnOff			= root.querySelector("select.OnOff");
			 this.html.OnOff.value		= this.action.method = this.action.method || 'Do_On';
			 this.html.OnOff.onchange	= function() {self.action.method = this.value;}
			 DragDrop.updateConfig	( this.dropZoneSelectorId
									, { acceptedClasse: [[openHabTypes.OnOff]]
									  }
									);
			}
		 return root;
		}

	module.exports = openHab_Action_OnOff;


/***/ },
/* 105 */
/***/ function(module, exports, __webpack_require__) {

	var ActionNodePresentation	= __webpack_require__( 70 )
	  // , utils					= require( '../../../utils.js' )
	  // , DragDrop				= require( '../../../DragDrop.js' )
	  ;
	  
	// 
	var openHab_Action = function() {
		 ActionNodePresentation.apply(this, []);
		 return this;
		}

	openHab_Action.prototype = Object.create( ActionNodePresentation.prototype ); // new ActionNodePresentation();
	openHab_Action.prototype.constructor = openHab_Action;

	openHab_Action.prototype.init		= function(PnodeID, parent, children) {
		 ActionNodePresentation.prototype.init.apply(this, [PnodeID, parent, children]);
		 return this;
		}

	openHab_Action.prototype.serialize = function() {
		 var json = ActionNodePresentation.prototype.serialize.apply(this, []);
		 json.subType = 'openHab_Action';
		 return json;
		}
		
	openHab_Action.prototype.Render = function() {
		 // var self = this;
		 var root = ActionNodePresentation.prototype.Render.apply(this, []);
		 root.classList.add( "openHab_Action" );
		 this.html.img_symbol.setAttribute("src", "js/Presentations/openHab/templates/openhab-logo-square.png");
		 return root;
		}

	module.exports = openHab_Action;




/***/ },
/* 106 */
/***/ function(module, exports) {

	module.exports =	{ OnOff				: "openHab_op_OnOff"
						, IncreaseDecrease	: "openHab_op_IncreaseDecrease"
						, Percent			: "openHab_op_Percent"
						, OpenClosed		: "openHab_op_OpenClosed"
						, Decimal			: "openHab_op_Decimal"
						, UpDown			: "openHab_op_UpDown"
						, StopMove			: "openHab_op_StopMove"
						, String			: "openHab_op_String"
						, HSB				: "openHab_op_HSB"
						};

/***/ },
/* 107 */
/***/ function(module, exports) {

	module.exports = "<label class=\"turn\">Turn </label>\r\n<select class=\"OnOff\">\r\n\t<option value=\"Do_On\" >On </option>\r\n\t<option value=\"Do_Off\">Off</option>\r\n</select>"

/***/ },
/* 108 */
/***/ function(module, exports, __webpack_require__) {

	var openHab_Event	= __webpack_require__( 109 )
	  // , utils		= require( '../../../utils.js' )
	  , DragDrop		= __webpack_require__( 54 )
	  , openHabTypes	= __webpack_require__( 106 )
	  , str_template	= __webpack_require__( 110 )
	  , html_template	= document.createElement( "div" )
	  ;
	  
	html_template.innerHTML = str_template;
	  
	// 
	var openHab_Event_OnOff = function() {
		 openHab_Event.apply(this, []);
		 this.eventFilter.val = "ON"
		 return this;
		}

	openHab_Event_OnOff.prototype = Object.create( openHab_Event.prototype );
	openHab_Event_OnOff.prototype.constructor = openHab_Event_OnOff;

	openHab_Event_OnOff.prototype.init		= function(PnodeID, parent, children) {
		 openHab_Event.prototype.init.apply(this, [PnodeID, parent, children]);
		 return this;
		}

	openHab_Event_OnOff.prototype.serialize = function() {
		 var json = openHab_Event.prototype.serialize.apply(this, []);
		 json.subType = 'openHab_Event_OnOff';
		 return json;
		}

	openHab_Event_OnOff.prototype.Render = function() {
		 var self = this;
		 var root = openHab_Event.prototype.Render.apply(this, []);
		 root.classList.add( "openHab_Event_OnOff" );
		 // template
		 this.copyHTML(html_template, this.html.eventName);
		 this.html.OnOff			= root.querySelector("select.OnOff");
		 this.html.OnOff.value		= this.eventFilter.val = this.eventFilter.val || 'ON';
		 this.html.OnOff.onchange	= function() {self.eventFilter.val = this.value;}
		 // DragDrop
		 DragDrop.updateConfig	( this.dropZoneSelectorId
								, { acceptedClasse: [[openHabTypes.OnOff]]
								  }
								);
		 return root;
		}

	module.exports = openHab_Event_OnOff;




/***/ },
/* 109 */
/***/ function(module, exports, __webpack_require__) {

	var EventNodePresentation	= __webpack_require__( 75 )
	  // , utils					= require( '../../../utils.js' )
	  // , DragDrop				= require( '../../../DragDrop.js' )
	  ;
	  
	// 
	var openHab_Event = function() {
		 EventNodePresentation.apply(this, []);
		 this.eventFilter = { att	: "value"
							, op	: "equal"
							, val	: ""
							}
		 this.eventNode =	{ eventName	: 'state'
							, filters	: [this.eventFilter]
							};
		 return this;
		}

	openHab_Event.prototype = Object.create( EventNodePresentation.prototype );
	openHab_Event.prototype.constructor			= openHab_Event;
	EventNodePresentation.prototype.className	= 'PeventBrick';

	openHab_Event.prototype.init		= function(PnodeID, parent, children) {
		 EventNodePresentation.prototype.init.apply(this, [PnodeID, parent, children]);
		 return this;
		}

	openHab_Event.prototype.serialize = function() {
		 var json = EventNodePresentation.prototype.serialize.apply(this, []);
		 json.subType = 'openHab_Event';
		 json.eventNode = this.eventNode;
		 return json;
		}

	openHab_Event.prototype.unserialize = function(json, PresoUtils) {
		 EventNodePresentation.prototype.unserialize.apply(this, [json, PresoUtils]);
		 this.eventNode		= json.eventNode;
		 this.eventFilter	= json.eventNode.filters[0];
		 return json;
		}
		
	openHab_Event.prototype.Render = function() {
		 // var self = this;
		 var root = EventNodePresentation.prototype.Render.apply(this, []);
		 root.classList.add( "openHab_Event" );
		 this.html.img_symbol.setAttribute("src", "js/Presentations/openHab/templates/Event_openhab-logo-square.png");
		 return root;
		}

	module.exports = openHab_Event;




/***/ },
/* 110 */
/***/ function(module, exports) {

	module.exports = "<label class=\"turn\">On turning </label>\r\n<select class=\"OnOff\">\r\n\t<option value=\"ON\" >On </option>\r\n\t<option value=\"OFF\">Off</option>\r\n</select>"

/***/ },
/* 111 */
/***/ function(module, exports, __webpack_require__) {

	var openHab_Action	= __webpack_require__( 105 )
	  // , utils		= require( '../../../utils.js' )
	  , DragDrop		= __webpack_require__( 54 )
	  , openHabTypes	= __webpack_require__( 106 )
	  , str_template	= __webpack_require__( 112 )
	  , html_template	= document.createElement( "div" )
	  ;
	  
	html_template.innerHTML = str_template;

	// 
	var openHab_Action_Contact = function() {
		 openHab_Action.apply(this, []);
		 this.mustDoRender = true;
		 return this;
		}

	openHab_Action_Contact.prototype = Object.create( openHab_Action.prototype );
	openHab_Action_Contact.prototype.constructor = openHab_Action_Contact;

	openHab_Action_Contact.prototype.init		= function(PnodeID, parent, children) {
		 openHab_Action.prototype.init.apply(this, [PnodeID, parent, children]);
		 return this;
		}

	openHab_Action_Contact.prototype.serialize = function() {
		 var json = openHab_Action.prototype.serialize.apply(this, []);
		 json.subType = 'openHab_Action_Contact';
		 return json;
		}

	openHab_Action_Contact.prototype.forceRender		= function() {
		this.mustDoRender = true;
		return openHab_Action.prototype.forceRender.apply(this, []);
	}

	openHab_Action_Contact.prototype.Render = function() {
		 var self = this;
		 var root = openHab_Action.prototype.Render.apply(this,[]);
		 if(this.mustDoRender) {
			 this.mustDoRender = false;
			 root.classList.add( "openHab_Action_Contact" );
			 this.copyHTML(html_template, this.html.actionName);
			 this.html.OpenClose			= root.querySelector("select.contact");
			 this.html.OpenClose.value		= this.action.method = this.action.method || 'Do_Open';
			 this.html.OpenClose.onchange	= function() {self.action.method = this.value;}
			 DragDrop.updateConfig	( this.dropZoneSelectorId
									, { acceptedClasse: [[openHabTypes.OpenClosed]]
									  }
									);
			}
		 return root;
		}
		

	module.exports = openHab_Action_Contact;


/***/ },
/* 112 */
/***/ function(module, exports) {

	module.exports = "<label class=\"turn\">\r\n\t<select class=\"contact\">\r\n\t\t<option value=\"Do_Open\" >Open </option>\r\n\t\t<option value=\"Do_Close\">Close</option>\r\n\t</select>\r\n</label>"

/***/ },
/* 113 */
/***/ function(module, exports, __webpack_require__) {

	var openHab_Event	= __webpack_require__( 109 )
	  // , utils		= require( '../../../utils.js' )
	  , DragDrop		= __webpack_require__( 54 )
	  , openHabTypes	= __webpack_require__( 106 )
	  , str_template	= __webpack_require__( 114 )
	  , html_template	= document.createElement( "div" )
	  ;
	  
	html_template.innerHTML = str_template;
	  
	// 
	var openHab_Event_Contact = function() {
		 openHab_Event.apply(this, []);
		 this.eventFilter.val = "OPEN"
		 return this;
		}

	openHab_Event_Contact.prototype = Object.create( openHab_Event.prototype );
	openHab_Event_Contact.prototype.constructor = openHab_Event_Contact;

	openHab_Event_Contact.prototype.init		= function(PnodeID, parent, children) {
		 openHab_Event.prototype.init.apply(this, [PnodeID, parent, children]);
		 return this;
		}

	openHab_Event_Contact.prototype.serialize = function() {
		 var json = openHab_Event.prototype.serialize.apply(this, []);
		 json.subType = 'openHab_Event_Contact';
		 return json;
		}

	openHab_Event_Contact.prototype.Render = function() {
		 var self = this;
		 var root = openHab_Event.prototype.Render.apply(this, []);
		 root.classList.add( "openHab_Event_Contact" );
		 // template
		 this.copyHTML(html_template, this.html.eventName);
		 this.html.OpenClose			= root.querySelector("select.contact");
		 this.html.OpenClose.value		= this.eventFilter.val = this.eventFilter.val || 'OPEN';
		 this.html.OpenClose.onchange	= function() {self.eventFilter.val = this.value;}
		 // DragDrop
		 DragDrop.updateConfig	( this.dropZoneSelectorId
								, { acceptedClasse: [[openHabTypes.OpenClosed]]
								  }
								);
		 return root;
		}

	module.exports = openHab_Event_Contact;




/***/ },
/* 114 */
/***/ function(module, exports) {

	module.exports = "<label class=\"turn\">Someone\r\n\t<select class=\"contact\">\r\n\t\t<option value=\"OPEN\"  >Opened</option>\r\n\t\t<option value=\"CLOSED\">Closed</option>\r\n\t</select>\r\n</label>"

/***/ },
/* 115 */
/***/ function(module, exports, __webpack_require__) {

	var openHab_Action	= __webpack_require__( 105 )
	  // , utils		= require( '../../../utils.js' )
	  , DragDrop		= __webpack_require__( 54 )
	  , openHabTypes	= __webpack_require__( 106 )
	  , str_template	= __webpack_require__( 116 )
	  , html_template	= document.createElement( "div" )
	  ;
	  
	html_template.innerHTML = str_template;

	// 
	var openHab_Action_Color = function() {
		 openHab_Action.apply(this, []);
		 this.mustDoRender = true;
		 return this;
		}

	openHab_Action_Color.prototype = Object.create( openHab_Action.prototype );
	openHab_Action_Color.prototype.constructor = openHab_Action_Color;

	openHab_Action_Color.prototype.init		= function(PnodeID, parent, children) {
		 openHab_Action.prototype.init.apply(this, [PnodeID, parent, children]);
		 return this;
		}

	openHab_Action_Color.prototype.serialize = function() {
		 this.action.method = "setColor_RGB";
		 var json = openHab_Action.prototype.serialize.apply(this, []);
		 json.subType = 'openHab_Action_Color';
		 return json;
		}

	openHab_Action_Color.prototype.forceRender		= function() {
		this.mustDoRender = true;
		return openHab_Action.prototype.forceRender.apply(this, []);
	}

	openHab_Action_Color.prototype.Render = function() {
		 var self = this;
		 var root = openHab_Action.prototype.Render.apply(this,[]);
		 if(this.mustDoRender) {
			 this.mustDoRender = false;
			 root.classList.add( "openHab_Action_Color" );
			 this.copyHTML(html_template, this.html.actionName);
			 this.html.color			= root.querySelector("input.color");
			 if(this.action.params.length === 0) {
				 this.action.params = [255, 0, 0];
				}
			 this.html.color.onchange	= function() {
				 // console.log(this.value);
				 var R = parseInt( this.value.substring(1,3), 16)
				   , G = parseInt( this.value.substring(3,5), 16)
				   , B = parseInt( this.value.substring(5,7), 16)
				   ;
				 self.action.params = [R, G, B];
				 // console.log("Color", self.action.params);
				}
			 DragDrop.updateConfig	( this.dropZoneSelectorId
									, { acceptedClasse: [[openHabTypes.HSB]]
									  }
									);
			}
		 // console.log("Render color", this.action.params);
		 this.html.color.value	= "#" 
								+ ("0" + this.action.params[0].toString(16) ).slice(-2)
								+ ("0" + this.action.params[1].toString(16) ).slice(-2)
								+ ("0" + this.action.params[2].toString(16) ).slice(-2)
								;
		 return root;
		}

	module.exports = openHab_Action_Color;


/***/ },
/* 116 */
/***/ function(module, exports) {

	module.exports = "<label class=\"turn\">Color in  \r\n\t<input type=\"color\" class=\"color\"></input>\r\n</label>\r\n"

/***/ },
/* 117 */
/***/ function(module, exports, __webpack_require__) {

	var openHab_Event	= __webpack_require__( 109 )
	  // , utils		= require( '../../../utils.js' )
	  , DragDrop		= __webpack_require__( 54 )
	  , openHabTypes	= __webpack_require__( 106 )
	  , str_template	= __webpack_require__( 118 )
	  , html_template	= document.createElement( "div" )
	  ;
	  
	html_template.innerHTML = str_template;
	  
	// 
	var openHab_Event_Color = function() {
		 openHab_Event.apply(this, []);
		 this.eventNode.filters = [];
		 return this;
		}

	openHab_Event_Color.prototype = Object.create( openHab_Event.prototype );
	openHab_Event_Color.prototype.constructor = openHab_Event_Color;

	openHab_Event_Color.prototype.init		= function(PnodeID, parent, children) {
		 openHab_Event.prototype.init.apply(this, [PnodeID, parent, children]);
		 return this;
		}

	openHab_Event_Color.prototype.serialize = function() {
		 var json = openHab_Event.prototype.serialize.apply(this, []);
		 json.subType = 'openHab_Event_Color';
		 return json;
		}

	openHab_Event_Color.prototype.Render = function() {
		 // var self = this;
		 var root = openHab_Event.prototype.Render.apply(this, []);
		 root.classList.add( "openHab_Event_Color" );
		 // template
		 this.copyHTML(html_template, this.html.eventName);
		 // DragDrop
		 DragDrop.updateConfig	( this.dropZoneSelectorId
								, { acceptedClasse: [[openHabTypes.HSB]]
								  }
								);
		 return root;
		}

	module.exports = openHab_Event_Color;




/***/ },
/* 118 */
/***/ function(module, exports) {

	module.exports = "<label class=\"turn\">Color changed for  \r\n</label>\r\n"

/***/ },
/* 119 */
/***/ function(module, exports, __webpack_require__) {

	var openHab_Action	= __webpack_require__( 105 )
	  // , utils		= require( '../../../utils.js' )
	  , DragDrop		= __webpack_require__( 54 )
	  , openHabTypes	= __webpack_require__( 106 )
	  , str_template	= __webpack_require__( 120 )
	  , html_template	= document.createElement( "div" )
	  ;
	  
	html_template.innerHTML = str_template;

	// 
	var openHab_Action_String = function() {
		 openHab_Action.apply(this, []);
		 this.mustDoRender = true;
		 return this;
		}

	openHab_Action_String.prototype = Object.create( openHab_Action.prototype );
	openHab_Action_String.prototype.constructor = openHab_Action_String;

	openHab_Action_String.prototype.init		= function(PnodeID, parent, children) {
		 openHab_Action.prototype.init.apply(this, [PnodeID, parent, children]);
		 return this;
		}

	openHab_Action_String.prototype.serialize = function() {
		 this.action.method = "setString";
		 var json = openHab_Action.prototype.serialize.apply(this, []);
		 json.subType = 'openHab_Action_String';
		 return json;
		}

	openHab_Action_String.prototype.forceRender		= function() {
		this.mustDoRender = true;
		return openHab_Action.prototype.forceRender.apply(this, []);
	}

	openHab_Action_String.prototype.Render = function() {
		 var self = this;
		 var root = openHab_Action.prototype.Render.apply(this,[]);
		 if(this.mustDoRender) {
			 this.mustDoRender = false;
			 root.classList.add( "openHab_Action_String" );
			 this.copyHTML(html_template, this.html.actionName);
			 this.html.string			= root.querySelector("input.string");
			 if(this.action.params.length === 0) {
				 this.action.params = [""];
				}
			 this.html.string.onchange	= function() {
				 self.action.params[0] = this.value;
				}
			 DragDrop.updateConfig	( this.dropZoneSelectorId
									, { acceptedClasse: [[openHabTypes.String]]
									  }
									);
			}
		 this.html.string.value	= this.action.params[0];
		 return root;
		}

	module.exports = openHab_Action_String;


/***/ },
/* 120 */
/***/ function(module, exports) {

	module.exports = "<label class=\"turn\">Change value to \r\n\t<input type=\"text\" class=\"string\"></input>\r\n</label>\r\n"

/***/ },
/* 121 */
/***/ function(module, exports, __webpack_require__) {

	var openHab_Event	= __webpack_require__( 109 )
	  // , utils		= require( '../../../utils.js' )
	  , DragDrop		= __webpack_require__( 54 )
	  , openHabTypes	= __webpack_require__( 106 )
	  , str_template	= __webpack_require__( 122 )
	  , html_template	= document.createElement( "div" )
	  ;
	  
	html_template.innerHTML = str_template;
	  
	// 
	var openHab_Event_String = function() {
		 openHab_Event.apply(this, []);
		 this.eventNode.filters = [];
		 return this;
		}

	openHab_Event_String.prototype = Object.create( openHab_Event.prototype );
	openHab_Event_String.prototype.constructor = openHab_Event_String;

	openHab_Event_String.prototype.init		= function(PnodeID, parent, children) {
		 openHab_Event.prototype.init.apply(this, [PnodeID, parent, children]);
		 return this;
		}

	openHab_Event_String.prototype.serialize = function() {
		 var json = openHab_Event.prototype.serialize.apply(this, []);
		 json.subType = 'openHab_Event_String';
		 return json;
		}

	openHab_Event_String.prototype.Render = function() {
		 // var self = this;
		 var root = openHab_Event.prototype.Render.apply(this, []);
		 root.classList.add( "openHab_Event_String" );
		 // template
		 this.copyHTML(html_template, this.html.eventName);
		 // DragDrop
		 DragDrop.updateConfig	( this.dropZoneSelectorId
								, { acceptedClasse: [[openHabTypes.String]]
								  }
								);
		 return root;
		}

	module.exports = openHab_Event_String;




/***/ },
/* 122 */
/***/ function(module, exports) {

	module.exports = "<label class=\"turn\">Value has changed for  \r\n</label>\r\n"

/***/ },
/* 123 */
/***/ function(module, exports, __webpack_require__) {

	var openHab_Action	= __webpack_require__( 105 )
	  // , utils		= require( '../../../utils.js' )
	  , DragDrop		= __webpack_require__( 54 )
	  , openHabTypes	= __webpack_require__( 106 )
	  , str_template	= __webpack_require__( 124 )
	  , html_template	= document.createElement( "div" )
	  ;
	  
	html_template.innerHTML = str_template;

	// 
	var openHab_Action_Number = function() {
		 openHab_Action.apply(this, []);
		 this.mustDoRender = true;
		 return this;
		}

	openHab_Action_Number.prototype = Object.create( openHab_Action.prototype );
	openHab_Action_Number.prototype.constructor = openHab_Action_Number;

	openHab_Action_Number.prototype.init		= function(PnodeID, parent, children) {
		 openHab_Action.prototype.init.apply(this, [PnodeID, parent, children]);
		 return this;
		}

	openHab_Action_Number.prototype.serialize = function() {
		 this.action.method = "setNumber";
		 var json = openHab_Action.prototype.serialize.apply(this, []);
		 json.subType = 'openHab_Action_Number';
		 return json;
		}

	openHab_Action_Number.prototype.forceRender		= function() {
		this.mustDoRender = true;
		return openHab_Action.prototype.forceRender.apply(this, []);
	}

	openHab_Action_Number.prototype.Render = function() {
		 var self = this;
		 var root = openHab_Action.prototype.Render.apply(this,[]);
		 if(this.mustDoRender) {
			 this.mustDoRender = false;
			 root.classList.add( "openHab_Action_Number" );
			 this.copyHTML(html_template, this.html.actionName);
			 this.html.number			= root.querySelector("input.number");
			 if(this.action.params.length === 0) {
				 this.action.params = [""];
				}
			 this.html.number.onchange	= function() {
				 self.action.params[0] = this.value;
				}
			 DragDrop.updateConfig	( this.dropZoneSelectorId
									, { acceptedClasse: [[openHabTypes.Decimal]]
									  }
									);
			}
		 this.html.number.value	= this.action.params[0];
		 return root;
		}

	module.exports = openHab_Action_Number;


/***/ },
/* 124 */
/***/ function(module, exports) {

	module.exports = "<label class=\"turn\">Change Number value to \r\n\t<input type=\"number\" class=\"number\"></input>\r\n</label>\r\n"

/***/ },
/* 125 */
/***/ function(module, exports, __webpack_require__) {

	var openHab_Event	= __webpack_require__( 109 )
	  // , utils		= require( '../../../utils.js' )
	  , DragDrop		= __webpack_require__( 54 )
	  , openHabTypes	= __webpack_require__( 106 )
	  , str_template	= __webpack_require__( 126 )
	  , html_template	= document.createElement( "div" )
	  ;
	  
	html_template.innerHTML = str_template;
	  
	// 
	var openHab_Event_Number = function() {
		 openHab_Event.apply(this, []);
		 this.eventNode.filters = [];
		 return this;
		}

	openHab_Event_Number.prototype = Object.create( openHab_Event.prototype );
	openHab_Event_Number.prototype.constructor = openHab_Event_Number;

	openHab_Event_Number.prototype.init		= function(PnodeID, parent, children) {
		 openHab_Event.prototype.init.apply(this, [PnodeID, parent, children]);
		 return this;
		}

	openHab_Event_Number.prototype.serialize = function() {
		 var json = openHab_Event.prototype.serialize.apply(this, []);
		 json.subType = 'openHab_Event_Number';
		 return json;
		}

	openHab_Event_Number.prototype.Render = function() {
		 // var self = this;
		 var root = openHab_Event.prototype.Render.apply(this, []);
		 root.classList.add( "openHab_Event_Number" );
		 // template
		 this.copyHTML(html_template, this.html.eventName);
		 // DragDrop
		 DragDrop.updateConfig	( this.dropZoneSelectorId
								, { acceptedClasse: [[openHabTypes.Decimal]]
								  }
								);
		 return root;
		}

	module.exports = openHab_Event_Number;




/***/ },
/* 126 */
/***/ function(module, exports) {

	module.exports = "<label class=\"turn\">Value has changed for Number \r\n</label>\r\n"

/***/ },
/* 127 */
/***/ function(module, exports, __webpack_require__) {

	var openHab_Action	= __webpack_require__( 105 )
	  // , utils		= require( '../../../utils.js' )
	  , DragDrop		= __webpack_require__( 54 )
	  , openHabTypes	= __webpack_require__( 106 )
	  , str_template	= __webpack_require__( 128 )
	  , html_template	= document.createElement( "div" )
	  ;
	  
	html_template.innerHTML = str_template;

	// 
	var openHab_Action_RollerShutter = function() {
		 openHab_Action.apply(this, []);
		 this.mustDoRender = true;
		 return this;
		}

	openHab_Action_RollerShutter.prototype = Object.create( openHab_Action.prototype );
	openHab_Action_RollerShutter.prototype.constructor = openHab_Action_RollerShutter;

	openHab_Action_RollerShutter.prototype.init		= function(PnodeID, parent, children) {
		 openHab_Action.prototype.init.apply(this, [PnodeID, parent, children]);
		 return this;
		}

	openHab_Action_RollerShutter.prototype.serialize = function() {
		 var json = openHab_Action.prototype.serialize.apply(this, []);
		 json.subType = 'openHab_Action_RollerShutter';
		 return json;
		}

	openHab_Action_RollerShutter.prototype.forceRender		= function() {
		this.mustDoRender = true;
		return openHab_Action.prototype.forceRender.apply(this, []);
	}

	openHab_Action_RollerShutter.prototype.Render = function() {
		 var self = this;
		 var root = openHab_Action.prototype.Render.apply(this,[]);
		 if(this.mustDoRender) {
			 this.mustDoRender = false;
			 root.classList.add( "openHab_Action_RollerShutter" );
			 this.copyHTML(html_template, this.html.actionName);
			 this.html.RollerShutter			= root.querySelector("select.RollerShutter");
			 this.html.RollerShutter.onchange	= function() {self.action.method = this.value;}
			 DragDrop.updateConfig	( this.dropZoneSelectorId
									, { acceptedClasse: [ [openHabTypes.UpDown  ]
														, [openHabTypes.StopMove]
														, [openHabTypes.Percent ]
														]
									  }
									);
			}
		 this.html.RollerShutter.value		= this.action.method = this.action.method || 'Do_UP';
		 return root;
		}

	module.exports = openHab_Action_RollerShutter;


/***/ },
/* 128 */
/***/ function(module, exports) {

	module.exports = "<label class=\"turn\">\r\n\tRollerShutter action\r\n\t<select class=\"RollerShutter\">\r\n\t\t<option value= \"Do_UP\" >Up  </option>\r\n\t\t<option value=\"Do_DOWN\">Down</option>\r\n\t\t<option value=\"Do_MOVE\">Move</option>\r\n\t\t<option value=\"Do_STOP\">Stop</option>\r\n\t\t<!--<option value=\"Do_PERCENT\">\r\n\t\t\t<input type=\"range\" min=\"0\" max=\"1\" step=\"1\" value=\"50\"></input>\r\n\t\t</option>-->\r\n\t</select>\r\n</label>"

/***/ },
/* 129 */
/***/ function(module, exports, __webpack_require__) {

	var openHab_Event	= __webpack_require__( 109 )
	  // , utils		= require( '../../../utils.js' )
	  , DragDrop		= __webpack_require__( 54 )
	  , openHabTypes	= __webpack_require__( 106 )
	  , str_template	= __webpack_require__( 130 )
	  , html_template	= document.createElement( "div" )
	  ;
	  
	html_template.innerHTML = str_template;
	  
	// 
	var openHab_Event_RollerShutter = function() {
		 openHab_Event.apply(this, []);
		 this.eventFilter.val = "UP"
		 return this;
		}

	openHab_Event_RollerShutter.prototype = Object.create( openHab_Event.prototype );
	openHab_Event_RollerShutter.prototype.constructor = openHab_Event_RollerShutter;

	openHab_Event_RollerShutter.prototype.init		= function(PnodeID, parent, children) {
		 openHab_Event.prototype.init.apply(this, [PnodeID, parent, children]);
		 return this;
		}

	openHab_Event_RollerShutter.prototype.serialize = function() {
		 var json = openHab_Event.prototype.serialize.apply(this, []);
		 json.subType = 'openHab_Event_RollerShutter';
		 return json;
		}

	openHab_Event_RollerShutter.prototype.Render = function() {
		 var self = this;
		 var root = openHab_Event.prototype.Render.apply(this, []);
		 root.classList.add( "openHab_Event_RollerShutter" );
		 // template
		 this.copyHTML(html_template, this.html.eventName);
		 this.html.OnOff			= root.querySelector("select.RollerShutter");
		 this.html.OnOff.value		= this.eventFilter.val = this.eventFilter.val || 'UP';
		 this.html.OnOff.onchange	= function() {self.eventFilter.val = this.value;}
		 // DragDrop
		 DragDrop.updateConfig	( this.dropZoneSelectorId
								, { acceptedClasse: [ [openHabTypes.UpDown  ]
													, [openHabTypes.StopMove]
													, [openHabTypes.Percent ]
													]
								  }
								);
		 return root;
		}

	module.exports = openHab_Event_RollerShutter;




/***/ },
/* 130 */
/***/ function(module, exports) {

	module.exports = "<label class=\"turn\">\r\n\tRollerShutter event\r\n\t<select class=\"RollerShutter\">\r\n\t\t<option value= \"UP\" >Up  </option>\r\n\t\t<option value=\"DOWN\">Down</option>\r\n\t\t<option value=\"MOVE\">Move</option>\r\n\t\t<option value=\"STOP\">Stop</option>\r\n\t</select>\r\n</label>"

/***/ },
/* 131 */
/***/ function(module, exports, __webpack_require__) {

	var PnodePresentation	= __webpack_require__( 57 )
	  // , DragDrop			= require( '../DragDrop.js' )
	  ;

	__webpack_require__( 132 );
	// var css = document.createElement('link');
		// css.setAttribute('rel' , 'stylesheet');
		// css.setAttribute('href', 'css/Program_UsePresentation.css');
		// document.head.appendChild( css );

	var Program_UsePresentation = function() {
		// console.log(this);
		PnodePresentation.prototype.constructor.apply(this, []);
		return this;
	}

	Program_UsePresentation.prototype = Object.create( PnodePresentation.prototype ); // new PnodePresentation();
	Program_UsePresentation.prototype.className		= 'Pselector_program';
	Program_UsePresentation.prototype.constructor	= Program_UsePresentation

	Program_UsePresentation.prototype.init = function(PnodeID, parent, children, infoObj) {
		PnodePresentation.prototype.init.apply(this, [PnodeID, parent, children, infoObj]);
		this.selector	= { progDefId	: null
						  , name		: ''
						  };
		if(infoObj) {
			 this.selector.progDefId	= infoObj.config.id;
			 this.selector.name			= infoObj.config.name;
			}
		return this;
	}

	Program_UsePresentation.prototype.serialize	= function() {
		var json = PnodePresentation.prototype.serialize.apply(this, []);
		// Describe action here
		json.subType	= 'Program_UsePresentation';
		json.selector = { progDefId		: this.selector.progDefId
						};
		return json;
	}

	Program_UsePresentation.prototype.unserialize	= function(json, PresoUtils) {
		// Describe action here
		PnodePresentation.prototype.unserialize.apply(this, [json, PresoUtils]);
		this.selector.progDefId	= json.selector.progDefId;
		this.selector.name		= json.selector.name;
		if(this.html.spanProgramName) {
			 this.html.spanProgramName.innerHTML = '';
			 this.html.spanProgramName.classList.add( this.selector.progDefId );
			 this.html.spanProgramName.appendChild( document.createTextNode(this.selector.name) );
			}
		return this;
	}

	Program_UsePresentation.prototype.updateType = function() {
		
	}

	Program_UsePresentation.prototype.Render	= function() {
		// var self = this;
		var root = PnodePresentation.prototype.Render.apply(this, []);
		root.classList.add('Pselector_program');
		if(typeof this.html.spanProgramName === 'undefined') {
			 this.html.spanProgramName = document.createElement('span');
				this.html.spanProgramName.classList.add( 'program' );
				this.divDescription.appendChild( this.html.spanProgramName );
				if(this.selector.progDefId) {
					 this.html.spanProgramName.classList.add( this.selector.progDefId );
					 this.html.spanProgramName.appendChild( document.createTextNode(this.selector.name) );
					}
			}
		return root;
	}

	// Return the constructor
	module.exports = Program_UsePresentation;



/***/ },
/* 132 */
/***/ function(module, exports) {

	// removed by extract-text-webpack-plugin

/***/ },
/* 133 */,
/* 134 */
/***/ function(module, exports, __webpack_require__) {

	var PnodePresentation	= __webpack_require__( 57 )
	  // , DragDrop			= require( '../DragDrop.js' )
	  ;

	var Program_DefinitionPresentation = function() {
		// console.log(this);
		PnodePresentation.prototype.constructor.apply(this, []);
		return this;
	}

	Program_DefinitionPresentation.prototype = Object.create( PnodePresentation.prototype ); // new PnodePresentation();
	Program_DefinitionPresentation.prototype.constructor	= Program_DefinitionPresentation;
	Program_DefinitionPresentation.prototype.className		= 'PprogramDeclaration';

	Program_DefinitionPresentation.prototype.init = function(PnodeID, parent, children) {
		PnodePresentation.prototype.init.apply(this, [PnodeID, parent, children]);
		this.varDef	= { name	: ''
					  , expose	: false
					  };
		return this;
	}

	Program_DefinitionPresentation.prototype.serialize	= function() {
		var json = PnodePresentation.prototype.serialize.apply(this, []);
		// Describe action here
		json.subType	= 'Program_DefinitionPresentation';
		json.varDef = { name	: this.varDef.name
					  , expose	: this.varDef.expose
					  };
		if(this.varDef.id		) {json.varDef.id		 = this.varDef.id		;}
		if(this.varDef.programId) {json.varDef.programId = this.varDef.programId;}
		return json;
	}

	Program_DefinitionPresentation.prototype.unserialize	= function(json, PresoUtils) {
		// Describe action here
		PnodePresentation.prototype.unserialize.apply(this, [json, PresoUtils]);
		this.varDef.id			= json.varDef.id;
		this.varDef.name		= json.varDef.name;
		this.varDef.expose		= json.varDef.expose;
		this.varDef.programId	= json.varDef.programId;
		if(this.html.inputId) {
			 this.html.inputId.value = this.varDef.name;
			 this.html.editProgram.setAttribute('href', 'editor?programId=' + encodeURIComponent(this.varDef.programId) );
			 this.html.expose.checked = this.varDef.expose;
			}
		return this;
	}

	Program_DefinitionPresentation.prototype.updateType = function() {}

	Program_DefinitionPresentation.prototype.Render	= function() {
		var self = this;
		var root = PnodePresentation.prototype.Render.apply(this, []);
		root.classList.add('DefinitionNode');
		if(typeof this.html.inputId === 'undefined') {
			 this.html.expose = document.createElement('input');
				this.html.expose.setAttribute('type', 'checkbox');
				this.html.expose.checked = self.varDef.expose;
				this.html.expose.onchange = function() {self.varDef.expose = this.checked; console.log(self.varDef.expose);};
				this.divDescription.appendChild( this.html.expose );
			 this.html.labelId = document.createElement('span');
				this.html.labelId.classList.add( 'varId' );
				this.html.labelId.innerHTML = "Define sub-program ";
				this.divDescription.appendChild( this.html.labelId );
			 this.html.inputId = document.createElement('input');
				this.html.inputId.classList.add( 'varId' );
				this.html.inputId.innerHTML = "ACTION";
				this.html.inputId.onkeyup = function() {self.varDef.name = self.html.inputId.value;};
				this.divDescription.appendChild( this.html.inputId );
			 // Link
			 this.html.editProgram = document.createElement('a');
				this.html.editProgram.setAttribute('href', 'editor?programId=' + encodeURIComponent(this.varDef.programId) );
				this.html.editProgram.setAttribute('target', "_blank");
				this.html.editProgram.innerHTML = " edit ";
				this.divDescription.appendChild( this.html.editProgram );
			} 
		return root;
	}

	// Return the constructor
	module.exports = Program_DefinitionPresentation;



/***/ },
/* 135 */
/***/ function(module, exports, __webpack_require__) {

	var PnodePresentation	= __webpack_require__( 57 )
	  , DragDrop			= __webpack_require__( 54 )
	  ;

	// linking CSS
	__webpack_require__( 136 );
	// var css = document.createElement('link');
		// css.setAttribute('rel' , 'stylesheet');
		// css.setAttribute('href', 'css/Var_DefinitionPresentation.css');
		// document.body.appendChild(css);
			
	// Defining Var_DefinitionPresentation
	var Var_DefinitionPresentation = function() {
		// console.log(this);
		PnodePresentation.prototype.constructor.apply(this, []);
		return this;
	}

	Var_DefinitionPresentation.prototype = Object.create( PnodePresentation.prototype ); // new PnodePresentation();
	Var_DefinitionPresentation.prototype.constructor	= Var_DefinitionPresentation;
	Var_DefinitionPresentation.prototype.className		= 'PvariableDeclaration';

	Var_DefinitionPresentation.prototype.init = function(PnodeID, parent, children) {
		PnodePresentation.prototype.init.apply(this, [PnodeID, parent, children]);
		this.varDef			= { name	: ''
							  , expose	: false
							  };
		return this;
	}
	Var_DefinitionPresentation.prototype.serialize	= function() {
		var json = PnodePresentation.prototype.serialize.apply(this, []);
		// Describe action here
		json.subType	= 'Var_DefinitionPresentation';
		json.varDef = { name	: this.varDef.name
					  , expose	: this.varDef.expose
					  };
		if(this.varDef.id) {json.varDef.id = this.varDef.id;}
		return json;
	}
	Var_DefinitionPresentation.prototype.unserialize	= function(json, PresoUtils) {
		// Describe action here
		PnodePresentation.prototype.unserialize.apply(this, [json, PresoUtils]);
		this.varDef.id		= json.varDef.id;
		this.varDef.name	= json.varDef.name;
		this.varDef.expose	= json.varDef.expose;
		if(this.html.inputId) {
			 this.html.inputId.value	= this.varDef.name;
			 this.html.expose.checked	= this.varDef.expose;
			}
		return this;
	}

	Var_DefinitionPresentation.prototype.primitivePlug	= function(c) {
		 // console.log("Primitive plug ", this.root, " ->", c.root);
		 this.Render();
		 var P = this.html.selector,
			 N = c.Render();
		 if(N.parentElement === null) {
				 P.innerHTML = '';
				 P.appendChild( N );
				}
		return this;
	}

	Var_DefinitionPresentation.prototype.updateType = function() {}

	Var_DefinitionPresentation.prototype.Render	= function() {
		var self = this;
		var root = PnodePresentation.prototype.Render.apply(this, []);
		root.classList.add('DefinitionNode');
		if(typeof this.html.inputId === 'undefined') {
			 this.html.expose = document.createElement('input');
				this.html.expose.setAttribute('type', 'checkbox');
				this.html.expose.checked = self.varDef.expose;
				this.html.expose.onchange = function() {self.varDef.expose = this.checked; console.log(self.varDef.expose);};
				this.divDescription.appendChild( this.html.expose );
				// console.error("XXX Var_DefinitionPresentation::Render must implement checkbox changes");
			 this.html.labelId = document.createElement('span');
				this.html.labelId.classList.add( 'varId' );
				this.html.labelId.innerHTML = "Define variable ";
				this.divDescription.appendChild( this.html.labelId );
			 this.html.inputId = document.createElement('input');
				this.html.inputId.classList.add( 'varId' );
				this.html.inputId.innerHTML = "ACTION";
				this.html.inputId.onkeyup = function() {self.varDef.name = self.html.inputId.value;};
				this.divDescription.appendChild( this.html.inputId );
			 this.html.as = document.createElement('span');
				this.html.as.classList.add('as');
				this.html.as.innerHTML = " as ";
				this.divDescription.appendChild( this.html.as );
			 // Drop zone for selector
			 this.html.selector = document.createElement('span');
				this.html.selector.classList.add('selector');
				this.html.selector.innerHTML = "Insert Selector here";
				this.divDescription.appendChild( this.html.selector );
				this.dropZoneSelectorId = DragDrop.newDropZone( this.html.selector
									, { acceptedClasse	: [['SelectorNode'], ['EventNode']]
									  , CSSwhenAccepted	: 'possible2drop'
									  , CSSwhenOver		: 'ready2drop'
									  , ondrop			: function(evt, draggedNode, infoObj) {
											 var Pnode = new infoObj.constructor().init	( undefined	// PnodeID
																						, undefined	// parent
																						, undefined	// children
																						, infoObj
																						);
											 self.appendChild( Pnode );
											}
									  }
									);
			} 
		return root;
	}

	// Return the constructor
	module.exports = Var_DefinitionPresentation;



/***/ },
/* 136 */
/***/ function(module, exports) {

	// removed by extract-text-webpack-plugin

/***/ },
/* 137 */,
/* 138 */
/***/ function(module, exports, __webpack_require__) {

	var /*PnodePresentation			= require( './PnodePresentation.js' )
	  , */SelectorNodePresentation	= __webpack_require__( 101 )
	  , MediaBrowser				= __webpack_require__( 139 )
	  , utils						= __webpack_require__( 1 )
	  ;

	function MR_Instance_SelectorNodePresentation() {
		SelectorNodePresentation.apply(this, []);
		return this;
	}

	MR_Instance_SelectorNodePresentation.prototype = Object.create( SelectorNodePresentation.prototype ); // new SelectorNodePresentation();
	MR_Instance_SelectorNodePresentation.prototype.constructor	= MR_Instance_SelectorNodePresentation;
	MR_Instance_SelectorNodePresentation.prototype.className	= 'Pselector_ObjInstance';

	MR_Instance_SelectorNodePresentation.prototype.init		= function(PnodeID, parent, children, infoObj) {
		SelectorNodePresentation.prototype.init.apply(this, [PnodeID, parent, children, infoObj]);
		this.selector.type.push( 'MediaRenderer' );
		if(infoObj) {this.selector.objectId = infoObj.config.uuid;}
		return this;
	}

	MR_Instance_SelectorNodePresentation.prototype.Render	= function() {
		var self = this;
		var root = SelectorNodePresentation.prototype.Render.apply(this, []);
		// Call server for the latest description of Media Player this.selector.objectId
		if(this.selector.objectId) {
			 utils.XHR( 'POST', 'getContext'
					  , { variables	: {nodeId: this.PnodeID}
					    , onload	: function() {
							 var data = JSON.parse( this.responseText );
							 // console.log("select", self.selector.objectId, data.bricks);
							 if(typeof data.bricks[ self.selector.objectId ] !== 'undefined') {
								 // console.log("XXX Render properly the selected MR with", data.bricks[ self.selector.objectId ]);
								 root.innerHTML = '';
								 root.classList.add( 'MediaBrowserFlow' );
								 var MR = data.bricks[ self.selector.objectId ];
								 var MP = MediaBrowser.prototype.RenderItem( MR.name // name
																 , MR.iconURL || 'js/Presentations/UPnP/images/defaultMediaRenderer.png'// iconURL
																 , MR.id // mediaServerId
																 , 0 // directoryId
																 , 'MediaRenderer' // classes
																 , false // isItem
																 );
								 MP.onclick = null;
								 root.appendChild( MP );
								} else {console.error("/getContext from", self.PnodeID, " : The brick", self.selector.objectId, "is not present in the context", data);}
							}
					    }
					  );
			}
		return root;
	}

	MR_Instance_SelectorNodePresentation.prototype.serialize	= function() {
		var json = SelectorNodePresentation.prototype.serialize.apply(this, []);
		// Describe action here
		json.subType	= 'MR_Instance_SelectorNodePresentation';
		json.selector.objectId	= this.selector.objectId;
		return json;
	}

	MR_Instance_SelectorNodePresentation.prototype.unserialize	= function(json, PresoUtils) {
		// Describe action here
		SelectorNodePresentation.prototype.unserialize.apply(this, [json, PresoUtils]);
		this.selector.objectId = json.selector.objectId;
		return this;
	}

	module.exports = MR_Instance_SelectorNodePresentation;


/***/ },
/* 139 */
/***/ function(module, exports, __webpack_require__) {

	var protoPresentation	= __webpack_require__( 58 )
	  , utils				= __webpack_require__( 1 )
	  , AlxEvents			= __webpack_require__( 140 )
	  ;
	  
	var XMLparser = new DOMParser();

	__webpack_require__( 141 );
	// var css = document.createElement('link');
		// css.setAttribute('rel' , 'stylesheet');
		// css.setAttribute('href', 'js/Presentations/UPnP/css/MediaBrowser.css');
		// document.head.appendChild( css );

	function MediaBrowser(title) {
		 // var self			= this;
		 protoPresentation.apply(this, []);
		 this.title			= title || 'TITLE';
		 this.Breadcrumbs	= [ {name: 'Servers', mediaServerId:'', directoryId:'', classes: 'MediaServer'}
							  ];
		 return this;
		}
		
	MediaBrowser.prototype				= Object.create( protoPresentation.prototype ); // new protoPresentation();
	MediaBrowser.prototype.constructor	= MediaBrowser;

	AlxEvents( MediaBrowser );
	MediaBrowser.prototype.Render	= function() {
		 var self = this;
		 var root = protoPresentation.prototype.Render.apply(this, []);
		 root.onclick = function(e) {
			 e.stopPropagation(); e.preventDefault();
			 var prevSelected = self.htmldivContent.querySelector( '.foreground .Media.selected' );
			 if(prevSelected) {prevSelected.classList.remove( 'selected' );}
			}
		 if(typeof this.htmlh1 === "undefined") {
			 root.classList.add( 'MediaBrowser' );
			 this.htmldivBackground = document.createElement('div');
				this.htmldivBackground.classList.add('background');
				root.appendChild( this.htmldivBackground );
			 this.htmldivForeground = document.createElement('div');
				this.htmldivForeground.classList.add('foreground');
				root.appendChild( this.htmldivForeground );
			 this.htmlh1 = document.createElement('h1');
				this.htmlh1.appendChild( document.createTextNode( this.title ) );
				this.htmldivForeground.appendChild( this.htmlh1 );
				// Cross to quit
				this.crossCancel = document.createElement('span');
					this.crossCancel.appendChild( document.createTextNode('X') );
					this.crossCancel.classList.add('cancel');
					this.htmlh1.appendChild( this.crossCancel );
					this.crossCancel.onclick = function() {
						 self.setParent(null);
						}
			 this.htmldivNavigation	= document.createElement('div');
				this.htmldivForeground.appendChild( this.htmldivNavigation );
				this.htmldivNavigation.classList.add('navigation');
			 this.htmldivContent	= document.createElement('div');
				this.htmldivForeground.appendChild( this.htmldivContent );
				this.htmldivContent.classList.add('content');
			}
		 this.Browse();
		 return root;
		}
	MediaBrowser.prototype.RenderNavigation = function() {
		 var self = this;
		 function RenderNavElement( element, index ) {
			 var span = document.createElement('a');
			 span.setAttribute('class', element.classes);
			 span.classList.add('element');
			 span.onclick = function(e) {
				 e.preventDefault(); e.stopPropagation();
				 self.Breadcrumbs.splice(index+1, self.Breadcrumbs.length);
				 self.Browse();
				}
			 span.appendChild( document.createTextNode(element.name) );
			 return span;
			}
		 // Render Breadcrumbs
		 this.htmldivNavigation.innerHTML = '';
		 var i;
		 for(i=0; i<this.Breadcrumbs.length - 1; i++) {
			 var htmlElement = RenderNavElement( this.Breadcrumbs[i], i );
			 this.htmldivNavigation.appendChild( htmlElement );
			 this.htmldivNavigation.appendChild( document.createTextNode(' > ') );
			}
		 this.htmldivNavigation.appendChild( RenderNavElement(this.Breadcrumbs[i], i) );
		}
	MediaBrowser.prototype.Selected	= function(mediaServerId, itemId, htmlMS, name, iconURL) {
		 this.emit( 'selected'
				  , { mediaServerId : mediaServerId
					, itemId		: itemId
					, htmlMS		: htmlMS
					, name			: name
					, iconURL		: iconURL
					}
				  );
		}
	MediaBrowser.prototype.RenderItem = function(name, iconURL, mediaServerId, directoryId, classes, isItem) {
		 var self = this;
		 var htmlMS = document.createElement('div');
		 htmlMS.setAttribute('class', classes);
		 htmlMS.classList.add('Media');
		 var img = document.createElement('img');
			img.setAttribute('src', iconURL);
			img.classList.add('icon');
			htmlMS.appendChild( img );
		 var title = document.createElement("div");
			title.appendChild( document.createTextNode(name) );
			title.classList.add('title');
			htmlMS.appendChild( title );
		 if(isItem) {
			 htmlMS.onclick = function(e) {
				 e.stopPropagation(); e.preventDefault();
				 var prevSelected = self.htmldivContent.querySelector( '.foreground .Media.selected' );
				 if(prevSelected) {
					 prevSelected.classList.remove( 'selected' );
					 if(prevSelected !== this) {
						 this.classList.add('selected');
						} else {this.classList.remove('selected');
								self.setParent(null);
								self.Selected(mediaServerId, directoryId, htmlMS, name, iconURL);
							   }
					} else {this.classList.add('selected');
						   }
				}
			} else {htmlMS.onclick = function() {
						 self.Breadcrumbs.push( { name			: name
												, mediaServerId	: mediaServerId
												, directoryId	: directoryId
												, classes		: classes } );
						 self.Browse();
						}
				   }
		 return htmlMS;
		}
	MediaBrowser.prototype.getServers = function(PnodeID) {
		 var self = this;
		 this.htmldivContent.innerHTML = '';
		 this.htmldivContent.classList.remove('error');
		 utils.XHR( 'POST', 'getContext'
				  , { variables	: {nodeId: this.PnodeID}
					, onload	: function() {
						 var data = JSON.parse( this.responseText )
						   , brick;
						 self.htmldivContent.innerHTML = '';
						 for(var i in data.bricks) {
							 brick = data.bricks[i];
							 if(brick.type.indexOf('BrickUPnP_MediaServer') !== -1) {
								 var htmlMS = self.RenderItem( brick.name
															 , brick.iconURL || 'js/Presentations/UPnP/images/defaultMediaServer.png'
															 , brick.id
															 , '0'
															 , 'MediaServer' );
								 self.htmldivContent.appendChild( htmlMS );
								}
							}
						}
					}
				  );
		}
	MediaBrowser.prototype.getHtmlItemFrom = function(mediaServerId, itemId, cb) {
		 var self = this;
		 utils.call	( mediaServerId
					, 'getMetaData'
					, [itemId]
					, function(res) {
						 if(typeof res === "string") {
							var doc = XMLparser.parseFromString(res, "text/xml");
							var Result = doc.getElementsByTagName('Result').item(0);
							if(Result) {
								 var ResultDoc	= XMLparser.parseFromString(Result.textContent, "text/xml");
								 var title		= ResultDoc.querySelector("title").textContent; 
								 var icon		= ResultDoc.querySelector("albumArtURI"); icon = icon?icon.textContent:null;
								 var htmlMedia = self.RenderItem( title
																, icon || 'js/Presentations/UPnP/images/media_icon.jpg'
																, mediaServerId
																, itemId
																, 'MediaFile'
																, true );
								 cb(htmlMedia);
								} else {console.error("Error in ", res); cb(null);}
							} else {console.log("Error getHtmlItemFrom :", res);
									cb(null); }
						}
					);
		}
	MediaBrowser.prototype.Browse = function(PnodeID) {
		 var self = this;
		 var element = this.Breadcrumbs[ this.Breadcrumbs.length - 1 ];
		 this.RenderNavigation();
		 if( element.mediaServerId === '') {return this.getServers(PnodeID);}
		 
		 utils.call	( element.mediaServerId
					, 'Browse'
					, [element.directoryId]
					, function(res) {
						 self.htmldivContent.innerHTML = '';
						 if(typeof res === "string") {
							 var doc = XMLparser.parseFromString(res, "text/xml");
							 var Result = doc.getElementsByTagName('Result').item(0);
							 if(Result) {
								 var ResultDoc = XMLparser.parseFromString(Result.textContent, "text/xml");
								 var L_containers = ResultDoc.querySelectorAll('container') 
								   , i, title, icon;
								 for(i=0; i<L_containers.length; i++) {
									 var container	= L_containers.item(i);
									 var contId		= container.getAttribute('id');
									 title	= container.querySelector('title').textContent; //container.getElementsByTagName('title').item(0).textContent;
									 icon	= container.querySelector('albumArtURI'); icon = icon?icon.textContent:null;
									 var htmlContainer = self.RenderItem( title
																		, icon || 'js/Presentations/UPnP/images/folder_256.png'
																		, element.mediaServerId
																		, contId
																		, 'MediaFolder'
																		, false );
									 self.htmldivContent.appendChild( htmlContainer );
									} // End of containers
								 var L_items	= ResultDoc.querySelectorAll('item'); 
								 for(i=0; i<L_items.length; i++) {
									 var item	= L_items.item(i);
									 var itemId	= item.getAttribute('id');
									 title	= item.querySelector('title').textContent; //item.getElementsByTagName('title').item(0).textContent;
									 icon	= item.querySelector('albumArtURI'); icon = icon?icon.textContent:null; 
									 var htmlMedia = self.RenderItem( title
																	, icon || 'js/Presentations/UPnP/images/media_icon.jpg'
																	, element.mediaServerId
																	, itemId
																	, 'MediaFile'
																	, true );
									 self.htmldivContent.appendChild( htmlMedia );
									}
								}
							}
						}
					);
		}

	module.exports = MediaBrowser;



/***/ },
/* 140 */
/***/ function(module, exports) {

	
	function AlxEvent(classe) {
		classe.prototype.emit				= AlxEvent.prototype.emit;
		classe.prototype.on					= AlxEvent.prototype.on;
		classe.prototype.off				= AlxEvent.prototype.off;
		classe.prototype.disposeAlxEvent	= AlxEvent.prototype.disposeAlxEvent;
	}

	AlxEvent.prototype.emit	= function(eventName, event) {
		var i;
		if(this.AlxEvent && this.AlxEvent[eventName]) {
			 // console.log("emiting to", this.AlxEvent[eventName]);
			 for(i=0; i<this.AlxEvent[eventName].length; i++) {
				 this.AlxEvent[eventName][i].apply(this, [event])
				}
			 this.AlxEvent["*"] = this.AlxEvent["*"] || [];
			 for(i=0; i<this.AlxEvent["*"].length; i++) {
				 this.AlxEvent["*"][i].apply(this, [event])
				}
			}
		return this;
	}

	AlxEvent.prototype.on	= function(eventName, callback) {
		if(typeof this.AlxEvent === 'undefined') {this.AlxEvent = {}}
		if(typeof this.AlxEvent[eventName] === 'undefined') {this.AlxEvent[eventName] = [];}
		if(this.AlxEvent[eventName].indexOf(callback) === -1) {
			 this.AlxEvent[eventName].push( callback );
			}
		return this;
	}

	AlxEvent.prototype.off	= function(eventName, callback) {
		if(this.AlxEvent && this.AlxEvent[eventName]) {
			 var pos = this.AlxEvent[eventName].indexOf(callback);
			 if(pos >= 0) {
				 this.AlxEvent[eventName].splice(pos, 1);
				}
			}
		return this;
	}

	AlxEvent.prototype.disposeAlxEvent	= function(eventName, callback) {
		if(this.AlxEvent) {
			 var keys, key;
			 for(var e in keys) {
				  key = key[e];
				  this.AlxEvent[e] = [];
				  delete this.AlxEvent[e];
				}
			}
		return this;
	}

	module.exports = AlxEvent;


/***/ },
/* 141 */
/***/ function(module, exports) {

	// removed by extract-text-webpack-plugin

/***/ },
/* 142 */,
/* 143 */
/***/ function(module, exports, __webpack_require__) {

	var /*PnodePresentation		= require( './PnodePresentation.js' )
	  ,*/ ActionNodePresentation	= __webpack_require__( 70 )
	  // , DragDrop				= require( '../DragDrop.js' )
	  ;

	function PprogramActionPresentation() {
		ActionNodePresentation.apply(this, []);
		return this;
	}

	PprogramActionPresentation.prototype = Object.create( ActionNodePresentation.prototype ); // new ActionNodePresentation();
	PprogramActionPresentation.prototype.constructor	= PprogramActionPresentation;
	PprogramActionPresentation.prototype.className		= 'ActionNode';

	PprogramActionPresentation.prototype.init		= function(PnodeID, parent, children) {
		ActionNodePresentation.prototype.init.apply(this, [PnodeID, parent, children]);
		this.action.method = 'Start';
		return this;
	}

	PprogramActionPresentation.prototype.serialize	= function() {
		var json = ActionNodePresentation.prototype.serialize.apply(this, []);
		json.subType		= 'PprogramActionPresentation';
		return json;
	}

	PprogramActionPresentation.prototype.unserialize	= function(json, Putils) {
		ActionNodePresentation.prototype.unserialize.apply(this, [json, Putils]);
		if(this.html.selectAction) {
			 this.html.selectAction.value = this.action.method;
			}
		return this;
	}

	PprogramActionPresentation.prototype.Render			= function() {
		var root = ActionNodePresentation.prototype.Render.apply(this, [])
		  , self = this;
		if(!this.html.selectAction) {
			 this.html.actionName.innerHTML		= '';
			 this.html.divSelector.innerHTML	= '[DROP PROGRAMS HERE]';
			 var options = '<option value="Start">Start</option><option value="Stop">Stop</option>';
				 this.html.selectAction = document.createElement( 'select' );
				 this.html.selectAction.innerHTML	= options;
				 this.html.selectAction.value		= this.action.method;
				 this.html.selectAction.onchange	= function() {self.action.method = this.value;}
			 this.html.actionName.appendChild(this.html.selectAction); 
			}
		return root;
	}

	module.exports = PprogramActionPresentation;



/***/ },
/* 144 */
/***/ function(module, exports, __webpack_require__) {

	var Program_UsePresentation	= __webpack_require__( 131 )
	  // , DragDrop				= require( '../DragDrop.js' )
	  ;

	var Program_ExposedAPI_elementPresentation = function() {
		// console.log(this);
		Program_UsePresentation.apply(this, []);
		return this;
	}

	Program_ExposedAPI_elementPresentation.prototype = Object.create( Program_UsePresentation.prototype ); // new Program_UsePresentation();
	Program_ExposedAPI_elementPresentation.prototype.constructor	= Program_ExposedAPI_elementPresentation;
	Program_ExposedAPI_elementPresentation.prototype.className		= 'Pselector_variable';

	Program_ExposedAPI_elementPresentation.prototype.init		= function(PnodeID, parent, children, infoObj) {
		Program_UsePresentation.prototype.init.apply(this, [PnodeID, parent, children, infoObj]);
		if(infoObj) {
			 this.selector.variableId	= infoObj.config.variableId;
			 this.selector.variableName	= infoObj.config.variableName;
			 this.selector.variableTypes= infoObj.config.variableTypes;
			} else {this.selector.variableId	= null;
					this.selector.variableTypes	= [];
				   }
		return this;
	}

	Program_ExposedAPI_elementPresentation.prototype.serialize	= function() {
		var json = Program_UsePresentation.prototype.serialize.apply(this, []);
		// Describe node here
		json.subType	= 'Program_ExposedAPI_elementPresentation';
		json.selector.variableId	= this.selector.variableId;

		return json;
	}

	Program_ExposedAPI_elementPresentation.prototype.unserialize	= function(json, PresoUtils) {
		// Describe action here
		Program_UsePresentation.prototype.unserialize.apply(this, [json, PresoUtils]);
		this.selector.variableId	= json.selector.variableId;
		this.selector.variableName	= json.selector.variableName;
		this.selector.variableTypes	= json.selector.variableTypes || [];
		if(this.html.spanVarId) {
			 this.html.spanVarId.innerHTML = '';
			 this.html.spanVarId.classList.add( this.selector.variableId );
			 for(var i=0;i<this.selector.variableTypes.length; i++) {
				 this.html.spanVarId.classList.add( this.selector.variableTypes[i] );
				}
			 this.html.spanVarId.appendChild( document.createTextNode(this.selector.variableName) );
			}
		return this;
	}

	Program_ExposedAPI_elementPresentation.prototype.updateType = function() {
		
	}

	Program_ExposedAPI_elementPresentation.prototype.Render	= function() {
		// var self = this;
		var root = Program_UsePresentation.prototype.Render.apply(this, []);
		root.classList.add('Pselector_variable');
		if(typeof this.html.spanVarId === 'undefined') {
			 this.html.spanVarId = document.createElement('span');
				this.html.spanVarId.classList.add( 'variable' );
				for(var i=0; i<this.selector.variableTypes.length; i++) {
					 this.html.spanVarId.classList.add( this.selector.variableTypes[i] );
					}
				this.divDescription.appendChild( this.html.spanVarId );
				if(this.selector.variableId) {
					 this.html.spanVarId.classList.add( this.selector.variableId );
					 this.html.spanVarId.appendChild( document.createTextNode(this.selector.variableName) );
					}
			}
		return root;
	}

	// Return the constructor
	module.exports = Program_ExposedAPI_elementPresentation;



/***/ },
/* 145 */
/***/ function(module, exports, __webpack_require__) {

	var PnodePresentation	= __webpack_require__( 57 )
	  // , DragDrop			= require( '../DragDrop.js' )
	  , utils				= __webpack_require__( 1 )
	  , AlxTextEditor		= __webpack_require__( 146 )
	  ;

	// XXX Try direct loading
	var htmlTemplate;
	utils.XHR( 'GET', 'js/Presentations/HTML_templates/Pselector_TextPresentation.html'
			 , function() {htmlTemplate = this.responseText;}
			 );
	var css = document.createElement('link');
		css.setAttribute('rel' , 'stylesheet');
		css.setAttribute('href', 'js/Presentations/HTML_templates/Pselector_TextPresentation.css');
		document.head.appendChild( css );

	var Pselector_TextPresentation = function() {
		// console.log(this);
		PnodePresentation.prototype.constructor.apply(this, []);
		this.alxTextEditor = new AlxTextEditor();
		return this;
	}

	Pselector_TextPresentation.prototype = Object.create( PnodePresentation.prototype ); // new PnodePresentation();
	Pselector_TextPresentation.prototype.constructor	= Pselector_TextPresentation;
	Pselector_TextPresentation.prototype.className		= 'Pselector_Text';

	Pselector_TextPresentation.prototype.init = function(PnodeID, parent, children, infoObj) {
		PnodePresentation.prototype.init.apply(this, [PnodeID, parent, children, infoObj]);
		this.selector	= {text : ''};
		if(infoObj) {
			 this.selector.text	= infoObj.config.text;
			}
		return this;
	}

	Pselector_TextPresentation.prototype.serialize	= function() {
		var json = PnodePresentation.prototype.serialize.apply(this, []);
		// Describe action here
		json.subType	= 'Pselector_TextPresentation';
		json.selector = this.selector;
		return json;
	}

	Pselector_TextPresentation.prototype.unserialize	= function(json, PresoUtils) {
		// Describe action here
		PnodePresentation.prototype.unserialize.apply(this, [json, PresoUtils]);
		this.selector = json.selector;
		if(this.html.spanVarId) {
			 this.html.spanVarId.innerHTML = '';
			 this.html.spanVarId.classList.add( this.selector.variableId );
			 this.html.spanVarId.appendChild( document.createTextNode(this.selector.name) );
			}
		return this;
	}

	Pselector_TextPresentation.prototype.updateType = function() {}

	Pselector_TextPresentation.prototype.Render	= function() {
		// var self = this;
		var root = PnodePresentation.prototype.Render.apply(this, []);
		root.classList.add('Pselector_TextPresentation');
		this.divDescription.setAttribute('', 'true');
		return root;
	}

	// Return the constructor
	module.exports = Pselector_TextPresentation;



/***/ },
/* 146 */
/***/ function(module, exports) {

	// var DragDrop	= require( '../../DragDrop.js' )
	  // , utils		= require( '../../utils.js' )
	  // ;
	  
	var css = document.createElement('link');
		css.setAttribute('rel' , 'stylesheet');
		css.setAttribute('href', 'js/Presentations/widgets/AlxTextEditor.css');
		
	// Defining the extended text editor
	function AlxTextEditor() {
		this.root = document.createElement('div');
		this.root.setAttribute('contenteditable', 'true');
		this.root.classList.add('AlxTextEditor');
		
		return this;
	}


	AlxTextEditor.prototype.Render = function() {
		if(this.root.parentNode) {this.root.parentNode.removeChild(this.root);}
		return this.root;
	}

	module.exports = AlxTextEditor;


/***/ },
/* 147 */
/***/ function(module, exports, __webpack_require__) {

	var ActionNodePresentation	= __webpack_require__( 70 )
	  , DragDrop				= __webpack_require__( 54 )
	  ;
	  
	// 
	var MR_Play_NodePresentation = function() {
		 ActionNodePresentation.apply(this, []);
		 return this;
		}

	MR_Play_NodePresentation.prototype = Object.create( ActionNodePresentation.prototype );
	MR_Play_NodePresentation.prototype.constructor = MR_Play_NodePresentation;

	MR_Play_NodePresentation.prototype.init		= function(PnodeID, parent, children) {
		 ActionNodePresentation.prototype.init.apply(this, [PnodeID, parent, children]);
		 this.action.method	= 'Play';
		 return this;
		}

	MR_Play_NodePresentation.prototype.serialize = function() {
		 // this.action.method	= 'Play';
		 var json = ActionNodePresentation.prototype.serialize.apply(this, []);
		 json.subType = 'MR_Play_NodePresentation';
		 return json;
		}
	MR_Play_NodePresentation.prototype.Render = function() {
		 // var self = this;
		 var root = ActionNodePresentation.prototype.Render.apply(this,[]);
		 this.html.actionName.innerHTML = "Play";
		 this.html.img_symbol.setAttribute('src', 'js/Presentations/UPnP/images/icon_PLAY.png');
		 this.html.actionName.innerHTML = "PLAY"
		 DragDrop.updateConfig(this.dropZoneSelectorId, {acceptedClasse: [['BrickUPnP_MediaRenderer']]});
		 return root;
		}

	module.exports = MR_Play_NodePresentation;



/***/ },
/* 148 */
/***/ function(module, exports, __webpack_require__) {

	var MR_Play_NodePresentation	= __webpack_require__( 147 )
	  // , utils						= require( '../../../utils.js' )
	  , MediaBrowser				= __webpack_require__( 139 )
	  ;

	var MB = new MediaBrowser( 'Select Media to be loaded' );

	var MR_load_NodePresentation = function() {
		 MR_Play_NodePresentation.apply(this, []);
		 return this;
		}

	MR_load_NodePresentation.prototype = Object.create( MR_Play_NodePresentation.prototype ); // new MR_Play_NodePresentation();
	MR_load_NodePresentation.prototype.constructor = MR_load_NodePresentation;

	MR_load_NodePresentation.prototype.init			= function(PnodeID, parent, children) {
		 var self = this;
		 MR_Play_NodePresentation.prototype.init.apply(this, [PnodeID, parent, children]);
		 this.action.method	= 'loadMedia';
		 this.forceRendering = false;
		 this.cbSelected = function(event) {
			 // console.log('MR_load_NodePresentation::cbSelected', self, event);
			 self.action.mediaServerId	= event.mediaServerId;
			 self.action.itemId			= event.itemId;
			 self.html.mediaBrowser.innerHTML = '';
			 self.html.mediaBrowser.appendChild( event.htmlMS );
			 self.action.params = [self.action.mediaServerId, self.action.itemId];
			}
		 return this;
		}

	MR_load_NodePresentation.prototype.unserialize = function(json, PresoUtils) {
		 var self = this;
		 MR_Play_NodePresentation.prototype.unserialize.apply(this, [json, PresoUtils]);
		 // this.action.method	= 'loadMedia';
		 if(this.action.params && this.action.params.length === 2) {
			 MB.getHtmlItemFrom	( this.action.params[0]
								, this.action.params[1]
								, function(htmlItem) {
									 if(self.html.mediaBrowser) {
										 self.html.mediaBrowser.innerHTML = '';
										 self.html.mediaBrowser.appendChild( htmlItem );
										}
									 self.html.htmlItem = htmlItem;
									 // console.log("MR_load_NodePresentation: now html item is available");
									 this.forceRendering = true;
									}
								);
			}
		 return this;
		}
	MR_load_NodePresentation.prototype.serialize = function() {
		 // this.action.method	= 'loadMedia';
		 var json = MR_Play_NodePresentation.prototype.serialize.apply(this, []);
		 json.ActionNode.mediaServerId	= this.action.mediaServerId;
		 json.ActionNode.itemId			= this.action.itemId;
		 json.subType = 'MR_load_NodePresentation';
		 return json;
		}

	MR_load_NodePresentation.prototype.primitivePlug	= function(c) {
		 if(c === MB) {
			 this.Render();
			 var P = this.root
				, N = c.Render();
			 if(N.parentElement === null) {
				 P.appendChild( N );
				}
			 return this;
			} else {return MR_Play_NodePresentation.prototype.primitivePlug.apply(this, [c]);}
		}

	MR_load_NodePresentation.prototype.Render = function() {
		 var self = this;
		 var root = MR_Play_NodePresentation.prototype.Render.apply(this,[]);
		 this.html.img_symbol.setAttribute('src', 'js/Presentations/UPnP/images/icon_LOAD.png');
		 this.html.actionName.innerHTML = "LOAD MEDIA"
		 // Create elements for selecting the media
		 if((typeof this.html.mediaBrowser === 'undefined') || this.forceRendering) {
			 // console.log( "MR_load_NodePresentation::Render" );
			 this.forceRendering = false;
			 if(this.html.mediaBrowser && this.html.mediaBrowser.parentNode) {
				 this.html.mediaBrowser.parentNode.removeChild( this.html.mediaBrowser );
				}
			 this.html.mediaBrowser = document.createElement('div');
			 this.html.mediaBrowser.classList.add('button');
			 this.html.mediaBrowser.classList.add('MediaBrowserFlow');
			 if(self.html.htmlItem) {
				 this.html.mediaBrowser.appendChild( self.html.htmlItem );
				} else {this.html.mediaBrowser.appendChild( document.createTextNode('Select Media') );}
			 this.html.mediaBrowser.addEventListener(
				  'click'
				, function() {self.appendChild( MB );
							  MB.on('selected', self.cbSelected);
							 }
				, true );
			 this.html.actionDescr.appendChild( this.html.mediaBrowser );
			} // else {console.log("MR_load_NodePresentation: no render");}
		 return root;
		}

	module.exports = MR_load_NodePresentation;



/***/ },
/* 149 */
/***/ function(module, exports, __webpack_require__) {

	var MR_Play_NodePresentation	= __webpack_require__( 147 )
	  // , utils						= require( '../../../utils.js' )
	  ;

	var MR_Pause_NodePresentation = function() {
		 MR_Play_NodePresentation.apply(this, []);
		 return this;
		}

	MR_Pause_NodePresentation.prototype = Object.create( MR_Play_NodePresentation.prototype ); // new MR_Play_NodePresentation();
	MR_Pause_NodePresentation.prototype.constructor = MR_Pause_NodePresentation;

	MR_Pause_NodePresentation.prototype.init		= function(PnodeID, parent, children) {
		 MR_Play_NodePresentation.prototype.init.apply(this, [PnodeID, parent, children]);
		 this.action.method	= 'Pause';
		 return this;
		}
		
	MR_Pause_NodePresentation.prototype.serialize	= function() {
		 var json = MR_Play_NodePresentation.prototype.serialize.apply(this, []);
		 json.subType = 'MR_Pause_NodePresentation';
		 console.log("MR_Pause_NodePresentation::serialize", json);
		 return json;
		}
		
	MR_Pause_NodePresentation.prototype.Render		= function() {
		 // var self = this;
		 var root = MR_Play_NodePresentation.prototype.Render.apply(this,[]);
		 this.html.img_symbol.setAttribute('src', 'js/Presentations/UPnP/images/icon_PAUSE.png');
		 this.html.actionName.innerHTML = "PAUSE"
		 return root;
		}

	module.exports = MR_Pause_NodePresentation;


/***/ },
/* 150 */
/***/ function(module, exports, __webpack_require__) {

	var MR_Play_NodePresentation	= __webpack_require__( 147 )
	  // , utils						= require( '../../../utils.js' )
	  ;
	  
		// 
	var MR_Stop_NodePresentation = function() {
		 MR_Play_NodePresentation.apply(this, []);
		 return this;
		}

	MR_Stop_NodePresentation.prototype = Object.create( MR_Play_NodePresentation.prototype ); // new MR_Play_NodePresentation();
	MR_Stop_NodePresentation.prototype.constructor = MR_Stop_NodePresentation;

	MR_Stop_NodePresentation.prototype.init		= function(PnodeID, parent, children) {
		 MR_Play_NodePresentation.prototype.init.apply(this, [PnodeID, parent, children]);
		 this.action.method	= 'Stop';
		 return this;
		}
	MR_Stop_NodePresentation.prototype.serialize = function() {
		 // this.action.method	= 'Stop';
		 var json = MR_Play_NodePresentation.prototype.serialize.apply(this, []);
		 json.subType = 'MR_Stop_NodePresentation';
		 return json;
		}
	MR_Stop_NodePresentation.prototype.Render = function() {
		 // var self = this;
		 var root = MR_Play_NodePresentation.prototype.Render.apply(this,[]);
		 this.html.img_symbol.setAttribute('src', 'js/Presentations/UPnP/images/icon_STOP.png');
		 this.html.actionName.innerHTML = "STOP"
		 return root;
		}

	module.exports = MR_Stop_NodePresentation;



/***/ },
/* 151 */
/***/ function(module, exports, __webpack_require__) {

	var PeventBrickPresentation	= __webpack_require__( 97 )
	  // , DragDrop				= require( '../DragDrop.js' )
	  // , utils					= require( '../utils.js' )
	  ;

	var PeventBrickPresentation_Hue = function() {
		PeventBrickPresentation.prototype.constructor.apply(this, []);
		return this;
	}

	PeventBrickPresentation_Hue.prototype = Object.create( PeventBrickPresentation.prototype ); // new PeventBrickPresentation();
	PeventBrickPresentation_Hue.prototype.constructor	= PeventBrickPresentation_Hue;
	PeventBrickPresentation_Hue.prototype.className		= 'PeventBrick';

	PeventBrickPresentation_Hue.prototype.Render	= function() {
		// var self = this;
		var root = PeventBrickPresentation.prototype.Render.apply(this, []);
		root.classList.add('PeventBrickPresentation_Hue');
		// Add possible events
		this.html.selectEvent.innerHTML = '';
		var events = [ {name : 'on'		, action : ''}
					 , {name : 'off'	, action : ''}
					 ];
		for(var i=0; i<events.length; i++) {
			 var event  = events[i];
			 var option = document.createElement('option');
			 option.setAttribute('value', i);
			 option.appendChild( document.createTextNode(event.name) );
			 this.html.selectEvent.appendChild( option );
			}
		this.html.selectEvent.onchange = function() {
			 // var i = parseInt(this.value);
			 // var event = events[i];
			 // XXX register event information to be serialized...
			}
		return root;
	}

	// Return the constructor
	module.exports = PeventBrickPresentation_Hue;



/***/ },
/* 152 */
/***/ function(module, exports, __webpack_require__) {

	var PnodePresentation	= __webpack_require__( 57 )
	  , utils				= __webpack_require__( 1 )
	  ;
	  
	// XXX Try direct loading
	// Retrieving htmlTemplate
	var htmlTemplate = '';
	utils.XHR( 'GET', 'js/Presentations/HTML_templates/PactionHTTP.html'
			 , function() {htmlTemplate = this.responseText;}
			 );

	var css = document.createElement('link');
		css.setAttribute('rel' , 'stylesheet');
		css.setAttribute('href', 'js/Presentations/HTML_templates/PactionHTTP.css');
		document.head.appendChild(css);

	// Defining PactionHTTP
	var PactionHTTP = function() {
		// console.log(this);
		PnodePresentation.apply(this, []);
		return this;
	}

	PactionHTTP.prototype = Object.create( PnodePresentation.prototype ); // new PnodePresentation();
	PactionHTTP.prototype.constructor	= PactionHTTP;
	PactionHTTP.prototype.className		= 'ActionNode';

	PactionHTTP.prototype.init = function(PnodeID, parent, children) {
		PnodePresentation.prototype.init.apply(this, [PnodeID, parent, children]);
		this.action			= { method		: 'httpRequest'
							  , params		: []
							  };
		return this;
	}
	PactionHTTP.prototype.serialize	= function() {
		var json = PnodePresentation.prototype.serialize.apply(this, []);
		// Encode body in case of application/x-www-form-urlencoded
		if(this.html.headers.value === 'application/x-www-form-urlencoded') {
			 var str = ''
			   , L   = this.html.contentKeyValue.querySelectorAll('.KeyValue')
			   , key, value;
			 for(var i=0; i<L.length; i++)  {
				 if(i !== 0) {str += '&';}
				 key	= L[i].querySelector('input.key').value;
				 value	= L[i].querySelector('.value'   ).value;
				 str += encodeURIComponent(key);
				 str += "=";
				 str += encodeURIComponent(value);
				}
			 this.html.body.value = str;
			}
		
		// Describe action here
		json.subType	= 'PactionHTTP';
		var headers = { 'Content-Type': this.html.headers.value};
		this.action.params = { url		: this.html.url.value
							 , method	: this.html.method.value
							 , headers	: headers
							 , body		: this.html.body.value
							 };
		json.ActionNode = { method		: 'httpRequestJSONstringified'
						  , params		: [this.action.params]
						  , targets		: ['webServer']
						  };
		console.log("PactionHTTP::serialize =>", json);
		return json;
	}
	PactionHTTP.prototype.unserialize	= function(json, PresoUtils) {
		// Describe action here
		PnodePresentation.prototype.unserialize.apply(this, [json, PresoUtils]);
		this.action.method		= 'httpRequest';
		this.action.params		= json.ActionNode.params[0];
		if(typeof this.html.method !== 'undefined') {
			 this.html.url.value		= this.action.params.url;
			 this.html.method.value		= this.action.params.method;
			 this.html.headers.value	= this.action.params.headers['Content-Type'];
			 this.html.body.value		= this.action.params.body;
			 this.html.headers.onchange();
			 if(this.html.headers.value === 'application/x-www-form-urlencoded') {
				 var params = utils.getUrlEncodedParameters(this.action.params.body)
				   , html_KeyValue;
				 for(var p in params) {
					 html_KeyValue = this.html.AddKeyValue.onclick();
					 html_KeyValue.querySelector('.key'  ).value = decodeURIComponent(p);
					 html_KeyValue.querySelector('.value').value = decodeURIComponent(params[p]);
					}
				}
			}
		return this;
	}

	PactionHTTP.prototype.Render	= function() {
		var self = this;
		var root = PnodePresentation.prototype.Render.apply(this, []);
		root.classList.add('ActionNode');
		root.classList.add('PactionHTTP');
		if(typeof this.html.method === 'undefined') {
			 this.divDescription.innerHTML = htmlTemplate;
			 this.html.divParams		= this.divDescription.querySelector('div.params'    );
			 this.html.url				= this.divDescription.querySelector('input.url'     );
			 this.html.method			= this.divDescription.querySelector('select.method' );
			 this.html.headers			= this.divDescription.querySelector('select.headers');
			 this.html.body				= this.divDescription.querySelector('textarea.body' );
			 this.html.listKeyValue		= this.divDescription.querySelector('.listKeyValue' );
			 this.html.protoKeyValue	= this.divDescription.querySelector('.listKeyValue > .prototype' );
			 this.html.contentKeyValue	= this.divDescription.querySelector('.listKeyValue > .content' );
			 this.html.AddKeyValue		= this.divDescription.querySelector('.listKeyValue input.ADD' );
			 
			 this.html.AddKeyValue.onclick = function() {
				 var html_KeyValue = self.html.protoKeyValue.cloneNode(true);
				 html_KeyValue.classList.remove('prototype');
				 self.html.contentKeyValue.appendChild( html_KeyValue );
				 html_KeyValue.querySelector('input.DEL').onclick = function() {
					 self.html.contentKeyValue.removeChild( html_KeyValue );
					}
				 return html_KeyValue;
				}
			 
			 this.html.headers.onchange = function() {
				 if(this.value === 'application/x-www-form-urlencoded') {
					 self.html.divParams.classList.add('keyValue');
					} else {self.html.divParams.classList.remove('keyValue');}
				}
			}
		return root;
	}

	// Return the constructor
	module.exports = PactionHTTP;



/***/ }
/******/ ]);