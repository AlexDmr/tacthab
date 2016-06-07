/**
 * Created by Alexandre on 24/11/2015.
 */
/* Converts an RGB color value to HSL. Conversion formula
* adapted from http://en.wikipedia.org/wiki/HSL_color_space.
    * Assumes r, g, and b are contained in the set [0, 255] and
* returns h, s, and l in the set [0, 1].
*
* @param   Number  r       The red color value
* @param   Number  g       The green color value
* @param   Number  b       The blue color value
* @return  Array           The HSL representation
*/

function rgbToHsl(r, g, b){
    r /= 255; g /= 255; b /= 255;
    var max = Math.max(r, g, b), min = Math.min(r, g, b);
    var h, s, l = (max + min) / 2;

    if(max == min){
        h = s = 0; // achromatic
    }else{
        var d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch(max){
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
    }

    return [h, s, l];
}

/**
 * Converts an HSL color value to RGB. Conversion formula
 * adapted from http://en.wikipedia.org/wiki/HSL_color_space.
 * Assumes h, s, and l are contained in the set [0, 1] and
 * returns r, g, and b in the set [0, 255].
 *
 * @param   Number  h       The hue
 * @param   Number  s       The saturation
 * @param   Number  l       The lightness
 * @return  Array           The RGB representation
 */
function hue2rgb(p, q, t){
    if(t < 0) t += 1;
    if(t > 1) t -= 1;
    if(t < 1/6) return p + (q - p) * 6 * t;
    if(t < 1/2) return q;
    if(t < 2/3) return p + (q - p) * (2/3 - t) * 6;
    return p;
}
function hslToRgb(h, s, l){
    var r, g, b;

    if(s === 0){
        r = g = b = l; // achromatic
    }else{

        var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        var p = 2 * l - q;
        r = hue2rgb(p, q, h + 1/3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1/3);
    }

    return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
}

/**
 * Converts an RGB color value to HSV. Conversion formula
 * adapted from http://en.wikipedia.org/wiki/HSV_color_space.
 * Assumes r, g, and b are contained in the set [0, 255] and
 * returns h, s, and v in the set [0, 1].
 *
 * @param   Number  r       The red color value
 * @param   Number  g       The green color value
 * @param   Number  b       The blue color value
 * @return  Array           The HSV representation
 */
function rgbToHsv(r, g, b){
    r = r/255; g = g/255; b = b/255;
    var max = Math.max(r, g, b), min = Math.min(r, g, b);
    var h, s, v = max;

    var d = max - min;
    s = max === 0 ? 0 : d / max;

    if(max === min){
        h = 0; // achromatic
    }else{
        switch(max){
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
    }

    return [h, s, v];
}

/**
 * Converts an HSV color value to RGB. Conversion formula
 * adapted from http://en.wikipedia.org/wiki/HSV_color_space.
 * Assumes h, s, and v are contained in the set [0, 1] and
 * returns r, g, and b in the set [0, 255].
 *
 * @param   Number  h       The hue
 * @param   Number  s       The saturation
 * @param   Number  v       The value
 * @return  Array           The RGB representation
 */
function hsvToRgb(h, s, v){
    var r, g, b;

    var i = Math.floor(h * 6);
    var f = h * 6 - i;
    var p = v * (1 - s);
    var q = v * (1 - f * s);
    var t = v * (1 - (1 - f) * s);

    switch(i % 6){
        case 0: r = v; g = t; b = p; break;
        case 1: r = q; g = v; b = p; break;
        case 2: r = p; g = v; b = t; break;
        case 3: r = p; g = q; b = v; break;
        case 4: r = t; g = p; b = v; break;
        case 5: r = v; g = p; b = q; break;
    }

    return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
}

function stringRGB_to_IntArray( str ) {
	var color	= "([0-9a-fA-F]{2})",
		RE		= new RegExp( "^#" + color + color + color + "$" ),
		rgb		= RE.exec( str );
	if(rgb) {
		return	[ parseInt( rgb[1], 16 )
				, parseInt( rgb[2], 16 )
				, parseInt( rgb[3], 16 )
				]
	} else {return null;}
}



// Phillips Hue

var XYPoint = function(x, y) {
		this.x = x;
		this.y = y;
	},
	Red = new XYPoint(0.675, 0.322),
	Lime = new XYPoint(0.4091, 0.518),
	Blue = new XYPoint(0.167, 0.04);

function _crossProduct(p1, p2) {
	return (p1.x * p2.y - p1.y * p2.x);
}

function _checkPointInLampsReach(p) {
	var v1 = new XYPoint(Lime.x - Red.x, Lime.y - Red.y),
		v2 = new XYPoint(Blue.x - Red.x, Blue.y - Red.y),
		q = new XYPoint(p.x - Red.x, p.y - Red.y),
		s = _crossProduct(q, v2) / _crossProduct(v1, v2),
		t = _crossProduct(v1, q) / _crossProduct(v1, v2);
	return (s >= 0.0) && (t >= 0.0) && (s + t <= 1.0);
}

function _getClosestPointToPoint(A, B, P) {
	var AP = new XYPoint(P.x - A.x, P.y - A.y),
		AB = new XYPoint(B.x - A.x, B.y - A.y),
		ab2 = AB.x * AB.x + AB.y * AB.y,
		ap_ab = AP.x * AB.x + AP.y * AB.y,
		t = ap_ab / ab2;
	if (t < 0.0) t = 0.0;
	else if (t > 1.0) t = 1.0;
	return new XYPoint(A.x + AB.x * t, A.y + AB.y * t);
}

function _getDistanceBetweenTwoPoints(one, two) {
	var dx = one.x - two.x,
		// horizontal difference
		dy = one.y - two.y; // vertical difference
	return Math.sqrt(dx * dx + dy * dy);
}

function getXYPointFromRGB(red, green, blue) {
	var r = (red > 0.04045) ? Math.pow((red + 0.055) / (1.0 + 0.055), 2.4) : (red / 12.92),
		g = (green > 0.04045) ? Math.pow((green + 0.055) / (1.0 + 0.055), 2.4) : (green / 12.92),
		b = (blue > 0.04045) ? Math.pow((blue + 0.055) / (1.0 + 0.055), 2.4) : (blue / 12.92),
		X = r * 0.4360747 + g * 0.3850649 + b * 0.0930804,
		Y = r * 0.2225045 + g * 0.7168786 + b * 0.0406169,
		Z = r * 0.0139322 + g * 0.0971045 + b * 0.7141733,
		cx = X / (X + Y + Z),
		cy = Y / (X + Y + Z);
	cx = isNaN(cx) ? 0.0 : cx;
	cy = isNaN(cy) ? 0.0 : cy;
	//Check if the given XY value is within the colourreach of our lamps.
	var xyPoint = new XYPoint(cx, cy),
		inReachOfLamps = _checkPointInLampsReach(xyPoint);
	if (!inReachOfLamps) {
		//Color is unreproducible, find the closest point on each line in the CIE 1931 'triangle'.
		var pAB = _getClosestPointToPoint(Red, Lime, xyPoint),
			pAC = _getClosestPointToPoint(Blue, Red, xyPoint),
			pBC = _getClosestPointToPoint(Lime, Blue, xyPoint),
			// Get the distances per point and see which point is closer to our Point.
			dAB = _getDistanceBetweenTwoPoints(xyPoint, pAB),
			dAC = _getDistanceBetweenTwoPoints(xyPoint, pAC),
			dBC = _getDistanceBetweenTwoPoints(xyPoint, pBC),
			lowest = dAB,
			closestPoint = pAB;
		if (dAC < lowest) {
			lowest = dAC;
			closestPoint = pAC;
		}
		if (dBC < lowest) {
			lowest = dBC;
			closestPoint = pBC;
		}
		// Change the xy value to a value which is within the reach of the lamp.
		cx = closestPoint.x;
		cy = closestPoint.y;
	}
	
	return [cx, cy];
}


module.exports = {
    rgbToHsl				: rgbToHsl,
    hslToRgb				: hslToRgb,
    rgbToHsv				: rgbToHsv,
    hsvToRgb				: hsvToRgb,
    stringRGB_to_IntArray	: stringRGB_to_IntArray,
    getXYPointFromRGB		: getXYPointFromRGB
};