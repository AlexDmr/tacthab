require( "./mediaPlayer.css" );
var utils = require( "../../../js/utils.js" );

module.exports = function(app) {
	app.directive	( "mediaPlayer"
					, function() {
						return {
							  restrict	: 'E'
							, controller	: function($scope) {
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
									 console.log( "new mediaPlayer getMediasStates", $scope.brick );
									 utils.call	( $scope.brick.id, "getMediasStates", []
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
										 return utils.call	( $scope.brick.id, "setVolume", [volume] );
									 }
									 this.Play	= function() {
										 return utils.call	( $scope.brick.id, "Play", [] );
									 }
									 this.Stop	= function() {
										 return utils.call	( $scope.brick.id, "Stop", [] );										 
									 }
									 this.Pause	= function() {
										 return utils.call	( $scope.brick.id, "Pause", [] );
									 }
									 this.Load	= function(serverId, mediaId) {
										 return utils.call	( $scope.brick.id, "loadMedia", [serverId, mediaId] );
									 }
									 this.dropMedia	= function(event, draggedInfo) {
										 // console.log( "dropMedia", event, draggedInfo);
										 var info = draggedInfo.draggedData;
										 return this.Load( info.serverId, info.mediaId
														 ).then( function(res) {ctrl.Play()} );
									 }
									}
							, controllerAs	: 'mpc'
							, templateUrl	: "/IHM/js/brick/mediaPlayer.html"
							, scope			: { brick	: "=brick"
											  }
							, link			: function(scope, element, attr, controller) {
								 // Subscribe to socket.io events
								 var eventCB
								   , cbEventName = scope.brick.id + "->eventUPnP";
								 utils.io.emit	( "subscribeBrick"
												, { brickId		: scope.brick.id
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
																	, { brickId		: scope.brick.brickId
																	  , eventName	: "eventUPnP"
																	  , cbEventName	: cbEventName
																	  }
																	);
													} 
												);
								/* OLD
								 var eventCB = function(data) {
										 console.log(data);
										 controller.state[data.serviceType] = controller.state[data.serviceType] || {};
										 try {
											 controller.state[data.serviceType][data.attribut] = data.value;
											 controller.updateFromUPnP();
											} catch(error) {
												console.error(error);
											}
										}
								 element.on	( "$destroy", function() {utils.io.off( "eventForBrick_" + scope.brick.id, eventCB);} );
								 utils.io.on( "eventForBrick_" + scope.brick.id, eventCB);
								 */
								}
							};
						}
					);
}
