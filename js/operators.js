/*eslint eqeqeq:0 */

var op = { 'equal'			: function(a, b) {return a == b;}
		 , 'different'		: function(a, b) {return a != b;}
		 , 'greater'		: function(a, b) {return parseFloat(a) >  parseFloat(b);}
		 , 'greaterOrEqual'	: function(a, b) {return parseFloat(a) >= parseFloat(b);}
		 , 'lower'			: function(a, b) {return parseFloat(a) <  parseFloat(b);}
		 , 'lowerOrEqual'	: function(a, b) {return parseFloat(a) <= parseFloat(b);}
		 , 'between'		: function(a, range) {
									 var va  = parseFloat(a)
									   , ran = JSON.parse(range);
									 return (va >  ran.min) 
									     && (va <= ran.max);
									}
		};

module.exports = op;
