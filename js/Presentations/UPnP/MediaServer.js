var AlxHierarchicalList	= require( '../../AlxHierarchicalList/liste.js' )
  , protoPresentation	= require( '../protoPresentation.js' )
  , utils				= require( '../../utils.js' )
  ;
  
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
	
MediaServer.prototype				= Object.create( protoPresentation.prototype ); // new protoPresentation();
MediaServer.prototype.constructor	= MediaServer;

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
function CB_BrowseCont(MS, contId, remoteBrickId) {
	 return function() {console.log("Browse", contId, this);
						MS.Browse(contId, this, remoteBrickId);
					   };
	}
function CB_BrowseItem(MS, itemId, icon, uri, title) {
	return function()  {console.log("Select", itemId, icon, uri);
						MS.itemSelected(itemId, icon, uri, title);
					   };
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
						 var doc = XMLparser.parseFromString(res, "text/xml")
						   , Result = doc.getElementsByTagName('Result').item(0)
						   , i, title, container, contId, item, itemId, icon, uri, L_items
						   , ResultDoc, L_containers;
						 if(Result) {
							 ResultDoc = XMLparser.parseFromString(Result.textContent, "text/xml");
							 L_containers = ResultDoc.getElementsByTagName('container');
							 for(i=0; i<L_containers.length; i++) {
								 container	= L_containers.item(i);
								 contId		= container.getAttribute('id');
								 title		= container.getElementsByTagName('title').item(0).textContent;
								 AlxListe.addList	( title
													, { classes	: "UPnP_container"
													  , onclick	: CB_BrowseCont(self, contId, remoteBrickId)
													  }
													);
								 // console.log("dc:title", container.getElementsByTagName('dc:title'));
								 // console.log("title", container.getElementsByTagName('title'));
								} // End of containers
							 L_items	= ResultDoc.getElementsByTagName('item');
							 // console.log("There is", L_items.length, "items");
							 for(i=0; i<L_items.length; i++) {
								 item	= L_items.item(i);
								 itemId	= item.getAttribute('id');
								 title	= item.getElementsByTagName('title').item(0).textContent;
									if(item.getElementsByTagName('albumArtURI').length) {
										 icon = item.getElementsByTagName('albumArtURI').item(0).textContent;
										} else {icon = null;}
								 uri	= item.getElementsByTagName('res').item(0).textContent;
								 AlxListe.addItem	( title
													, { classes	: "UPnP_item"
													  , onclick	: CB_BrowseItem(self, itemId, icon, uri, title)
													  }
													);
								}
							}
						}
					}
				);
	}

module.exports = MediaServer;

