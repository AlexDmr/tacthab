require( "./default.css" );

module.exports = {
	template	: require( "../../brick/brick.html" ),
	controller	: function(/*$scope, utils*/) {
		this.iconURL = this.brick.iconURL || "/js/Presentations/UPnP/images/defaultMediaServer.png";
	}
	
}

