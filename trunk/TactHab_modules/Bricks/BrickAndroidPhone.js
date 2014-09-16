define( [ './IFTTTBrick.js'
		]
	  , function(IFTTTBrick) {
	var IFTTTBrickAndroidPhone = function(user, pass, androidID) {
		 IFTTTBrick.apply(this, [user, pass]);
		 this.webServer.subscribe_to_wordPressEvent( 
			  function(user, pass, title, categs) {
				 
				}
			, user
			, ['IFTTTBrickAndroidPhone'] );
		 return this;
		}
	IFTTTBrickAndroidPhone.prototype = new IFTTTBrick();
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
	return IFTTTBrickAndroidPhone;
})