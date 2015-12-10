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

	__webpack_require__( 1 );
	var domReady	= __webpack_require__( 2 )
	  , accelero	= __webpack_require__( 7 )
	  , multitouch	= __webpack_require__( 10 )
	  , voice		= __webpack_require__( 13 )
	  ;
		
	__webpack_require__( 16);

	domReady( function() {
		accelero  .init( ".accelerometer" );
		multitouch.init( ".multitouch"    );
		voice	  .init( ".vocal"         );
	});

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	var domReady	= __webpack_require__(2);

	// console.log('tabs.js');
	__webpack_require__( 3 );


	function whichTransitionEvent(){
	    var t;
	    var el = document.createElement('fakeelement');
	    var transitions = {
	      'transition'		: 'transitionend',
	      'OTransition'		: 'oTransitionEnd',
	      'MozTransition'	: 'transitionend',
	      'WebkitTransition': 'webkitTransitionEnd'
	    }

	    for(t in transitions){
	        if( el.style[t] !== undefined ){
	            return transitions[t];
	        }
	    }
	}
	var transitionEvent = whichTransitionEvent();
	function kebloEvent(e) {e.stopPropagation();}

	function tabs(node) {
		this.node = node;
		this.last_active = null;
		var L_tabMenus = node.querySelectorAll( '.tabMenu *[data-target]' ), menu, content;
		for(var i=0; i<L_tabMenus.length; i++) {
			 menu = L_tabMenus.item(i);
			 content = this.node.querySelector( '.tabContent[data-tab='+menu.dataset.target+']' );
			 content.classList.add('hidden');
			 this.processMenu(menu);
			}
	}

	tabs.prototype.HideShow = function(menuHide, menuShow) {
		// Hide
		var contentHide, self = this;
		if(menuHide) {
			 menuHide.classList.remove('display');
			 contentHide = this.node.querySelector( '.tabContent[data-tab='+menuHide.dataset.target+']' );
			 contentHide.classList.remove('display');
			}
		// Show
		menuShow.classList.add('display');
		var contentShow = this.node.querySelector( '.tabContent[data-tab='+menuShow.dataset.target+']' );
		// callback
		if(transitionEvent) {
			 var cb = function() {contentShow.classList.add('display');}
			 if(contentHide) {
				 var transitionCb;
				 this.node.addEventListener('click', kebloEvent, true);
				 contentHide.addEventListener( transitionEvent
											 , transitionCb = function() {
												 if(menuHide) {contentHide.classList.add   ('hidden' );}
												 contentShow.classList.remove('hidden' );
												 contentShow.classList.add('appearing');
												 // window.requestAnimationFrame( function() {cb(); self.node.removeEventListener('click', kebloEvent, true);});
												 setTimeout	( function() {window.requestAnimationFrame(cb);
																		  self.node.removeEventListener	 ('click', kebloEvent, true);
																		  contentHide.removeEventListener(transitionEvent, transitionCb, false);
																		  contentShow.classList.remove('appearing');
																		 }
															, 0);
												}
											 , false);
				}
			 else {contentShow.classList.remove('hidden' );
				   contentShow.classList.add   ('display');
				  }
			} else {if(menuHide) {contentHide.classList.add   ('hidden' );}
					contentShow.classList.remove('hidden' );
				    contentShow.classList.add   ('display');
				   }
	}

	tabs.prototype.processMenu = function(menu) {
		var self = this;
		menu.onclick = function() {
			 self.HideShow(self.last_active, menu);
			 self.last_active = menu;
			}
		// self.last_active.classList.add('hidden');
		if(!self.last_active) {
			 menu.onclick();
			 this.node.querySelector( '.tabContent[data-tab='+menu.dataset.target+']' ).classList.remove('hidden');
			}
	}

	domReady( function() {
		// console.log("domReady for tabs");
		var allTabs = document.querySelectorAll('.tabs'), tab;
		for(var i=0; i<allTabs.length; i++) {
			 tab = allTabs.item(i);
			 new tabs(tab);
			}
		} );
		
	module.exports = tabs;



/***/ },
/* 2 */
/***/ function(module, exports) {

	/**
	 * @license RequireJS domReady 2.0.1 Copyright (c) 2010-2012, The Dojo Foundation All Rights Reserved.
	 * Available via the MIT or new BSD license.
	 * see: http://github.com/requirejs/domReady for details
	 */
	/*jslint */
	/*global require: false, define: false, requirejs: false,
	  window: false, clearInterval: false, document: false,
	  self: false, setInterval: false */


	// define(function () {
	    // 'use strict';

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
		module.exports = domReady;
	    // return domReady;
	// });


/***/ },
/* 3 */
/***/ function(module, exports) {

	// removed by extract-text-webpack-plugin

/***/ },
/* 4 */,
/* 5 */,
/* 6 */,
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__( 8 );

	var t = 0;

	module.exports = {
		init	: function(selector) {
			 var root		= document.querySelector( selector )
			   , svg		= root.querySelector( "svg" )
			   // , svgGroup	= root.querySelector( "g.root" )
			   , svg_alpha	= root.querySelector( "polyline.alpha" )
			   , svg_beta	= root.querySelector( "polyline.beta" )
			   , svg_gamma	= root.querySelector( "polyline.gamma" )
			   , device		= root.querySelector( ".device" )
			   ;
			 function handleOrientation(e) {
				 // console.log("orientation:", svg_alpha.points.length);
				 var P;
				 P = svg.createSVGPoint(); P.x=t; P.y=(360+e.alpha)%360; svg_alpha.points.appendItem(P);
				 P = svg.createSVGPoint(); P.x=t; P.y=(180+e.beta )%360; svg_beta.points.appendItem (P);
				 P = svg.createSVGPoint(); P.x=t; P.y=(90 +e.gamma)%360; svg_gamma.points.appendItem(P);
				 t++;
				 
			 var nb = parseInt( window.getComputedStyle(svg).width );
			 if(svg_alpha.points.length >= nb) {
				 svg_alpha.points.removeItem(0);
				 svg_beta .points.removeItem(0);
				 svg_gamma.points.removeItem(0);
				 svg_alpha.style.transform = "translate(" +(-t+nb) + "px)";
				 svg_beta .style.transform = "translate(" +(-t+nb) + "px)";
				 svg_gamma.style.transform = "translate(" +(-t+nb) + "px)";
				}

			 device.style.transform =	""
									+	"rotateX(" + e.alpha + "deg) "
									+	"rotateZ(" + (180 + e.beta ) + "deg) "
									+	"rotateY(" + (0   + e.gamma) + "deg) "
									;
		}

			 window.addEventListener("deviceorientation", handleOrientation, true);
			 // window.addEventListener("devicemotion"     , handleAcceleration, true);
			}
	};

/***/ },
/* 8 */
/***/ function(module, exports) {

	// removed by extract-text-webpack-plugin

/***/ },
/* 9 */,
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__( 11 );
	var voice = __webpack_require__( 13 );

	var voixFr = speechSynthesis.getVoices().filter(function(voice) { return voice.URI === 'Google Français'; })[0];


	var root;
	var states	= {};
	var mode	= "rectangle", color="white";
	var Color	= { rouge	: "red"
				  , bleu	: "blue"
				  , vert	: "green"
				  , verre	: "green"
				  , vers	: "green"
				  , jaune	: "yellow"
				  , orange	: "orange"
				  , violet	: "violet"
				  , cyan	: "cyan"
				  , magenta	: "magenta"
				  };

	function setMode(m) {
		var msg = new SpeechSynthesisUtterance( m );
		msg.voice	= voixFr;
		msg.lang	= "fr-FR"
		speechSynthesis.speak(msg);
		
		mode = m;
		var L = document.querySelectorAll( ".geometric.selected" )
		  , node;
		for(var i=0; i<L.length; i++) {
			 node = L.item(i);
			 node.classList.remove( 'ovale' );
			 node.classList.remove( 'arrondi' );
			 node.classList.remove( 'rectangle' );
			 node.classList.add( m );
			}
	}

	function setColor(c) {
		if(typeof Color[c] === "undefined") {return;}
		color = Color[c];

		var msg = new SpeechSynthesisUtterance( c );
		msg.voice	= voixFr;
		msg.lang	= "fr-FR"
		speechSynthesis.speak(msg);

		var L = document.querySelectorAll( ".geometric.selected" )
		  , node;
		for(var i=0; i<L.length; i++) {
			 node = L.item(i);
			 node.style.backgroundColor = color;
			}
	}

	voice.on("rectangle", function() {setMode('rectangle');})
	voice.on("ovale"    , function() {setMode('ovale'    );})
	voice.on("arrondi"  , function() {setMode('arrondi'  );})

	voice.on("*", function(w) {setColor(w);});





	function select() {
		this.d.classList.toggle("selected");
	}


	function update_position(x, y) {
		this.x				+= x - this.dragX;
		this.y				+= y - this.dragY;
		this.dragX			= x;
		this.dragY			= y;
		this.d.style.left	= this.x + 'px';
		this.d.style.top	= this.y + 'px';
	}

	function update_size(x, y) {
		this.w				= x - this.x;
		this.h				= y - this.y;
		this.d.style.width	= this.w + 'px';
		this.d.style.height	= this.h + 'px';
	}

	function start(e) {
		// console.log(e);
		var div = document.createElement("div");
		div.classList.add( "geometric" );
		div.classList.add( mode );
		var touch = e.changedTouches.item(0);
		var state = { x	: touch.pageX - root.offsetLeft  
					, y : touch.pageY - root.offsetTop  
					, w	: 0
					, h	: 0
					, c	: color.slice()
					, d : div
					, cb: update_size
					};
		div.dataset.state = state;
		div.addEventListener	( 'touchstart'
								, function(e) {
									 e.preventDefault();
									 e.stopPropagation();
									 var touch		= e.changedTouches.item(0);
									 state.dragX	= touch.pageX - root.offsetLeft;
									 state.dragY	= touch.pageY - root.offsetTop ;
									 states[touch.identifier] = state;
									 state.cb = update_position;
									 select.call(state);
									}
								, false
								);
		
		states[e.changedTouches[0].identifier] = state
		div.style.top	= state.y + 'px';
		div.style.left	= state.x + 'px';
		div.style.width	= state.w + 'px';
		div.style.height= state.h + 'px';
		div.style.backgroundColor	= color;
		root.appendChild( div );
	}

	function move(e) {
		e.preventDefault();
		e.stopPropagation();
		var i, touch, id;
		// console.log("move", e);
		for(i=0; i<e.changedTouches.length; i++) {
			 touch	= e.changedTouches.item(i);
			 id		= touch.identifier;
			 // console.log("\t", id);
			 if(states[id]) {
				 states[id].cb.call	( states[id]
									, touch.pageX - root.offsetLeft
									, touch.pageY - root.offsetTop
									);
				}
			}
	}

	function init(selector) {
		root	= document.querySelector( selector );
		root.addEventListener('touchstart', start, false);
		root.addEventListener('touchmove' , move , false);
		// root.addEventListener('touchmove' , move , false);
	}

	module.exports = {init: init};


/***/ },
/* 11 */
/***/ function(module, exports) {

	// removed by extract-text-webpack-plugin

/***/ },
/* 12 */,
/* 13 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(14);

	var CBs = {"*": []};
	var root, finalElement, intermediateElement
	  , str;
	var recognition = new webkitSpeechRecognition();

	recognition.continuous		= true;
	recognition.interimResults	= true;
	recognition.lang			= 'fr-FR';


	recognition.onstart		= function() {
		console.log("recognition start");
		str	= "";
	}

	recognition.onresult	= function(event) {
		intermediateElement.textContent = "";
		console.log("result:", event);
		for (var i = event.resultIndex; i < event.results.length; ++i) {
			 if (event.results[i].isFinal) {
				 str += event.results[i][0].transcript;
				} else	{intermediateElement.textContent += event.results[i][0].transcript;
						}
			}
		if(str) {
			 var L = str.split(" "), cbs, cb, w;
			 for(i=0; i<L.length; i++) {
				 w = L[i].toLowerCase();
				 cbs = (CBs[w] || []).concat( CBs['*'] );
				 for(cb in cbs) {cbs[cb](w);}
				 
				}
			 var p = document.createElement("p");
			 p.textContent = str;
			 str = "";
			 if(finalElement.children.length) {
				 finalElement.insertBefore(p, finalElement.children[0]);
				} else {finalElement.appendChild(p);}
			}
	}

	recognition.onerror		= function(event) {
		console.log("recognition error", event);
	}

	recognition.onend		= function() {
		console.log("recognition end");
	}


	function init(selector) {
		root				= document.querySelector( selector );
		intermediateElement	= root.querySelector(".intermediate");
		finalElement		= root.querySelector("div.final");
		recognition.start();
	}

	module.exports = { init: init
					 , on	: function(word, cb) {
								 CBs[word] = CBs[word] || [];
								 CBs[word].push(cb);
								}
					 };



/***/ },
/* 14 */
/***/ function(module, exports) {

	// removed by extract-text-webpack-plugin

/***/ },
/* 15 */,
/* 16 */
/***/ function(module, exports) {

	// removed by extract-text-webpack-plugin

/***/ }
/******/ ]);