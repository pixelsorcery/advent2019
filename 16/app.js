"use strict";
let fs = require('fs');
let input = fs.readFileSync("input.txt").toString();
let originalInput = input;

let assert = require('assert');

function fft(input) {
    const pattern = [0, 1, 0, -1];
    let newPattern = [];
    let newVal = [];
    input = input.split('').map(x => parseInt(x));
    for (let i = 0; i < input.length; i++) {
        newPattern = [];
        for(let j = 0; j < input.length; j++) {
            let arr = new Array(i+1).fill(pattern[j%pattern.length]);
            newPattern = newPattern.concat(arr);
            if (newPattern.length > input.length) break;
        }
        let f = newPattern.shift();
        newPattern.push(f);
        let t = input.map(function(num, idx) { return num * newPattern[idx]}).reduce((a, b) => a + b, 0);
        newVal.push(Math.abs(t) % 10);
    }
    return newVal.join('');
}

for (let i = 0; i < 100; i++) {
    input = fft(input);
}

console.log("part 1:", input.substring(0, 8));

function fft2(input) {
    let output = [];
    let sum = 0;
    for(let i = 0; i < input.length; i++) {
        sum += input[i];
    }

    output[0] = sum % 10;

    for (let i = 1; i < input.length; i++) {
        sum -= input[i-1];
        output[i] = sum % 10;
    }

    return output;
}

// pattern for the last half is always something like:
// 11111111
// 01111111
// 00111111
// 00011111
// 00001111... etc
// and our offset happens to be > (650 * 10000) / 2 so only need to worry about the last half
let offset = parseInt(originalInput.substring(0, 7));
assert(offset > (originalInput.length * 10000) / 2, "Assumption about offset is wrong.");
let max = originalInput.length * 10000;
let length = max - offset;

// create array of values starting at the offset
let idx = (max - length) % originalInput.length;
input = [];
for (let i = 0; i < length; i++, idx++) {
    input.push(parseInt(originalInput[idx % originalInput.length]));
}

// make sure it makes sense
for (let i = 0; i < originalInput.length; i++)
{
    assert(originalInput[originalInput.length - i - 1] == input[input.length - i - 1]);
}

// run 100 phases again
for (let i = 0; i < 100; i++) {
    input = fft2(input);
}

let part2 = "";
for (let i = 0; i < 8; i++)
{
    part2 += input[i];
}

console.log("part 2:", part2);