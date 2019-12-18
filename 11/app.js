const fs = require('fs');
const input = fs.readFileSync('input.txt').toString();

const asm = input.split(',');

const modeEnum = {
    Address : 0,
    Immediate : 1,
    Offset : 2
};

function getOperand(nums, mode0, i, base) {
    if (mode0 === modeEnum.Immediate) {
        var op = parseInt(nums[i]);
    } else if (mode0 === modeEnum.Address) {
        if (typeof nums[nums[i]] === "undefined") {
            op = 0;
        } else {
            var op = parseInt(nums[nums[i]]);
        }
    } else if (mode0 === modeEnum.Offset) {
        var op = parseInt(nums[i]);
        op += base;
        op = parseInt(nums[op]);
    }
    return op;
}

function getDestOperand(nums, mode, i, base) {
    if (mode === modeEnum.Immediate) {
        var op = parseInt(i);
    } else if (mode === modeEnum.Address) {
        if (typeof nums[i] === "undefined") {
            op = 0;
        } else {
            var op = parseInt(nums[i]);
        }
    } else if (mode === modeEnum.Offset) {
        var op = parseInt(nums[i]);
        op += base;
    }
    return op;
}

var paintMap = [];

function run(nums, startColor) {
    // internal intcode variables
    let buffer = "";
    let i = 0;
    let base = 0;

    // local program variables
    let outIdx = 0;
    let x = 0;
    let y = 0;

    let first = true;

    const dirs = {
        up    : 0,
        right : 1,
        down  : 2,
        left  : 3,
    }

    let currentDir = dirs.up;

    var changeDir = function(lr) {
        if (lr == 0) {
            currentDir--;
        } else {
            currentDir++;
        }

        if (currentDir === 4) currentDir = 0;
        else if (currentDir === -1) currentDir = 3;
    }

    var moveRobot = function() {
        switch (currentDir) {
            case dirs.up:
                y++;
                break;
            case dirs.down:
                y--;
                break;
            case dirs.left:
                x--;
                break;
            case dirs.right:
                x++;
                break;
            default:
                throw "unknown dir";
        }
    }

    while (1)
    {
        if (nums[i].length <= 2) {
            var op = parseInt(nums[i]);
            var mode0 = 0;
            var mode1 = 0;
            var mode2 = 0;
        } else if (nums[i].length === 3){
            var op = parseInt(nums[i].slice(-2));
            var mod = nums[i].slice(0, -2);
            var mode0 = parseInt(mod[0]);
            var mode1 = 0;
            var mode2 = 0;
        } else if (nums[i].length === 4) {
            var op = parseInt(nums[i].slice(-2));
            var mod = nums[i].slice(0, -2);
            var mode0 = parseInt(mod[1]);
            var mode1 = parseInt(mod[0]);
            var mode2 = 0;
        } else if (nums[i].length === 5) {
            var op = parseInt(nums[i].slice(-2));
            var mod = nums[i].slice(0, -2);
            var mode0 = parseInt(mod[2]);
            var mode1 = parseInt(mod[1]);
            var mode2 = parseInt(mod[0]);
        }
            
        if (op === 99) {
            // end
            break;            
        } else if (op === 1) {
            // add
            op1 = getOperand(nums, mode0, i+1, base);
            op2 = getOperand(nums, mode1, i+2, base);
            op3 = getDestOperand(nums, mode2, i+3, base);
            nums[op3] = (op1 + op2).toString();
            i += 4;
        } else if (op === 2) {
            // mul
            op1 = getOperand(nums, mode0, i+1, base);
            op2 = getOperand(nums, mode1, i+2, base);
            op3 = getDestOperand(nums, mode2, i+3, base);
            nums[op3] = (op1 * op2).toString();
            i += 4;
        } else if (op === 3) {
            // get input
            op1 = getDestOperand(nums, mode0, i+1, base);
            if (first == true) {
                asmInput = startColor;
                first = false;
            }
            else if (typeof paintMap[x + "_" + y] === "undefined") {
                asmInput = "0";
            } else {
                asmInput = paintMap[x + "_" + y];
            }

            nums[op1] = asmInput;
            i += 2;
        } else if (op === 4) {
            // add output code to buffer
            op = getOperand(nums, mode0, i+1, base);

            if (outIdx % 2 === 0) {
                // first output color, 0 = black, 1 = white
                paintMap[x + "_" + y] = op.toString();;
            } else {
                // second output 0 = turn left 90 degrees, 1 = turn right 90 degrees
                changeDir(op);
                moveRobot();
            }
            outIdx++;
            //buffer += op + '\n';
            i += 2;
        } else if (op === 5) {
            // jmp if true, if first parameter is non zero, set ip to second parameter
            op1 = getOperand(nums, mode0, i+1, base);
            op2 = getOperand(nums, mode1, i+2, base);
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
            op1 = getOperand(nums, mode0, i+1, base);
            op2 = getOperand(nums, mode1, i+2, base);
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
            op1 = getOperand(nums, mode0, i+1, base);
            op2 = getOperand(nums, mode1, i+2, base);
            op3 = getDestOperand(nums, mode2, i+3, base);
            if (op1 < op2)
            {
                nums[op3] = "1";
            }
            else
            {
                nums[op3] = "0";
            }
            i += 4;
        } else if (op === 8) {
            // equals: if the first parameter is equal to the second parameter,
            // it stores 1 in the position given by the third parameter. Otherwise, it stores 0.
            op1 = getOperand(nums, mode0, i+1, base);
            op2 = getOperand(nums, mode1, i+2, base);
            op3 = getDestOperand(nums, mode2, i+3, base);
            if (op1 === op2)
            {
                nums[op3] = "1";
            }
            else
            {
                nums[op3] = "0";
            }
            i += 4;
        } else if (op === 9) {
            op1 = getOperand(nums, mode0, i+1, base);
            base += op1;
            i += 2;
        } else{
            throw "unknown instruction";
        }

    }
    return buffer;
}

run(asm, "0");

function countProperties(obj) {
    var count = 0;

    for(var prop in obj) {
        if(obj.hasOwnProperty(prop))
            ++count;
    }

    return count;
}

console.log("part 1: " + countProperties(paintMap));

paintMap = [];
run(asm, "1");

//find mins
var minx = 0;
var miny = 0;
var maxx = 0;
var maxy = 0;
for (i in paintMap) {
    let vals = i.split("_");
    let x = parseInt(vals[0]);
    let y = parseInt(vals[1]);

    if (x > maxx) {
        maxx = x;
    }

    if (x < minx) {
        minx = x;
    }

    if (y < miny) {
        miny = y;
    }

    if (y > maxy) {
        maxy = y;
    }
}

console.log("part 2:");
var buffer = "";
for (let y = maxy; y >= miny; y--) {
    for (let x = minx; x < maxx; x++) {
        if (typeof paintMap[x + "_" + y] === "undefined") {
            buffer += "\u25A1";
        } else {
        buffer += paintMap[x + "_" + y] === '1' ? "\u25A0" : "\u25A1";;
        }
        if (x != 0 && x % 5 === 0) {
            buffer += " ";
        }
    }
    console.log(buffer);
    buffer = "";
}