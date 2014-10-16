define( [ './BrickManager.js'
		]
	  , function(BrickManager) {
	var BrickFactory = function(constr) {
		 this.D_instances	= {};
		 this.constr		= constr;
		}
	BrickFactory.prototype.constructor = BrickFactory;
	BrickFactory.prototype.newBrick	= function() {
		 var n = new this.constr();
		 this.D_instances[ n.brickId ] = n;
		 BrickManager.appendBrick( n );
		 return n;
		}
	BrickFactory.prototype.removeBrick	= function(brickId) {
		 var brick = this.D_instances[ brickId ];
		 if(brick) {
			 if(brick.ondelete) {
				try {brick.ondelete();
					} catch(err) {console.error("In BrickFactory.prototype.removeBrick\n\tbrick.ondelete();\n\t", err);}
				}
			 delete this.D_instances[ brickId ];
			 BrickManager.removeBrick( brickId );
			}
		}
	return BrickFactory;
});
