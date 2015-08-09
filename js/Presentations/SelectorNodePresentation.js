var PnodePresentation = require( './PnodePresentation.js' );

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
