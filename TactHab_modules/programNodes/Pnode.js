define( [ //'../webServer/webServer.js'
	    ]
	  , function(/*webServer*/) {
var states		= {0:'stopped', 1:'started'};
var id			= 0;
var D_nodes		= {};
var D_classes	= {};

// Definition of a node for programs
var Pnode = function(parent, children) {
	 this.parent	= parent	|| null;
	 this.children	= children	|| [];
		 if(parent) {parent.children.push(this);}
		 for(var i in children) {children[i].parent = this;}
	 this.state		= 0;
	 this.name		= '';
	 this.id		= 'Node' + (id++);
	 D_nodes[this.id] = this;
	 return this;
	}
Pnode.prototype.constructor = Pnode;
Pnode.prototype.className	= 'Pnode';

Pnode.prototype.getClasses	= function() {return [Pnode.prototype.className];}
Pnode.prototype.getD_classes= function() {return D_classes;}
Pnode.prototype.appendClass	= function(classe) {D_classes[classe.prototype.className] = classe;}

// API for starting, stopping the instruction
Pnode.prototype.serialize	= function() {
	var json = {className: this.className, PnodeID: this.id, children: []};
	for(i in this.children) {
		 json.children.push( this.children[i].serialize() );
		}
	return json;
}
Pnode.prototype.unserialize	= function(json, Putils) {
	// className and id are fixed by the constructor of the object itself
	var children = this.children.slice();
	for(var i in children		) {children.setParent(null);}
	for(var i in json.children	) {Putils.unserialize(json.children[i], Putils).setParent(this);}
	return this;
}
Pnode.prototype.isInstanceOf= function(classe)	{return this.getClasses().indexOf(classe) >= 0;}
Pnode.prototype.getNode		= function(id)		{return D_nodes[id];}
Pnode.prototype.setName		= function(name)	{this.name = name; return this;}
Pnode.prototype.setParent	= function(node)	{
	if(this.parent) {
		 var pos = this.parent.children.indexOf(this);
		 this.parent.children.splice(pos, 1);
		}
	this.parent = node;
	if(node) {node.children.push(this);}
	return this;
}

Pnode.prototype.Start = function() {
	// Log the execution ?
	return this.setState(1);
}
Pnode.prototype.Stop = function() {
	if(this.state !== 0) {
		 // Stop the execution
		 for(var i=0; i<this.children.length; i++) {
			 this.children[i].Stop();
			}
		}
	return this.setState(0);
}

Pnode.prototype.getStateName = function() {return states[this.state];}
Pnode.prototype.getState = function() {return this.state;}
Pnode.prototype.setState = function(state) {
	var prevState = this.state;
	this.state = state;
	if(prevState !== state) {
		 if(this.cb_setState) {this.cb_setState.apply(this, [this, prevState, state]);}
		 if(Pnode.prototype.CB_setState) {Pnode.prototype.CB_setState.apply(this, [this, prevState, state]);}
		 // console.log(this.className, "setting state to ", state);
		 if(this.parent) this.parent.childStateChanged(this, prevState, state);
		 return true;
		} else {return false;}
}
Pnode.prototype.on_setState = function(cb) {this.cb_setState = cb;}
Pnode.prototype.CB_setState = null;

Pnode.prototype.childStateChanged = function(child, prevState, newState) {}

Pnode.prototype.call = function(call) {
	// Propagate an action call if it is not forbidden
	if(this.parent) {
		 return this.parent.call(call);
		} else {error("Call cannot be propagated");}
}

Pnode.prototype.getContext = function() {
	// Propagate a call for context information
	if(this.parent) {
		 return this.parent.getContext();
		} else {return {};}
}

return Pnode;
});