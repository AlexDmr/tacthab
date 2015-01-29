var last_result = null;
define	( [ './js/utils.js'
		  , './js/domReady.js'
		  ]
		, function(utils, domReady) {

var parser = new DOMParser();
var result = {};

function startExtraction(url) {
	result = {};
	ExtractFromSection( url
					  , function() {
							 console.log("Result:", result);
							 last_result = result;
							}
					  );
}

function ExtractFromSection(url, next) {
	var server = url.slice(0, url.indexOf('/', 7));
	utils.XHR( 'POST', './proxy'
			 , { onload : function() {
					 var doc = parser.parseFromString(this.responseText, "text/html");
					 var L = doc.querySelectorAll('ul.topiclist.topics a.topictitle');
					 if(typeof result.sectionTitle === "undefined") {
						 result.sectionTitle = doc.querySelector("#page-body h2").innerText;
						}
					 if(typeof result.L_topics_JSON === "undefined") {
						 result.L_topics_JSON = [];
						}
					 ExtractFromSectionDoc(doc, server, L, 0, result.L_topics_JSON, next);
					}
			   , variables : {url: url}
			   }
			 );
}

function ExtractFromSectionDoc(doc, server, L_topics, i, L_topics_JSON, next) {
	// console.log("ExtractFromSectionDoc", next);
	var url = server + '/' + L_topics.item(i).getAttribute('href');
	var result = { topic : L_topics.item(i).innerText
				 , posts : []
				 };
	console.log(result.topic);
	L_topics_JSON.push( result );
	ExtractFromTopic( url, server, result
					, function() {
						 if(++i < L_topics.length) {
							 ExtractFromSectionDoc(doc, server, L_topics, i, L_topics_JSON, next);
							} else {var right = doc.querySelector('a.right-box.right');
									if(right) {
										 var nextURL = server + '/' + right.getAttribute('href');
										 // console.log("\tnext page for section!");
										 ExtractFromSection(nextURL, next);
										} else {console.log("End of section");
												if(next) {next();} else {console.log("L_topics_JSON:", L_topics_JSON);}
											   }
								   }
						}
					);
}

function ExtractFromTopic(url, server, result, next) {
	// console.log("ExtractFromTopic", url);
	utils.XHR( 'POST', './proxy'
			 , { onload : function() {
					 var doc = parser.parseFromString(this.responseText, "text/html");
					 var L = doc.querySelectorAll('div.post div.postbody div.content');
					 console.log("\t", L.length, "posts for", url);
					 for(var i=0; i<L.length; i++) {
						 result.posts.push( L.item(i).innerText );
						}
					 var right = doc.querySelector('a.right-box.right');
					 if(right) {
						 var nextURL = server + '/' + right.getAttribute('href');
						 // console.log("\tnext page for topic!");
						 ExtractFromTopic(nextURL, server, result, next);
						} else {
								next();
							   }
					}
			   , variables : {url: url}
			   }
			 );
}

domReady( function() {
	 document.getElementById("process").onclick = function() {
		 startExtraction( document.getElementById("URL").value );
		}
	}
);

return startExtraction;
}); // FIN