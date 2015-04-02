define	( [ './PnodePresentation.js'
		  , './SelectorNodePresentation.js'
		  ]
		, function( PnodePresentation
				  , SelectorNodePresentation
				  ) {

function basicBrickPresentation(infoObj) {
	SelectorNodePresentation.apply(this, [infoObj]);
	// this.selector.type.push( 'MediaRenderer' );
	if(infoObj) this.selector.objectId = infoObj.config.uuid;
}

basicBrickPresentation.prototype = new SelectorNodePresentation();
basicBrickPresentation.prototype.className = 'Pselector_ObjInstance';

basicBrickPresentation.prototype.Render = function() {
	var self = this;
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

return basicBrickPresentation;
});