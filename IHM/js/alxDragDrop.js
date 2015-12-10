require( "./alxDragDrop.css" );

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
			// console.log( "over -> adding class", scope.hoverFeedback );
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
	// console.log( "->dragStart", idPointer, draggedData );
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
function getCB_dragStart_mouse(innerScope) {
	 return function(e) {dragStart(e, "mouse", e, innerScope.draggedData);
						 innerScope.alxDragStart( innerScope.scope
												, { event	: e
												  , data	: innerScope.draggedData
												  }
												);
						}
	}

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
	// console.log( "dragEnd", idPointer );
	delete draggingPointers[idPointer];
}

function getCB_dragEnd_mouse(innerScope) {
	return function (e) {dragEnd(e, "mouse");
						 innerScope.alxDragEnd	( innerScope.scope
												, { event	: e
												  , data	: innerScope.draggedData
												  }
												);
						}
}


//_________________________________________________________________________________________________________________
// Angular directives ---------------------------------------------------------------------------------------------
//_________________________________________________________________________________________________________________
module.exports = function(app) {
	app	.directive	( "alxDraggable" 
					, function($parse) {
						return {
							  restrict		: 'A'
							, link	: function(scope, elements, attrs, controller) {
								 var element = elements[0];
								 // console.log( "alxDraggable:", attrs.alxDraggable, attrs);
								 element.setAttribute("draggable", "true");
								 
								 var innerScope =	{ alxDragStart	: $parse( attrs.alxDragStart )
													, alxDragEnd	: $parse( attrs.alxDragEnd   )
													, draggedData	: scope.$eval( attrs.alxDraggable )
													, scope			: scope
													};
								 // var draggedData = scope.$eval( attrs.alxDraggable );
								 
								 element.ondragstart	= getCB_dragStart_mouse	( innerScope );
								 element.ondragend		= getCB_dragEnd_mouse	( innerScope );
								 element.ondragcancel	= getCB_dragEnd_mouse	( innerScope );
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
							  link	: function(scope, elements, attrs, controller) {
								 var element = elements[0];
								 var idDrop = idDropZone++;
								 console.log( "alxDroppable", attrs);
								 var innerScope = 	{ accept			: attrs.alxDroppable
													, acceptFeedback	: attrs.alxAcceptFeedback
													, hoverFeedback		: attrs.alxHoverFeedback
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
															 innerScope.dropAction(scope, {event: e, draggedInfo: draggingPointers[idPointer]});
															 e.preventDefault();
															 e.stopPropagation();
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

