define( [ '../../js/AlxEvents.js'
		]
	  , function(AlxEvents) {
	var brickId = 0;
	var D_brick = {};
	
	var ProtoBrick = D_brick.ProtoBrick = { brickId			: 'ProtoBrick'
										  , getDescription	: function() {return {type:'ProtoBrick', id:'ProtoBrick',name:'ProtoBrick'};}
										  };
	var Brick = function() {
		 this.brickId	= 'Brick' + (brickId++);
			D_brick[this.brickId] = this;
		 this.types		= [ 'Brick' ];
		 this.Actions	= [];
		 this.Events	= [];
		 this.States	= [];
		 ProtoBrick.emit('appear', this);
		 return this;
		}

	Brick.prototype.constructor		= Brick;
	Brick.prototype.dispose			= function() {
		 this.disposeAlxEvent();
		 this.unreference();
		}	
	AlxEvents(Brick);
	Brick.prototype.getTypeName		= function() {return "Brick";}
	Brick.prototype.getBrickFromId	= function(id) {return D_brick[id];}
	Brick.prototype.unreference		= function() {
		 ProtoBrick.emit('disappear', this);
		 delete D_brick[this.brickId];		
		}
	Brick.prototype.changeIdTo		= function(newId) {
		 this.unreference();
		 D_brick[newId] = this;
		 this.brickId	= newId;
		 ProtoBrick.emit('appear', this);
		}
	Brick.prototype.getDescription	= function() {
		return	{ type	: this.getTypes()
				, id	: this.brickId
				, name	: this.brickId
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
					, classe	: 'Brick'
					};
		 return json;
		}
	Brick.prototype.toString	= function() {
		 return JSON.stringify(this.serialize());
		}
	ProtoBrick.on	= Brick.prototype.on;
	ProtoBrick.off	= Brick.prototype.off;
	ProtoBrick.emit	= Brick.prototype.emit;

	return Brick;
});
