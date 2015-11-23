
function AlxEvent(classe) {
	classe.prototype.emit				= AlxEvent.prototype.emit;
	classe.prototype.on					= AlxEvent.prototype.on;
	classe.prototype.off				= AlxEvent.prototype.off;
	classe.prototype.disposeAlxEvent	= AlxEvent.prototype.disposeAlxEvent;
}

AlxEvent.prototype.emit	= function(eventName, event) {
	var i;
	if(this.AlxEvent && this.AlxEvent[eventName]) {
		 // console.log("emiting to", this.AlxEvent[eventName]);
		 for(i=0; i<this.AlxEvent[eventName].length; i++) {
			 this.AlxEvent[eventName][i].apply(this, [event])
			}
		 this.AlxEvent["*"] = this.AlxEvent["*"] || [];
		 for(i=0; i<this.AlxEvent["*"].length; i++) {
			 this.AlxEvent["*"][i].apply(this, [event])
			}
		}
	return this;
}

AlxEvent.prototype.on	= function(eventName, callback) {
	if(typeof this.AlxEvent === 'undefined') {this.AlxEvent = {}}
	if(typeof this.AlxEvent[eventName] === 'undefined') {this.AlxEvent[eventName] = [];}
	if(this.AlxEvent[eventName].indexOf(callback) === -1) {
		 this.AlxEvent[eventName].push( callback );
		}
	return this;
}

AlxEvent.prototype.off	= function(eventName, callback) {
	if(this.AlxEvent && this.AlxEvent[eventName]) {
		 var pos = this.AlxEvent[eventName].indexOf(callback);
		 if(pos >= 0) {
			 this.AlxEvent[eventName].splice(pos, 1);
			}
		}
	return this;
}

AlxEvent.prototype.disposeAlxEvent	= function(eventName, callback) {
	if(this.AlxEvent) {
		 var keys, key;
		 for(var e in keys) {
			  key = key[e];
			  this.AlxEvent[e] = [];
			  delete this.AlxEvent[e];
			}
		}
	return this;
}

module.exports = AlxEvent;
