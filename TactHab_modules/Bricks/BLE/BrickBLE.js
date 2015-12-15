var Brick		= require( '../Brick.js' )
  ;
  
  
var BrickBLE = function(id, peripheral) {
	var self = this;

	Brick.apply(this, [id]);
	this.peripheral	= peripheral;
	this.name		= peripheral.advertisement?peripheral.advertisement.localName:peripheral.address;

	this.isConnected = true;
	peripheral.on('connect'		, function() {self.connect   ();} );
	peripheral.on('disconnect'	, function() {self.disconnect();} );
}

BrickBLE.prototype = Object.create(Brick.prototype); // new Brick(); BrickUPnP.prototype.unreference();
BrickBLE.prototype.constructor	= BrickBLE;
BrickBLE.prototype.getTypeName	= function() {return "BrickBLE";}
BrickBLE.prototype.getTypes		= function() {var L=Brick.prototype.getTypes(); L.push(BrickBLE.prototype.getTypeName()); return L;}
BrickBLE.prototype.registerType('BrickBLE', BrickBLE.prototype);

BrickBLE.prototype.connect 		= function() {this.isConnected = true ; this.emit("connect"   , {id: this.id}); }
BrickBLE.prototype.disconnect	= function() {this.isConnected = false; this.emit("disconnect", {id: this.id}); }


module.exports = BrickBLE;

