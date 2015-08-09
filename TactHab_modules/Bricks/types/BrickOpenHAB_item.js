var Brick		= require( '../Brick.js' )
  , AlxEvents	= require( '../../../js/AlxEvents.js' )
  , openHabTypes= require( '../../../js/openHabTypes.js' )
  ;

var BrickOpenHAB_item = function() {
	Brick.apply(this, []);
	return this;
}

BrickOpenHAB_item.prototype = Object.create( Brick.prototype ); //BrickOpenHAB_item.prototype.unreference();
BrickOpenHAB_item.prototype.constructor		= BrickOpenHAB_item;
BrickOpenHAB_item.prototype.getTypeName 	= function() {return "BrickOpenHAB_item";}
BrickOpenHAB_item.prototype.getTypes		= function() {var L=Brick.prototype.getTypes(); L.push(BrickOpenHAB_item.prototype.getTypeName()); return L;}

BrickOpenHAB_item.prototype.registerType('BrickOpenHAB_item', BrickOpenHAB_item.prototype);
AlxEvents(BrickOpenHAB_item);	// Managing events

BrickOpenHAB_item.prototype.dispose	= function() {
	Brick.prototype.dispose.apply(this, []);
	return this;
}

BrickOpenHAB_item.prototype.init	= function(device) {
	Brick.prototype.init.apply(this, [device]);
	this.name = device.name;
	return this;
}

BrickOpenHAB_item.prototype.getESA	= function() {
		return { events	: [ 'update' ]
			   , states	: []
			   , actions: []
			   };
	}

BrickOpenHAB_item.prototype.setFactory	= function(factory) {this.factory = factory;}

BrickOpenHAB_item.prototype.sendCommand	= function(topic, message) {
	 if(this.factory) {
		 this.factory.sendCommand(this, message);
		}
	}

BrickOpenHAB_item.prototype.publish		= function(topic, message) {
	 if(this.factory) {
		 this.factory.publish(topic, message);
		}
	}

BrickOpenHAB_item.prototype.update		= function(topic, operation, message) {
	console.log	( this.brickId, this.getTypeName(), "::update"
				, "\n\t- topic     :", topic
				, "\n\t- operation :", operation
				, "\n\t- message   :", message
				)
	this.emit('update', {topic:topic, operation:operation, message:message});
	return this;
}

BrickOpenHAB_item.types	= openHabTypes;

module.exports = BrickOpenHAB_item;
