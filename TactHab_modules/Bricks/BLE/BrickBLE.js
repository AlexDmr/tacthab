var Brick		= require( '../Brick.js' )
  ;
  
  
var BrickBLE = function(id, peripheral) {
	Brick.apply(this, [id]);
	this.peripheral	= peripheral;
	this.name		= peripheral.advertisement?peripheral.advertisement.localName:peripheral.address;
}

BrickBLE.prototype = Object.create(Brick.prototype); // new Brick(); BrickUPnP.prototype.unreference();
BrickBLE.prototype.constructor	= BrickBLE;
BrickBLE.prototype.getTypeName	= function() {return "BrickBLE";}
BrickBLE.prototype.getTypes		= function() {var L=Brick.prototype.getTypes(); L.push(BrickBLE.prototype.getTypeName()); return L;}
BrickBLE.prototype.registerType('BrickBLE', BrickBLE.prototype);

module.exports = BrickBLE;

