require( "./mediaSelector.css" );
var utils		= require( "../../js/utils.js" )
  , parser		= new DOMParser()
  ;


function getDirectoriesAndMediaFromString(serverId, str) {
	var json = {directories: [], medias: []};
	var doc = parser.parseFromString(str, "text/xml");
	var Result = doc.querySelector('Result');
	if(Result) {
		 var ResultDoc = parser.parseFromString(Result.textContent, "text/xml");
		 var L_containers = ResultDoc.querySelectorAll('container') 
		   , i, title, icon;
		 for(i=0; i<L_containers.length; i++) {
			 var container	= L_containers.item(i);
			 title	= container.querySelector('title').textContent; //container.getElementsByTagName('title').item(0).textContent;
			 icon	= container.querySelector('albumArtURI'); icon = icon?icon.textContent:"./images/icons/folder_256.png";
			 json.directories.push( {serverId: serverId, name: title, iconURL: icon, directory: container.getAttribute("id")} );
			} // End of containers
		 var L_items	= ResultDoc.querySelectorAll('item'); 
		 for(i=0; i<L_items.length; i++) {
			 var item	= L_items.item(i);
			 title	= item.querySelector('title').textContent; //item.getElementsByTagName('title').item(0).textContent;
			 icon	= item.querySelector('albumArtURI'); icon = icon?icon.textContent:"./images/icons/media_icon.jpg"; 
			 json.medias.push( {serverId: serverId, name: title, iconURL: icon, mediaId: item.getAttribute("id")} );
			}
		}
	return json;
}

module.exports = function(app) {
	app.directive	( "mediaSelector"
					, function() {
						 return {
							  restrict		: 'A'
							, templateUrl	: "./templates/mediaSelector.html"
							, controller	: function($scope) {
								 var ctrl = this;
								 this.searching		= false;
								 // console.log("mediaSelector");
								 this.localBricks	= $scope.bricks; 
								 this.serverId		= null;
								 this.breadcrumb	= [ {name: "Servers"} ];
								 this.directories	= null;
								 this.medias		= null;
								 this.navigateTo	= function(ad) {
									 // console.log(ad);
									 var pos = this.breadcrumb.indexOf(ad);
									 if(pos !== -1) {
										 // console.log( "go back to", ad );
										 this.breadcrumb.splice(pos+1, this.breadcrumb.length);
										} else	{//console.log( "entering", ad );
												 this.breadcrumb.push(ad);
												}
									 // Go to ad
									 this.localBricks	= [];
									 this.directories	= [];
									 this.medias		= [];
									 this.searching		= true;
									 if(this.breadcrumb.length === 1) {
										 this.localBricks	= $scope.bricks; 
										 ctrl.searching		= false;
										} else	{utils.call	( ad.serverId || ad.id
															, "Browse"
															, [ad.directory || "0"]
															).then	( function(data) {
																		 var json = getDirectoriesAndMediaFromString(ad.serverId || ad.id, data);
																		 ctrl.directories	= json.directories;
																		 ctrl.medias		= json.medias;
																		 ctrl.searching		= false;
																		 $scope.$apply();
																		}
																	);
												}
									}
								}
							, controllerAs	: "ms"
							, scope			: { bricks	: "=bricks"
											  , title	: "@title"
											  }
							, link			: function(scope, element, attr, controller) {
								// interact(element).draggable( {inertia: true} );
							}
							};
						}
					);
};


