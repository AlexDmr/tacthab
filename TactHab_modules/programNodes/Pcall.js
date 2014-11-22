define( [ 
	    ]
	  , function() {
// Definition of a call for programs
var Pcall = function(obj, mtd, params, CB_success, CB_cancel) {
	 this.CB_cancel	= CB_cancel;
	 this.CB_success= CB_success;
	 this.obj		= obj;
	 this.mtd		= mtd;
	 this.params	= params;
	 return this;
	}
Pcall.prototype.constructor = Pcall;

Pcall.prototype.execute = function() {
	var self = this;
	// console.log("Pcall :", this.params);
	var params = this.params.slice(0);
	params.push(this.CB_success, this.CB_cancel);
	try {var res = self.mtd.apply(self.obj, params);
		 if(res !== undefined) {
			 self.CB_success(res);
			}
		} catch(err) {self.CB_cancel(err);}
}

Pcall.prototype.cancel = function() {
	this.CB_cancel();
}

return Pcall;
});