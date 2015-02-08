define( [ './Pnode.js'
	    ]
	  , function(Pnode) {
// console.log('Pnode is a ', Pnode);
// Definition of a node for programs
var SequenceNode = function(parent, children) {
	 Pnode.prototype.constructor.apply(this, [parent, children]);
	 this.currentChildIndex = -1;
	 return this;
	}

// API for starting, stopping the instruction
SequenceNode.prototype = new Pnode();
SequenceNode.prototype.className	= 'SequenceNode';
Pnode.prototype.appendClass(SequenceNode);

var classes = Pnode.prototype.getClasses().slice();
classes.push(SequenceNode.prototype.className);
SequenceNode.prototype.getClasses	= function() {return classes;};

SequenceNode.prototype.Start = function() {
	var res = Pnode.prototype.Start.apply(this, []);
	if(res) {
		 if(this.children.length) {
			 // Start the sequence
			 this.currentChildIndex = 0;
			 this.children[this.currentChildIndex].Start()
			} else {this.Stop();}
		}
	return res;
}

SequenceNode.prototype.Stop = function() {
	this.currentChildIndex = -1;
	return Pnode.prototype.Stop.apply(this, []);
}

SequenceNode.prototype.childStateChanged = function(child, prevState, newState) {
	if(this.currentChildIndex === -1) return;
	if(child === this.children[this.currentChildIndex]) {
		 if(newState === 0){
			 this.currentChildIndex++;
			 if(this.currentChildIndex >= this.children.length) {
				 this.Stop();
				} else	{this.children[this.currentChildIndex].Start();}
			}
		} else {error('SequenceNode::childStateChanged : a child state changed but this was not the expected child !');}
}
return SequenceNode;
});
