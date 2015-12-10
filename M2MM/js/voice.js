require("./voice.css");

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

