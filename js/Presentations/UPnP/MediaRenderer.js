var protoPresentation	= require( '../protoPresentation.js' )
  , utils				= require( '../../utils.js' )
  , AlxHierarchicalList	= require( '../../AlxHierarchicalList/liste.js' )
  , MediaServer			= require( './MediaServer.js' )
  ;
  
var css = document.createElement('link');
	css.setAttribute('rel' , 'stylesheet');
	css.setAttribute('href', 'js/Presentations/UPnP/css/MediaRenderer.css');
	document.head.appendChild( css );
	
function CB_BrowseFromBrickId(MR, brickId) {
	 return function() {MR.Browse('0', this, brickId);};
	}
	
function MediaRenderer(id, name, idMediaRenderer) {
	 protoPresentation.apply(this, []);
	 var self				= this;
	 this.remoteBrickId		= id;
	 this.idMediaRenderer	= idMediaRenderer;
	 this.name				= name;
	 this.AlxListe		= new AlxHierarchicalList(
							  name
							, { classes	: "MediaRenderer"
							  , onclick	: function() {
									 // Ask for MediaServer
									 utils.call	( self.remoteBrickId
												, 'getMediaServersIds'
												, []
												, function(L) {
													 console.log(self.remoteBrickId, 'getMediaServersIds', L);
													 self.AlxListe.emptyAll();
													 for(var i=0; i<L.length; i++) {
														 var MS = L[i]; console.log(MS);
														 self.AlxListe.addList(
																  MS.name
																, { classes : 'MediaServer'
																  , onclick : CB_BrowseFromBrickId(self, MS.id)
																  }
																);
														}
													}
												);
									}
							  }
							);
	 // Subscribe to events from server
	 utils.io.on( 'eventForBrick_' + this.remoteBrickId
				, function(json) {
					 console.log( self, "received", json);
					 // self.RemoteStates[]
					}
				);
	 self.RemoteStates	= {};
	 utils.call	( self.remoteBrickId
				, 'getMediasStates'
				, []
				, function(res) {
					 console.log(self.remoteBrickId, 'getMediasStates', res);
					 self.RemoteStates = res;
					 self.updateRenderTable();
					}
				);
	 return this;
	}

MediaRenderer.prototype				= Object.create( protoPresentation.prototype ); // new protoPresentation();
MediaRenderer.prototype.constructor	= MediaRenderer;

MediaRenderer.prototype.Browse = MediaServer.prototype.Browse;
MediaRenderer.prototype.itemSelected	= function(itemId, icon, uri, title) {
	 var self = this;
	 console.log( this.remoteBrickId, "MediaRenderer::itemSelected"
				, "\n\titemId :", itemId
				, "\n\t title :", title
				, "\n\t  icon :", icon
				, "\n\t   uri :", uri
				);
	 utils.call	( self.remoteBrickId
				, 'loadMedia'
				, [uri]
				, function(rep) {
					 if(rep.error) {
						 console.error("error in remote call", self.remoteBrickId, uri, ":\n", rep);
						} else 	{console.log("OK for ", self.remoteBrickId, uri, ":\n", rep);
								 utils.call	( self.remoteBrickId
											, 'Play'
											, []
											, function(data) {
												 console.log("play =>", data);
												}
											);
								}
					}
				);
	}
MediaRenderer.prototype.updateRenderTable	= function() {
	 // var self = this;
	 if(this.tableVariables) {
		 var table = this.tableVariables;
		 table.innerHTML = '<tr><td class="service">Service or channel</td><td class="var">Variable</td><td class="val">Value</td></tr>';
		 for(var s in this.RemoteStates) {
			 var tr = document.createElement('tr')
			   , th = document.createElement('th');
			 th.appendChild( document.createTextNode(s) );
			 tr.appendChild( th ); var nb = 0;
			 for(var v in this.RemoteStates[s]) {
				 var val = this.RemoteStates[s][v];
				 var tdVar = document.createElement('td')
				   , tdVal = document.createElement('td');
				 tr.appendChild( tdVar ); tdVar.appendChild( document.createTextNode(v  ) );
				 tr.appendChild( tdVal ); tdVal.appendChild( document.createTextNode(val) );
				 table.appendChild(tr);
				 tr = document.createElement('tr');
				 nb++;
				}
			 th.setAttribute('rowspan', nb);
			 table.appendChild(tr);
			}
		}
	}
MediaRenderer.prototype.Render	= function() {
	 var root = protoPresentation.prototype.Render.apply(this, []);
	 root.classList.add('MediaRenderer');
	 this.AlxListe.plugUnder( root );
	 if(typeof this.htmlMediaRenderer === "undefined") {
		 this.details			= document.createElement('details');
		 this.summary			= document.createElement('summary');
		 this.htmlMediaRenderer = document.createElement('p');
			this.htmlMediaRenderer.appendChild( document.createTextNode( this.name + ' : ' + this.remoteBrickId + ' : ' + this.idMediaRenderer ) );
				this.tableVariables	= document.createElement('table');
			this.details.appendChild( this.tableVariables );
			this.details.appendChild( this.summary );
			this.summary.appendChild( this.htmlMediaRenderer );
			root.appendChild( this.details );
		}
	 return root;
	}

module.exports = MediaRenderer;

