const fs = require('fs')
const contents = fs.readFileSync('input.txt').toString();

var nums = contents.split(',');

var input = "8"
// tests
var test1 = "3,9,8,9,10,9,4,9,99,-1,8";
test1 = test1.split(',');
testres = run(test1);
console.log("test1 = " + testres);

test1 = "3,9,7,9,10,9,4,9,99,-1,8";
test1 = test1.split(',');
testres = run(test1);
console.log("test2 = " + testres);

test1 = "3,3,1108,-1,8,3,4,3,99";
test1 = test1.split(',');
testres = run(test1);
console.log("test3 = " + testres);

test1 = "3,3,1107,-1,8,3,4,3,99";
test1 = test1.split(',');
testres = run(test1);
console.log("test4 = " + testres);

test1 = "3,12,6,12,15,1,13,14,13,4,13,99,-1,0,1,9";
test1 = test1.split(',');
testres = run(test1);
console.log("test5 = " + testres);

test1 = "3,3,1105,-1,9,1101,0,0,12,4,12,99,1";
test1 = test1.split(',');
testres = run(test1);
console.log("test6 = " + testres);


test1 = "3,21,1008,21,8,20,1005,20,22,107,8,21,20,1006,20,31,1106,0,36,98,0,0,1002,21,125,20,4,20,1105,1,46,104,\
999,1105,1,46,1101,1000,1,20,4,20,1105,1,46,98,99"
test1 = test1.split(',');
testres = run(test1);
console.log("test7 = " + testres);

// run actual program
nums = contents.split(',');
input = "1";
const p1 = run(nums);
console.log("part 1: " + p1);

nums = contents.split(',');
input = "5";
const p2 = run(nums);
console.log("part 2: " + p2);

function getOperand(nums, imm0, i) {
    if (imm0) {
        var op = parseInt(nums[i]);
    } else {
        var op = parseInt(nums[nums[i]]);
    }
    return op;
}

function run(nums)
{
    let buffer = "";
    let i = 0;
    while (1)
    {
        if (nums[i].length <= 2) {
            var op = parseInt(nums[i]);
            var imm0 = 0;
            var imm1 = 0;
            var imm2 = 0;
        } else if (nums[i].length === 3){
            var op = parseInt(nums[i].slice(-2));
            var mod = nums[i].slice(0, -2);
            var imm0 = parseInt(mod[0]);
            var imm1 = 0;
            var imm2 = 0;
        } else if (nums[i].length === 4) {
            var op = parseInt(nums[i].slice(-2));
            var mod = nums[i].slice(0, -2);
            var imm0 = parseInt(mod[1]);
            var imm1 = parseInt(mod[0]);
            var imm2 = 0;
        } else if (nums[i].length === 5) {
            var op = parseInt(nums[i].slice(-2));
            var mod = nums[i].slice(0, -2);
            var imm0 = parseInt(mod[2]);
            var imm1 = parseInt(mod[1]);
            var imm2 = parseInt(mod[0]);
        }
            
        if (op === 99) {
            // end
            break;            
        } else if (op === 1) {
            // add
            op1 = getOperand(nums, imm0, i+1);
            op2 = getOperand(nums, imm1, i+2);
            op3 = getOperand(nums, imm2, i+3);
            nums[nums[i+3]] = (op1 + op2).toString();
            i += 4;
        } else if (op === 2) {
            // mul
            op1 = getOperand(nums, imm0, i+1);
            op2 = getOperand(nums, imm1, i+2);
            op3 = getOperand(nums, imm2, i+3);
            nums[nums[i+3]] = (op1 * op2).toString();
            i += 4;
        } else if (op === 3) {
            // get input (hardcoded to 1 for advent test)
            // input is 1 for part 1, 5 for part 2
            nums[nums[i+1]] = input;
            i += 2;
        } else if (op === 4) {
            // add output code to buffer
            op = getOperand(nums, imm0, i+1);
            buffer += op + '\n';
            i += 2;
        } else if (op === 5) {
            // jmp if true, if first parameter is non zero, set ip to second parameter
            op1 = getOperand(nums, imm0, i+1);
            op2 = getOperand(nums, imm1, i+2);
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
            op1 = getOperand(nums, imm0, i+1);
            op2 = getOperand(nums, imm1, i+2);
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
            op1 = getOperand(nums, imm0, i+1);
            op2 = getOperand(nums, imm1, i+2);
            op3 = getOperand(nums, imm2, i+3);
            if (op1 < op2)
            {
                nums[nums[i+3]] = "1";
            }
            else
            {
                nums[nums[i+3]] = "0";
            }
            i += 4;
        } else if (op === 8) {
            // equals: if the first parameter is equal to the second parameter,
            // it stores 1 in the position given by the third parameter. Otherwise, it stores 0.
            op1 = getOperand(nums, imm0, i+1);
            op2 = getOperand(nums, imm1, i+2);
            op3 = getOperand(nums, imm2, i+3);
            if (op1 === op2)
            {
                nums[nums[i+3]] = "1";
            }
            else
            {
                nums[nums[i+3]] = "0";
            }
            i += 4;
        }

    }

    return buffer;
}