var Brick = require( './Brick.js' );

var BrickFactory = function(constr) {
	 this.constr		= constr;
	}
	
BrickFactory.prototype = Object.create( {} );
BrickFactory.prototype.constructor = BrickFactory;
BrickFactory.prototype.newBrick	= function() {
	 var n = new this.constr();
	 // n.init();
	 return n;
	}
BrickFactory.prototype.removeBrick	= function(brickId) {
	 var brick = Brick.prototype.getBrickFromId( brickId );
	 // console.log("\tBrickFactory::removeBrick", brickId, brick?'PRESENT':'NOT FOUND');
	 if(brick) {
		 brick.dispose();
		}
	}

module.exports = BrickFactory;
