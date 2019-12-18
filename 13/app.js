const fs = require('fs')
var readline = require('readline');

var rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: false
  });

const contents = fs.readFileSync('input.txt').toString();

var nums = contents.split(',');

var modeEnum = {
    Address : 0,
    Immediate : 1,
    Offset : 2
};
var input = 0;

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

function run(nums) {
    let buffer = "";
    let i = 0;
    let base = 0;
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
            printOutput(buffer);
            buffer = "";

            op1 = getDestOperand(nums, mode0, i+1, base);
            nums[op1] = "0";
            i += 2;
        } else if (op === 4) {
            // add output code to buffer
            op = getOperand(nums, mode0, i+1, base);
            buffer += op + '\n';

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

var input = "8"

var test = "109,1,204,-1,1001,100,1,100,1008,100,16,101,1006,101,0,99"
test = test.split(',');
testres = run(test);
console.log("test 1: " + testres);

test = "1102,34915192,34915192,7,4,7,99,0";
test = test.split(',');
testres = run(test);
console.log("test 2: " + testres);

var test = "104,1125899906842624,99";
test = test.split(',');
var testres = run(test);
console.log("test 3: " + testres);

input = 1;
var output = run(nums);
output = output.split('\n');

var answer1 = 0;
for (let i = 0; i < output.length; i++)
{
    i += 2;
    if (output[i] === "2") answer1++;
}
console.log("part 1: " + answer1);


var nums = contents.split(',');

nums[0] = "2";
var map = [];

var output = run(nums);

var score = 0;
printOutput(output);

function printOutput(string2process) {
    let width = 37;
    output = string2process.split('\n');

    for (let i = 0; i < output.length; i++) {
        let x = parseInt(output[i]);
        let y = parseInt(output[i+1]);
        let val =  output[i+2];

        if (x === -1 && y === 0) {
            score = val;
            //console.log(val);
        } else {
            map[y * width + x] = val;
        }
        i+= 2;
    }

    var strOut = "";
    for (let i = 0; i < map.length - 1; i++) {
        if (i !== 0 && (i % (width)) === 0) strOut += '\n';
        strOut += map[i];
    }

    //console.log(strOut + '\n');
}

console.log("part 2: " + score);