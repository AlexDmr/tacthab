var PnodePresentation	= require( './PnodePresentation.js' )
  , DragDrop			= require( '../DragDrop.js' )
  , str_template		= require( './HTML_templates/PnodeNChildPresentation.html' )
  , htmlTemplate		= document.createElement("div")
  , htmlSeparator		= document.createElement("div")
  , htmlSeparatorSuffix	= document.createElement("div")
  ;

htmlTemplate.innerHTML	= str_template;
htmlSeparator.classList.add("separator");
htmlSeparator.innerHTML	= '<div class="top"></div><div class="middle"></div><div class="bottom"></div>';

htmlSeparatorSuffix = htmlSeparator.cloneNode(true);
htmlSeparatorSuffix.classList.add("suffix");
htmlSeparatorSuffix.querySelector(".middle").innerHTML = '<div class="left"></div><div class="right"></div>';


// var css = document.createElement('link');
	// css.setAttribute('rel' , 'stylesheet');
	// css.setAttribute('href', 'js/Presentations/HTML_templates/PnodeNChildPresentation.css');
	// document.head.appendChild( css );

require( "./HTML_templates/PnodeNChildPresentation.css" );

var PnodeNChildPresentation = function() {
	// console.log(this);
	PnodePresentation.apply(this, []);
	return this;
}

PnodeNChildPresentation.prototype = Object.create( PnodePresentation.prototype );
PnodeNChildPresentation.prototype.constructor	= PnodeNChildPresentation;
PnodeNChildPresentation.prototype.className		= 'PnodeNChildPresentation';

PnodeNChildPresentation.prototype.init = function(PnodeID, parent, children) {
	PnodePresentation.prototype.init.apply(this, [PnodeID, parent, children]);
	return this;
}


PnodeNChildPresentation.prototype.Render	= function() {
	var self = this;
	var root = PnodePresentation.prototype.Render.apply(this, []);
	root.classList.add('PnodeNChildPresentation');
	root.classList.add('Pnode');
	if(typeof this.html.content === "undefined") {
		 this.copyHTML(htmlTemplate, root);
		 this.html.content	= root.querySelector(".content");
		 this.html.lastOne	= root.querySelector(".content .lastOne");
		 this.encapsulate(this.html.lastOne)
		 this.html.D_encaps	= {};
		 this.dropZoneId = DragDrop.newDropZone( this.html.lastOne
							, { acceptedClasse	: [['Pnode', 'instruction']]
							  , CSSwhenAccepted	: 'possible2drop'
							  , CSSwhenOver		: 'ready2drop'
							  , ondrop			: function(evt, draggedNode, infoObj) {
									 var Pnode = new infoObj.constructor().init	( undefined	// PnodeID
																				, undefined	// parent
																				, undefined	// children
																				, infoObj
																				);
									 self.appendChild( Pnode );
									}
							  }
							);
		}
	return root;
}

PnodeNChildPresentation.prototype.encapsulate	= function(c) {
	var c_root
	  , parent
	  , encaps	= document.createElement( "div" )
	  , content	= document.createElement( "div" )
	  ;
	if(c.Render) {c_root = c.Render();} else {c_root = c;}
	parent = c_root.parentNode;
	if(parent) {parent.removeChild(c_root);}
	
	content.appendChild( c_root );
	content.classList.add( "container" );
	encaps.classList.add("child");
	encaps.appendChild( htmlSeparator.cloneNode(true) );
	encaps.appendChild( content );
	var suffix = htmlSeparatorSuffix.cloneNode(true);
	encaps.appendChild( suffix );
	
	if(parent) {parent.appendChild(encaps);}
	
	return encaps;
}



PnodeNChildPresentation.prototype.primitivePlug	= function(c) {
	this.Render();
	// Where is c in children ?
	var pos		= this.children.indexOf(c)
	  , nextOne	= this.html.content.children[pos]
	  , encaps	= this.encapsulate(c)
	  ;
	 
	this.html.content.insertBefore(encaps, nextOne);
	if(c.uid) {this.html.D_encaps[ c.uid ] = encaps;}
		
	return this;
}

PnodeNChildPresentation.prototype.primitiveUnPlug	= function(c) {
	 PnodePresentation.prototype.primitiveUnPlug.apply(this, [c]);
	 var encaps = this.html.D_encaps[c.uid];
	 if(encaps) {
		 encaps.parentNode.removeChild( encaps );
		 delete this.html.D_encaps[c.uid];
		}
	 return this;
 }
 
 
PnodeNChildPresentation.prototype.deletePrimitives = function() {
	PnodePresentation.prototype.deletePrimitives.apply(this, []);
	if(this.dropZoneId) {
		 DragDrop.deleteDropZone( this.dropZoneId );
		 this.dropZoneId = null;
		}
	return this;
}



// OLD_________________________________________________________________________________________________________
PnodeNChildPresentation.prototype.RenderOLD	= function() {
	var self = this;
	var root = PnodePresentation.prototype.Render.apply(this, []);
	root.classList.add('Pnode');
	this.divDescription.innerText = 'PnodeNChild ' + this.PnodeID + ' (presentation ' + this.uid + ')' ;
	if(!this.divChildren) {
		this.divChildren = document.createElement('div');
			root.appendChild( this.divChildren );
			this.divChildren.classList.add('children');
			this.divChildrenTxt = document.createElement('div');
			this.divChildrenTxt.innerText = 'Insert a Pnode here';
			this.divChildren.appendChild( this.divChildrenTxt );
			this.dropZoneId = DragDrop.newDropZone( this.divChildrenTxt
								, { acceptedClasse	: [['Pnode', 'instruction']]
								  , CSSwhenAccepted	: 'possible2drop'
								  , CSSwhenOver		: 'ready2drop'
								  , ondrop			: function(evt, draggedNode, infoObj) {
										 var Pnode = new infoObj.constructor().init	( undefined	// PnodeID
																					, undefined	// parent
																					, undefined	// children
																					, infoObj
																					);
										 self.appendChild( Pnode );
										}
								  }
								);
		}
	return root;
}

PnodeNChildPresentation.prototype.deletePrimitivesOLD = function() {
	PnodePresentation.prototype.deletePrimitives.apply(this, []);
	if(this.divChildren) {
		 DragDrop.deleteDropZone( this.dropZoneId );
		 if(this.divChildren.parentNode) {this.divChildren.parentNode.removeChild( this.divChildren );}
		 this.divChildren = this.divChildrenTxt = this.dropZoneId = null;
		}
	return this;
}

PnodeNChildPresentation.prototype.primitivePlugOLD	= function(c) {
	 // console.log("Primitive plug ", this.root, " ->", c.root);
	 this.Render();
	 var P = this.divChildren,
		 N = c.Render();
	 if(N.parentElement === null) {P.insertBefore(N, this.divChildrenTxt);}
	return this;
}

// Return the constructor
module.exports = PnodeNChildPresentation;

