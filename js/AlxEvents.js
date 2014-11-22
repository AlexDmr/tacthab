define(	[]
	  , function() {
function AlxEvent(classe) {
	classe.prototype.emit	= AlxEvent.prototype.emit;
	classe.prototype.on		= AlxEvent.prototype.on;
	classe.prototype.off	= AlxEvent.prototype.off;
}

AlxEvent.prototype.emit	= function(eventName, event) {
	if(this.AlxEvent && this.AlxEvent[eventName]) {
		 for(var i=0; i<this.AlxEvent[eventName].length; i++) {
			 this.AlxEvent[eventName][i].apply(this, [event])
			}
		}
}

AlxEvent.prototype.on	= function(eventName, callback) {
	if(typeof this.AlxEvent === 'undefined') {this.AlxEvent = {}}
	if(typeof this.AlxEvent[eventName] === 'undefined') {this.AlxEvent[eventName] = [];}
	if(this.AlxEvent[eventName].indexOf(callback) === -1) {
		 this.AlxEvent[eventName].push( callback );
		}
}

AlxEvent.prototype.off	= function(eventName, callback) {
	if(this.AlxEvent && this.AlxEvent[eventName]) {
		 var pos = this.AlxEvent.indexOf(callback);
		 if(pos >= 0) {
			 this.AlxEvent[eventName].splice(pos, 1);
			}
		}
}

return AlxEvent;
});