var BrickOpenHAB = require( "./BrickOpenHAB.js" );
require( "./BrickOpenHAB_Contact.css" );

module.exports = {
	template	: require( "./BrickOpenHAB_Contact.html" ),
	controller	: function(scope, utils) {
		BrickOpenHAB.apply(this, [scope, utils]);
		// console.log( "Create a color controller", this, scope );
		this.updateState = function(event, noUpdate) {
			console.log( "BrickOpenHAB_Contact event", event, noUpdate);
		}
	}
};
