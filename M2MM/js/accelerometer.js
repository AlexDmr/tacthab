require( "./accelerometer.css" );

var t = 0;

module.exports = {
	init	: function(selector) {
		 var root		= document.querySelector( selector )
		   , svg		= root.querySelector( "svg" )
		   // , svgGroup	= root.querySelector( "g.root" )
		   , svg_alpha	= root.querySelector( "polyline.alpha" )
		   , svg_beta	= root.querySelector( "polyline.beta" )
		   , svg_gamma	= root.querySelector( "polyline.gamma" )
		   , device		= root.querySelector( ".device" )
		   ;
		 function handleOrientation(e) {
			 // console.log("orientation:", svg_alpha.points.length);
			 var P;
			 P = svg.createSVGPoint(); P.x=t; P.y=(360+e.alpha)%360; svg_alpha.points.appendItem(P);
			 P = svg.createSVGPoint(); P.x=t; P.y=(180+e.beta )%360; svg_beta.points.appendItem (P);
			 P = svg.createSVGPoint(); P.x=t; P.y=(90 +e.gamma)%360; svg_gamma.points.appendItem(P);
			 t++;
			 
		 var nb = parseInt( window.getComputedStyle(svg).width );
		 if(svg_alpha.points.length >= nb) {
			 svg_alpha.points.removeItem(0);
			 svg_beta .points.removeItem(0);
			 svg_gamma.points.removeItem(0);
			 svg_alpha.style.transform = "translate(" +(-t+nb) + "px)";
			 svg_beta .style.transform = "translate(" +(-t+nb) + "px)";
			 svg_gamma.style.transform = "translate(" +(-t+nb) + "px)";
			}

		 device.style.transform =	""
								+	"rotateX(" + e.alpha + "deg) "
								+	"rotateZ(" + (180 + e.beta ) + "deg) "
								+	"rotateY(" + (0   + e.gamma) + "deg) "
								;
	}

		 window.addEventListener("deviceorientation", handleOrientation, true);
		 // window.addEventListener("devicemotion"     , handleAcceleration, true);
		}
};