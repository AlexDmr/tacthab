require( "./BrickUPnP_HueLamp.css" );
var template 		= require( "./BrickUPnP_HueLamp.html" ),
	colorConverter	= require( "../colorConverter.js" );

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
			console.log("=>", rgb);
			console.log("=>", xy);
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
