require( "./multitouch.css" );
var voice = require( "./voice.js" );

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
