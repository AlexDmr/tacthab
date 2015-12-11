var noble		= require('noble')
  , SensorTag	= require('sensortag')
  , BrickBLE	= require("./BrickBLE.js")
  ;

var L_CB_Discover	= [];
var initDone		= false;

function init() {
	if(initDone) {return false;} else {initDone = true;}
	
	noble.on('stateChange', function(state) {
		console.log("\tnoble state:", state);
		if (state === 'poweredOn') {
			console.log("\tnoble start scanning");
			noble.startScanning();
		} else  {
			console.log("\tnoble stop scanning");
			noble.stopScanning();
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
			});
			/*
			sensorTag.enableAccelerometer( function(error) {
				if(error) {console.error(error); return;}
				sensorTag.setAccelerometerPeriod(100, function(error) {
					if(error) {console.error(error);}
				});
				sensorTag.notifyAccelerometer(function(error) {
					if(error) {console.error(error);}
				});
				sensorTag.on('accelerometerChange', function(x, y, z) {
					console.log("acc", x, y, z);
				});
			});
			*/
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
