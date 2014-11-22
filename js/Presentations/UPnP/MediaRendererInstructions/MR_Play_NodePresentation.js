define	( [ '../../ActionNodePresentation.js'
		  , '../../../utils.js'
		  ]
		, function(ActionNodePresentation, utils) {
	// 
	var MR_Play_NodePresentation = function() {
		 ActionNodePresentation.apply(this, []);
		 this.action.method	= 'Play';
		 return this;
		}
	
	MR_Play_NodePresentation.prototype = new ActionNodePresentation();
	MR_Play_NodePresentation.prototype.serialize = function() {
		 var json = ActionNodePresentation.prototype.serialize.apply(this, []);
		 json.subType = 'MR_Play_NodePresentation';
		 return json;
		}
	MR_Play_NodePresentation.prototype.Render = function() {
		 var self = this;
		 var root = ActionNodePresentation.prototype.Render.apply(this,[]);
		 this.html.actionName.innerHTML = "Play";
		 utils.XHR( 'GET', '/get_MediaDLNA'
				  , {onload : function() {
								 var data = JSON.parse( this.responseText );
								 if(data.error) {
									 console.error('error get_MediaDLNA', data);
									} else	{var MRs = data.MediaRenderer;
											 self.html.select.innerHTML = '';
											 for(var i=0; i<MRs.length; i++) {
												 var MR = MRs[i];
												 var option = document.createElement( 'option' );
												 option.appendChild( document.createTextNode(MR.name) );
												 option.setAttribute('value', MR.id);
												 self.html.select.appendChild( option );
												}
											 if(self.action.objectId !== "") {
												 self.html.select.value = self.action.objectId;
												}
											 self.action.objectId = self.html.select.value;
											}
								}
					}
				 );
		 return root;
		}
	
	return MR_Play_NodePresentation;
});
