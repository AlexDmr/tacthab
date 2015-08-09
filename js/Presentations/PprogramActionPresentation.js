var /*PnodePresentation		= require( './PnodePresentation.js' )
  ,*/ ActionNodePresentation	= require( './ActionNodePresentation.js' )
  // , DragDrop				= require( '../DragDrop.js' )
  ;

function PprogramActionPresentation() {
	ActionNodePresentation.apply(this, []);
	return this;
}

PprogramActionPresentation.prototype = Object.create( ActionNodePresentation.prototype ); // new ActionNodePresentation();
PprogramActionPresentation.prototype.constructor	= PprogramActionPresentation;
PprogramActionPresentation.prototype.className		= 'ActionNode';

PprogramActionPresentation.prototype.init		= function(PnodeID, parent, children) {
	ActionNodePresentation.prototype.init.apply(this, [PnodeID, parent, children]);
	this.action.method = 'Start';
	return this;
}

PprogramActionPresentation.prototype.serialize	= function() {
	var json = ActionNodePresentation.prototype.serialize.apply(this, []);
	json.subType		= 'PprogramActionPresentation';
	return json;
}

PprogramActionPresentation.prototype.unserialize	= function(json, Putils) {
	ActionNodePresentation.prototype.unserialize.apply(this, [json, Putils]);
	if(this.html.selectAction) {
		 this.html.selectAction.value = this.action.method;
		}
	return this;
}

PprogramActionPresentation.prototype.Render			= function() {
	var root = ActionNodePresentation.prototype.Render.apply(this, [])
	  , self = this;
	if(!this.html.selectAction) {
		 this.html.actionName.innerHTML		= '';
		 this.html.divSelector.innerHTML	= '[DROP PROGRAMS HERE]';
		 var options = '<option value="Start">Start</option><option value="Stop">Stop</option>';
			 this.html.selectAction = document.createElement( 'select' );
			 this.html.selectAction.innerHTML	= options;
			 this.html.selectAction.value		= this.action.method;
			 this.html.selectAction.onchange	= function() {self.action.method = this.value;}
		 this.html.actionName.appendChild(this.html.selectAction); 
		}
	return root;
}

module.exports = PprogramActionPresentation;

