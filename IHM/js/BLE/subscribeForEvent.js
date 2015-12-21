var utils = require( "../../../js/utils.js" );

function subscribeForEvent(brick, eventName, element, cb) {
	var eventCB
	  , cbEventName = brick.id + "->" + eventName;
	utils.io.emit	( "subscribeBrick"
					, { brickId		: brick.id
					  , eventName	: eventName
					  , cbEventName	: cbEventName
					  } 
					);
	utils.io.on	( cbEventName
					, eventCB = function(eventData) {
						 try {
						 	cb(eventData.data);
						 } catch(error) {
						 	console.error(error);
						 }
						}
					); 
	element.on		( "$destroy"
					, function() {
						 utils.io.off( cbEventName, eventCB);
						 utils.io.emit	( "unSubscribeBrick"
										, { brickId		: brick.brickId
										  , eventName	: eventName
										  , cbEventName	: cbEventName
										  }
										);
						} 
					);
}

module.exports = subscribeForEvent;
