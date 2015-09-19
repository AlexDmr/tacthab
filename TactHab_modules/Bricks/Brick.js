var AlxEvents	= require(  '../../js/AlxEvents.js' )
  // , webServer	= require( '../webServer/webServer.js' )
  ;
		  
var brickId = 0;
var D_brickTypes	= {};
var D_brick			= {};

var ProtoBrick = D_brick.ProtoBrick = { brickId			: 'ProtoBrick'
									  , getDescription	: function() {return {type:'ProtoBrick', id:'ProtoBrick',name:'ProtoBrick'};}
									  };
var Brick = function() {
	 this.brickId	= 'Brick' + (brickId++);
		D_brick[this.brickId] = this;
	 // this.types		= [ 'Brick' ];
	 this.Actions	= [];
	 this.Events	= [];
	 this.States	= [];
	 ProtoBrick.emit('appear', {brickId: this.brickId});
	 return this;
	}

Brick.D_brick = D_brick;

Brick.prototype = Object.create( {} );
Brick.prototype.registerType	= function(name, proto) {
	 D_brickTypes[name] = proto;
	}
Brick.prototype.getTypesFromName= function(name) {
	 var type = D_brickTypes[name];
	 if(type) {
		 return type.getTypes();
		}
	 return [];
	}
Brick.prototype.constructor		= Brick;
Brick.prototype.dispose			= function() {
	 ProtoBrick.emit('disappear', {brickId: this.brickId});
	 this.disposeAlxEvent();
	 this.unreference();
	}	
AlxEvents(Brick);

Brick.prototype.registerType('Brick', Brick.prototype);


Brick.prototype.getESA			= function() {
	return { events	: this.Events
		   , states	: this.States
		   , actions: this.Actions
		   };
}

Brick.prototype.getTypeName		= function() {return "Brick";}
Brick.prototype.getBrickFromId	= function(id) {return D_brick[id];}
Brick.prototype.unreference		= function() {
	 ProtoBrick.emit('disappear', {brickId: this.brickId});
	 delete D_brick[this.brickId];		
	 return this;
	}
Brick.prototype.changeIdTo		= function(newId) {
	 this.unreference();
	 D_brick[newId] = this;
	 this.brickId	= newId;
	 ProtoBrick.emit('appear', {brickId: this.brickId});
	 return this;
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

Brick.prototype.getTypes	= function() {return [ 'Brick' ];}
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
ProtoBrick.on	= function(event, CB) {
	 console.log("ProtoBrick.on", event);
	 Brick.prototype.on.apply(this, [event, CB]);
	 return this;
	}
ProtoBrick.off	= Brick.prototype.off;
ProtoBrick.emit	= Brick.prototype.emit;

module.exports = Brick;
