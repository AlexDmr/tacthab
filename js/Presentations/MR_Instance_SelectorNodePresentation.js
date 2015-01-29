define	( [ './PnodePresentation.js'
		  , './SelectorNodePresentation.js'
		  ]
		, function(PnodePresentation, SelectorNodePresentation) {

function MR_Instance_SelectorNodePresentation(infoObj) {
	SelectorNodePresentation.apply(this, [infoObj]);
	this.selector.type.push( 'MediaRenderer' );
	if(infoObj) {
		 this.selector.objectId = infoObj.config.MR.id;
		}
}

MR_Instance_SelectorNodePresentation.prototype = new SelectorNodePresentation();
MR_Instance_SelectorNodePresentation.prototype.className = 'Pselector_ObjInstance';

MR_Instance_SelectorNodePresentation.prototype.Render = function() {
	var root = SelectorNodePresentation.prototype.Render.apply(this, []);
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

return MR_Instance_SelectorNodePresentation;
});