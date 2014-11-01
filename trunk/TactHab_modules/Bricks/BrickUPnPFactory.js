define( [ './Brick.js'
		, './BrickFactory.js'
		, '../UpnpServer/UpnpServer.js'
		]
	  , function(Brick, BrickFactory, UpnpServer) {
	var BrickUPnPFactory = function(name, constr, fct_UPnP_type) {
		 var self = this;
		 BrickFactory.prototype.constructor.apply(this, [constr]);
		 this.D_uuid_brickId = {};
		 this.fct_UPnP_type = fct_UPnP_type;
		 UpnpServer.Subscribe(
			  name
			, function(type, device) {
				 if(self.fct_UPnP_type(device)) {
				 switch(type) {
					 case 'add':
						var brick = self.newBrick();
						brick.init(device);
						// console.log( brick );
						self.D_uuid_brickId[ device.uuid ] = brick.brickId;
					 break;
					 case 'remove':
						var uuid = device.uuid;
						self.removeBrick( self.D_uuid_brickId[uuid] );
						delete self.D_uuid_brickId[uuid];
					 break;
					}
				 }
				}
			);
		 return this;
		}
	BrickUPnPFactory.prototype					= new BrickFactory();
	
	BrickUPnPFactory.prototype.constructor		= BrickUPnPFactory;
	BrickUPnPFactory.prototype.getBricks		= function() {
		 var L = [];
		 for(var uuid in this.D_uuid_brickId) {
			 L.push( this.getBrickFromUUID(uuid) );
			}
		 return L;
		}
	BrickUPnPFactory.prototype.getBrickFromUUID	= function(uuid) {
		 if(typeof this.D_uuid_brickId[uuid] !== "undefined") {
			 var brick = Brick.prototype.getBrickFromId( this.D_uuid_brickId[uuid] );
			 // console.log( uuid, '=>', this.D_uuid_brickId[uuid], "=>", brick);
			 return brick;
			} else {return null;}
		}

	return BrickUPnPFactory;
});