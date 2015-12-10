var convert = require( "../../colorConverter.js" );

function toHex(d) {
	return  ("0"+(Number(d).toString(16))).slice(-2).toLowerCase()
}

module.exports = function(scope, utils) {
	// console.log( "Create a color controller", this, scope );
	this.userSetColor = function(e) {
		// console.log(e, this.color);
		var r = parseInt( this.color.slice(1,3), 16 )
		  , g = parseInt( this.color.slice(3,5), 16 )
		  , b = parseInt( this.color.slice(5,7), 16 )
		  ;
		// console.log(this.color, "=>", r, g, b);
		utils.call	( scope.brick.id
					, "setColor_RGB"
					, [r, g, b]
					);
	}
	this.updateState = function(event, noUpdate) {
		// console.log( "Color event", event);
		var rgb  = convert.hsvToRgb ( event.data.hue / 360
									, event.data.saturation / 100
									, event.data.brightness / 100
									);
		// console.log(rgb);
		var str = "#" + toHex(rgb[0]) + toHex(rgb[1]) + toHex(rgb[2]);
		this.color = str;
		// console.log(this.color);
		if(noUpdate !== true) {scope.$apply();}
	}
	console.log( "color init with", scope.brick.state ); 
	this.updateState( {data: scope.brick.state}
					, true 
					);
}
