module.exports = {
	BrickUPnP_MediaRenderer	: {
		ActionNodePlay	: { controller	: require( "./BrickUPnP_MediaRenderer/ActionNodePlay.js"	)
						  , template	: require( "./ActionNode.html" ) },
		ActionNodePause	: { controller	: require( "./BrickUPnP_MediaRenderer/ActionNodePause.js"	)
						  , template	: require( "./ActionNode.html" ) },
		ActionNodeStop	: { controller	: require( "./BrickUPnP_MediaRenderer/ActionNodeStop.js" 	)
						  , template	: require( "./ActionNode.html" ) }
	}
};
