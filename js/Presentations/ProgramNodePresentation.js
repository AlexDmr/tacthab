var PnodePresentation			= require( './PnodePresentation.js' )
  , PnodeNChildPresentation		= require( './PnodeNChildPresentation.js' )
  // , SequenceNodePresentation	= require( './SequenceNodePresentation.js' )
  , ParallelNodePresentation	= require( './ParallelNodePresentation.js' )
  , DragDrop					= require( '../DragDrop.js' )

var css = document.createElement('link');
	css.setAttribute('rel' , 'stylesheet');
	css.setAttribute('href', 'js/Presentations/HTML_templates/ProgramNodePresentation.css');
	document.head.appendChild( css );

require( "./HTML_templates/ProgramNodePresentation.css" );




var ProgramNodePresentation = function() {
	// console.log(this);
	PnodePresentation.prototype.constructor.apply(this, []);
	return this;
}

ProgramNodePresentation.prototype = Object.create( PnodeNChildPresentation.prototype ); //new PnodeNChildPresentation();
ProgramNodePresentation.prototype.constructor	= ProgramNodePresentation;
ProgramNodePresentation.prototype.className		= 'ProgramNode';

ProgramNodePresentation.prototype.init = function(PnodeID, parent, children) {
	PnodePresentation.prototype.init.apply(this, [PnodeID, parent, children]);
	this.html.instructions	= null;
	this.html.definitions	= null;
	this.Pnodes = { instructions	: []
				  , definitions		: []
				  };
	return this;
}

ProgramNodePresentation.prototype.reset = function() {
	this.Pnodes.definitions		= [];
	this.Pnodes.instructions	= [];
}

ProgramNodePresentation.prototype.serialize	= function() {
	var children	= this.children;
	this.children	= [];
	var json = PnodePresentation.prototype.serialize.apply(this, [])
	  , i, node;
	this.children	= children;
	json.pg = { definitions : []
			  , instructions: [] };
	for(i=0; i<this.Pnodes.definitions.length; i++) {
		 node = this.Pnodes.definitions[i];
		 json.pg.definitions.push( node.serialize() );
		}
	this.Pnodes.instructions = this.Pnode_ParallelInstructions?this.Pnode_ParallelInstructions.children:[];
	for(i=0; i<this.Pnodes.instructions.length; i++) {
		 node = this.Pnodes.instructions[i];
		 json.pg.instructions.push( node.serialize() );
		}
	return json;
}

ProgramNodePresentation.prototype.unserialize	= function(json, PresoUtils) {
	var i, jsonNode;
	PnodePresentation.prototype.unserialize.apply(this, [json, PresoUtils]);
	this.reset();
	for(i=0; i<json.pg.definitions.length; i++) {
		 jsonNode = json.pg.definitions[i];
		 this.appendDefinitionNode ( PresoUtils.unserialize(jsonNode) );
		}
	this.Render();
	for(i=0; i<json.pg.instructions.length; i++) {
		 jsonNode = json.pg.instructions[i];
		 this.appendInstructionNode( PresoUtils.unserialize(jsonNode) );
		}
	return this;
}


ProgramNodePresentation.prototype.appendDefinitionNode = function(node) {
	var nodeRoot = node.Render();
	this.html.definitions.insertBefore(nodeRoot, this.divChildrenDefTxt);
	this.Pnodes.definitions.push( node );
}

ProgramNodePresentation.prototype.appendInstructionNode = function(node) {
	// var nodeRoot = node.Render();
	// this.html.instructions.insertBefore(nodeRoot, this.divChildrenInstTxt);
	this.Pnode_ParallelInstructions.appendChild(node);
	// this.Pnodes.instructions.push( node );
}

ProgramNodePresentation.prototype.Render	= function() {
	var self = this;
	var root = PnodePresentation.prototype.Render.apply(this, []);
	root.classList.add('ProgramNode');
	root.classList.add('ProgramNodePresentation');
	this.divDescription.innerText = 'ProgramNode ' + this.PnodeID + ' (presentation ' + this.uid + ')' ;
	// Render blocks for declarations and instructions
	if(this.html.instructions === null) {
		// Déclarations -------------------------------------------------------
		 this.html.definitions = document.createElement('details');
			this.html.definitions.setAttribute('open', 'open');
			this.html.definitionsSummary	= document.createElement('summary');
			this.html.definitionsSummary.innerHTML = "Definitions";
			// Drop zone
			this.divChildrenDefTxt = document.createElement('div');
			this.divChildrenDefTxt.innerText = 'Insert a Definition here';
			this.html.definitions.appendChild( this.divChildrenDefTxt );
			this.dropZoneDefId = DragDrop.newDropZone( this.divChildrenDefTxt
								, { acceptedClasse	: 'DefinitionNode'
								  , CSSwhenAccepted	: 'possible2drop'
								  , CSSwhenOver		: 'ready2drop'
								  , ondrop			: function(evt, draggedNode, infoObj) {
										 var Pnode = new infoObj.constructor().init	( undefined	// PnodeID
																					, undefined	// parent
																					, undefined	// children
																					, infoObj
																					);
										 self.appendDefinitionNode( Pnode );
										}
								  }
								);
		 this.html.definitions.appendChild(this.html.definitionsSummary);
		 
		// Instructions -------------------------------------------------------
		 this.html.instructions = document.createElement('details');
			this.html.instructions.setAttribute('open', 'open');
			this.html.instructionsSummary	= document.createElement('summary');
			this.html.instructionsSummary.innerHTML = "Instructions";
			// Drop zone
			this.Pnode_ParallelInstructions = new ParallelNodePresentation().init();
			this.html.instructions.appendChild( this.Pnode_ParallelInstructions.Render() );
			/*this.dropZoneInstId = DragDrop.newDropZone( this.divChildrenInstTxt
								, { acceptedClasse	: [['Pnode', 'instruction']]
								  , CSSwhenAccepted	: 'possible2drop'
								  , CSSwhenOver		: 'ready2drop'
								  , ondrop			: function(evt, draggedNode, infoObj) {
										 var Pnode = new infoObj.constructor().init	( undefined	// PnodeID
																					, undefined	// parent
																					, undefined	// children
																					, infoObj
																					);
										 self.appendInstructionNode( Pnode );
										}
								  }
								);*/
		 this.html.instructions.appendChild(this.html.instructionsSummary);
		 // Plug under the root
		 this.root.appendChild( this.html.definitions );
		 this.root.appendChild( this.html.instructions );
		}
	return root;
}

ProgramNodePresentation.prototype.deletePrimitives = function() {
	PnodePresentation.prototype.deletePrimitives.apply(this, []);
	if(this.html.instructions !== null) {
		 this.html = { instructions	: null
					 , definitions	: null};
		}
	return this;
}

// Return the constructor
module.exports = ProgramNodePresentation;

