require( "./BrickUPnP_HueLamp.css" );

module.exports = {
	template	: require( "../brick/brick.html" ),
	controller	: function(/*$scope, utils*/) {
		this.iconURL = "images/icons/hue.png"
	}
}

module.exports.controller	= module.exports;
module.exports.template		= require( "../../brick/brick.html" );