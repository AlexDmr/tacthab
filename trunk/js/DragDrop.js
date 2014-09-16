define	( []
		, function() {
var DragDrop = {
	  draggedNode	: null
	, infoObj		: null
	, dropZones		: {}
	, dropZoneId	: 0
	, init			: function() {
		// Some initialization here
		// May be useful to handle subscribing at document level
		 var self = this;
		}
	, deleteDropZone: function(id) {
		 if(typeof this.dropZones[id] === 'undefined') return;
		 var config = this.dropZones[id].config
		   , node   = this.dropZones[id].node;
		 node.removeEventListener('dragenter'	, config.dragenter	, false);
		 node.removeEventListener('dragover'	, config.dragover	, false);
		 node.removeEventListener('drop'		, config.drop		, false);
		 node.removeEventListener('dragleave'	, config.dragleave	, false);
		 node.classList.remove(config.CSSwhenAccepted);
		 node.classList.remove(config.CSSwhenOver	 );
		 delete this.dropZones[id];
		}
	, newDropZone	: function(node, config) {
		 // Config is an object containing potentially :
		 //		- acceptedClasse	: Accepted class
		 //		- CSSwhenAccepted	: class added to the drop zone when an accepted node is dragged
		 //		- CSSwhenOver		: class added to the drop zone when an accepted node is dragged over
		 //		- ondrop			: function triggered when an accepted dragged node is dropped on the zone
		 var self = this;
		 node.addEventListener( 'dragenter'
							  , config.dragenter = function(evt) {
									 // console.log(self.draggedNode.classList);
									 if(self.draggedNode.classList.contains( config.acceptedClasse )) {
										 // console.log('enter');
										 this.classList.add( config.CSSwhenOver );
										}
									}
							  , false );
		 node.addEventListener( 'dragover'
							  , config.dragover = function(event) {
									 if(node.classList.contains( config.CSSwhenOver ) ) {
										 event.preventDefault();
										}
									}
							  , false );
		 node.addEventListener( 'drop'
							  , config.drop = function(event) {
									 if( node.classList.contains( config.CSSwhenOver )
									   &&config.ondrop ) {
										 // console.log('drop on', node);
										 config.ondrop.apply(node, [event, self.draggedNode, self.infoObj, self]);
										}
									}
							  , false );
		 node.addEventListener( 'dragleave'
							  , config.dragleave = function(evt) {
									 if(self.draggedNode.classList.contains( config.acceptedClasse )) {
										 this.classList.remove( config.CSSwhenOver );
										}
									}
							  , false );
		// Register drop zone
		 var id = self.dropZoneId++
		 self.dropZones[id] = {node: node, config: config};
		 return id;
		}
	, newDraggable	: function(node, infoObj) {
		 node.setAttribute('draggable', 'true');
		 var self = this;
		 node.addEventListener( 'dragstart'
							  , function(evt) {self.startingDrag( node, infoObj );}
							  , false );
		 node.addEventListener( 'dragend'
							  , function(evt) {self.stoppingDrag( node, infoObj );}
							  , false );
		}
	, startingDrag	: function(node, infoObj) {
		 var self = this;
		 // console.log('Starting to drag', node);
		 self.draggedNode	= node;
		 self.infoObj		= infoObj
		// Go through Drop zones
		 var dropNode, dropConfig;
		 for(var i in self.dropZones) {
			 dropNode	= self.dropZones[i].node;
			 dropConfig	= self.dropZones[i].config;
			 if( node.classList.contains( dropConfig.acceptedClasse )
			   &&dropConfig.CSSwhenAccepted ) {
				 dropNode.classList.add( dropConfig.CSSwhenAccepted );
				}
			}
		}
	, stoppingDrag	: function(node, infoObj) {
		 var self = this;
		 // console.log('Stop dragging', self.draggedNode);
		 self.draggedNode	= null;
		 self.infoObj		= null;
		// Go through Drop zones
		 var dropNode, dropConfig;
		 for(var i in self.dropZones) {
			 dropNode	= self.dropZones[i].node;
			 dropConfig	= self.dropZones[i].config;
			 dropNode.classList.remove( dropConfig.CSSwhenOver );
			 dropNode.classList.remove( dropConfig.CSSwhenAccepted );
			}
		}
};

return DragDrop;

});