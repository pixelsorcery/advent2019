"use strict";

const fs = require('fs');
const input = fs.readFileSync("input.txt").toString();

/**********INTCODE COMPUTER BEGIN**********/
var modeEnum = {
    Address : 0,
    Immediate : 1,
    Offset : 2
};

function getOperand(asm, mode0, i, base) {
    if (mode0 === modeEnum.Immediate) {
        var op = parseInt(asm[i]);
    } else if (mode0 === modeEnum.Address) {
        if (typeof asm[asm[i]] === "undefined") {
            op = 0;
        } else {
            var op = parseInt(asm[asm[i]]);
        }
    } else if (mode0 === modeEnum.Offset) {
        var op = 0;
        if (typeof asm[asm[i]] === "undefined") {
            op = 0;
        }
        var op = parseInt(asm[i]);
        op += base;
        if (typeof asm[op] === "undefined") {
            op = 0;
        } else {
            op = parseInt(asm[op]);
        }
    }
    return op;
}

function getDestOperand(asm, mode, i, base) {
    if (mode === modeEnum.Immediate) {
        var op = parseInt(i);
    } else if (mode === modeEnum.Address) {
        if (typeof asm[i] === "undefined") {
            op = 0;
        } else {
            var op = parseInt(asm[i]);
        }
    } else if (mode === modeEnum.Offset) {
        if (typeof asm[i] === "undefined") {
            var op = 0;
        }
        op = parseInt(asm[i]);
        op += base;
    }
    return op;
}

function run(asm, ip, input) {
    let i = ip;
    let base = 0;
    let buffer = "";
    let inputIdx = 0;
    while (1)
    {
        if (asm[i].length <= 2) {
            var op = parseInt(asm[i]);
            var mode0 = 0;
            var mode1 = 0;
            var mode2 = 0;
        } else if (asm[i].length === 3){
            var op = parseInt(asm[i].slice(-2));
            var mod = asm[i].slice(0, -2);
            var mode0 = parseInt(mod[0]);
            var mode1 = 0;
            var mode2 = 0;
        } else if (asm[i].length === 4) {
            var op = parseInt(asm[i].slice(-2));
            var mod = asm[i].slice(0, -2);
            var mode0 = parseInt(mod[1]);
            var mode1 = parseInt(mod[0]);
            var mode2 = 0;
        } else if (asm[i].length === 5) {
            var op = parseInt(asm[i].slice(-2));
            var mod = asm[i].slice(0, -2);
            var mode0 = parseInt(mod[2]);
            var mode1 = parseInt(mod[1]);
            var mode2 = parseInt(mod[0]);
        }
            
        if (op === 99) {
            // end
            break;            
        } else if (op === 1) {
            // add
            let op1 = getOperand(asm, mode0, i+1, base);
            let op2 = getOperand(asm, mode1, i+2, base);
            let op3 = getDestOperand(asm, mode2, i+3, base);
            asm[op3] = (op1 + op2).toString();
            i += 4;
        } else if (op === 2) {
            // mul
            let op1 = getOperand(asm, mode0, i+1, base);
            let op2 = getOperand(asm, mode1, i+2, base);
            let op3 = getDestOperand(asm, mode2, i+3, base);
            asm[op3] = (op1 * op2).toString();
            i += 4;
        } else if (op === 3) {
            // get input
            let op1 = getDestOperand(asm, mode0, i+1, base);
            asm[op1] = input[inputIdx];
            inputIdx++;
            i += 2;
        } else if (op === 4) {
            // add output code to buffer
            let op = getOperand(asm, mode0, i+1, base);
            buffer += op + ',';
            i += 2;
        } else if (op === 5) {
            // jmp if true, if first parameter is non zero, set ip to second parameter
            let op1 = getOperand(asm, mode0, i+1, base);
            let op2 = getOperand(asm, mode1, i+2, base);
            if (op1 !== 0)
            {
                i = op2;
            }
            else
            {
                i += 3;
            }
        } else if (op === 6) {
            // jmp if false, if first parameter is zero, set ip to second parameter
            let op1 = getOperand(asm, mode0, i+1, base);
            let op2 = getOperand(asm, mode1, i+2, base);
            if (op1 === 0)
            {
                i = op2;
            }
            else
            {
                i += 3;
            }
        } else if (op === 7) {
            // less than: if the first parameter is less than the second parameter,
            // it stores 1 in the position given by the third parameter. Otherwise, it stores 0.
            let op1 = getOperand(asm, mode0, i+1, base);
            let op2 = getOperand(asm, mode1, i+2, base);
            let op3 = getDestOperand(asm, mode2, i+3, base);
            if (op1 < op2)
            {
                asm[op3] = "1";
            }
            else
            {
                asm[op3] = "0";
            }
            i += 4;
        } else if (op === 8) {
            // equals: if the first parameter is equal to the second parameter,
            // it stores 1 in the position given by the third parameter. Otherwise, it stores 0.
            let op1 = getOperand(asm, mode0, i+1, base);
            let op2 = getOperand(asm, mode1, i+2, base);
            let op3 = getDestOperand(asm, mode2, i+3, base);
            if (op1 === op2)
            {
                asm[op3] = "1";
            }
            else
            {
                asm[op3] = "0";
            }
            i += 4;
        } else if (op === 9) {
            let op1 = getOperand(asm, mode0, i+1, base);
            base += op1;
            i += 2;
        } else{
            throw "unknown instruction";
        }
    }
    return buffer;
}

/**********INTCODE COMPUTER END**********/


var asm = input.split(',');

var output = run(asm, 0, 0);

output = output.split(',');

var buffer = "";
let width = 0;
let height = 0;
for (let i = 0; i < output.length; i++) {
    buffer += String.fromCharCode(output[i]);
    if (output[i] == 10) height++;
    if (width === 0 && output[i] == 10) width = i+1;
}

//console.log(buffer);

let part1 = 0;
for (let y = 1; y < height-1; y++) {
    for (let x = 1; x < width-1; x++) {
        if ((buffer[y * width + x]       === "#") &&
            (buffer[(y + 1) * width + x] === "#") &&
            (buffer[(y - 1) * width + x] === "#") &&
            (buffer[y * width + (x + 1)] === "#") &&
            (buffer[y * width + (x - 1)] === "#")) {
            part1 += x * y;
        }
    }
}

console.log("part 1:", part1);

function convertToAsciiCode(string) {
    let code = [];
    for (let i = 0; i < string.length; i++) {
        code.push(string.charCodeAt(i));
    }
    return code;
}

let functions = "A,B,A,C,A,B,A,C,B,C\n";
functions = convertToAsciiCode(functions); //"65,44,66,44,65,44,67,44,65,44,66,44,65,44,67,44,66,44,67,10"
let a = "R,4,L,12,L,8,R,4\n";
a = convertToAsciiCode(a);
let b = "L,8,R,10,R,10,R,6\n";
b = convertToAsciiCode(b);
let c = "R,4,R,10,L,12\n"
c = convertToAsciiCode(c);
let v = "N\n"
v = convertToAsciiCode(v);

let progInput = [];
progInput = progInput.concat(functions, a, b, c, v);

var asm = input.split(',');

asm[0] = "2";

var output = run(asm, 0, progInput);
output = output.split(',');
buffer = "";
width = 0;
height = 0;
for (let i = 0; i < output.length; i++) {
    buffer += String.fromCharCode(output[i]);
    //if (i > 1887) 
    //console.log(output[i], ":", String.fromCharCode(output[i]));
    if (output[i] == 10) height++;
    if (width === 0 && output[i] == 10) width = i+1;
}
//console.log(buffer);

console.log("part 2:", output[output.length-2]);
