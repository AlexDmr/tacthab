require( "./mediaPlayer.css" );
var utils = require( "../../../js/utils.js" );

var controller = function($scope) {
	 var ctrl = this;
	 this.state = {};
	 ctrl.playState = "";
	 // ctrl.volume	= 0;
	 var volumeLocal = 0, volumePlayer = 0;
	 this.promiseVolume = null;
	 Object.defineProperty	( ctrl
							, "volume"
							, { get: function( ) {return volumeLocal; }
							  , set: function(v) {
								   volumeLocal = v; //console.log("volumeLocal =", v);
								   if(volumeLocal !== volumePlayer) {
									   if(this.promiseVolume === null) {
											 if(volumeLocal !== volumePlayer) {
												 ctrl.promiseVolume = ctrl.setVolume(volumeLocal).then( function() {ctrl.promiseVolume = null;} );
												}
											} else {ctrl.promiseVolume.then( function() {ctrl.volume = v;} );
												   }
										}
								  }
							  }
							);
	 // ctrl.volume = 0;
	 // console.log( "new mediaPlayer getMediasStates", ctrl.brick );
	 utils.call	( ctrl.brick.id, "getMediasStates", []
				).then( function(state) {
							// console.log( "getMediasStates", state);
							ctrl.state = state;
							ctrl.updateFromUPnP();
							});
	 this.updateFromUPnP = function() {
		 if(ctrl.state["urn:schemas-upnp-org:service:AVTransport:1"] && ctrl.state["urn:schemas-upnp-org:service:AVTransport:1"].TransportState) {
			ctrl.playState	= ctrl.state["urn:schemas-upnp-org:service:AVTransport:1"].TransportState;}
		 if(ctrl.state["urn:schemas-upnp-org:service:RenderingControl:1"]) {
			ctrl.volume	= volumePlayer = ctrl.state["urn:schemas-upnp-org:service:RenderingControl:1"].Volume || 0;}
		 $scope.$apply();
	 }
	 this.setVolume	= function(volume) {
		 return utils.call	( ctrl.brick.id, "setVolume", [volume] );
	 }
	 this.Play		= function() {
		 return utils.call	( ctrl.brick.id, "Play", [] );
	 }
	 this.Stop		= function() {
		 return utils.call	( ctrl.brick.id, "Stop", [] );										 
	 }
	 this.Pause		= function() {
		 return utils.call	( ctrl.brick.id, "Pause", [] );
	 }
	 this.Load		= function(serverId, mediaId) {
		 return utils.call	( ctrl.brick.id, "loadMedia", [serverId, mediaId] );
	 }
	 this.loadURI	= function(uri, metadata) {
		 return utils.call	( ctrl.brick.id, "loadURI"  , [uri, metadata] );
	 }
	 this.dropMedia	= function(event, draggedInfo) {
		 var info = draggedInfo.draggedData;
		 console.log( "dropMedia", event, draggedInfo);
		 var pipoMetaData = [ 
		 	'<DIDL-Lite xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:upnp="urn:schemas-upnp-org:metadata-1-0/upnp/" xmlns="urn:schemas-upnp-org:metadata-1-0/DIDL-Lite/">',
		 		'<item id="0" parentID="0" restricted="False">',
		 			'<dc:title>', info.URL, '</dc:title>',
		 			'<upnp:artist>', info.URL, '</upnp:artist>',
		 			'<res bitsPerSample="16" protocolInfo="http-get:*:audio/mpeg:*" duration="17:00:00.000" nrAudioChannels="2" bitrate="192000" sampleFrequency="48000">',
		 			// '<res bitsPerSample="16" protocolInfo="http-get:*:audio/mpeg:*" duration="17:00:00.000 nrAudioChannels="2" >',
		 				info.URL,
		 			'</res>',
		 			'<upnp:album>', info.URL, '</upnp:album>',
		 			'<upnp:genre>Streaming</upnp:genre>',
		 			'<upnp:class>object.item.audioItem.audioBroadcast</upnp:class>',
		 		'</item>',
		 	'</DIDL-Lite>'].join();
		 if( info.URL ) {
		 	 console.log( "loadURI:", pipoMetaData );
			 return this.loadURI( info.URL, pipoMetaData
							 	).then( function(/*res*/) {ctrl.Play()} );
		 } else {
			 return this.Load( info.serverId, info.mediaId
							 ).then( function(/*res*/) {ctrl.Play()} );
			}
	 }
}
controller.$inject = ["$scope"];

module.exports = function(app) {
	app.directive	( "mediaPlayer"
					, function() {
						return {
							  restrict			: 'E'
							, controller		: controller
							, bindToController 	: true
							, controllerAs		: 'ctrl'
							, templateUrl		: "/IHM/js/brick/mediaPlayer.html"
							, scope				: { brick	: "=brick"
												  }
							, link				: function(scope, element, attr, controller) {
								 // Subscribe to socket.io events
								 var eventCB
								   , cbEventName = controller.brick.id + "->eventUPnP";
								 utils.io.emit	( "subscribeBrick"
												, { brickId		: controller.brick.id
												  , eventName	: "eventUPnP"
												  , cbEventName	: cbEventName
												  } 
												);
								 utils.io.on	( cbEventName
												, eventCB = function(eventData) {
													 console.log("brickOpenhab eventUPnP:", eventData);
													 var event = eventData.data;
													 controller.state[event.serviceType] = controller.state[event.serviceType] || {};
													 try {
														 controller.state[event.serviceType][event.attribut] = event.value;
														 controller.updateFromUPnP();
														} catch(error) {
															console.error(error);
														}
													}
												); 
								 element.on		( "$destroy"
												, function() {
													 utils.io.off( cbEventName, eventCB);
													 utils.io.emit	( "unSubscribeBrick"
																	, { brickId		: controller.brick.brickId
																	  , eventName	: "eventUPnP"
																	  , cbEventName	: cbEventName
																	  }
																	);
													} 
												);
								}
							};
						}
					);
}
