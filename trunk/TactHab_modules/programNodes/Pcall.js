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
	var res = this.mtd.apply(this.obj, this.params);
	this.CB_success(res);
}

Pcall.prototype.cancel = function() {
	this.CB_cancel();
}

return Pcall;
});