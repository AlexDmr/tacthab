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


//_____________________________________________________________________________________________________________________________
//_____________________________________________________________________________________________________________________________
// Phillips Hue _______________________________________________________________________________________________________________
//_____________________________________________________________________________________________________________________________
//_____________________________________________________________________________________________________________________________
var XY = function (x, y) {
        this.x = x;
        this.y = y;
    }
    , hueLimits = {
        red: new XY(0.675, 0.322),
        green: new XY(0.4091, 0.518),
        blue: new XY(0.167, 0.04)
    }
    , livingColorsLimits = {
        red: new XY(0.704, 0.296),
        green: new XY(0.2151, 0.7106),
        blue: new XY(0.138, 0.08)
    }
    , defaultLimits = {
        red: new XY(1.0, 0),
        green: new XY(0.0, 1.0),
        blue: new XY(0.0, 0.0)
    }
    ;

function _crossProduct(p1, p2) {
    return (p1.x * p2.y - p1.y * p2.x);
}

function _isInColorGamut(p, lampLimits) {
    var v1 = new XY(
            lampLimits.green.x - lampLimits.red.x
            , lampLimits.green.y - lampLimits.red.y
        )
        , v2 = new XY(
            lampLimits.blue.x - lampLimits.red.x
            , lampLimits.blue.y - lampLimits.red.y
        )
        , q = new XY(p.x - lampLimits.red.x, p.y - lampLimits.red.y)
        , s = _crossProduct(q, v2) / _crossProduct(v1, v2)
        , t = _crossProduct(v1, q) / _crossProduct(v1, v2)
        ;

    return (s >= 0.0) && (t >= 0.0) && (s + t <= 1.0);
}

/**
 * Find the closest point on a line. This point will be reproducible by the limits.
 *
 * @param start {XY} The point where the line starts.
 * @param stop {XY} The point where the line ends.
 * @param point {XY} The point which is close to the line.
 * @return {XY} A point that is on the line specified, and closest to the XY provided.
 */
function _getClosestPoint(start, stop, point) {
    var AP = new XY(point.x - start.x, point.y - start.y)
        , AB = new XY(stop.x - start.x, stop.y - start.y)
        , ab2 = AB.x * AB.x + AB.y * AB.y
        , ap_ab = AP.x * AB.x + AP.y * AB.y
        , t = ap_ab / ab2
        ;

    if (t < 0.0) {
        t = 0.0;
    } else if (t > 1.0) {
        t = 1.0;
    }

    return new XY(
        start.x + AB.x * t
        , start.y + AB.y * t
    );
}

function _getDistanceBetweenPoints(pOne, pTwo) {
    var dx = pOne.x - pTwo.x
        , dy = pOne.y - pTwo.y
        ;
    return Math.sqrt(dx * dx + dy * dy);
}

function _getXYStateFromRGB(red, green, blue, limits) {
    var r = _gammaCorrection(red)
        , g = _gammaCorrection(green)
        , b = _gammaCorrection(blue)
        , X = r * 0.4360747 + g * 0.3850649 + b * 0.0930804
        , Y = r * 0.2225045 + g * 0.7168786 + b * 0.0406169
        , Z = r * 0.0139322 + g * 0.0971045 + b * 0.7141733
        , cx = X / (X + Y + Z)
        , cy = Y / (X + Y + Z)
        , xyPoint
        ;

    cx = isNaN(cx) ? 0.0 : cx;
    cy = isNaN(cy) ? 0.0 : cy;

    xyPoint = new XY(cx, cy);

    if (!_isInColorGamut(xyPoint, limits)) {
        xyPoint = _resolveXYPointForLamp(xyPoint, limits);
    }

    return [xyPoint.x, xyPoint.y];
}

/**
 * This function is a rough approximation of the reversal of RGB to xy transform. It is a gross approximation and does
 * get close, but is not exact.
 * @param x
 * @param y
 * @param brightness
 * @returns {Array} RGB values
 * @private
 *
 * This function is a modification of the one found at https://github.com/bjohnso5/hue-hacking/blob/master/src/colors.js#L251
 */
function _getRGBFromXYState(x, y, brightness) {
    var Y = brightness
      , X = (Y / y) * x
      , Z = (Y / y) * (1 - x - y)
      , rgb =  [
          X * 1.612 - Y * 0.203 - Z * 0.302,
          -X * 0.509 + Y * 1.412 + Z * 0.066,
          X * 0.026 - Y * 0.072 + Z * 0.962
      ]
      ;

    // Apply reverse gamma correction.
    rgb = rgb.map(function (x) {
        return (x <= 0.0031308) ? (12.92 * x) : ((1.0 + 0.055) * Math.pow(x, (1.0 / 2.4)) - 0.055);
    });

    // Bring all negative components to zero.
    rgb = rgb.map(function (x) { return Math.max(0, x); });

    // If one component is greater than 1, weight components by that value.
    var max = Math.max(rgb[0], rgb[1], rgb[2]);
    if (max > 1) {
        rgb = rgb.map(function (x) { return x / max; });
    }

    rgb = rgb.map(function (x) { return Math.floor(x * 255); });

    return rgb;
}

/**
 * When a color is outside the limits, find the closest point on each line in the CIE 1931 'triangle'.
 * @param point {XY} The point that is outside the limits
 * @param limits The limits of the bulb (red, green and blue XY points).
 * @returns {XY}
 */
function _resolveXYPointForLamp(point, limits) {

    var pAB = _getClosestPoint(limits.red, limits.green, point)
        , pAC = _getClosestPoint(limits.blue, limits.red, point)
        , pBC = _getClosestPoint(limits.green, limits.blue, point)
        , dAB = _getDistanceBetweenPoints(point, pAB)
        , dAC = _getDistanceBetweenPoints(point, pAC)
        , dBC = _getDistanceBetweenPoints(point, pBC)
        , lowest = dAB
        , closestPoint = pAB
        ;

    if (dAC < lowest) {
        lowest = dAC;
        closestPoint = pAC;
    }

    if (dBC < lowest) {
        closestPoint = pBC;
    }

    return closestPoint;
}

function _gammaCorrection(value) {
    var result = value;
    if (value > 0.04045) {
        result = Math.pow((value + 0.055) / (1.0 + 0.055), 2.4);
    } else {
        result = value / 12.92;
    }
    return result;
}

function _getLimits(modelid) {
    var limits = defaultLimits
        ;

    if (modelid) {
        modelid = modelid.toLowerCase();

        if (/^lct/.test(modelid)) {
            // This is a Hue bulb
            limits = hueLimits;
        } else if (/^llc/.test(modelid)) {
            // This is a Living Color lamp (Bloom, Iris, etc..)
            limits = livingColorsLimits;
        } else if (/^lwb/.test(modelid)) {
            // This is a lux bulb
            limits = defaultLimits;
        } else {
            limits = defaultLimits;
        }
    }

    return limits;
}

module.exports = {
    rgbToHsl				: rgbToHsl,
    hslToRgb				: hslToRgb,
    rgbToHsv				: rgbToHsv,
    hsvToRgb				: hsvToRgb,
    stringRGB_to_IntArray	: stringRGB_to_IntArray,
    getXYStateFromRGB		: function(rgb, modelid) {
        var limits = _getLimits(modelid);
        var res    = _getXYStateFromRGB(rgb[0], rgb[1], rgb[2], limits);
        res.push( Math.max(rgb[0], rgb[1], rgb[2]) )
        return res;
    },
    getRGBFromXYState		: _getRGBFromXYState
};
