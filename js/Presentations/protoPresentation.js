/** 
 * Module defining the generic presentation node of scene graph..
 * @module protoPresentation
 */
var uid = 0;
			 // Define the Presentation constructor
/**
 * Represents PnodePresentation a program node in the scene graph.
 * Actual HTML bodes are generated via Render method.
 * @class
 * @constructor
 * @alias module:protoPresentation
 */
var Presentation = function() {
	this.uid	= this.getUniqueId();
	Presentation.prototype.init.apply(this, [null, []]);
	// this.init(null, []);
	return  
}

Presentation.prototype = Object.create( {} );
Presentation.prototype.className = 'Presentation';
Presentation.prototype.constructor = Presentation;
Presentation.prototype.getUniqueId = function() {
	uid++;
	return 'PresoId_' + uid;
}

Presentation.prototype.dispose	= function() {
	if(this.parent) {this.parent.removeChild(this);}
	while(this.children.length) {
		 this.removeChild( this.children[0] );
		}
	return this;
}

/**
 * Initialization method: Plug the node to parent and children.
 * @param {Presentation} parent parent {@link Presentation}, can be unspecified.
 * @param {Presentation[]} children children array {@link Presentation}, can be unspecified.
 */
 Presentation.prototype.init = function(parent, children) {
	 this.root			= this.root || null;
	 if(this.children) {
		 for(var i=0; i<this.children.length; i++) {
			 this.removeChild(this.children[i]);
			}
		}
	 this.children 		= children  || [];
	 this.setParent( parent );
	 return this;
	}
 // Definition of the Presentation class
 Presentation.prototype.setParent = function(p) {
	 if(this.parent === p) {return;}
	 if(this.parent) {
		var parent = this.parent;
		this.parent = null;
		parent.removeChild(this);}
	 this.parent = p;
	 if(p) {
		 if(typeof p.appendChild === "undefined") {
			 console.error("Problem for parent", p);
			}
		 p.appendChild(this);
		}
	}
/**
 * Append a {@link Presentation} child.
 * @param {Presentation} c {@link Presentation} to append.
 */
 Presentation.prototype.appendChild = function(c) {
	 if(this.children.indexOf(c) === -1) {
		 this.children.push(c);
		 this.primitivePlug(c);
		 c.setParent(this);
		}
	}
/**
 * Copy children of source to dest
 */
 Presentation.prototype.copyHTML = function(node_source, node_dest) {
	 node_dest.innerHTML = "";
	 for(var i=0; i<node_source.children.length; i++) {
		 node_dest.appendChild( node_source.children[i].cloneNode(true) );
		}
	}
/**
 * Remove a {@link Presentation} child.
 * @param {Presentation} c {@link Presentation} to remove.
 */
Presentation.prototype.removeChild = function(c) {
	 var pos = this.children.indexOf(c)
	 if(pos !== -1) {
		 this.primitiveUnPlug(c);
		 this.children.splice(pos,1);
		 c.setParent(null);
		}
	}
	
/**
 * Render the HTML structure of the {@link Presentation}. If the structure already exists, it is not created again.
 * The HTML structure can be deleted via the use of {@link deletePrimitives} method.
 * @returns {object} HTML root node representing {@link Presentation}.
 */
			 Presentation.prototype.Render			= function() {
				 if(!this.root) {
					 this.root = document.createElement('div');
					 this.root.classList.add('protoPresentation');
					 this.root.setAttribute('id', this.uid);
					 for(var i=0;i<this.children.length;i++) {
						 this.primitivePlug(this.children[i]);
						}
					}
				 return this.root;
				}
/**
 * Delete the HTML structure of the {@link PnodePresentation} if it exists.
 */
			 Presentation.prototype.deletePrimitives = function() {
				 // console.log("Presentation::deletePrimitives", this);
				 if(this.root && (this.root.parentElement || this.root.parentNode)) {
					 (this.root.parentElement || this.root.parentNode).removeChild(this.root);
					 this.root = null;
					}
				 return this;
				}
/**
 * Force the rendering, delete primitives, render new ones and plug.
 */
			 Presentation.prototype.forceRender		= function() {
				 var primitiveParent;
				 if(this.root) {primitiveParent = this.root.parentNode;
								this.deletePrimitives();
							   } else {primitiveParent = null;}
				 var root = this.Render();
				 if(primitiveParent) {primitiveParent.appendChild(root);}
				 return root;
				}
/**
 * Plug the HTML root node of c under a HTML node used in the rendering.
 * Render method is called for both the node and c.
 * primitivePlug is called by {@link appendChild}.
 * @param {Presentation} c {@link Presentation} that will be rendered, its root will be plug under an HTML node rendered for this Presentation.
 */
			 Presentation.prototype.primitivePlug	= function(c) {
				 // console.log("Primitive plug ", this.root, " ->", c.root);
				 var P = this.Render(),
				     N = c.Render();
				 if(N.parentElement === null) {P.appendChild(N);}
				}
/**
 * Unplug the HTML root node of c that should have for parent a HTML node of the Presentation.
 * primitiveUnPlug is called by {@link removeChild}.
 * @param {Presentation} c {@link Presentation} which root has for parent a HTML node rendered by this Presentation.
 */
 Presentation.prototype.primitiveUnPlug	= function(c) {
	 if(c.root && c.root.parentNode   ) {c.root.parentNode.removeChild(c.root);}
	 if(c.root && c.root.parentElement) {c.root.parentElement.removeChild(c.root);}
	 return this;
	}
 Presentation.prototype.setName			= function(name) {}
/**
 * List all the descendants Presentation nodes.
 * @returns {Presentation[]} Array of all {@link Presentation} that have this node for ancestor.
 */
 Presentation.prototype.getDescendants	= function() {
	 var L = [this], L_rep = [], n;
	 while(L.length) {
		 n = L[0];
		 L_rep.push( L.splice(0,1)[0] );
		 for(var i=0; i<n.children.length; i++) {L.push( n.children[i] );}
		}
	 return L_rep;
	}

 // Return the reference to the Presentation constructor
module.exports = Presentation;
