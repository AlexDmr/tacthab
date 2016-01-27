require( "./alxDragDrop.css" );

var draggingPointers	= {}
  , dropZones			= {}
  , idDropZone			= 0
  ;
/* dropZone:
{ element				: element
, scope					: innerScope
, canReceivePointers	: []
, pointersOver			: []
, removePointer			: removePointer
};
*/
function removePointer(idPointer) {
	var pos;
	while(true) {
		pos = this.pointersOver.indexOf( idPointer );
		if(pos >= 0) {
			this.pointersOver.splice(pos, 1);
		} else {break;}
	}
}

//_________________________________________________________________________________________________________________
// Drop zones -----------------------------------------------------------------------------------------------------
//_________________________________________________________________________________________________________________
function dragEnter(event, idPointer, dropZone) {
	if(draggingPointers[idPointer]) {
		event.stopPropagation();
		// console.log( "dragEnter", scope.dropZone );
		var fctAccept	= dropZone.scope.accept
		  , canDrop		= dropZone.canReceivePointers.indexOf(idPointer)>=0?1:0
		  ;
		// Change the dropzone over wish the pointer is positionned
		var prevDropZone = draggingPointers[idPointer].overDropZone;
		if(prevDropZone !== dropZone) {
			if(prevDropZone) {
				prevDropZone.removePointer( idPointer );
				prevDropZone.element.classList.remove( prevDropZone.scope.hoverFeedback );
			}
			draggingPointers[idPointer].overDropZone = null;
		}

		if(canDrop) {
			event.preventDefault();
			dropZone.pointersOver.push( idPointer );
			draggingPointers[idPointer].overDropZone = dropZone;
			event.currentTarget.classList.add( dropZone.scope.hoverFeedback );
		}
		draggingPointers[idPointer].canDrop += canDrop;

		/*draggingPointers[idPointer].canDrop += canDrop;
		scope.dropZone.pointersOver.push( idPointer );

		if( scope.dropZone.pointersOver.length === 1 ) {
			event.currentTarget.classList.add( scope.hoverFeedback );
		}*/
	}
}
function getCB_dragEnter_mouse(dropZone) {return function(e) {dragEnter(e, "mouse", dropZone)};}

function dragOver(event, idPointer) {
	event.stopPropagation();
	if(  draggingPointers[idPointer]
	  && draggingPointers[idPointer].canDrop )	{event.preventDefault();
												}
}
function dragOver_mouse(e) {dragOver(e, "mouse");}

function dragLeave(event, idPointer, dropZone) {
	if(  draggingPointers[idPointer] ) {
		event.stopPropagation();
		var pos = dropZone.pointersOver.indexOf(idPointer);
		dropZone.pointersOver.splice(pos, 1);
		draggingPointers[idPointer].canDrop--;
		// console.log( "dragLeave", event.currentTarget);
		if(dropZone.pointersOver.length === 0) {
			event.currentTarget.classList.remove( dropZone.scope.hoverFeedback );
		}
	}
}
function getCB_dragLeave_mouse(dropZone) {return function(e) {dragLeave(e, "mouse", dropZone);}}

//_________________________________________________________________________________________________________________
// Draggables -----------------------------------------------------------------------------------------------------
//_________________________________________________________________________________________________________________
function dragStart(event, idPointer, info, innerScope) {
	// console.log( "->dragStart", idPointer, draggedData );
	if(event.dataTransfer) {event.dataTransfer.setData("text/plain", "toto");}
	draggingPointers[idPointer] = { node		: event.currentTarget
								  , draggedData	: innerScope.draggedData
								  , canDrop		: 0
								  };
	// Update all dropzone that can handle that node...
	var dropZone, i; //, nodes;
	for(i in dropZones) {
		dropZone = dropZones[i];
		if( 	dropZone.scope.acceptFeedback 
			&&	dropZone.scope.accept 
			&&	dropZone.scope.accept(dropZone.scope.angularScope, {draggedInfo: draggingPointers[idPointer]})
			) {
				dropZone.canReceivePointers.push( idPointer );
				dropZone.element.classList.add( dropZone.scope.acceptFeedback );
			/* OLD style when acceptation was based on HTML selector instead of data
			nodes = Array.prototype.slice.call( document.querySelectorAll( dropZone.scope.accept ) );
			if( nodes.indexOf(event.currentTarget) >= 0 ) {
				dropZone.canReceivePointers.push( idPointer );
				dropZone.element.classList.add( dropZone.scope.acceptFeedback );
			}*/
		}
	}
}
function getCB_dragStart_mouse(innerScope) {
	 return function(e) {dragStart(e, "mouse", e, innerScope);
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
			dragLeave( {
					currentTarget		: dropZone.element, 
					stopPropagation		: function(){}				
				}, 
				idPointer, dropZone);
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
								 // console.log( "alxDroppable", attrs);
								 var innerScope = 	{ accept			: $parse( attrs.alxDroppable || 'false' )
													, acceptFeedback	: attrs.alxAcceptFeedback
													, hoverFeedback		: attrs.alxHoverFeedback
													, dropAction		: $parse( attrs.alxDropAction )
													, angularScope		: scope
													}
								   ;
								 dropZones[idDrop]	= innerScope.dropZone 
													= { element				: element
													  , scope				: innerScope
													  , canReceivePointers	: []
													  , pointersOver		: []
													  , removePointer		: removePointer
													  };
								 element.ondragenter	= getCB_dragEnter_mouse(dropZones[idDrop]);
								 element.ondragover		= dragOver_mouse;
								 element.ondragleave	= getCB_dragLeave_mouse(dropZones[idDrop]);
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

