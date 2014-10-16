define( [
		]
	  , function() {
	var BrickManager = {
		  D_bricks		: {}
		, appendBrick	: function(brick) {
			 console.log( "BrickManager.appendBrick", brick.brickId);
			 this.D_bricks[brick.brickId] = brick;
			}
		, removeBrick	: function(brickId) {
			 console.log( "BrickManager.removeBrick", brickId);
			 delete this.D_bricks[brickId];
			}
		};
	return BrickManager;
});