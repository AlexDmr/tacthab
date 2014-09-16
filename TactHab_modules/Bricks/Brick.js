define( [ 
		]
	  , function(ActionNode) {
	var brickId = 0;
	
	var Brick = function() {
		 this.brickId	= brickId++;
		 this.Actions	= [];
		 this.Events	= [];
		 this.States	= [];
		 return this;
		}
	Brick.prototype.constructor = Brick;
	
	Brick.prototype.getActions	= function() {return this.Actions}
	Brick.prototype.getEvents	= function() {return this.Events }
	Brick.prototype.getStates	= function() {return this.States }

	Brick.prototype.serialize	= function() {
		 var json = { brickId	: this.brickId
					};
		 return json;
		}
		
	return Brick;
});