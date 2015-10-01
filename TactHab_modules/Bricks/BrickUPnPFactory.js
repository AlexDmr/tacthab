var /*Brick		= require( './Brick.js' )
  , */BrickFactory= require( './BrickFactory.js' )
  , UpnpServer	= require( '../UpnpServer/UpnpServer.js' )
  ;

var BrickUPnPFactory = function(name, constr, fct_UPnP_type) {
	 var self = this;
	 BrickFactory.prototype.constructor.apply(this, [constr]);
	 this.fct_UPnP_type = fct_UPnP_type;
	 UpnpServer.Subscribe(
		  name
		, function(type, device) {
			 if(self.fct_UPnP_type(device)) {
			 // console.log("\tProcessing a", device.deviceType, type, device.uuid);
			 switch(type) {
				 case 'add':
					var brick = self.newBrick( [device.uuid] );
					// brick.changeIdTo( device.uuid );
					brick.init(device);
					// console.log( brick );
				 break;
				 case 'sub':
					var uuid = device.uuid;
					self.removeBrick( uuid );
				 break;
				 default:
					console.error("BrickUPnPFactory::CallBack uknown command type", type);
				}
			 }// else {console.log("\tnothing to do for a", device.deviceType);}
			}
		);
	 return this;
	}
BrickUPnPFactory.prototype					= Object.create(BrickFactory.prototype ); //new BrickFactory();
BrickUPnPFactory.prototype.constructor		= BrickUPnPFactory;

module.exports = BrickUPnPFactory;
