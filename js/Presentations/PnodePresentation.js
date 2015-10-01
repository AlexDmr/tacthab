/** 
 * Module defining the presentation node PnodePresentation related to program node.
 * @module PnodePresentation_module
 * @see module:protoPresentation
 */
var protoPresentation	= require( './protoPresentation.js' )
  // , DragDrop			= require( '../DragDrop.js' )
  , domReady			= require( '../domReady.js' )
  ;
var L_Pnodes = {};

require( "./HTML_templates/PnodePresentation.css" );

/**
 * The server side identifier of a presentation node.
 *@typedef {string} PnodeID
*/

/**
 * A PnodePresentation_serialization is a json structure representing the state of a {@link PnodePresentation}
 *@typedef {object} PnodePresentation_serialization
 *@property {string} className name of the represented object's class.
 *@property {PnodeID} PnodeID identifyer of the represented object.
 *@property {PnodePresentation_serialization[]} children Array of children's seriaizations.
*/

/**
 * Represents PnodePresentation a program node in the scene graph.
 * Actual HTML bodes are generated via Render method.
 * @class
 * @constructor
 * @alias module:PnodePresentation_module
 * @augments protoPresentation
 */
var PnodePresentation = function() {
	// console.log(this);
	protoPresentation.prototype.constructor.apply(this, []);
	return this;
}

PnodePresentation.prototype = Object.create( protoPresentation.prototype ); // new protoPresentation();
PnodePresentation.prototype.constructor	= PnodePresentation;
PnodePresentation.prototype.className	= 'PnodePresentation';

/**
 * Initialization method: link the presentation with the corresponding program node identified on the server by PnodeID.
 * @param {string} PnodeID that identify the corresponding program node on the server.
 * @param {PnodePresentation} parent parent {@link PnodePresentation}, can be unspecified.
 * @param {PnodePresentation[]} children children array {@link PnodePresentation}, can be unspecified.
 */
PnodePresentation.prototype.init = function(PnodeID, parent, children) {
	var self = this;
	protoPresentation.prototype.init.apply(this, [parent, children]);
	this.PnodeID = PnodeID;
	if(this.PnodeID) {L_Pnodes[this.PnodeID] = this;}
	this.state	= null;
	this.html	= {};
	this.contextualMenuItems = [{content: 'delete', cb: function() {self.dispose();}}];
	return this;
}

/**
 * Retrieve the node identfied by id.
 * @param {string} id that identify the presentation node (WARNING: id is not the same than PnodeId).
 */
PnodePresentation.prototype.getPnode = function(id) {
	return L_Pnodes[id];
}

/**
 * Serialize the node in a json structure.
 * @returns {PnodePresentation_serialization} {@link PnodePresentation_serialization} of the presentation node and its children.
 */
PnodePresentation.prototype.serialize	= function() {
	// JSON format
	var json = { className	: this.className
			   , PnodeID	: this.PnodeID
			   , children	: []
			   }
	for(var i=0; i<this.children.length; i++) {
		 json.children.push( this.children[i].serialize() );
		}
	return json;
}

/**
 * Unserialize the state from a json object.
 * @param {PnodePresentation_serialization} json
 * @returns {PnodePresentation_serialization} {@link PnodePresentation_serialization} of the presentation node and its children.
 */
PnodePresentation.prototype.unserialize	= function(json, PresoUtils) {
	this.PnodeID = json.PnodeID;
	if(this.PnodeID) {L_Pnodes[this.PnodeID] = this;}
	this.Render();
	for(var i in json.children) {
		 this.appendChild( PresoUtils.unserialize(json.children[i]), PresoUtils );
		}
	return this;
}

/**
 * Update the state of the {@link PnodePresentation}. This is done by changing the classList attribute of the HTML root node.
 * @param {number} prev Previous state (0 or 1).
 * @param {number} next New state (1 or 0).
 */
PnodePresentation.prototype.setState	= function(prev, next) {
	if(this.root) {
		 this.state = next;
		 this.root.classList.remove(prev);
		 this.root.classList.add   (next);
		}
	return this;
}

/**
 * Display the contextual menu
*/
var root = document.createElement('div');
domReady( function() {
	root.classList.add('contextualMenu');
	document.body.appendChild(root);
	document.addEventListener( 'click' 
							 , function() {
								  root.classList.remove("display");
								 }
							 , true
							 );
});
						 
PnodePresentation.prototype.displayContextMenu	= function(x, y) {
	var i, htmlItem, item;
	root.innerHTML = "";
	root.classList.add( 'display' );
	for(i=0; i<this.contextualMenuItems.length; i++) {
		 item				= this.contextualMenuItems[i];
		 htmlItem			= document.createElement('div');
		 htmlItem.innerHTML = item.content;
		 htmlItem.onclick	= item.cb.bind(this);
		 htmlItem.classList.add( 'contextualItem' );
		 root.appendChild( htmlItem );
		}
	root.style.top	= y + 'px';
	root.style.left	= x + 'px';
	if(root.parentNode) {} else {document.body.appendChild(root);}
	return this;
}

/**
 * Render the HTML structure of the {@link PnodePresentation}. If the structure already exists, it is not created again.
 * The HTML structure can be deleted via the use of {@link deletePrimitives} method.
 * Overload {@link module:protoPresentation.Presentation#Render}
 * @returns {object} HTML root node representing {@link PnodePresentation}.
 */
PnodePresentation.prototype.Render		= function() {
	var self = this;
	var root = protoPresentation.prototype.Render.apply(this, []);
	root.classList.add('Pnode');
	// React on right click
	root.addEventListener	( 'contextmenu'
							, function(e) {
								 //if(e.button === 2) {
									 self.displayContextMenu(e.pageX, e.pageY);
									 e.preventDefault();
									 e.stopPropagation();
									 return false;
									}
								//}
							, false
							);
	// React on state
	if(this.state) {root.classList.add(this.state);}
	if(!this.divDescription) {
		 // root.appendChild( document.createTextNode(this.PnodeID + ' : ') );
		 this.divDescription = document.createElement('div');
			root.appendChild( this.divDescription );
			this.divDescription.classList.add('description');
		}
	return root;
}

/**
 * Delete the HTML structure of the {@link PnodePresentation} if it exists.
 */
PnodePresentation.prototype.deletePrimitives = function() {
	protoPresentation.prototype.deletePrimitives.apply(this, []);
	if(this.divDescription) {
		 if(this.divDescription.parentNode) {this.divDescription.parentNode.removeChild( this.divDescription );}
		 delete this.divDescription;
		 this.divDescription = null;
		}
	return this;
}

// Return the constructor
module.exports = PnodePresentation;

