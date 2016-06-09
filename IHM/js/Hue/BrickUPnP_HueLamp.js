require( "./BrickUPnP_HueLamp.css" );
var template 		= require( "./BrickUPnP_HueLamp.html" ),
	colorConverter	= require( "../colorConverter.js" );


function xyBriToRgb(x, y, bri) {
	var z, X, Y, Z, r, g, b, maxValue;

    z = 1.0 - x - y;
    Y = bri / 255.0; // Brightness of lamp
    X = (Y / y) * x;
    Z = (Y / y) * z;
    r = X * 1.612 - Y * 0.203 - Z * 0.302;
    g = -X * 0.509 + Y * 1.412 + Z * 0.066;
    b = X * 0.026 - Y * 0.072 + Z * 0.962;
    r = r <= 0.0031308 ? 12.92 * r : (1.0 + 0.055) * Math.pow(r, (1.0 / 2.4)) - 0.055;
    g = g <= 0.0031308 ? 12.92 * g : (1.0 + 0.055) * Math.pow(g, (1.0 / 2.4)) - 0.055;
    b = b <= 0.0031308 ? 12.92 * b : (1.0 + 0.055) * Math.pow(b, (1.0 / 2.4)) - 0.055;
    maxValue = Math.max(r,g,b);
    r /= maxValue;
    g /= maxValue;
    b /= maxValue;
    r = r * 255;   if (r < 0) { r = 255 }
    g = g * 255;   if (g < 0) { g = 255 }
    b = b * 255;   if (b < 0) { b = 255 }
    return {
        r :r,
        g :g,
        b :b
    }
}



module.exports = {
	template	: template,
	controller	: function($scope, utils) {
		var ctrl = this;
		var updateLamp = function(event) {
			$scope.$applyAsync( function() {
				// console.log( "BrickUPnP_HueLamp::event", event );
				if(event && event.data) {
					Object.assign(ctrl.brick.lampJS.state, event.data);
				}
				// Update the color from bri and xy
				if(ctrl.brick.lampJS) {
					var xy	= ctrl.brick.lampJS.state.xy,
						bri	= ctrl.brick.lampJS.state.bri;

					var rgb = colorConverter.getRGBFromXYState(xy[0], xy[1], bri/255);
					// console.log("color", xy, bri, "=>", rgb);
					ctrl.color	= "#" + (16777216 + 65536*rgb[0] + 256*rgb[1] + rgb[2]).toString(16).slice(1);
				}
			});
		}
		this.color = "#000000";
		// console.log( this.brick );
		updateLamp( {} );
		utils.subscribeBrick( this.brick.id, "update", updateLamp );

		// Commands to the Hue lamp
		// this.isOn = false;
		this.toggle			= function() {
			// this.isOn = !this.isOn;
			this.setOn( !this.brick.lampJS.state.on );
		}
		this.setOn			= function(value) {
			this.sendCommand( {on: value} );
		}
		this.setColor		= function( color ) {
			console.log( "setColor", color, this.brick.lampJS.modelid );
			var rgb = colorConverter.stringRGB_to_IntArray( color ).map( function(x) {return x/255} ),
				xy  = colorConverter.getXYStateFromRGB(rgb, this.brick.lampJS.modelid )/*,
				bri	= Math.max(rgb[0], rgb[1], rgb[2])*/;
			console.log("colorRGB   =>", rgb);
			console.log("colorXYB   =>", xy );
			console.log("xyBriToRgb =>", xyBriToRgb(xy[0], xy[1], xy[2]) );
			console.log("=>", colorConverter.getRGBFromXYState(xy[0], xy[1], xy[2]) );
			this.sendCommand( {on: true, xy: xy, bri: Math.round(255*xy[2])} );
		}
		this.sendCommand	= function( json ) {
			// console.log( "call", this.brick.id, "set", [json]);
			return utils.call	( this.brick.id
								, "set"
								, [json]
								);
		}
	}
}
