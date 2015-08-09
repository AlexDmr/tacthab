var DragDrop = {
	  draggedNode	: null
	, infoObj		: null
	, dropZones		: {}
	, dropZoneId	: 0
	, init			: function() {
		// Some initialization here
		// May be useful to handle subscribing at document level
		 // var self = this;
		}
	, updateConfig	: function(id, config) {
		 for(var i in config) {
			 this.dropZones[id].config[i] = config[i];
			}
		 return this;
		}
	, deleteDropZone: function(id) {
		 if(typeof this.dropZones[id] === 'undefined') {return;}
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
	, nodeContainsClasses	: function(node, classes) { // classes is a list of list of string
		 if(node === null) {return false;}
		 for(var i=0; i<classes.length; i++) {
			 if( this.nodeContainsClassesConjonction(node, classes[i]) ) {return true;}
			}
		 return false;
		 
		}
	, nodeContainsClassesConjonction	: function(node, classes) { // classes is a list of string
		 if(node === null) {return false;}
		 for(var i=0; i<classes.length; i++) {
			 if( !node.classList.contains(classes[i]) ) {return false;}
			}
		 return true;
		}
	, newDropZone	: function(node, config ) {
		 // Config is an object containing potentially :
		 //		- acceptedClasse	: Accepted classes disjonction of conjunctions (list of list of string)
		 //		- CSSwhenAccepted	: class added to the drop zone when an accepted node is dragged
		 //		- CSSwhenOver		: class added to the drop zone when an accepted node is dragged over
		 //		- ondrop			: function triggered when an accepted dragged node is dropped on the zone
		 var self = this, i;
		 if(typeof config.acceptedClasse === 'string') {
			 config.acceptedClasse = [[config.acceptedClasse]];
			}
		 for(i in config.acceptedClasse) {
			 if(typeof config.acceptedClasse[i] === 'string') {config.acceptedClasse[i] = [config.acceptedClasse[i]];}
			}
		 // Register drop zone
		 var id = self.dropZoneId++
		 self.dropZones[id] = {node: node, config: config};

		 node.addEventListener( 'dragenter'
							  , config.dragenter = function(event) {
									 // console.log(self.draggedNode.classList);
									 if( self.nodeContainsClasses(self.draggedNode, self.dropZones[id].config.acceptedClasse) ) {
										 // console.log('enter');
										 this.classList.add( self.dropZones[id].config.CSSwhenOver );
										 event.stopPropagation();
										 event.preventDefault ();
										}
									}
							  , false );
		 node.addEventListener( 'dragover'
							  , config.dragover = function(event) {
									 if(node.classList.contains( self.dropZones[id].config.CSSwhenOver ) ) {
										 event.preventDefault();
										 event.stopPropagation();
										 event.preventDefault ();
										}
									}
							  , false );
		 node.addEventListener( 'drop'
							  , config.drop = function(event) {
									 if( node.classList.contains( self.dropZones[id].config.CSSwhenOver )
									   &&self.dropZones[id].config.ondrop ) {
										 // console.log('drop on', node);
										 self.dropZones[id].config.ondrop.apply(node, [event, self.draggedNode, self.infoObj, self]);
										 event.stopPropagation();
										 event.preventDefault ();
										}
									}
							  , false );
		 node.addEventListener( 'dragleave'
							  , config.dragleave = function(event) {
									 if( self.nodeContainsClasses(self.draggedNode, self.dropZones[id].config.acceptedClasse) ) {
										 this.classList.remove( self.dropZones[id].config.CSSwhenOver );
										 event.stopPropagation();
										 event.preventDefault ();
										}
									}
							  , false );
		 return id;
		}
	, newDraggable	: function(node, infoObj) {
		 node.setAttribute('draggable', 'true');
		 var self = this;
		 node.addEventListener( 'dragstart'
							  , function(event) {
									 event.dataTransfer.setData('text/plain', "newDraggable");
									 self.startingDrag( node, infoObj );
									 // event.preventDefault();
									 event.stopPropagation();
									}
							  , false );
		 node.addEventListener( 'dragend'
							  , function(event) {
									 self.stoppingDrag( node, infoObj );
									 event.preventDefault();
									 event.stopPropagation();
									} 
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
			 if( self.nodeContainsClasses(node, dropConfig.acceptedClasse)
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

module.exports = DragDrop;
