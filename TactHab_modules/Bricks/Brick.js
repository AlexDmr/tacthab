define( [ '../../js/AlxEvents.js'
		]
	  , function(AlxEvents) {
	var brickId = 0;
	var D_brick = {};
	
	var Brick = function() {
		 this.brickId	= 'Brick' + (brickId++);
			D_brick[this.brickId] = this;
		 this.types		= [ 'Brick' ];
		 this.Actions	= [];
		 this.Events	= [];
		 this.States	= [];
		 return this;
		}
	Brick.prototype.constructor		= Brick;
	AlxEvents(Brick);
	Brick.prototype.getTypeName		= function() {return "Brick";}
	Brick.prototype.getBrickFromId	= function(id) {return D_brick[id];}
	Brick.prototype.changeIdTo		= function(newId) {
		 delete D_brick[this.brickId];
		 D_brick[newId] = this;
		 this.brickId	= newId;
		}
	Brick.prototype.getDescription = function() {
		return	{ type	: this.getTypes()
				, id	: this.brickId
				};
		}
	Brick.prototype.getBricks		= function(  ) {
		 var res = {};
		 for(var i in D_brick) {res[i] = D_brick[i];}
		 return res;
		}
	
	Brick.prototype.getTypes	= function() {return this.types}
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
