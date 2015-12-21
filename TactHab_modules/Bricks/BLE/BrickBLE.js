var Brick		= require( '../Brick.js' )
  ;
  
  
var BrickBLE = function(id, peripheral) {
	var brick = this;

	Brick.apply(this, [id]);
	this.peripheral	= peripheral;
	this.name		= peripheral.advertisement?peripheral.advertisement.localName:peripheral.address;

	this.isConnected						= false;
	this.gotAllServicesAndCharacteristics	= false;
	peripheral.on  ('connect'		, function() {
		brick.isConnected	= true;
		brick.emit("connected", {value: true});
	});
	peripheral.once('disconnect'	, function() {
		brick.isConnected	= false;
		brick.emit("connected", {value: false});
	});
	
	this.characteristics = {};
	this.cb_characterisitcs = {};

	this.getDescription();	
}

BrickBLE.prototype = Object.create(Brick.prototype); // new Brick(); BrickUPnP.prototype.unreference();
BrickBLE.prototype.constructor	= BrickBLE;
BrickBLE.prototype.getTypeName	= function() {return "BrickBLE";}
BrickBLE.prototype.getTypes		= function() {var L=Brick.prototype.getTypes(); L.push(BrickBLE.prototype.getTypeName()); return L;}
BrickBLE.prototype.registerType('BrickBLE', BrickBLE.prototype);

BrickBLE.prototype.connect 		= function() {
	var brick = this;
	if(this.isConnected) {return true;}
	var peripheral = this.peripheral;
	
	return new Promise( function(resolve, reject) {
		console.log( "connecting to", peripheral.id);
		peripheral.connect( function(error) {
			console.log("\tconnected to", peripheral.id);
			if(error) {reject(error);} else {resolve(true);}
			if(brick.gotAllServicesAndCharacteristics === false) {
				peripheral.discoverAllServicesAndCharacteristics( function(error, services, characteristics) {
					if(error) {console.error("Error BLE", peripheral.id, ":", error); return;}
					brick.gotAllServicesAndCharacteristics = true;
					brick.emit("updateDescription", brick.getDescription());
				});
			}
		}); // peripheral.connect
	}); // Promise
}

BrickBLE.prototype.disconnect	= function() {
	// var brick = this;
	var peripheral = this.peripheral;
	if(this.isConnected === false) {return true;}
	return new Promise( function(resolve, reject) {
		peripheral.disconnect( function(error) {
			if(error) {reject(error);} else {resolve(true);}
		}); // peripheral.disconnect
	}); // Promise
}



BrickBLE.prototype.getDescription	= function() {
	 var json = Brick.prototype.getDescription.apply(this, [])
	   , i, j, k
	   , serviceJSON, service
	   , characteristic, characteristicJSON
	   , property;
	 json.isConnected = this.isConnected;
	 json.services = [];
	 if(this.peripheral.services) {
	 for(i=0; i<this.peripheral.services.length; i++) {
	 	service = this.peripheral.services[i];
	 	serviceJSON = 	{ uuid 				: service.uuid
	 					, name 				: service.name
	 					, type 				: service.type
	 					, characteristics 	: []
	 					};
	 	if(service.characteristics) {
	 	for(j=0; j<service.characteristics.length; j++) {
	 		characteristic 		= service.characteristics[j];
			this.characteristics[characteristic.uuid] = characteristic;
	 		characteristicJSON 	= { uuid 		: characteristic.uuid
	 							  , name 		: characteristic.name
	 							  , type 		: characteristic.type
	 							  , properties 	: {}
	 							  };
			if(characteristic.properties) {
			for(k=0; k<characteristic.properties.length; k++) {
				property = characteristic.properties[k];
				characteristicJSON.properties[ property ] = true;
			}}
	 		serviceJSON.characteristics.push( characteristicJSON );
	 	}}
	 	json.services.push( serviceJSON );
	 }}
	 
	 return json;
	}

BrickBLE.prototype.readCharacteristic	= function(uuid) {
	var characteristic = this.characteristics[uuid], res;
	console.log( this.brickId, "readCharacteristic", uuid );
	if( characteristic ) {
		//console.log( this.characteristics[uuid] );
		return new Promise( function(resolve, reject) {
			characteristic.read( function(error, data) {
				console.log( "error:", error, " data:", data);
				if(error) {
					reject(error);
				} else {
					res = 	{ data	: data
							, length: data.length
							, utf8	: data.toString('ascii')
							}
					console.log(res);
					resolve( res );
				}
			});
		});
	}
	return false;
}
	
BrickBLE.prototype.writeCharacteristic	= function(uuid, value) {
	var characteristic = this.characteristics[uuid];
	console.log( this.brickId, "writeCharacteristic", uuid, value );
	if( characteristic ) {
		var buffer = new Buffer( Buffer.byteLength(value, 'utf8') );
		buffer.write(value, 0);
		console.log( "\tbuffer:", buffer);
		return new Promise( function(resolve, reject) {
			characteristic.write(buffer, false, function(error) {
				console.log( "error:", error );
				if(error) {reject(error);} else {resolve(true);}
			});
		});
	}
	return false;
}

BrickBLE.prototype.notifyCharacteristic = function(uuid, notify) {
	var characteristic = this.characteristics[uuid],
		brick = this;

	console.log( this.brickId, "notifyCharacteristic", uuid );
	if( characteristic ) {
		return new Promise( function(resolve, reject) {
			characteristic.notify(notify, true, function(error) {
				console.log( "\tnotification response has error", error);
				if(error) {reject(error);} else {resolve(true);}
				var cb = brick.cb_characterisitcs[ uuid ];
				if(!cb) {
					cb = function(data, isNotification) {
						console.log("\notification for", uuid, "<<", data, isNotification);
						if( !isNotification ) {return;}
						var res = 	{ data	: data
									, length: data.length
									, utf8	: data.toString('ascii')
									};
						this.emit("notification_" + uuid, res);
					}
					characteristic.on('data', cb);
				}
				console.log("\terror", error);
			});
		});
	}
	return false;
}



module.exports = BrickBLE;

