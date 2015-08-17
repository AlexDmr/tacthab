var BrickOpenHAB_item = require( './BrickOpenHAB_item.js' )

var BrickOpenHAB_RollerShutter = function() {
	BrickOpenHAB_item.apply(this, []);
	// this.infos = {command: ''};
	return this;
}

BrickOpenHAB_RollerShutter.prototype = Object.create( BrickOpenHAB_item.prototype );
BrickOpenHAB_RollerShutter.prototype.constructor	= BrickOpenHAB_RollerShutter;
BrickOpenHAB_RollerShutter.prototype.getTypeName 	= function() {return "BrickOpenHAB_RollerShutter";}
var types = BrickOpenHAB_item.prototype.getTypes();
types.push	( BrickOpenHAB_RollerShutter.prototype.getTypeName()
			, BrickOpenHAB_item.types.UpDown
			, BrickOpenHAB_item.types.StopMove
			, BrickOpenHAB_item.types.Percent
			);
BrickOpenHAB_RollerShutter.prototype.getTypes		= function() {return types;}

BrickOpenHAB_RollerShutter.prototype.registerType(BrickOpenHAB_RollerShutter.prototype.getTypeName(), BrickOpenHAB_RollerShutter.prototype);

BrickOpenHAB_RollerShutter.prototype.update	= function(topic, operation, message) {
	BrickOpenHAB_item.prototype.update.apply(this, [topic, operation, message]);
	// this.infos[ operation ] = message;
	switch(message) {
		 case 'UP'	:
		 case 'DOWN':
		 case 'STOP':
		 case 'MOVE':
			this.state = message;
			this.emit("state", {value: this.state});
		 break;
		 default:
			var percent = parseInt( message );
			if(message == percent.toString()) {
				 this.state = percent;
				 this.emit("state", {value: this.state});
				} else	{console.error("BrickOpenHAB_RollerShutter::update Unknown message", message);
						}
		}
	return this;
}

BrickOpenHAB_RollerShutter.prototype.Do_UP		= function( ) {this.sendCommand(  "UP"  ); return true;}
BrickOpenHAB_RollerShutter.prototype.Do_DOWN	= function( ) {this.sendCommand( "DOWN" ); return true;}
BrickOpenHAB_RollerShutter.prototype.Do_STOP	= function( ) {this.sendCommand( "STOP" ); return true;}
BrickOpenHAB_RollerShutter.prototype.Do_MOVE	= function( ) {this.sendCommand( "MOVE" ); return true;}
BrickOpenHAB_RollerShutter.prototype.Do_PERCENT	= function(p) {this.sendCommand(    p   ); return true;}

module.exports = BrickOpenHAB_RollerShutter;
