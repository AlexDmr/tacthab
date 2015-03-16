define	( [ './PnodePresentation.js'
		  , './ActionNodePresentation.js'
		  , '../DragDrop.js'
		  ]
		, function(PnodePresentation, ActionNodePresentation, DragDrop) {

function PprogramActionPresentation() {
	ActionNodePresentation.apply(this, []);
	this.html = {};
	this.action.method = 'Start';
	return this;
}

PprogramActionPresentation.prototype = new ActionNodePresentation();
PprogramActionPresentation.prototype.className = 'ActionNode';

PprogramActionPresentation.prototype.unserialize	= function() {
	ActionNodePresentation.prototype.unserialize.apply(this, []);
	if(this.html.selectAction) {
		 this.html.selectAction.value = this.action.method;
		}
	return this;
}

PprogramActionPresentation.prototype.Render			= function() {
	ActionNodePresentation.prototype.Render.apply(this, []);
	if(!this.html.selectAction) {
		 var options = '<option value="Start">Start</option><option value="Stop">Stop</option>';
			 this.html.selectAction = document.createElement( 'select' );
			 this.html.selectAction.innerHTML	= str;
			 this.html.selectAction.value		= this.action.method;
			 this.html.selectAction.onchange	= function() {
				 self.action.method = this.value;
				}
		 this.divDescription.appendChild( this.html.selectAction );
		}
	return this;
}

return PprogramActionPresentation;
} );
