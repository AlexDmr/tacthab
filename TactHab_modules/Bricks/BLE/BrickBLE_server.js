var noble			= require('noble')
  , SensorTag		= require('sensortag')
  , BrickBLE		= require("./BrickBLE.js")
  , BrickSensorTag	= require("./BrickSensorTag.js")
  ;

var L_CB_Discover	= [];
var initDone		= false;

var L_types			= [ {nobleType	: SensorTag.CC2540, brickType	: BrickSensorTag}
					  , {nobleType	: SensorTag.CC2650, brickType	: BrickSensorTag}
					  ];

function init() {
	if(initDone) {return false;} //else {initDone = true;}
	
	noble.on('scanStop', function() {
		setTimeout( function() {
			console.log("restart BLE scanning");
			noble.startScanning();
		}, 1000 );
	});

	// Start scan
	console.log("noble.state ===", noble.state);
	if(noble.state === "poweredOn") {
		console.log("BLE start scanning");
		noble.startScanning( );
		initDone = true;
	} else {
		noble.on('stateChange', function(state) {
			console.log("\tnoble state:", state);
			switch(state) {
				case 'poweredOn':
					console.log("BLE start scanning");
					noble.startScanning();
					initDone = true;
				break;
				default:
			}
			return true;
		});
	}

	// When a device is discovered...
	if(initDone) {
		noble.on( 'discover'
				, function(peripheral) {
					var i, nobleType, brickType, object
					  , name	= peripheral.advertisement?peripheral.advertisement.localName:peripheral.address
					  , brick 	;
					console.log("Discover BLE", peripheral.id, name);
					for(i=0; i<L_types.length; i++) {
						nobleType = L_types[i].nobleType;
						brickType = L_types[i].brickType;
						if(nobleType.is(peripheral)) {
							object 	= new nobleType(peripheral);
							brick 	= new brickType(peripheral.id, object);
						}
					}
					if(!brick) {brick = new BrickBLE(peripheral.id, peripheral);}
					for(i=0; i<L_CB_Discover.length; i++) {L_CB_Discover[i].apply(brick);}
				});
	}
	
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
