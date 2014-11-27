define	( [ './PnodePresentation.js'
		  , '../DragDrop.js'
		  , '../utils.js'
		  ]
		, function(PnodePresentation, DragDrop, utils) {

var EventNodePresentation = function() {
	PnodePresentation.prototype.constructor.apply(this, []);
	return this;
}

EventNodePresentation.prototype = new PnodePresentation();
EventNodePresentation.prototype.className = 'EventNode';

EventNodePresentation.prototype.init = function(PnodeID, parent, children) {
	PnodePresentation.prototype.init.apply(this, [parent, children]);
	this.PnodeID = PnodeID;
	return this;
}

EventNodePresentation.prototype.serialize = function() {
	 var json = PnodePresentation.prototype.serialize.apply(this, []);
	 json.subType = './EventNodePresentation.js';
	 return json;
	}
EventNodePresentation.prototype.Render	= function() {
	var self = this;
	var root = PnodePresentation.prototype.Render.apply(this, []);
	root.classList.add('EventNode');
	root.classList.remove('Pnode');
	this.divDescription.innerHTML = ''; //'EventNode:' + this.PnodeID ;
	var bt = document.createElement('button');
		bt.addEventListener	( 'click'
							, function() {
								 console.log('trigger', self);
								 utils.io.emit( 'call', { objectId	: self.PnodeID
														, method	: 'triggerEvent'
														, params	: JSON.stringify([])
														} );
								 /*utils.XHR( 'POST', 'call'
										  , {variables : { objectId		: self.PnodeID
														 , objectMtd	: 'triggerEvent'
														 , objectParams	: JSON.stringify([])
														 }
										    }
										  )*/
								}
							, false );
		bt.innerText = 'TRIGGER';
		this.divDescription.appendChild( bt );
	return root;
}

// Return the constructor
return EventNodePresentation;
});
