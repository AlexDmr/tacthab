
var css = document.createElement( 'link' );
	css.setAttribute('rel' , 'stylesheet');
	css.setAttribute('href', 'js/AlxHierarchicalList/liste.css');
	document.head.appendChild( css );

// function toggleOpen(e) {e.currentTarget.parentNode.classList.toggle('open');}

function AlxHierarchicalList(name, config) {
	 var self		= this;
	 this.parentList= null;
	 this.divRoot	= document.createElement('div');
		this.divRoot.setAttribute('class', config.classes || '');
		this.divRoot.classList.add('AlxHierarchicalList');
	 this.ulRoot  = document.createElement('ul');			
	 this.pName  = document.createElement('p');
		this.pName.appendChild( document.createTextNode(name) );
		this.pName.addEventListener(
			  'click'
			, function() {
				if(self.parentList) {
					 self.parentList.li.classList.toggle('open');
					}
				}
			, false );
	 this.divRoot.appendChild( this.pName );
	 this.divRoot.appendChild( this.ulRoot );
	 this.subLists	= [];
	 if(config.onclick) {
		 this.pName.onclick = function(e) {
									 config.onclick.apply(self, [e]);
									}
		}
	 
	 return this;
	}
AlxHierarchicalList.prototype.emptyAll = function() {
	 this.ulRoot.innerHTML = "";
	 for(var i=0; i<this.subLists.length; i++) {
		 delete this.subLists[i];
		}
	 this.subLists = [];
	}	
AlxHierarchicalList.prototype.addList = function(name, config) {
	 var li = document.createElement('li');
		this.ulRoot.appendChild( li );
		li.classList.add( 'AlxHierarchicalList' );
	 var newAlxL = new AlxHierarchicalList(name, config);
		newAlxL.plugUnder( li );
		newAlxL.parentList = {list: this, li: li};
		this.subLists.push( newAlxL );
	 return this;
	}
AlxHierarchicalList.prototype.addItem = function(name, config) {
	 var li			= document.createElement('li');
	 var textNode	= document.createTextNode(name);
	 li.appendChild( textNode );
	 li.setAttribute('class', config.classes || '');
	 li.classList.add( 'item' );
	 this.ulRoot.appendChild( li );
	 if(config.onclick) {
		 li.onclick = config.onclick;
		}
	 return this;
	}
AlxHierarchicalList.prototype.plugUnder	= function(htmlNode) {
	 if(this.divRoot.parentNode) {
		 this.divRoot.parentNode.removeChild( this.divRoot );
		}
	 htmlNode.appendChild( this.divRoot );
	 return this;
	}
	
module.exports = AlxHierarchicalList;

