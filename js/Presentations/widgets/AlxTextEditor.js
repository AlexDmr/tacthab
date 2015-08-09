// var DragDrop	= require( '../../DragDrop.js' )
  // , utils		= require( '../../utils.js' )
  // ;
  
var css = document.createElement('link');
	css.setAttribute('rel' , 'stylesheet');
	css.setAttribute('href', 'js/Presentations/widgets/AlxTextEditor.css');
	
// Defining the extended text editor
function AlxTextEditor() {
	this.root = document.createElement('div');
	this.root.setAttribute('contenteditable', 'true');
	this.root.classList.add('AlxTextEditor');
	
	return this;
}


AlxTextEditor.prototype.Render = function() {
	if(this.root.parentNode) {this.root.parentNode.removeChild(this.root);}
	return this.root;
}

module.exports = AlxTextEditor;
