var /*PnodePresentation			= require( './PnodePresentation.js' )
  , */SelectorNodePresentation	= require( './SelectorNodePresentation.js' )
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
