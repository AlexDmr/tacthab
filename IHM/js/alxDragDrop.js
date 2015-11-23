var draggingPointers	= {}
  , dropZones			= {}
  , idDropZone			= 0
  ;

//_________________________________________________________________________________________________________________
// Drop zones -----------------------------------------------------------------------------------------------------
//_________________________________________________________________________________________________________________
function dragEnter(event, idPointer, scope) {
	if(draggingPointers[idPointer]) {
		var acceptedNodes	= document.querySelectorAll( scope.accept || "*" )
		  , draggedNode		= draggingPointers[idPointer].node
		  , canDrop			= 0
		  ;
		for(var i=0; i<acceptedNodes.length; i++) {
			if(draggedNode === acceptedNodes.item(i)) {canDrop = 1; break;}
		}
		if(canDrop) {
			event.preventDefault();
			console.log( "over -> adding class", scope.hoverFeedback );
			event.currentTarget.classList.add( scope.hoverFeedback );
		}
		draggingPointers[idPointer].canDrop += canDrop;
		if( draggingPointers[idPointer].canDrop === 1 ) {
			scope.dropZone.pointersOver.push( idPointer );
		}
	}
}
function getCB_dragEnter_mouse(scope) {return function(e) {dragEnter(e, "mouse", scope)};}

function dragOver(event, idPointer) {
	if(  draggingPointers[idPointer]
	  && draggingPointers[idPointer].canDrop )	{event.preventDefault();
												}
}
function dragOver_mouse(e) {dragOver(e, "mouse");}

function dragLeave(e, idPointer, scope) {
	if(  draggingPointers[idPointer] ) {
		draggingPointers[idPointer].canDrop--;
		if(draggingPointers[idPointer].canDrop === 0) {
			scope.dropZone.pointersOver.splice( scope.dropZone.pointersOver.indexOf(idPointer), 1);
			if(scope.dropZone.pointersOver.length === 0) {
				e.currentTarget.classList.remove( scope.hoverFeedback );
			}
		}
	}
}
function getCB_dragLeave_mouse(scope) {return function(e) {dragLeave(e, "mouse", scope);}}

//_________________________________________________________________________________________________________________
// Draggables -----------------------------------------------------------------------------------------------------
//_________________________________________________________________________________________________________________
function dragStart(event, idPointer, info, draggedData) {
	console.log( "->dragStart", idPointer, draggedData );
	if(event.dataTransfer) {event.dataTransfer.setData("text/plain", "toto");}
	draggingPointers[idPointer] = { node		: event.currentTarget
								  , draggedData	: draggedData
								  , canDrop		: 0
								  };
	// Update all dropzone that can handle that node...
	var dropZone, i, nodes;
	for(i in dropZones) {
		dropZone = dropZones[i];
		if(dropZone.scope.acceptFeedback && dropZone.scope.accept) {
			nodes = Array.prototype.slice.call( document.querySelectorAll( dropZone.scope.accept ) );
			if( nodes.indexOf(event.currentTarget) ) {
				dropZone.canReceivePointers.push( idPointer );
				dropZone.element.classList.add( dropZone.scope.acceptFeedback );
			}
		}
	}
}
function getCB_dragStart_mouse(draggedData) {return function(e) {dragStart(e, "mouse", e, draggedData);}}

function dragEnd(event, idPointer) {
	// Stop drop zones feedback
	var dropZone, i, pos;
	for(i in dropZones) {
		dropZone = dropZones[i];
		pos = dropZone.canReceivePointers.indexOf(idPointer)
		if( pos >= 0 ) {
			dragLeave({currentTarget: dropZone.element}, idPointer, dropZone.scope);
			dropZone.canReceivePointers.splice(pos, 1);
			if(dropZone.canReceivePointers.length === 0) {
				dropZone.element.classList.remove( dropZone.scope.acceptFeedback );
			}
		}
	}
	// Unregister drag
	console.log( "dragEnd", idPointer );
	delete draggingPointers[idPointer];
}

function dragEnd_mouse(event) {
	return dragEnd(event, "mouse");
}


//_________________________________________________________________________________________________________________
// Angular directives ---------------------------------------------------------------------------------------------
//_________________________________________________________________________________________________________________
module.exports = function(app) {
	app	.directive	( "alxDraggable" 
					, function() {
						return {
							  restrict		: 'A'
							, link	: function(scope, elements, attr, controller) {
								 var element = elements[0];
								 console.log( "alxDraggable:", attr.alxDraggable, attr);
								 element.setAttribute("draggable", "true");
								 
								 var draggedData = scope.$eval( attr.alxDraggable );
								 
								 element.ondragstart	= getCB_dragStart_mouse(draggedData)
								 element.ondragend		= dragEnd_mouse;
								 element.ondragcancel	= dragEnd_mouse;
								 elements.on('$destroy', function() {
									element.setAttribute("draggable", "false");
									element.ondragstart		= null;
									element.ondragend		= null;
									element.ondragcancel	= null;
									});
								}
							}
						}
					)
		.directive	("alxDroppable" 
					, function($parse) {
						return {
							  /*scope	: { accept			: "@accept"
									  , acceptFeedback	: "@acceptFeedback"
									  , hoverFeedback	: "@hoverFeedback"
									  , dropAction		: "&dropAction"
									  }
							, */link	: function(scope, elements, attrs, controller) {
								 var element = elements[0];
								 var idDrop = idDropZone++;
								 console.log("drop zone", attrs);
								 var innerScope = 	{ accept			: attrs.accept
													, acceptFeedback	: attrs.acceptFeedback
													, hoverFeedback		: attrs.hoverFeedback
													, dropAction		: $parse( attrs.dropAction )
													}
								   ;
								 dropZones[idDrop]	= innerScope.dropZone 
													= { element				: element
													  , scope				: innerScope
													  , canReceivePointers	: []
													  , pointersOver		: []
													  };
								 element.ondragenter	= getCB_dragEnter_mouse(innerScope);
								 element.ondragover		= dragOver_mouse;
								 element.ondragleave	= getCB_dragLeave_mouse(innerScope);
								 element.ondrop			= function(e) {
															 var idPointer = e.identifier || "mouse";
															 // var res = scope.dropAction(e, draggingPointers[idPointer]);
															 var res = innerScope.dropAction(scope, {event: e, draggedInfo: draggingPointers[idPointer]});
															 console.log("res", res);
															 e.preventDefault();
															 e.stopPropagation();
															 // var fn = $parse(attrs.dropEvent);
															 // fn(scope, {$element : elementTransfer, $to : element});
															}
								 elements.on('$destroy', function() {
									 element.ondragenter	= null;
									 element.ondragover		= null;
									 element.ondragleave	= null;
									 element.ondrop			= null;
									 delete dropZones[idDrop];
									});
								}
							}
						}
					)
};

