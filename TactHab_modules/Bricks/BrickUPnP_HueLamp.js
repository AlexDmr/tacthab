define( [ './Brick.js'
		, 'request'
		]
	  , function(Brick) {

function BrickUPnP_HueLamp(HueBridge, lampHueId, lampJS) {
	Brick.apply(this, []);
	this.HueBridge	= HueBridge;
	this.lampHueId	= lampHueId;
	this.prefixHTTP	= HueBridge.prefixHTTP;
	this.update(lampJS);
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
