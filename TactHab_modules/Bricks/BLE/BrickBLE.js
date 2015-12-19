var Brick		= require( '../Brick.js' )
  ;
  
  
var BrickBLE = function(id, peripheral) {
	var self = this;

	Brick.apply(this, [id]);
	this.peripheral	= peripheral;
	this.name		= peripheral.advertisement?peripheral.advertisement.localName:peripheral.address;

	this.isConnected = true;
	peripheral.on  ('connect'		, function() {console.log(id, "connected"   ); self.connect   ();} );
	peripheral.once('disconnect'	, function() {console.log(id, "disconnected"); self.disconnect();} );
}

BrickBLE.prototype = Object.create(Brick.prototype); // new Brick(); BrickUPnP.prototype.unreference();
BrickBLE.prototype.constructor	= BrickBLE;
BrickBLE.prototype.getTypeName	= function() {return "BrickBLE";}
BrickBLE.prototype.getTypes		= function() {var L=Brick.prototype.getTypes(); L.push(BrickBLE.prototype.getTypeName()); return L;}
BrickBLE.prototype.registerType('BrickBLE', BrickBLE.prototype);

BrickBLE.prototype.connect 		= function() {this.isConnected = true ; this.emit("connect"   , {id: this.id}); }
BrickBLE.prototype.disconnect	= function() {this.isConnected = false; this.emit("disconnect", {id: this.id}); }


BrickBLE.prototype.getDescription	= function() {
	 var json = Brick.prototype.getDescription.apply(this, [])
	   , i, j, k
	   , serviceJSON, service
	   , characteristic, characteristicJSON
	   , property;
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


module.exports = BrickBLE;

