var Brick		= require( './Brick.js' )
  ;
  
  
var BrickBLE = function(id, peripheral) {
	Brick.apply(this, ["BLE::" + id]);
	this.peripheral	= peripheral;
}

