var noble			= require('noble')
  , SensorTag		= require('sensortag')
  , BrickBLE		= require("./BrickBLE.js")
  , BrickSensorTag	= require("./BrickSensorTag.js")
  ;

var L_CB_Discover	= [];
var initDone		= false;

function init() {
	if(initDone) {return false;} else {initDone = true;}
	
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
				var i;
				console.log("Discover peripheral", peripheral);
				// Create a new Brick ?
				var brick = new BrickBLE(peripheral.id, peripheral);
				// Callbacks
				for(i=0; i<L_CB_Discover.length; i++) {L_CB_Discover[i].apply(brick);}
			});

			
	function onDiscoverSensorTag(sensorTag) {
		console.log("new sensorTag", sensorTag);
		sensorTag.connectAndSetUp( function(error) {
			if(error) {console.error(error); return;}
			sensorTag.readDeviceName( function(error, deviceName) {
				if(error) {console.error(error); return;}
				console.log( "SensorTag", deviceName );
				var brick = BrickBLE.prototype.getBrickFromId( sensorTag.id );
				if(brick) {
					console.log( "switch from BrickBLE to BrickSensorTag", sensorTag.id );
					var peripheral = brick.peripheral;
					sensorTag.connectAndSetUp( function(error) {
						if(error) {console.error("sensorTag initialization error", error);} else {
							brick.dispose();
							brick = new BrickSensorTag(peripheral.id, peripheral, sensorTag);
						}
					});
					// Callbacks
					for(var i=0; i<L_CB_Discover.length; i++) {L_CB_Discover[i].apply(brick);}
				}
			});
		});
	}
	
	SensorTag.discoverAll(onDiscoverSensorTag);
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
