var noble			= require('noble')
  , SensorTag		= require('sensortag')
  , BrickBLE		= require("./BrickBLE.js")
  , BrickSensorTag	= require("./BrickSensorTag.js")
  ;

var L_CB_Discover	= [];
var initDone		= false;

function init() {
	if(initDone) {return false;} else {initDone = true;}
	
	noble.on('scanStop', function() {
		setTimeout( function() {
			console.log("restart BLE scanning");
			noble.startScanning();
		}, 1000 );
	});
	noble.on('stateChange', function(state) {
		console.log("\tnoble state:", state);
		switch(state) {
			case 'poweredOn':
				noble.startScanning();
			break;
			default:
		}
		return true;
	});

	noble.on( 'discover'
			, function(peripheral) {
				var i
				  , name	= peripheral.advertisement?peripheral.advertisement.localName:peripheral.address
				  , brick 	;
				console.log("Discover BLE", peripheral.id, name);
				if(peripheral.id === "c4be841ac429") {
				//if(name !== "CC2650 SensorTag") {
					peripheral.connect( function(error) {
						console.log("\tconnected to", peripheral.id);
						peripheral.discoverAllServicesAndCharacteristics( function(error, services, characteristics) {
							if(error) {console.error("Error BLE", peripheral.id, ":", error); return;}
							brick = new BrickBLE(peripheral.id, peripheral);
							for(i=0; i<L_CB_Discover.length; i++) {L_CB_Discover[i].apply(brick);}
							// console.log	( "Discover peripheral", peripheral
							// 			, "\n------services-----\n", services
							// 			, "\n------characteristics-------\n", characteristics);

						});
					});
				} else {
					brick = new BrickBLE(peripheral.id, peripheral);
					for(i=0; i<L_CB_Discover.length; i++) {L_CB_Discover[i].apply(brick);}
				}
				// Callbacks
				
			});
			
	function onDiscoverSensorTag(sensorTag) {
		sensorTag.connectAndSetUp( function(error) {
			if(error) {console.error(error); return;}
			sensorTag.readDeviceName( function(error, deviceName) {
				if(error) {console.error(error); return;}
				//console.log("new sensorTag", sensorTag);
				console.log( "SensorTag", deviceName );
				var brick = BrickBLE.prototype.getBrickFromId( sensorTag.id );
				if(brick) {
					console.log( "switch from BrickBLE to BrickSensorTag", sensorTag.id );
					var peripheral = brick.peripheral;
					brick.dispose();
					brick = new BrickSensorTag(peripheral.id, peripheral, sensorTag);
					// Callbacks
					for(var i=0; i<L_CB_Discover.length; i++) {L_CB_Discover[i].apply(brick);}
				}
			});
		});
	}
	
	noble.startScanning( );
	console.log("BLE start scanning");
	//SensorTag.discoverAll(onDiscoverSensorTag);
	return true;
}



module.exports = {
	onDiscover	: function(cb) {
		if(L_CB_Discover.indexOf(cb) !== -1) {L_CB_Discover.push(cb);}
		return this;
	},
	offDiscover	: function(cb) {
		var pos = L_CB_Discover.indexOf(cb);
		if(pos !== -1) {L_CB_Discover.splice(pos, 1);}
		return this;
	},
	init		: init,
	isInit		: function() {return initDone;}
};
