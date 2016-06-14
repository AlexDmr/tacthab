var noble			= require('noble')
  // , SensorTag		= require('sensortag')
  , Brick 			= require("../Brick.js")
  , BrickBLE		= require("./BrickBLE.js")
  // , BrickSensorTag	= require("./BrickSensorTag.js")
  , BrickMetaWear	= require("./BrickMetaWear.js")
  ;

var L_types			= [ /*{nobleType	: SensorTag.CC2540, brickType	: BrickSensorTag}
					  , {nobleType	: SensorTag.CC2650, brickType	: BrickSensorTag}
					  ,*/ {nobleType	: BrickMetaWear, 	brickType	: BrickMetaWear}
					  ];

function BrickBLE_sever(id) {
	var server = this;
	Brick.apply(this, [ id ]);

	this.BLE_server		= {
		bricks			: [],
		scanning		: false,
		continuousScan	: false,
		state			: noble.state
	};

	noble.on('scanStart', function() {
		server.BLE_server.scanning = true;
		server.emit("update_BrickBLE_sever", {scanning: server.BLE_server.scanning} );
	});
	noble.on('scanStop', function() {
		if(server.BLE_server.continuousScan && server.BLE_server.scanning) {
			noble.startScanning();
		} else {
			server.BLE_server.scanning = false;
			server.emit("update_BrickBLE_sever", {scanning: server.BLE_server.scanning} );
		}
	});
	noble.on('stateChange', function(state) {
		server.emit("update_BrickBLE_sever", {state: server.BLE_server.state = state})
		if(state === "poweredOn") {noble.startScanning();}
	});
	noble.on( 'discover', function(peripheral) {
		var i, nobleType, brickType, object
		  , name	= peripheral.advertisement?peripheral.advertisement.localName:peripheral.address
		  , brick 	;
		console.log("Discover BLE", peripheral.id, name);
		for(i=0; i<L_types.length; i++) {
			nobleType = L_types[i].nobleType;
			brickType = L_types[i].brickType;
			if(nobleType.is(peripheral)) {
				if(nobleType !== brickType) {
					object = new nobleType(peripheral);
				} else {object = peripheral;}
				brick 	= new brickType(peripheral.id, object);
			}
		}
		if(!brick) {brick = new BrickBLE(peripheral.id, peripheral);}
		server.BLE_server.bricks.push( brick );
	});
}

BrickBLE_sever.prototype				= Object.create(Brick.prototype);
BrickBLE_sever.prototype.constructor	= BrickBLE_sever;
BrickBLE_sever.prototype.getTypeName	= function() {return "BrickBLE_sever";}
BrickBLE_sever.prototype.getTypes		= function() {var L=Brick.prototype.getTypes(); L.push(BrickBLE_sever.prototype.getTypeName()); return L;}

BrickBLE_sever.prototype.startScanning	= function(continuousScan) {
	this.BLE_server.continuousScan = continuousScan?true:false;
	if( !this.BLE_server.scanning && noble.state === "poweredOn") {
		noble.startScanning();
	}
	this.emit( "update_BrickBLE_sever", {continuousScan: this.BLE_server.continuousScan} );
}
BrickBLE_sever.prototype.stopScanning	= function() {
	this.BLE_server.continuousScan	= false;
	noble.stopScanning();
	this.emit( "update_BrickBLE_sever", {continuousScan: this.BLE_server.continuousScan} );
}


BrickBLE_sever.prototype.getDescription	= function() {
	 var json = Brick.prototype.getDescription.apply(this, []);
	 json.BLE_server = {
	 	bricks			: [],
	 	scanning		: this.BLE_server.scanning,
	 	continuousScan	: this.BLE_server.continuousScan,
	 	state			: this.BLE_server.state
	 };

	 this.BLE_server.bricks.forEach( function(brick) {json.BLE_server.push( brick.id )} );

	 return json;
}

var BrickBLE_sever_singleton = new BrickBLE_sever( "BrickBLE_sever" );

module.exports = BrickBLE_sever_singleton;
