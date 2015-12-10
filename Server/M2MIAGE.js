// Plug to Brick appear/disappear
var Brick = require( "../TactHab_modules/Bricks/Brick.js" )
  ;

module.exports = function(webServer) {
	var io		= webServer.io
	  , ioHTTPS	= webServer.ioHTTPS
	  ;
	var m2m		= io		.of('/m2m')
	  , m2mHTTPS= ioHTTPS	.of('/m2m')
	  ;
	var cbNewSocket = function(socket) {
		webServer.registerSocketForCall( socket );
		webServer.addClient(socket);
		var D_callbacks = {};
		
		socket.on( "unSubscribeBrick"
				 , function(subscription) {
					 var brick = Brick.prototype.getBrickFromId( subscription.brickId );
					 if(brick) {
						 var D_id = subscription.brickId + "::" + subscription.eventName + "::" + subscription.cbEventName;
						 brick.off( subscription.eventName
								  , D_callbacks[D_id].callback
								  );
						}
					}
				 );
		socket.on( "subscribeBrick"
				 , function(subscription) {
					 var brick = Brick.prototype.getBrickFromId( subscription.brickId );
					 if(brick) {
						 var D_id = subscription.brickId + "::" + subscription.eventName + "::" + subscription.cbEventName;
						 // console.log( "subscribeBrick", subscription.eventName );
						 D_callbacks[D_id] = D_callbacks[D_id] ||
											 { callback : function(msg) {socket.emit( subscription.cbEventName
																					, {eventName: subscription.eventName, data: msg} 
																					);
																	  }
											 , subscription	: subscription
											 , brick			: brick
											 , eventName		: subscription.eventName
											 };
						 brick.on( subscription.eventName
								 , D_callbacks[D_id].callback
								 );
						}
					}
				 );
		socket.on( 'broadcast'
				 , function(id, msg) {
						console.log( "m2m broadcast:", id, ":", msg );
						m2m		.emit(msg.title, msg.body);
						m2mHTTPS.emit(msg.title, msg.body);
				 });
		socket.on( 'disconnect'
				 , function() {
					  webServer.removeClient(socket);
					  var i, item, brick, callback, eventName;
					  for(i in D_callbacks) {
						item = D_callbacks[i];
						try {
							brick		= item.brick;
							eventName	= item.eventName;
							callback	= item.callback
							brick.off(eventName, callback);
						} catch(errUnsubscribe) {console.error("Error unsubscribe", item);}
					  }
					 });
	};
	
	
	
	
	Brick.ProtoBrick.on	( 'appear'
						, function(jsonBrickId) {//console.log("brickAppears"		, jsonBrickId);
												 m2m	 .emit("brickAppears"		, jsonBrickId);
												 m2mHTTPS.emit("brickAppears"		, jsonBrickId);
												}
						);
	Brick.ProtoBrick.on	( 'disappear'
						, function(jsonBrickId) {//console.log("brickDisappears"	, jsonBrickId);
												 m2m	 .emit("brickDisappears"	, jsonBrickId);
												 m2mHTTPS.emit("brickDisappears"	, jsonBrickId);
												}
						);
	m2m		.on('connection', cbNewSocket);
	m2mHTTPS.on('connection', cbNewSocket);
};
