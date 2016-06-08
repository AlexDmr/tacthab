require( "./BrickUPnP_HueLamp.css" );
var template 		= require( "./BrickUPnP_HueLamp.html" ),
	colorConverter	= require( "../colorConverter.js" );

module.exports = {
	template	: template,
	controller	: function($scope, utils) {
		var ctrl = this;
		this.color = "#000000";
		utils.subscribeBrick( this.brick.id, "update", function(event) {
			$scope.$applyAsync( function() {
				console.log( "BrickUPnP_HueLamp::event", event );
				Object.assign(ctrl.brick.lampJS, event.data);
				// Update the color from bri and xy
				var xy	= ctrl.brick.lampJS.state.xy,
					bri	= ctrl.brick.lampJS.state.bri;
				var rgb = colorConverter.xyBriToRgb(xy[0], xy[1], bri);

			});
		});

		// Commands to the Hue lamp
		this.isOn = false;
		this.toggle			= function() {
			this.isOn = !this.isOn;
			this.setOn( this.isOn );
		}
		this.setOn			= function(value) {
			this.sendCommand( {on: value} );
		}
		this.setColor		= function( color ) {
			console.log( "setColor", color );
			var rgb = colorConverter.stringRGB_to_IntArray( color ),
				xy  = colorConverter.getXYPointFromRGB(rgb[0]/255, rgb[1]/255, rgb[2]/255);
			this.sendCommand( {on: true, xy: xy, bri: Math.max(rgb[0], rgb[1], rgb[2])} );
		}
		this.sendCommand	= function( json ) {
			console.log( "call", this.brick.id, "set", [json]);
			return utils.call	( this.brick.id
								, "set"
								, [json]
								);
		}
	}
}
