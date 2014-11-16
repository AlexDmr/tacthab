define( [ 
		]
	  , function(ActionNode) {
	var brickId = 0;
	var D_brick = {};
	
	var Brick = function() {
		 this.brickId	= 'Brick' + (brickId++);
			D_brick[this.brickId] = this;
		 this.Actions	= [];
		 this.Events	= [];
		 this.States	= [];
		 return this;
		}
	Brick.prototype.constructor = Brick;
	Brick.prototype.getTypeName = function() {return "Brick";}
	Brick.prototype.getBrickFromId = function(id) {return D_brick[id];}
	Brick.prototype.getBricks   = function(  ) {
		 var res = {};
		 for(var i in D_brick) {res[i] = D_brick[i];}
		 return res;
		}
	
	Brick.prototype.getActions	= function() {return this.Actions}
	Brick.prototype.getEvents	= function() {return this.Events }
	Brick.prototype.getStates	= function() {return this.States }

	Brick.prototype.init		= function(obj) {
		 return this;
		}
	Brick.prototype.serialize	= function() {
		 var json = { brickId	: this.brickId
					};
		 return json;
		}
	Brick.prototype.toString	= function() {
		 return JSON.stringify(this.serialize());
		}
		
	return Brick;
});
