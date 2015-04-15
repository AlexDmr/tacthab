define	( [ './PnodePresentation.js'
		  ,	'./PnodeNChildPresentation.js'
		  , './SequenceNodePresentation.js'
		  , './ParallelNodePresentation.js'
		  , '../DragDrop.js'
		  ]
		, function( PnodePresentation
				  , PnodeNChildPresentation
				  , SequenceNodePresentation
				  , ParallelNodePresentation
				  , DragDrop) {

var ProgramNodePresentation = function() {
	// console.log(this);
	PnodePresentation.prototype.constructor.apply(this, []);
	return this;
}

ProgramNodePresentation.prototype = new PnodeNChildPresentation();
ProgramNodePresentation.prototype.className = 'ProgramNode';

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
	var json = PnodePresentation.prototype.serialize.apply(this, [])
	  , i, node;
	json.pg = { definitions : []
			  , instructions: [] };
	for(i=0; i<this.Pnodes.definitions.length; i++) {
		 node = this.Pnodes.definitions[i];
		 json.pg.definitions.push( node.serialize() );
		}
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
	var nodeRoot = node.Render();
	this.html.instructions.insertBefore(nodeRoot, this.divChildrenInstTxt);
	this.Pnodes.instructions.push( node );
}

ProgramNodePresentation.prototype.Render	= function() {
	var self = this;
	var root = PnodePresentation.prototype.Render.apply(this, []);
	root.classList.add('ProgramNode');
	this.divDescription.innerText = 'ProgramNode ' + this.PnodeID + ' (presentation ' + this.uid + ')' ;
	// Render blocks for declarations and instructions
	if(this.html.instructions === null) {
		 // Déclarations
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
		 // Instructions
		 this.html.instructions = document.createElement('details');
			this.html.instructions.setAttribute('open', 'open');
			this.html.instructionsSummary	= document.createElement('summary');
			this.html.instructionsSummary.innerHTML = "Instructions";
			// Drop zone
			this.divChildrenInstTxt = document.createElement('div');
			this.divChildrenInstTxt.innerText = 'Insert a Definition here';
			this.html.instructions.appendChild( this.divChildrenInstTxt );
			this.dropZoneInstId = DragDrop.newDropZone( this.divChildrenInstTxt
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
								);
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
return ProgramNodePresentation;
});
