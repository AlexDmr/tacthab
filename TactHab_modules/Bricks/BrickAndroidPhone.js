var IFTTTBrick = require( './IFTTTBrick.js' );

function CB_subscribe(user, pass, title, categs) {
			 
}

var IFTTTBrickAndroidPhone = function(user, pass, androidID) {
	 IFTTTBrick.apply(this, [user, pass]);
	 console.log( "IFTTTBrickAndroidPhone", this.brickId);
	 this.webServer.subscribe_to_wordPressEvent( 
		  CB_subscribe
		, user
		, ['IFTTTBrickAndroidPhone'] );
	 return this;
	}
IFTTTBrickAndroidPhone.prototype = Object.create(IFTTTBrick.prototype); //new IFTTTBrick(); IFTTTBrickAndroidPhone.prototype.unreference();
IFTTTBrickAndroidPhone.prototype.constructor = IFTTTBrickAndroidPhone;

IFTTTBrickAndroidPhone.prototype.serialize	= function() {
	 var json = IFTTTBrick.prototype.serialize();
	 return json;
	}
IFTTTBrickAndroidPhone.prototype.unserialize	= function(json) {
	 return this;
	}

// List related events !

// List related actions !


// Return constructor
module.exports = IFTTTBrickAndroidPhone;
