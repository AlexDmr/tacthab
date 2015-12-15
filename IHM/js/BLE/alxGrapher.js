require( "./templates/alxGrapher.css" );

module.exports = function(app) {
	app.directive( "alxGrapher"
				 , function($parse) {
					 return {
						restrict	: 'E',
						scope		: { 
							title			: "@",
							dataArray		: "=",
							onEnableChange	: "&",
							onPeriodChange	: "&",
							periods			: "=",
							enabled			: "=",
							size			: "="
						},
						controller	: function($scope) {
							var onEnableChange 	= $parse( onEnableChange )
							  , onPeriodChange	= $parse( onPeriodChange )
							  ;
							//var ctrl = this;
							this.enable 		= function() {
								onEnableChange($scope, {value: true});
							};
							this.disable 		= function() {
								onEnableChange($scope, {value: false});
							}
							this.periodChange 	= function(ms) {
								onPeriodChange($scope, {ms:ms});
							}
							//
						},
						controllerAs: "ctrl",
						templateUrl	: "/IHM/js/BLE/templates/alxGrapher.html",
						link		: function(scope, element, attr, controller) {
							// Compute scope.size with respect to available width
							//
						}
					 };
				 });
}

