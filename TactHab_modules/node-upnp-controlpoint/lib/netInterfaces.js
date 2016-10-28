var os 				= require( "os" );

var ifaces = os.networkInterfaces(), netInterfaces = [];
for (var dev in ifaces) {
    var iface = ifaces[dev].filter(function(details) {
        var rep = details.family === 'IPv4' && details.internal === false;
        if(rep) {
            netInterfaces.push( details );
            //console.log("net:", details.address, "<=>", details);
        }
        return rep
    });
}

module.exports = {
    netInterfaces   : netInterfaces
};
