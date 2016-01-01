var BrickBLE		= require( './BrickBLE.js' )
  , defs 			= require( "./BrickMetaWear_defs.js" )
  , accelerometer 	= require( "./MetaWear/Accelerometer.js" )
  , gyroscope	 	= require( "./MetaWear/Gyroscope.js" )
  , LED			 	= require( "./MetaWear/LED.js" )
  , bufferSubscribeSwitch = new Buffer(3)
  ;

bufferSubscribeSwitch[0] = 1;
bufferSubscribeSwitch[1] = 1;
bufferSubscribeSwitch[2] = 1;

//____________________________________________________________________________________________________
// 
//____________________________________________________________________________________________________
var BrickMetaWear 	= function(id, peripheral) {
	var brick = this;
	BrickBLE.apply(this, [id, peripheral]);
	console.log( "Creation of a BrickMetaWear", this.name);

	this.initAccelerometer	();
	this.initGyroscope		();
	this.initLED			();

	this.on	( 'ble_' + defs.modules.SWITCH + '_' + defs.SwitchRegister.STATE
			, function(bin) {
				// console.log("switch:", bin);
				var state = bin.readUInt8(2) === 1;
				brick.emit( "buttonChange", {state: state} );
			});

	this.on(defs.NOTIFY_UUID, function(data) {
		// console.log("MetaWear notification:", data);
		var mw_module		= data.readUInt8(0)
		  , mw_eventType	= data.readUInt8(1);
		// console.log( "emit" + 'ble_' + mw_module + '_' + mw_eventType );
		brick.emit('ble_' + mw_module + '_' + mw_eventType, data);
	});
}

BrickMetaWear.is 	= function(peripheral) {
  var localName = peripheral.advertisement?peripheral.advertisement.localName:"";
  localName = localName || "";
  return localName.toLocaleLowerCase() === 'metawear';
}

BrickMetaWear.prototype = Object.create(BrickBLE.prototype); // new Brick(); BrickUPnP.prototype.unreference();
BrickMetaWear.prototype.constructor	= BrickMetaWear;
BrickMetaWear.prototype.getTypeName	= function() {return "BrickMetaWear";}
BrickMetaWear.prototype.getTypes	= function() {var L = BrickBLE.prototype.getTypes(); 
												  L.push(BrickMetaWear.prototype.getTypeName()); 
												  return L;}
BrickMetaWear.prototype.registerType('BrickMetaWear', BrickMetaWear.prototype);

accelerometer 	( BrickMetaWear.prototype );
gyroscope 		( BrickMetaWear.prototype );
LED 			( BrickMetaWear.prototype );

//____________________________________________________________________________________________________
// Connection
//____________________________________________________________________________________________________
BrickMetaWear.prototype.connect 		= function() {
	var brick = this;
	return BrickBLE.prototype.connect.apply(this, []).then( function() {
		brick.notifyCharacteristic(defs.NOTIFY_UUID, true);
	}).then( function() {
		brick.writeCharacteristic(defs.COMMAND_UUID, bufferSubscribeSwitch);
	})
}

BrickMetaWear.prototype.disconnect	= function() {
	return this.notifyCharacteristic(defs.NOTIFY_UUID, false).then( function() {
				BrickBLE.prototype.disconnect.apply(this, [])
			});
}

//____________________________________________________________________________________________________
// Exports
//____________________________________________________________________________________________________
module.exports = BrickMetaWear;