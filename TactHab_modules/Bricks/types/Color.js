var BrickOpenHAB_item = require( './BrickOpenHAB_item.js' )

var BrickOpenHAB_Color = function() {
	BrickOpenHAB_item.apply(this, []);
	this.color =	{ hue			: 0
					, saturation	: 0
					, luminosity	: 0 };
	return this;
}

BrickOpenHAB_Color.prototype = Object.create( BrickOpenHAB_item.prototype );
BrickOpenHAB_Color.prototype.constructor	= BrickOpenHAB_Color;
BrickOpenHAB_Color.prototype.getTypeName 	= function() {return "BrickOpenHAB_Color";}
var types = BrickOpenHAB_item.prototype.getTypes();
types.push	( BrickOpenHAB_Color.prototype.getTypeName()
			, BrickOpenHAB_item.types.OnOff
			, BrickOpenHAB_item.types.IncreaseDecrease
			, BrickOpenHAB_item.types.Percent
			, BrickOpenHAB_item.types.HSB
			);
BrickOpenHAB_Color.prototype.getTypes		= function() {return types;}

BrickOpenHAB_Color.prototype.registerType(BrickOpenHAB_Color.prototype.getTypeName(), BrickOpenHAB_Color.prototype);

BrickOpenHAB_Color.prototype.getColor	= function() {return this.color;}
BrickOpenHAB_Color.prototype.update	= function(topic, operation, message) {
	BrickOpenHAB_item.prototype.update.apply(this, [topic, operation, message]);
	if(topic === 'command') {
		 var HSV = message.split(',');
		 this.color.hue		= parseFloat( HSV[0] );
		 this.color.saturation	= parseFloat( HSV[1] );
		 this.color.luminosity	= parseFloat( HSV[2] );
		 this.emit('color', this.color);
		}
	return this;
}

module.exports = BrickOpenHAB_Color;
