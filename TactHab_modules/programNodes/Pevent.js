var Pnode		= require( './Pnode.js' )
  , AlxEvents	= require( '../../js/AlxEvents.js' )
  ;

// var D_EventNode	= {};	// Dedicated dictionnary

// Definition of a node for programs
var EventNode = function() {
	 Pnode.prototype.constructor.apply(this, []);
	 return this;
	}

// API for starting, stopping the instruction
EventNode.prototype = Object.create( Pnode.prototype ); // new Pnode();
EventNode.prototype.constructor	= EventNode;
EventNode.prototype.className	= 'EventNode';
Pnode.prototype.appendClass(EventNode);

AlxEvents(EventNode);

var classes = [];//Pnode.prototype.getClasses();
classes.push(EventNode.prototype.className);
EventNode.prototype.getClasses	= function() {return classes;};

EventNode.prototype.init			= function(parent, children) {
	Pnode.prototype.init.apply(this, [parent, children]);
	this.event = {};
	return this;
}

EventNode.prototype.dispose			= function() {
	// delete  D_EventNode[this.id];
	return Pnode.prototype.dispose.apply(this, []);
}

EventNode.prototype.evalSelector	= function() {
	var res = Pnode.prototype.evalSelector.apply(this, []);
	res.push( this.id );
	return res;
}

EventNode.prototype.updateType		= function() {
	 var type = Pnode.prototype.updateType.apply(this, []);
	 type.push( 'EventNode' );
	 return type;
	}
	
EventNode.prototype.triggerEvent = function(event) {
	if(this.parent && this.state) {
		 this.parent.eventFromChild(this, event);
		 return true;
		}
	this.emit( 'triggerEvent', event);
	return false;
}

EventNode.prototype.eventFromChild = function(child, event) {
	console.log(this.className + "::eventFromChild(", child, " ,", event, ")");
	if(this.parent && this.parent.eventFromChild) {this.parent.eventFromChild(this, event);}
}

EventNode.prototype.getRelatedTypes	= function() {
	return [];
}

EventNode.prototype.serialize		= function() {
	var json = Pnode.prototype.serialize.apply(this, []);
	// Describe event here
	json.subType = this.subType;
	if(this.implicitVariableId) {json.implicitVariableId = this.implicitVariableId;}
	return json;
}

EventNode.prototype.unserialize	= function(json, Putils) {
	Pnode.prototype.unserialize.apply(this, [json, Putils]);
	return this;
}

module.exports = EventNode;

