var Pnode = require( './Pnode.js' );

// console.log('Pnode is a ', Pnode);
// Definition of a node for programs
var ParallelNode = function() {
	 Pnode.prototype.constructor.apply(this, []);
	 return this;
	}

// API for starting, stopping the instruction
ParallelNode.prototype = Object.create( Pnode.prototype ); //new Pnode();
ParallelNode.prototype.constructor	= ParallelNode;
ParallelNode.prototype.className	= 'ParallelNode';
Pnode.prototype.appendClass(ParallelNode);

var classes = Pnode.prototype.getClasses().slice();
classes.push(ParallelNode.prototype.className);
ParallelNode.prototype.getClasses	= function() {return classes;};

ParallelNode.prototype.Start = function() {
	var res = Pnode.prototype.Start.apply(this, []);
	if( res ) {
		this.childrenStopped = new Int8Array(this.children.length);
		for(var i=0; i<this.children.length; i++) {
			 this.childrenStopped[i] = false;
			 this.children[i].Start();
			}
		 if(this.children.length === 0) {this.Stop();}
		}
	return res;
}

ParallelNode.prototype.childStateChanged = function(child, prevState, newState) {
	if(this.childrenStopped) {
		this.childrenStopped[ this.children.indexOf(child) ] = (newState === 0);
		for(var i=0; i<this.childrenStopped.length; i++) {
			 if(this.childrenStopped[i] === 0) {return;}
			}
		}
	this.Stop();
}

module.exports = ParallelNode;

