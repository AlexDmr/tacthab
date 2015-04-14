var pipoDoc;
define	( [ '../../AlxHierarchicalList/liste.js'
		  , '../protoPresentation.js'
		  , '../../utils.js'
		  ]
		, function(AlxHierarchicalList, protoPresentation, utils) {
	var XMLparser = new DOMParser();
	
	function MediaServer(id, name, idMediaServer) {
		 protoPresentation.apply(this, []);
		 var self			= this;
		 this.remoteBrickId	= id;
		 this.idMediaServer	= idMediaServer;
		 this.name			= name;
		 this.AlxListe		= new AlxHierarchicalList(
								  name
								, { classes	: "MediaServer"
								  , onclick	: function() {
										 self.Browse('0', self.AlxListe);
										}
								  }
								);
		 // Subscribe to events from server
		 utils.io.on( 'eventForBrick_' + this.remoteBrickId
					, function(json) {
						 console.log( self
									, "eventForBrick_" + this.remoteBrickId
									, json );
						}
					);
		 utils.call	( self.remoteBrickId
					, 'getServerStates'
					, []
					, function(res) {
						 console.log(self.remoteBrickId, 'getServerStates', res);
						}
					);
		 return this;
		}
		
	MediaServer.prototype	= new protoPresentation();
	MediaServer.prototype.Render	= function() {
		 var root = protoPresentation.prototype.Render.apply(this, []);
		 if(typeof this.htmlMediaServer === "undefined") {
			 this.htmlMediaServer = document.createElement('p');
				this.htmlMediaServer.appendChild( document.createTextNode( this.remoteBrickId + ' : ' + this.idMediaServer ) );
				this.divVariables	= document.createElement('div');
					this.tableVariables	= document.createElement('table');
					this.divVariables.appendChild( this.tableVariables );
				root.appendChild( this.divVariables );
				root.appendChild( this.htmlMediaServer );
			}
		 this.AlxListe.plugUnder( root );
		 return root;
		}
	MediaServer.prototype.itemSelected	= function(itemId, icon, uri, title) {
		 console.log( this.remoteBrickId, "MediaServer::itemSelected"
					, "\n\titemId :", itemId
					, "\n\t title :", title
					, "\n\t  icon :", icon
					, "\n\t   uri :", uri
					);
		}
	MediaServer.prototype.Browse		= function(id, AlxListe, remoteBrickId) {
		 var self = this;
		 remoteBrickId = remoteBrickId || self.remoteBrickId;
		 utils.call	( remoteBrickId
					, 'Browse'
					, [id]
					, function(res) {
						 // console.log("Result of Browse", id, ":", res);
						 if(typeof res === "string") {
							 AlxListe.emptyAll();
							 var doc = pipoDoc = XMLparser.parseFromString(res, "text/xml");
							 var Result = doc.getElementsByTagName('Result').item(0);
							 if(Result) {
								 var ResultDoc = XMLparser.parseFromString(Result.textContent, "text/xml");
								 var L_containers = ResultDoc.getElementsByTagName('container');
								 for(var i=0; i<L_containers.length; i++) {
									 var container	= L_containers.item(i);
									 var contId		= container.getAttribute('id');
									 var title		= container.getElementsByTagName('title').item(0).textContent;
									 AlxListe.addList	( title
														, { classes	: "UPnP_container"
														  , onclick	: function(contId) {return function() {
																 console.log("Browse", contId, this);
																 self.Browse(contId, this, remoteBrickId);
																};}(contId)
														  }
														);
									 // console.log("dc:title", container.getElementsByTagName('dc:title'));
									 // console.log("title", container.getElementsByTagName('title'));
									} // End of containers
								 var L_items	= ResultDoc.getElementsByTagName('item');
								 // console.log("There is", L_items.length, "items");
								 for(var i=0; i<L_items.length; i++) {
									 var item	= L_items.item(i);
									 var itemId	= item.getAttribute('id');
									 var title	= item.getElementsByTagName('title').item(0).textContent;
									 var icon	;
										if(item.getElementsByTagName('albumArtURI').length) {
											 icon = item.getElementsByTagName('albumArtURI').item(0).textContent;
											} else {icon = null;}
									 var uri	= item.getElementsByTagName('res').item(0).textContent;
									 AlxListe.addItem	( title
														, { classes	: "UPnP_item"
														  , onclick	: function(itemId, icon, uri, title) {return function() {
																 console.log("Select", itemId, icon, uri);
																 self.itemSelected(itemId, icon, uri, title);
																};}(itemId, icon, uri, title)
														  }
														);
									}
								}
							}
						}
					);
		}
	
	return MediaServer;
});
