define( [ './Brick.js'
		, '../webServer/webServer.js'
		]
	  , function(Brick, webServer) {
	var IFTTTBrick = function(user, pass) {
		 Brick.apply(this, []);
		 console.log( "IFTTTBrick", this.brickId);
		 this.wordPress = {user : user, pass, pass};
		 this.webServer = webServer;
		 return this;
		}
	IFTTTBrick.prototype.constructor = IFTTTBrick;
	
	IFTTTBrick.prototype.serialize	= function() {
		 var json = Brick.prototype.serialize();
		 return json;
		}
		
	return IFTTTBrick;
});
