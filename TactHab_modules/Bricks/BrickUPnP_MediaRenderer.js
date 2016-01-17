var BrickUPnP				= require( './BrickUPnP.js' )
  , BrickUPnPFactory		= require( './BrickUPnPFactory.js' )
  // , UpnpServer				= require( '../UpnpServer/UpnpServer.js' )
  // , webServer				= require( '../webServer/webServer.js' )
  , BrickUPnP_MediaServer	= require( './BrickUPnP_MediaServer.js' )
  , AlxEvents				= require( '../../js/AlxEvents.js' )
  , AlxAutomate				= require( '../../js/AlxAutomate.js' )


var xmldom		= require( 'xmldom' );
var xmldomparser= new xmldom.DOMParser();

var BrickUPnP_MediaRenderer = function(id) {
	 BrickUPnP.apply(this, [id]);
	 return this;
	}
BrickUPnP_MediaRenderer.prototype = Object.create( BrickUPnP.prototype ); 
BrickUPnP_MediaRenderer.prototype.registerType('BrickUPnP_MediaRenderer', BrickUPnP_MediaRenderer.prototype);
BrickUPnP_MediaRenderer.prototype.constructor	= BrickUPnP_MediaRenderer;
BrickUPnP_MediaRenderer.prototype.getTypeName	= function() {return "BrickUPnP_MediaRenderer";}
BrickUPnP_MediaRenderer.prototype.getTypes		= function() {var L=BrickUPnP.prototype.getTypes(); L.push(BrickUPnP_MediaRenderer.prototype.getTypeName()); return L;}

var actions = BrickUPnP.prototype.getActions()
  , states 	= BrickUPnP.prototype.getStates ()
  , events 	= BrickUPnP.prototype.getEvents ()
  ;
actions.push( {name: 'loadMedia', params: ['mediaServerId', 'itemId']} );
actions.push( {name: 'loadURI'	, params: ['uri', 'metadata']} );
actions.push( {name: 'Play' 	, params: []} );
actions.push( {name: 'Pause' 	, params: []} );
actions.push( {name: 'Stop' 	, params: []} );

states.push	( {name: 'PLAYING'			, type: 'boolean'}
			, {name: 'STOPPED'			, type: 'boolean'}
			, {name: 'PAUSED_PLAYBACK'	, type: 'boolean'}
			, {name: 'VOLUME'			, type: 'percent'}
			);

events.push( 'PLAYING', 'STOPPED', 'PAUSED_PLAYBACK', 'VOLUME' );

BrickUPnP_MediaRenderer.prototype.getActions= function() {return actions;}
BrickUPnP_MediaRenderer.prototype.getStates	= function() {return states ;}
BrickUPnP_MediaRenderer.prototype.getEvents	= function() {return events ;}

AlxEvents	(BrickUPnP_MediaRenderer);

BrickUPnP_MediaRenderer.prototype.init		= function(device) {
	 var self = this;
	 BrickUPnP.prototype.init.apply(this, [device]);
	 this.MediasStates = {};
	 this.automatePlay = new AlxAutomate(	{ initialState	: "INIT"
											, states	: { INIT	: { transitions : [ {state: 'PLAYING', eventName: 'TransportState', op: 'equal', value: 'PLAYING'}
																					  , {state: 'STOPPED', eventName: 'TransportState', op: 'equal', value: 'STOPPED'}
																					  , {state: 'PAUSED' , eventName: 'TransportState', op: 'equal', value: 'PAUSED_PLAYBACK'}
																					  ]
																	  }
														  , PLAYING	: { enter		: {action: {}}
																	  , transitions	: [ {state: 'STOPPED', eventName: 'TransportState', op: 'equal', value: 'STOPPED'}
																					  , {state: 'PAUSED' , eventName: 'TransportState', op: 'equal', value: 'PAUSED_PLAYBACK'}
																					  ]
																	  }
														  , STOPPED	: { enter		: {action: {}}
																	  , transitions	: [ {state: 'PLAYING', eventName: 'TransportState', op: 'equal', value: 'PLAYING'}
																					  , {state: 'PAUSED' , eventName: 'TransportState', op: 'equal', value: 'PAUSED_PLAYBACK'}
																					  ]
																	  }
														  , PAUSED	: { enter		: {action: {}}
																	  , transitions	: [ {state: 'STOPPED', eventName: 'TransportState', op: 'equal', value: 'STOPPED'}
																					  , {state: 'PLAYING', eventName: 'TransportState', op: 'equal', value: 'PLAYING'}
																					  ]
																	  }
														  }
											, events	: [ 'PLAYING', 'STOPPED', 'PAUSED']
											, eventSrc	: self
											, actions	: { Play		: {eventName: 'TransportState', value:'PLAYING'			}
														  , Stop		: {eventName: 'TransportState', value:'STOPPED'			}
														  , Pause		: {eventName: 'TransportState', value:'PAUSED_PLAYBACK'	}
														  , setVolume	: {}
														  , goToTime	: {}
														  }
											}
										);
	 this.automatePlay.on('enter_PLAYING', function(e) {console.log("enter_PLAYING", e);});
	 this.automatePlay.on('leave_PLAYING', function(e) {console.log("leave_PLAYING", e);});
	 this.automatePlay.on('enter_STOPPED', function(e) {console.log("enter_STOPPED", e);});
	 this.automatePlay.on('leave_STOPPED', function(e) {console.log("leave_STOPPED", e);});
	 this.automatePlay.on('enter_PAUSED' , function(e) {console.log("enter_PAUSED" , e);});
	 this.automatePlay.on('leave_PAUSED' , function(e) {console.log("leave_PAUSED" , e);});
	 return this;
	}

BrickUPnP_MediaRenderer.prototype.getMediasStates	= function() {
	 return this.MediasStates;
	}
BrickUPnP_MediaRenderer.prototype.loadMedia	= function(mediaServerId, itemId) {
	 var self 		 = this;
	 var mediaServer = this.getBrickFromId(mediaServerId);
	 var service	 = mediaServer.UPnP.device.services['urn:upnp-org:serviceId:ContentDirectory'];
	 return new Promise( function(resolve, reject) {
		 service.callAction	( 'Browse'
							, { ObjectID		: itemId
							  , BrowseFlag		: 'BrowseMetadata'
							  , Filter			: '*'
							  , StartingIndex	: 0
							  , RequestedCount	: 0
							  , SortCriteria	: ''
							  }
							, function(err, buffer) {
								 // console.log(self.brickId, "BrickUPnP_MediaRenderer::Browse", err || buffer);
								 if(err) {
									 console.error("Error :", JSON.stringify(err));
									 reject(err);
									} else	{try	{var doc			= xmldomparser.parseFromString(buffer);
													 var metadata		= doc.getElementsByTagName('Result')[0].textContent;
													 var docMetadata	= xmldomparser.parseFromString( metadata );
													 var res			= docMetadata.getElementsByTagName('res');
													 if(res.length > 0) {
														 // console.log("URI:", res[0].textContent);
														 self.loadURI( res[0].textContent// uri
																	 , metadata
																	 ).then(resolve, reject);
														} else {console.error("loadMedia : no res : ", metadata);}
													} catch(err2) {console.error(err2);
																   reject(err2);
																  }
											}
								}
							);

	}); // Promise
}
BrickUPnP_MediaRenderer.prototype.loadURI	= function(uri, metadata) {
	 // var self = this; console.log("loadURI", uri, metadata);
	return new Promise( function(resolve, reject) {
		 var service = this.UPnP.device.services['urn:upnp-org:serviceId:AVTransport'];
		 service.callAction	( 'SetAVTransportURI'
							, { InstanceID			: 0
							  , CurrentURI			: uri
							  , CurrentURIMetaData	: metadata
							  }
							, function(err, buffer) {
								 // console.log(self.brickId, "BrickUPnP_MediaRenderer::loadMedia", err || buffer);
								 if(err) {
									 console.error("loadURI error :", err, buffer);
									 if(metadata !== "") {
										 console.log("retry");
										 service.callAction	( 'SetAVTransportURI'
															, { InstanceID			: 0
															  , CurrentURI			: uri
															  , CurrentURIMetaData	: ''
															  }
															, function(err2, buffer2) {
																 if(err2) {reject(err2);} else {resolve(buffer2);}
																}
															);
										} else {reject(err);}
									} else	{resolve(buffer);}
								}
							);
		}); // Promise
	}
BrickUPnP_MediaRenderer.prototype.Play		= function() {
	 // var self = this;
	 return new Promise( function(resolve, reject) {
	 	 var service = this.UPnP.device.services['urn:upnp-org:serviceId:AVTransport'];
		 service.callAction	( 'Play'
							, { InstanceID		: 0
							  , Speed			: '1' }
							, function(err, buffer) {
								 // console.log(self.brickId, "BrickUPnP_MediaRenderer::Play", err || buffer);
								 // if(cb) {cb(err || buffer);}
								 if(err) {reject(err);} else {resolve(buffer);}
								}
							);
		}); // Promise
	}
BrickUPnP_MediaRenderer.prototype.Pause		= function() {
	 return new Promise( function(resolve, reject) {
		 var service = this.UPnP.device.services['urn:upnp-org:serviceId:AVTransport'];
		 service.callAction	( 'Pause'
							, { InstanceID		: 0
							  }
							, function(err, buffer) {
								 // console.log(this.brickId, "BrickUPnP_MediaRenderer::Pause", err || buffer);
								 if(err) {reject(err);} else {resolve(buffer);}
								}
							);
		}); // Promise
	}
BrickUPnP_MediaRenderer.prototype.Stop		= function() {
	 return new Promise( function(resolve, reject) {
		 var service = this.UPnP.device.services['urn:upnp-org:serviceId:AVTransport'];
		 service.callAction	( 'Stop'
							, { InstanceID		: 0
							  }
							, function(err, buffer) {
								 // console.log(this.brickId, "BrickUPnP_MediaRenderer::Stop", err || buffer);
								 if(err) {reject(err);} else {resolve(buffer);}
								}
							);
		}); // Promise
	}
BrickUPnP_MediaRenderer.prototype.getVolume	= function() {
	 return new Promise( function(resolve, reject) {
		 var service = this.UPnP.device.services['urn:upnp-org:serviceId:RenderingControl'];
		 service.callAction	( 'GetVolume'
							, { InstanceID		: 0
							  , Channel			: "Master"
							  }
							, function(err, buffer) {
								 // console.log(this.brickId, "BrickUPnP_MediaRenderer::GetVolume", err || buffer);
								 if(err) {reject(err);} else {resolve(buffer);}
								}
							);
		}); // Promise
	}
BrickUPnP_MediaRenderer.prototype.setVolume	= function(volume) {
	 return new Promise( function(resolve, reject) {
		 volume = Math.min(100, Math.max(0, Math.round(volume)));
		 var service = this.UPnP.device.services['urn:upnp-org:serviceId:RenderingControl'];
		 service.callAction	( 'SetVolume'
							, { InstanceID		: 0
							  , Channel			: "Master"
							  , DesiredVolume	: volume
							  }
							, function(err, buffer) {
								 // console.log(this.brickId, "BrickUPnP_MediaRenderer::SetVolume", err || buffer);
								 if(err) {reject(err);} else {resolve(buffer);}
								}
							);
		}); // Promise
	}
BrickUPnP_MediaRenderer.prototype.goToTime	= function(time) {
	 
	}

// UPnP events
BrickUPnP_MediaRenderer.prototype.UPnPEvent	= function(event, service) {
	 delete this.currentInstanceID;
	 return BrickUPnP.prototype.UPnPEvent.apply(this, [event, service]);
	}
BrickUPnP_MediaRenderer.prototype.UpdateEvent	= function(eventNode, service) {
	 var i, val, content;
	 // console.log("\t", this.brickId, service.serviceType, "<" + eventNode.tagName + ">");
	 switch(eventNode.tagName) {
		 case 'InstanceID'					:
			val = eventNode.getAttribute('val');
			this.currentInstanceID = val;
			if(typeof this.MediasStates[val] === 'undefined') {this.MediasStates[val] = {};}
			for(i=0; i<eventNode.childNodes.length; i++) {
				 this.UpdateEvent( eventNode.childNodes.item(i), service );
				}
			break;
		 case 'LastChange':
			var doc = xmldomparser.parseFromString(eventNode.textContent, 'text/xml');
			// console.log( "doc.documentElement:", doc.documentElement.childNodes.length);
			for(i=0; i<doc.documentElement.childNodes.length; i++) {
				 this.UpdateEvent( doc.documentElement.childNodes.item(i), service );
				}
		 break;
		 case 'SourceProtocolInfo'		:
		 case 'SinkProtocolInfo'		:
		 case 'CurrentConnectionIDs'	:
			content = eventNode.textContent;
			if (typeof this.MediasStates[service.serviceType] === 'undefined') {
				 this.MediasStates[service.serviceType] = {};
				}
			this.MediasStates[service.serviceType][eventNode.tagName] = content;
			this.emit		( "eventUPnP" 
							, { serviceType	: service.serviceType
							  , attribut	: eventNode.tagName
							  , value		: content
							  }
							);
		 break;
		 default:
			 if(eventNode.hasAttribute('val')) {
				 val = eventNode.getAttribute('val');
				 // this.MediasStates[this.currentInstanceID || 0][eventNode.tagName] = val;
				 this.MediasStates[service.serviceType] = this.MediasStates[service.serviceType] || {};
				 this.MediasStates[service.serviceType][eventNode.tagName] = val;
				 console.log(service.serviceType, eventNode.tagName, val);
				 this.MediasStates[service.serviceType][eventNode.tagName] = val;
				 this.emit		(eventNode.tagName, {value: val});
				 this.emit		( "eventUPnP" 
								, { serviceType	: service.serviceType //this.currentInstanceID
								  , attribut	: eventNode.tagName
								  , value		: val
								  }
								);
				 // webServer.emit	( "eventForBrick_" + this.brickId
								// , { serviceType	: service.serviceType //this.currentInstanceID
								  // , attribut	: eventNode.tagName
								  // , value		: val
								  // }
								// );
				} else {console.error('Event that has no val attribute :', eventNode.tagName);
					   }
			//console.log('BrickUPnP_MediaRenderer::UpdateEvent('+eventNode.tagName+') has to be implemented : ');
		}
	 // console.log("\t</", eventNode.tagName, ">");
	 return this;
	}

// Links to the MediaServers
BrickUPnP_MediaRenderer.prototype.getMediaServersIds = function() {
	 var L_Bricks = BrickUPnP_MediaServer.getBricks()
	   , L_Ids    = [];
	 for(var i=0; i<L_Bricks.length; i++) {
		 var MS = L_Bricks[i];
		 L_Ids.push( {id: MS.brickId, name: MS.UPnP.friendlyName} );
		}
	 return L_Ids;
	}

// ------------------------- Factory -------------------------
var Factory__BrickUPnP_MediaRenderer = new BrickUPnPFactory(
												  'Factory__BrickUPnP_MediaRenderer'
												, BrickUPnP_MediaRenderer
												, function(device) {
													 // console.log("Is this a MediaRenderer?");
													 return device.deviceType.indexOf("urn:schemas-upnp-org:device:MediaRenderer:") === 0;
													}
												); 
Factory__BrickUPnP_MediaRenderer.setFactoryMediaServer = function(fact) {
	 this.FactoryMediaServer = fact;
	}

module.exports = Factory__BrickUPnP_MediaRenderer;
