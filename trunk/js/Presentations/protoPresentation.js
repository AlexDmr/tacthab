define( function() {
			 var uid = 0;
			 // Define the Presentation constructor
			 var Presentation = function() {
				 this.uid	= this.getUniqueId();
				 Presentation.prototype.init(null, []);
				}
			 Presentation.prototype.className = 'Presentation';
			 Presentation.prototype.constructor = Presentation;
			 Presentation.prototype.getUniqueId = function() {
				 uid++;
				 return 'PresoId_' + uid;
				}
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
			 Presentation.prototype.appendChild = function(c) {
				 if(this.children.indexOf(c) == -1) {
					 this.children.push(c);
					 this.primitivePlug(c);
					 c.setParent(this);
					}
				}
			 Presentation.prototype.removeChild = function(c) {
				 var pos = this.children.indexOf(c)
				 if(pos !== -1) {
					 this.children.splice(pos,1);
					 this.primitiveUnPlug(c);
					 c.setParent(null);
					}
				}
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
			 Presentation.prototype.deletePrimitives = function() {
				 // console.log("Presentation::deletePrimitives", this);
				 if(this.root && (this.root.parentElement || this.root.parentNode)) {
					 (this.root.parentElement || this.root.parentNode).removeChild(this.root);
					 this.root = null;
					}
				 return this;
				}
			 Presentation.prototype.forceRender		= function() {
				 var primitiveParent;
				 if(this.root) {primitiveParent = this.root.parentNode;
								this.deletePrimitives();
							   } else {primitiveParent = null;}
				 var root = this.Render();
				 if(primitiveParent) {primitiveParent.appendChild(root);}
				}
			 Presentation.prototype.primitivePlug	= function(c) {
				 // console.log("Primitive plug ", this.root, " ->", c.root);
				 var P = this.Render(),
				     N = c.Render();
				 if(N.parentElement === null) {P.appendChild(N);}
				}
			 Presentation.prototype.primitiveUnPlug	= function(c) {
				 if(c.root && c.root.parentElement) {c.root.parentElement.removeChild(c.root);}
				 if(c.root && c.root.parentNode   ) {c.root.parentNode.removeChild(c.root);}
				}
			 Presentation.prototype.setName			= function(name) {}
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
			 return Presentation;
			}
	  );