var PnodePresentation	= require( './PnodePresentation.js' )
  , utils				= require( '../utils.js' )
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

