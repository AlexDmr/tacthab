var PnodePresentation	= require( './PnodePresentation.js' )
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

