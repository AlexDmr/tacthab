/** 
 * Module defining the presentation node PnodePresentation related to program node.
 * @module PnodePresentation_module
 * @see module:protoPresentation
 */
 define	( [ './protoPresentation.js'
		  , '../DragDrop.js'
		  ]
		, function(protoPresentation, DragDrop) {
var L_Pnodes = {};

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
	this.state	= null;
	this.html	= {};
	return this;
}

PnodePresentation.prototype = new protoPresentation();
PnodePresentation.prototype.className = 'PnodePresentation';

/**
 * Initialization method: link the presentation with the corresponding program node identified on the server by PnodeID.
 * @param {string} PnodeID that identify the corresponding program node on the server.
 * @param {PnodePresentation} parent parent {@link PnodePresentation}, can be unspecified.
 * @param {PnodePresentation[]} children children array {@link PnodePresentation}, can be unspecified.
 */
PnodePresentation.prototype.init = function(PnodeID, parent, children) {
	protoPresentation.prototype.init.apply(this, [parent, children]);
	this.PnodeID = PnodeID;
	if(this.PnodeID) L_Pnodes[this.PnodeID] = this;
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
	if(this.PnodeID) L_Pnodes[this.PnodeID] = this;
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
 * Render the HTML structure of the {@link PnodePresentation}. If the structure already exists, it is not created again.
 * The HTML structure can be deleted via the use of {@link deletePrimitives} method.
 * Overload {@link module:protoPresentation.Presentation#Render}
 * @returns {object} HTML root node representing {@link PnodePresentation}.
 */
PnodePresentation.prototype.Render		= function() {
	var self = this;
	var root = protoPresentation.prototype.Render.apply(this, []);
	root.classList.add('Pnode');
	if(this.state) {root.classList.add(this.state);}
	if(!this.divDescription) {
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
return PnodePresentation;
});
