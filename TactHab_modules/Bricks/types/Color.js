var BrickOpenHAB_item = require( './BrickOpenHAB_item.js' )

var BrickOpenHAB_Color							= function() {
	BrickOpenHAB_item.apply(this, []);
	/*this.color = { hue			: 0
				 , saturation	: 0
				 , brightness	: 0
				 };*/
	return this;
}

BrickOpenHAB_Color.prototype = Object.create( BrickOpenHAB_item.prototype );
BrickOpenHAB_Color.prototype.constructor		= BrickOpenHAB_Color;
BrickOpenHAB_Color.prototype.getTypeName 		= function() {return "BrickOpenHAB_Color";}

BrickOpenHAB_Color.prototype.init				= function(device) {
	BrickOpenHAB_item.prototype.init.apply(this, [device]);
	var HSV = device.state.split(',');
	this.color = 
	this.state =	{ hue			: parseFloat( HSV[0] )
					, saturation	: parseFloat( HSV[1] )
					, brightness	: parseFloat( HSV[2] ) };
	return this;
}

var types = BrickOpenHAB_item.prototype.getTypes();
types.push	( BrickOpenHAB_Color.prototype.getTypeName()
			, BrickOpenHAB_item.types.OnOff
			, BrickOpenHAB_item.types.IncreaseDecrease
			, BrickOpenHAB_item.types.Percent
			, BrickOpenHAB_item.types.HSB
			);
BrickOpenHAB_Color.prototype.getTypes			= function() {return types;}

BrickOpenHAB_Color.prototype.registerType(BrickOpenHAB_Color.prototype.getTypeName(), BrickOpenHAB_Color.prototype);
BrickOpenHAB_Color.prototype.getColor			= function() {return this.color;}
BrickOpenHAB_Color.prototype.update				= function(topic, operation, message) {
	BrickOpenHAB_item.prototype.update.apply(this, [topic, operation, message]);

	switch(message) {
		 case 'ON' :
		 case 'OFF':
			this.state = message;
			console.log("BrickOpenHAB_Switch::state", this.state);
			this.emit("state", {value: this.state==="ON"});
		 break;
		 default:
			var HSV = message.split(',');
			if(HSV.length === 3) {
				 this.state = this.color;
				 this.color.hue			= parseFloat( HSV[0] );
				 this.color.saturation	= parseFloat( HSV[1] );
				 this.color.brightness	= parseFloat( HSV[2] );
				 this.emit('color', this.color);
				 this.emit('state', this.color);
				}			
		}


	return this;
}

BrickOpenHAB_Color.prototype.Do_On				= function() {this.sendCommand("ON" ); return true;}
BrickOpenHAB_Color.prototype.Do_Off				= function() {this.sendCommand("OFF"); return true;}

BrickOpenHAB_Color.prototype.setColor_HSB		= function(H, S, B) {
	this.color.hue			= H;
	this.color.saturation	= S;
	this.color.brightness	= B;
	this.sendCommand( H + "," + S + "," + B );
	return true;
}
BrickOpenHAB_Color.prototype.setColor_RGB		= function(R, G, B) {
	var min, max, delta
	  , h, s, v
	  , r = R / 255.0
	  , g = G / 255.0
	  , b = B / 255.0
	  ;
	min = Math.min( r, g, b );
	max = Math.max( r, g, b );
	v		= max;				// v
	delta	= max - min;
	if( max === 0 ) {
		 s = 0;
		 h = 0;
		} else {s = delta / max;		// s
				if( r === max ) {h = ( g - b ) / delta;		// between yellow & magenta
					} else { if( g === max ) {h = 2 + ( b - r ) / delta;	// between cyan & yellow
								} else	{h = 4 + ( r - g ) / delta;	// between magenta & cyan
										}
						   }
				h *= 60;				// degrees
				if( h < 0 ) {h += 360;}
				}
	
	return this.setColor_HSB(h, 100*s, 100*v);
}
BrickOpenHAB_Color.prototype.setColor_RGB_OLD	= function(R, G, B) {
	console.log( "BrickOpenHAB_Color::setColor_RGB")
	var r		= R/255.0
	  , g		= G/255.0
	  , b		= B/255.0
	  , Cmax	= Math.max(r,g,b)
	  , Cmin	= Math.min(r,g,b)
	  , delta	= Cmax - Cmin
	  , del_R, del_G, del_B
	  , H, S, V = Cmax
	  ;
	  
	if(delta === 0) {
		 H = S = 0;
		} else	{S = delta / Cmax;
				 del_R = ( ( ( Cmax - r ) / 6 ) + ( delta / 2 ) ) / delta
				 del_G = ( ( ( Cmax - g ) / 6 ) + ( delta / 2 ) ) / delta
				 del_B = ( ( ( Cmax - b ) / 6 ) + ( delta / 2 ) ) / delta

				 if      ( r === Cmax ) H = del_B - del_G
				 else if ( g === Cmax ) H = ( 1 / 3 ) + del_R - del_B
				 else if ( b === Cmax ) H = ( 2 / 3 ) + del_G - del_R

				 if ( H < 0 ) H += 1;
				 if ( H > 1 ) H -= 1;
				}
	
	return this.setColor_HSB( 100*H
							, 100*S
							, 100*V
							);
}


module.exports = BrickOpenHAB_Color;
