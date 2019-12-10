const fs = require('fs')
const contents = fs.readFileSync('input.txt').toString();

var w = 25;
var h = 6;

var layerSize = 25 * 6;

var layer = 0;

var zeroes = [];
var ones = [];
var twos = [];

var numLayers = contents.length / layerSize;

zeroes.push(0);
ones.push(0);
twos.push(0);

for (let i = 0; i < contents.length; i++) {
    if (i != 0 && i % layerSize === 0) { 
        layer++;
        zeroes.push(0);
        ones.push(0);
        twos.push(0);
    };

    if (contents[i] === '0') 
        zeroes[layer]++;
    if (contents[i] === '1') 
        ones[layer]++;
    if (contents[i] === '2') 
        twos[layer]++;
}

var min = 9999999;
var minIdx = 0;
for (let i = 0; i < zeroes.length; i++) {
    if (zeroes.length > 0) 
    {
        if (zeroes[i] < min) {
            min = zeroes[i];
            minIdx = i;
        }
    }
}

answer = ones[minIdx] * twos[minIdx];

console.log ("part 1: " + answer);

var finalImage = "";

for (let y = 0; y < 6; y++) {
    for (let x = 0; x < 25; x++) {
        for (let l = 0; l < numLayers; l++) {
            let idx = (y * w + x) + (layerSize * l);
            if (contents[idx] === '2') continue;
            finalImage += contents[idx] === '1' ? "\u25A1" : "\u25A0";
            break;
        }
    }
    finalImage += '\n';
}
console.log("part 2:");
console.log(finalImage);