"use strict";

let fs = require('fs');
let input = fs.readFileSync("input.txt").toString();

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
        var op = parseInt(asm[i]);
        op += base;
        op = parseInt(asm[op]);
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
        var op = parseInt(asm[i]);
        op += base;
    }
    return op;
}

function run(asm, ip, input) {
    let i = ip;
    let base = 0;
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
            asm[op1] = input;
            i += 2;
        } else if (op === 4) {
            // add output code to buffer
            let op = getOperand(asm, mode0, i+1, base);
            i += 2;
            return [op, i];
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
}

/**********INTCODE COMPUTER END**********/

let dir = {
    north : 1,
    south : 2, 
    west  : 3, 
    east  : 4
};

let visited = {};

let asm = input.split(',');
let ip = 0;

let part1 = 0;
let p = [0,0];

let bfsq = [[ip, 0, p, asm.slice()]];
visited[[0,0]] = 1;

while (bfsq.length > 0) {
    var stat = bfsq.shift();
    for (let i = 1; i <= 4; i++) {
        let x = stat[2][0];
        let y = stat[2][1];

        if (i === 1) y++;
        if (i === 2) y--;
        if (i === 3) x--;
        if (i === 4) x++;

        // memoize
        if (typeof visited[[x,y]] !== "undefined") {
            continue;
        } else {
            visited[[x,y]] = 1;
        }

        let prog = stat[3].slice();
        let result = run(prog, stat[0], i);

        if (result[0] === 1) {
            bfsq.push([result[1], stat[1]+1, [x,y], prog]);
        }

        if (result[0] === 2 && part1 == 0) {
            part1 = stat[1] + 1;
            // reset everything and start filling o2 now for part 2
            bfsq = [[result[1], 0, [x,y], prog]];
            visited = [];
            visited[[x,y]] = 1;
            break;
        }
    }
}

console.log("part 1: ", part1);
console.log("part 2: ", stat[1]);