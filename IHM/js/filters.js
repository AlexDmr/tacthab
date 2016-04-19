var angular = require( "angular" );

var id	= "tacthabFilters";
function filterBrickType(type) {
	return function(obj) {
		return obj.type.indexOf(type) !== -1;
	}
}
var filterBrickFhem		= filterBrickType( "BrickFhem" )
  , filterBridgeFhem	= filterBrickType( "FhemBridge" )
  , filterBridgeOpenHAB	= filterBrickType( "BridgeOpenHAB" )
  , filterBrickOpenHAB	= filterBrickType( "BrickOpenHAB_item" )
  ;

angular	.module(id, [])
		.filter( 'filterBrickFhem', 
			function() {return function(A) {
				// console.log( "filterBrickFhem on", A);
				return A.filter( filterBrickFhem );
			}})
		.filter( 'filterBridgeFhem', 
			function() {return function(A) {
				return A.filter( filterBridgeFhem );
			}})
		.filter( 'filterBridgeOpenHAB',
			function() {return function(A) {
				return A.filter( filterBridgeOpenHAB );
			}})
		.filter( 'filterBrickOpenHAB', 
			function() {return function(A) {
				return A.filter( filterBrickOpenHAB );
			}})
		;

module.exports =  id;
