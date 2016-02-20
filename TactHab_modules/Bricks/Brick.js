var AlxEvents	= require(  '../../js/AlxEvents.js' )
  // , webServer	= require( '../webServer/webServer.js' )
  ;
		  
var brickId = 0;
var D_brickTypes	= {};
var D_brick			= {};

// Logs object contains one entry for each brick
// On each entry, there is an object having attribute representing data sources
// Each data source is an array of time stamped events.
var logs			= {};


var ProtoBrick = D_brick.ProtoBrick = { brickId			: 'ProtoBrick'
									  , getDescription	: function() {return {type:'ProtoBrick', id:'ProtoBrick',name:'ProtoBrick'};}
									  };
var Brick = function(id) {
	 var brick = this;
	 this.brickId	= id || ('Brick' + (brickId++));
		D_brick[this.brickId] = this;
	 logs[this.brickId] = logs[this.brickId] || {};
	 this.logEvents("state");
	 this.log("state", "construction");
	 setTimeout	( function() {ProtoBrick.emit('appear', brick.getDescription());}
				, 100 );
	 return this;
	}

Brick.D_brick		= D_brick;
Brick.ProtoBrick	= ProtoBrick;
Brick.D_brickTypes	= D_brickTypes;

Brick.prototype = Object.create( {} );
Brick.prototype.registerType	= function(name, proto) {
	 D_brickTypes[name] 		= {proto: proto, specializations: [], generalization: null};
	 var protoBrickHerited 		= Object.getPrototypeOf( proto )
	   , protoBrickHeritedName 	= protoBrickHerited.getTypeName?protoBrickHerited.getTypeName():""
	   , exemple
	   ;
	 if( D_brickTypes[protoBrickHeritedName] ) {
	 	exemple = new proto.constructor();
	 	exemple.name = name;
	 	console.log( name, "inherits from", protoBrickHeritedName);
		D_brickTypes[protoBrickHeritedName].specializations.push( name );
		D_brickTypes[name].generalization 	= protoBrickHeritedName;
		D_brickTypes[name].json				= exemple.getDescription();
		exemple.dispose();
	 }
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
	 // ProtoBrick.emit('disappear', {brickId: this.brickId});
	 this.disposeAlxEvent();
	 this.unreference();
	 this.log("state", "destruction");
	}	
AlxEvents(Brick);

Brick.prototype.registerType('Brick', Brick.prototype);

Brick.prototype.getESA			= function() {
	return { events	: this.getEvents ()
		   , states	: this.getStates ()
		   , actions: this.getActions()
		   };
}

//____________________________________________________________________________________________________
// Data logs
//____________________________________________________________________________________________________
Brick.prototype.logEvents		= function(eventName) {
	logs[this.brickId][eventName]	= logs[this.brickId][eventName] || [];
	return this;
}

Brick.prototype.log 			= function(eventName, data, ms) {
	ms = ms || Date.now();
	logs[this.brickId][eventName].push( {ms:ms, data:data} );
	return this;
}

Brick.prototype.filter			= function(eventName, fct) {
	return logs[this.brickId][eventName].filter(fct);
}

Brick.prototype.filterTime		= function(eventName, t0, t1) {
	return logs[this.brickId][eventName].filter( function(e) {
		return e.ms >= t0 
		    && e.ms <= t1 ;
	});		
}

//____________________________________________________________________________________________________
// 
//____________________________________________________________________________________________________
Brick.prototype.getTypeName		= function() {return "Brick";}
Brick.prototype.getBrickFromId	= function(id) {return D_brick[id];}
Brick.prototype.unreference		= function() {
	 ProtoBrick.emit('disappear', {brickId: this.brickId, class: this.getTypeName()});
	 delete D_brick[this.brickId];		
	 return this;
	}
Brick.prototype.changeIdTo		= function(newId) {
	//var brick = this;
	if(newId !== this.brickId) {
		 this.unreference();
		 D_brick[newId] = this;
		 this.brickId	= newId;
		 ProtoBrick.emit('appear', this.getDescription());
		}
	 return this;
	}
Brick.prototype.getDescription	= function() {
	return	{ type	: this.getTypes()
			, id	: this.brickId
			, name	: this.name || this.brickId
			, class : this.getTypeName()
			};
	}
Brick.prototype.getBricks		= function( filter ) {
	 var res = {};
	 if(typeof filter === "undefined") {filter = function(e) {return true;};}
	 for(var i in D_brick) {
		 if( filter(D_brick[i]) ) {res[i] = D_brick[i];}
		}
	 return res;
	}

Brick.prototype.getTypes	= function() {return [ 'Brick' ];}
Brick.prototype.getActions	= function() {return [];}
Brick.prototype.getEvents	= function() {return [];}
Brick.prototype.getStates	= function() {return [];}

Brick.prototype.init		= function(obj) {return this;}
Brick.prototype.serialize	= function() {
	 var json = { brickId	: this.brickId
				, classe	: 'Brick'
				};
	 return json;
	}
Brick.prototype.toJSON		= function() {
	return this.serialize();
}
Brick.prototype.toString	= function() {
	 return JSON.stringify(this.toJSON());
	}
ProtoBrick.on	= function(event, CB) {
	 console.log("ProtoBrick.on", event);
	 Brick.prototype.on.apply(this, [event, CB]);
	 return this;
	}
ProtoBrick.off	= Brick.prototype.off;
ProtoBrick.emit	= Brick.prototype.emit;

module.exports = Brick;
