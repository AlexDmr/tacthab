require( "./templates/alxGrapher.css" );
//var resizeDetector = require( "../../../js/resizeDetector.js" );


module.exports = function(app) {
	app.directive( "alxGrapher"
				 , function($parse) {
					 return {
						restrict	: 'E',
						scope		: { 
							title			: "@",
							descriptionData	: "=",
							onEnable		: "&",
							onDisable		: "&",
							onPeriodChange	: "&",
							periods			: "=",
						},
						controller	: function($scope) {
							var ctrl 			= this 
							  ;
							this.values = []; // Values to be displayed [{name:"", string:"x y x y ..."}]
							//$scope.period = $scope.descriptionData.period || 100;

							$scope.$watch( 'descriptionData'
										 , function(newValue, oldValue) {ctrl.processDataArray();}
										 , true );
							//var ctrl = this;
							// descriptionData.data has to be an array of object of the same type
							var max = 0;
							this.processDataArray	= function() {
								if(    !$scope.descriptionData 
									|| !$scope.descriptionData.data 
									||  $scope.descriptionData.data.length === 0) {return;}
								var i, j, att, data, value, item = $scope.descriptionData.data[0]
								  , L_attributs = Object.keys(item);
								ctrl.values = [];
								var scale = 50 / (max?1.15*max:1);
								for(i=0; i<L_attributs.length; i++) {
									att = L_attributs[i];
									data = {name: att, string: ""};
									ctrl.values.push( data );
									for(j=0; j<$scope.descriptionData.data.length; j++) {
										value = $scope.descriptionData.data[j][att];
										if(Math.abs(value) > max ) {max = Math.abs(value);}
										data.string += j;
										data.string += " ";
										data.string += scale * value;
										data.string += " ";
									}
								}
								//$scope.$apply();
							}
							//
						},
						controllerAs: "ctrl",
						templateUrl	: "/IHM/js/BLE/templates/alxGrapher.html",
						link		: function(scope, element, attr, controller) {
							var svg 		= element[0].querySelector( "svg" );
							scope.descriptionData.maxSize = parseInt( window.getComputedStyle( svg ).width);
						}
					 };
				 });
}

