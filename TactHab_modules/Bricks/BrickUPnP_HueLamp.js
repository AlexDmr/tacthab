var Brick	= require( './Brick.js' )
  , request	= require( 'request' )
  ;

function BrickUPnP_HueLamp(HueBridge, lampHueId, lampJS) {
	Brick.apply(this, []);
	this.HueBridge	= HueBridge;
	this.lampHueId	= lampHueId;
	this.prefixHTTP	= HueBridge.prefixHTTP;
	this.update(lampJS);
	var self = this;
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

BrickUPnP_HueLamp.prototype					= Object.create(Brick.prototype); //new Brick(); BrickUPnP_HueLamp.prototype.unreference();
BrickUPnP_HueLamp.prototypeconstructor		= BrickUPnP_HueLamp;
BrickUPnP_HueLamp.prototype.getTypeName		= function() {return 'BrickUPnP_HueLamp';}
BrickUPnP_HueLamp.prototype.getTypes		= function() {var L=Brick.prototype.getTypes(); L.push(BrickUPnP_HueLamp.prototype.getTypeName()); return L;}
BrickUPnP_HueLamp.prototype.registerType('BrickUPnP_HueLamp', BrickUPnP_HueLamp.prototype);

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
					 if(cbError) {cbError(error);}
					} else {self.update( JSON.parse(responseText) );
							if(cbSuccess) {cbSuccess(responseText);}
						   }
				}
			);
}
BrickUPnP_HueLamp.prototype.set		= function(jsonSet, cbError, cbSuccess) {
	var self = this;
	request	( { url		: self.prefixHTTP + '/api/TActHab8888/lights/' + this.lampHueId + '/state'
			  , method	: "PUT"
			  , body	: JSON.stringify(jsonSet)
			  }
			, function(error, IncomingMessage, responseText) {
				 if(error) {
					 console.error("BrickUPnP_HueLamp::set error:", error, responseText);
					 if(cbError) {cbError(error);}
					} else {var json = JSON.parse(responseText);
							if(cbSuccess) {cbSuccess(responseText);}
							for(var i=0; i<json.length; i++) {
								 if(json[i].success) {
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
				}
			);
}

module.exports = BrickUPnP_HueLamp;
