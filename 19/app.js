"use strict";
let fs = require('fs');
const originalInput = fs.readFileSync("input.txt").toString().split(',');


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
            buffer += op;
            return buffer;
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

const width  = 50;
const height = 50;
let part1 = 0;
for (let y = 0; y < height; y++) {
    let buffer = "";
    for (let x = 0; x < width; x++) {
        let input = originalInput.slice();
        let result = run(input, 0, [x, y]);
        if (result === "1") part1++;
        buffer += result;
    }
    //console.log(buffer);
}

console.log("part 1:", part1);

let part2 = 0;
let y = 1600;
let x = 1000;
let numX = 0;
let go = true;
let minx = [];
let maxx = [];
let ys = [];
let startx = 0;

while(go) {
    let input = originalInput.slice();
    let result = run(input, 0, [x, y]);

    if (result === '1'){
        if (numX === 0) {
            startx = x;
            minx.push(x);
        }
        numX++;
    }

    else if (result === '0' && numX > 0){
        //console.log("y:", y, "numx:", numX);
        numX = 0;
        maxx.push(x-1);
        ys.push(y);
        x = startx - 10;
        y++;

        if (minx.length > 100) {
            minx.shift();
            maxx.shift();
            ys.shift();
        }

        continue;
    }
    if (maxx[0] - minx[99] === 99) {
        break;
    }
    x++;
}

console.log("part 2:", minx[99] * 10000 + ys[0]);