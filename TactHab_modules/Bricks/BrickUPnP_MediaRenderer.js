define( [ './BrickUPnP.js'
		, './BrickUPnPFactory.js'
		, '../UpnpServer/UpnpServer.js'
		, '../webServer/webServer.js'
		, './BrickUPnP_MediaServer.js'
		, '../../js/AlxEvents.js'
		, '../../js/AlxAutomate.js'
		]
	  , function( BrickUPnP, BrickUPnPFactory
				, UpnpServer, webServer
				, BrickUPnP_MediaServer
				, AlxEvents, AlxAutomate
				) {
	var xmldom		= require( 'xmldom' );
	var xmldomparser= new xmldom.DOMParser();

	var BrickUPnP_MediaRenderer = function() {
		 BrickUPnP.prototype.constructor.apply(this, []);
		 return this;
		}
	BrickUPnP_MediaRenderer.prototype = new BrickUPnP(); BrickUPnP_MediaRenderer.prototype.unreference();
	BrickUPnP_MediaRenderer.prototype.constructor = BrickUPnP_MediaRenderer;
	BrickUPnP_MediaRenderer.prototype.getTypeName = function() {return "BrickUPnP_MediaRenderer";}

	AlxEvents	(BrickUPnP_MediaRenderer);

	BrickUPnP_MediaRenderer.prototype.init		= function(device) {
		 var self = this;
		 BrickUPnP.prototype.init.apply(this, [device]);
		 this.types.push( 'BrickUPnP_MediaRenderer' );
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
												, actions	: { PLAY	: {eventName: 'TransportState', value:'PLAYING'			}
															  , STOP	: {eventName: 'TransportState', value:'STOPPED'			}
															  , PAUSED	: {eventName: 'TransportState', value:'PAUSED_PLAYBACK'	}
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

	BrickUPnP_MediaRenderer.prototype.getESA			= function() {
		 var esa = BrickUPnP.prototype.getESA();
		 esa.events	= esa.events .concat(['Mute', 'TransportState', 'Volume', 'VolumeDB']);
		 /*
		   stateVars : ['playState']
		   states	 : { stateVar: 'play', name: 'PLAYING', enter	: [ {eventName: 'TransportState', op:'equal', value:'PLAYING'} ]
														  , leave	: [ ]
														  , update	: [ {eventName: 'TransportState', op:'equal', value:'PLAYING'} ]
					   }
		 */
		 esa.states	= esa.states .concat( [ {name: 'PLAYING', enter:[], leave:[], update:[]}
										  , {name: 'STOPPED', enter:[], leave:[], update:[]}
										  ]
										);
		 esa.actions= esa.actions.concat([]);
		 return esa;
		}

	BrickUPnP_MediaRenderer.prototype.getMediasStates	= function() {
		 return this.MediasStates;
		}
	BrickUPnP_MediaRenderer.prototype.loadMedia	= function(mediaServerId, itemId, cbSuccess, cbError) {
		 var self 		 = this;
		 var mediaServer = this.getBrickFromId(mediaServerId);
		 var service	 = mediaServer.UPnP.device.services['urn:upnp-org:serviceId:ContentDirectory'];
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
									 cbError(err);
									} else	{try	{var doc			= xmldomparser.parseFromString(buffer);
													 var metadata		= doc.getElementsByTagName('Result')[0].textContent;
													 var docMetadata	= xmldomparser.parseFromString( metadata );
													 var res			= docMetadata.getElementsByTagName('res');
													 if(res.length > 0) {
														 // console.log("URI:", res[0].textContent);
														 self.loadURI( res[0].textContent// uri
																	 , metadata
																	 , cbSuccess, cbError );
														} else {console.error("loadMedia : no res : ", metadata);}
													} catch(err2) {console.error(err2);
																   cbError(err2);
																  }
											}
								}
							);		 
		}
	BrickUPnP_MediaRenderer.prototype.loadURI	= function(uri, metadata, cbSuccess, cbError) {
		 // var self = this; console.log("loadURI", uri, metadata);
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
															, function(err, buffer) {
																 if(err) {
																	 if(cbError) cbError(err);
																	} else {if(cbSuccess) cbSuccess(buffer);}
																}
															);
										} else {if(cbError) cbError(err);}
									} else	{// Check SOAP response
											 // console.log("loadURI OK");
											 if(cbSuccess) {
												 // console.log("cbSuccess");
												 cbSuccess(buffer);
												}
											}
								}
							);
		}
	BrickUPnP_MediaRenderer.prototype.Play		= function(cb) {
		 // var self = this;
		 var service = this.UPnP.device.services['urn:upnp-org:serviceId:AVTransport'];
		 service.callAction	( 'Play'
							, { InstanceID		: 0
							  , Speed			: '1'
							  }
							, function(err, buffer) {
								 // console.log(self.brickId, "BrickUPnP_MediaRenderer::Play", err || buffer);
								 if(cb) cb(err || buffer);
								}
							);
		}
	BrickUPnP_MediaRenderer.prototype.Pause		= function(cb) {
		 var service = this.UPnP.device.services['urn:upnp-org:serviceId:AVTransport'];
		 service.callAction	( 'Pause'
							, { InstanceID		: 0
							  }
							, function(err, buffer) {
								 // console.log(this.brickId, "BrickUPnP_MediaRenderer::Pause", err || buffer);
								 if(cb) cb(err || buffer);
								}
							);
		}
	BrickUPnP_MediaRenderer.prototype.Stop		= function(cb) {
		 var service = this.UPnP.device.services['urn:upnp-org:serviceId:AVTransport'];
		 service.callAction	( 'Stop'
							, { InstanceID		: 0
							  }
							, function(err, buffer) {
								 // console.log(this.brickId, "BrickUPnP_MediaRenderer::Stop", err || buffer);
								 if(cb) cb(err || buffer);
								}
							);
		}
	BrickUPnP_MediaRenderer.prototype.GetVolume	= function(callback) {
		 var service = this.UPnP.device.services['urn:upnp-org:serviceId:RenderingControl'];
		 service.callAction	( 'GetVolume'
							, { InstanceID		: 0
							  , Channel			: "Master"
							  }
							, function(err, buffer) {
								 // console.log(this.brickId, "BrickUPnP_MediaRenderer::GetVolume", err || buffer);
								 if(callback) {
									 callback(err, buffer);
									}
								}
							);
		}
	BrickUPnP_MediaRenderer.prototype.SetVolume	= function(volume, cb) {
		 volume = Math.min(100, Math.max(0, Math.round(volume)));
		 var service = this.UPnP.device.services['urn:upnp-org:serviceId:RenderingControl'];
		 service.callAction	( 'SetVolume'
							, { InstanceID		: 0
							  , Channel			: "Master"
							  , DesiredVolume	: volume
							  }
							, function(err, buffer) {
								 // console.log(this.brickId, "BrickUPnP_MediaRenderer::SetVolume", err || buffer);
								 if(cb) cb(err || buffer);
								}
							);
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
				webServer.emit	( "eventForBrick_" + this.brickId
								, { serviceType	: service.serviceType
								  , attribut	: eventNode.tagName
								  , value		: content
								  }
								);
			 break;
			 default:
				 if(eventNode.hasAttribute('val')) {
					 val = eventNode.getAttribute('val');
					 this.MediasStates[this.currentInstanceID || 0][eventNode.tagName] = val;
					 console.log("BrickUPnP_MediaRenderer::event", eventNode.tagName, '=', val);
					 this.emit(eventNode.tagName, {value: val});
					 webServer.emit	( "eventForBrick_" + this.brickId
									, { serviceType	: this.currentInstanceID
									  , attribut	: eventNode.tagName
									  , value		: val
									  }
									);
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
	return Factory__BrickUPnP_MediaRenderer;
});