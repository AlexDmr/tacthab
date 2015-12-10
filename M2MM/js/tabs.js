var domReady	= require("./domReady.js");

// console.log('tabs.js');
require( "./tabs.css" );


function whichTransitionEvent(){
    var t;
    var el = document.createElement('fakeelement');
    var transitions = {
      'transition'		: 'transitionend',
      'OTransition'		: 'oTransitionEnd',
      'MozTransition'	: 'transitionend',
      'WebkitTransition': 'webkitTransitionEnd'
    }

    for(t in transitions){
        if( el.style[t] !== undefined ){
            return transitions[t];
        }
    }
}
var transitionEvent = whichTransitionEvent();
function kebloEvent(e) {e.stopPropagation();}

function tabs(node) {
	this.node = node;
	this.last_active = null;
	var L_tabMenus = node.querySelectorAll( '.tabMenu *[data-target]' ), menu, content;
	for(var i=0; i<L_tabMenus.length; i++) {
		 menu = L_tabMenus.item(i);
		 content = this.node.querySelector( '.tabContent[data-tab='+menu.dataset.target+']' );
		 content.classList.add('hidden');
		 this.processMenu(menu);
		}
}

tabs.prototype.HideShow = function(menuHide, menuShow) {
	// Hide
	var contentHide, self = this;
	if(menuHide) {
		 menuHide.classList.remove('display');
		 contentHide = this.node.querySelector( '.tabContent[data-tab='+menuHide.dataset.target+']' );
		 contentHide.classList.remove('display');
		}
	// Show
	menuShow.classList.add('display');
	var contentShow = this.node.querySelector( '.tabContent[data-tab='+menuShow.dataset.target+']' );
	// callback
	if(transitionEvent) {
		 var cb = function() {contentShow.classList.add('display');}
		 if(contentHide) {
			 var transitionCb;
			 this.node.addEventListener('click', kebloEvent, true);
			 contentHide.addEventListener( transitionEvent
										 , transitionCb = function() {
											 if(menuHide) {contentHide.classList.add   ('hidden' );}
											 contentShow.classList.remove('hidden' );
											 contentShow.classList.add('appearing');
											 // window.requestAnimationFrame( function() {cb(); self.node.removeEventListener('click', kebloEvent, true);});
											 setTimeout	( function() {window.requestAnimationFrame(cb);
																	  self.node.removeEventListener	 ('click', kebloEvent, true);
																	  contentHide.removeEventListener(transitionEvent, transitionCb, false);
																	  contentShow.classList.remove('appearing');
																	 }
														, 0);
											}
										 , false);
			}
		 else {contentShow.classList.remove('hidden' );
			   contentShow.classList.add   ('display');
			  }
		} else {if(menuHide) {contentHide.classList.add   ('hidden' );}
				contentShow.classList.remove('hidden' );
			    contentShow.classList.add   ('display');
			   }
}

tabs.prototype.processMenu = function(menu) {
	var self = this;
	menu.onclick = function() {
		 self.HideShow(self.last_active, menu);
		 self.last_active = menu;
		}
	// self.last_active.classList.add('hidden');
	if(!self.last_active) {
		 menu.onclick();
		 this.node.querySelector( '.tabContent[data-tab='+menu.dataset.target+']' ).classList.remove('hidden');
		}
}

domReady( function() {
	// console.log("domReady for tabs");
	var allTabs = document.querySelectorAll('.tabs'), tab;
	for(var i=0; i<allTabs.length; i++) {
		 tab = allTabs.item(i);
		 new tabs(tab);
		}
	} );
	
module.exports = tabs;

