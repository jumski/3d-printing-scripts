var Simple1DNoise = function() {
    var MAX_VERTICES = 256;
    var MAX_VERTICES_MASK = MAX_VERTICES -1;
    var amplitude = 1;
    var scale = 1;

    var r = [];

    for ( var i = 0; i < MAX_VERTICES; ++i ) {
        r.push(Math.random());
    }

    var getVal = function( x ){
        var scaledX = x * scale;
        var xFloor = Math.floor(scaledX);
        var t = scaledX - xFloor;
        var tRemapSmoothstep = t * t * ( 3 - 2 * t );

        /// Modulo using &#038;
        var xMin = xFloor % MAX_VERTICES_MASK;
        var xMax = ( xMin + 1 ) % MAX_VERTICES_MASK;

        var y = lerp( r[ xMin ], r[ xMax ], tRemapSmoothstep );

        return y * amplitude;
    };

    /**
    * Linear interpolation function.
    * @param a The lower integer value
    * @param b The upper integer value
    * @param t The value between the two
    * @returns {number}
    */
    var lerp = function(a, b, t ) {
        return a * ( 1 - t ) + b * t;
    };

    // return the API
    return {
        getVal: getVal,
        setAmplitude: function(newAmplitude) {
            amplitude = newAmplitude;
        },
        setScale: function(newScale) {
            scale = newScale;
        }
    };
};

var generator = new Simple1DNoise();
var ratio = 1;
// generator.setAmplitude(0.5);
// generator.setScale(0.5);

layer_height = 0.3;
prusaslicer = [];
min_temp = 190;
temp_range = 40;

for (x = 0; x < 1000; x+=1) {
    var opacity = generator.getVal(x);
    document.write("<div class='row' style='opacity: " + opacity + ";'> </div>");

    var z = layer_height * (x+1);
    var temp = min_temp + (temp_range * opacity);

    zWithPrecision = parseFloat(z).toPrecision(5);
    tempWithPrecision = parseFloat(temp).toPrecision(5);
    console.log(zWithPrecision, tempWithPrecision);
    if (x == 0) {
        prusaslicer.push("{if layer_z <= " + z + "}M104 S" + temp);
    }
    else {
        prusaslicer.push("{elsif layer_z <= " + z + "}M104 S" + temp);
    }
}
prusaslicer.push("{endif}");

console.log(prusaslicer.join("\n"));

// var x = 1;
// var y = generator.getVal(x);
