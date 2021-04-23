function Simple1DNoise() {
    let MAX_VERTICES = 256;
    let MAX_VERTICES_MASK = MAX_VERTICES -1;
    let amplitude = 1;
    let scale = 1;

    let r = [];

    for ( let i = 0; i < MAX_VERTICES; ++i ) {
        r.push(Math.random());
    }

    let getVal = function( x ){
        let scaledX = x * scale;
        let xFloor = Math.floor(scaledX);
        let t = scaledX - xFloor;
        let tRemapSmoothstep = t * t * ( 3 - 2 * t );

        /// Modulo using &#038;
        let xMin = xFloor % MAX_VERTICES_MASK;
        let xMax = ( xMin + 1 ) % MAX_VERTICES_MASK;

        let y = lerp( r[ xMin ], r[ xMax ], tRemapSmoothstep );

        return y * amplitude;
    };

    /**
    * Linear interpolation function.
    * @param a The lower integer value
    * @param b The upper integer value
    * @param t The value between the two
    * @returns {number}
    */
    let lerp = function(a, b, t ) {
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

function generateLayers({ num }) {
    let generator = new Simple1DNoise();
    // generator.setAmplitude(0.5);
    // generator.setScale(0.5);

    let layers = [];

    for (x = 0; x <= num; x+=1) {
        let value = generator.getVal(x);

        let z = layer_height * (x+1);
        layers.push({
            z: parseFloat(z).toPrecision(5);
            value: opacity
        });
    }

    return layers;
}

function valueToTemp(value) {
    let min_temp = 190;
    let temp_range = 40;
    let temp = min_temp + (temp_range * value);

    return parseFloat(temp).toPrecision(5);
}

function layersToHtml(layers) {
    let lines = layers.map({value} => `<div class='row' style='height: 1px; opacity: ${value};'> </div>`);

    return lines.join("\n");
}

function layersToCode(layers) {
    let lines = layers.map(({z, value}, i) => {
        let temp = valueToTemp(value);
        if (i == 0) {
            return `{if layer_z <= ${z}}M104 S${temp}`;
        }
        else {
            return `{elsif layer_z <= ${z}}M104 S${temp}`;
        }
    });
    lines.push("{endif}");

    return lines.join("\n");
}

let layer_height = 0.3;
let max_height = 80;
let layers_per_temp = 1;
let layers_cnt = Math.ceil(max_height / layers_per_temp / layer_height);
let layers = generateLayers(layers_cnt, layers_per_temp);

document.write(layersToHtml(layers));
document.write(`<textarea>${layersToCode(layers)}</textarea>`);

