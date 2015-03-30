define( [ './Brick.js'
		, 'request'
		]
	  , function(Brick, request) {

function BrickUPnP_HueLamp(HueBridge, lampHueId, lampJS) {
	Brick.apply(this, []);
	this.HueBridge	= HueBridge;
	this.lampHueId	= lampHueId;
	this.prefixHTTP	= HueBridge.prefixHTTP;
	this.update(lampJS);
	var self = this;
	this.types.push( 'BrickUPnP_HueLamp' );
	this.set( { alert: "select"
			  }
			, function(err ) {console.log("Error ADD Hue", lampHueId, err );}
		    , function(data) {console.log("Yeahh ADD Hue", lampHueId, data);
							  self.set({on:true, transitiontime: 20, hue:46920, sat:255});
							  setTimeout(function() {self.set({transitiontime: 20, hue:0, bri:50});}, 2000);
							  setTimeout(function() {self.set({on:false});}, 5000);
							 }
			);
	return this;
}

BrickUPnP_HueLamp.prototype			= new Brick(); BrickUPnP_HueLamp.prototype.unreference();
BrickUPnP_HueLamp.prototype.update	= function(lampJS) {
	// Check for changes, trigger events
	
	// Update the description
	this.lampJS = lampJS;	
}
BrickUPnP_HueLamp.prototype.get		= function(cbError, cbSuccess) {
	var self = this;
	request	( { url		: self.prefixHTTP + '/api/TActHab8888/lights/' + this.lampHueId
			  , method	: "GET"
			  }
			, function(error, IncomingMessage, responseText) {
				 if(error) {
					 if(cbError) cbError(error);
					} else {self.update( JSON.parse(responseText) );
							if(cbSuccess) cbSuccess(responseText);
						   }
				}
			);
}
BrickUPnP_HueLamp.prototype.set		= function(json, cbError, cbSuccess) {
	var self = this;
	request	( { url		: self.prefixHTTP + '/api/TActHab8888/lights/' + this.lampHueId + '/state'
			  , method	: "PUT"
			  , body	: JSON.stringify(json)
			  }
			, function(error, IncomingMessage, responseText) {
				 if(error) {
					 console.error("BrickUPnP_HueLamp::set error:", error, responseText);
					 if(cbError) cbError(error);
					} else {var json = JSON.parse(responseText);
							if(cbSuccess) cbSuccess(responseText);
							for(var i=0; i<json.length; i++) {
								 if(json[i].success)
								 for(var varName in json[i].success) {
									 var varValue = json[i].success[varName];
									 var L = varName.split('/');
									 var jsonUpdate = {};
									 jsonUpdate[ L[L.length-1] ] = varValue;
									 self.update( jsonUpdate );
									}
								}
						   }
				}
			);
}

return BrickUPnP_HueLamp;
});
