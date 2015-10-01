// Plug to Brick appear/disappear
var Brick = require( "../TactHab_modules/Bricks/Brick.js" );

module.exports = function(webServer) {
	var io		= webServer.io;
	var m2m		= io.of('/m2m');
	Brick.ProtoBrick.on	( 'appear'
						, function(jsonBrickId) {console.log("brickAppears"		, jsonBrickId);
												 m2m.emit("brickAppears"		, jsonBrickId);
												}
						);
	Brick.ProtoBrick.on	( 'disappear'
						, function(jsonBrickId) {console.log("brickDisappears"	, jsonBrickId);
												 m2m.emit("brickDisappears"		, jsonBrickId);
												}
						);
	m2m.on('connection', function(socket) {
		socket.on( 'broadcast'
				 , function(id, msg) {
						 console.log( "m2m broadcast:", id, ":", msg );
						 m2m.emit(msg.title, msg.body);
						}
				 );
	});
};
