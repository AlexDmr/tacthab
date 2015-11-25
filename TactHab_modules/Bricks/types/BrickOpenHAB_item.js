var Brick		= require( '../Brick.js' )
  , AlxEvents	= require( '../../../js/AlxEvents.js' )
  , openHabTypes= require( '../../../js/openHabTypes.js' )
  ;

var BrickOpenHAB_item = function() {
	Brick.apply(this, []);
	this.state = "";
	return this;
}

BrickOpenHAB_item.prototype = Object.create( Brick.prototype ); //BrickOpenHAB_item.prototype.unreference();
BrickOpenHAB_item.prototype.constructor		= BrickOpenHAB_item;
BrickOpenHAB_item.prototype.getTypeName 	= function() {return "BrickOpenHAB_item";}
var types = Brick.prototype.getTypes();
types.push( BrickOpenHAB_item.prototype.getTypeName() );
BrickOpenHAB_item.prototype.getTypes		= function() {var L=types.slice(); L.push(this.getTypeName()); return L;}

BrickOpenHAB_item.prototype.registerType('BrickOpenHAB_item', BrickOpenHAB_item.prototype);
AlxEvents(BrickOpenHAB_item);	// Managing events

BrickOpenHAB_item.prototype.dispose			= function() {
	Brick.prototype.dispose.apply(this, []);
	return this;
}

BrickOpenHAB_item.prototype.getDescription	= function() {
	// console.log("BrickOpenHAB_item::getDescription");
	var json	= Brick.prototype.getDescription.apply(this, []);
	json.class	= this.getTypeName();
	json.state	= this.state;
	return json;
}
BrickOpenHAB_item.prototype.init			= function(device) {
	Brick.prototype.init.apply(this, [device]);
	this.name	= device.name;
	this.state	= device.state || "";
	return this;
}
BrickOpenHAB_item.prototype.getESA			= function() {
		return { events	: [ 'update' ]
			   , states	: []
			   , actions: []
			   };
	}
BrickOpenHAB_item.prototype.setFactory		= function(factory) {this.factory = factory;}
BrickOpenHAB_item.prototype.sendCommand		= function(message) {
	 if(this.factory) {
		 this.factory.sendCommand(this, message);
		}
	}
BrickOpenHAB_item.prototype.publish			= function(topic, message) {
	 if(this.factory) {
		 this.factory.publish(topic, message);
		}
	}
BrickOpenHAB_item.prototype.update			= function(topic, operation, message) {
	this.state = message;
	this.emit('update', {topic:topic, operation:operation, message:message});
	return this;
}

BrickOpenHAB_item.types	= openHabTypes;

module.exports = BrickOpenHAB_item;
