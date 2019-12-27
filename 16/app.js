"use strict;"
let fs = require('fs');
let input = fs.readFileSync("input.txt").toString();

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
        console.log(newPattern);
        let t = input.map(function(num, idx) { return num * newPattern[idx]}).reduce((a, b) => a + b, 0);
        newVal.push(Math.abs(t) % 10);
    }
    return newVal.join('');
}

input = "123456123456123456123456";

for (let i = 0; i < 100; i++) {
    console.log(input);
    input = fft(input);
}

console.log("part 1:", input.substring(0, 8));

function fft2(input) {
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

//for (let i = 0; i < 100; i++) {
//    input = fft2(input);
//}

//console.log("part 2:", input.substring(parseInt(input.substring(0, 8)), 8));
