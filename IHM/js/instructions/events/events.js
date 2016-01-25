module.exports = {
	BrickUPnP_MediaRenderer	: {
		EventNodePlay	: { controller	: require( "./BrickUPnP_MediaRenderer/EventNodePlay.js"	)
						  , template	: require( "./EventNode.html" ) },
		EventNodePause	: { controller	: require( "./BrickUPnP_MediaRenderer/EventNodePause.js")
						  , template	: require( "./EventNode.html" ) },
		EventNodeStop	: { controller	: require( "./BrickUPnP_MediaRenderer/EventNodeStop.js" )
						  , template	: require( "./EventNode.html" ) }
	}
};
