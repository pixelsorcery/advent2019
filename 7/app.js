const fs = require('fs')
const contents = fs.readFileSync('input.txt').toString();

var nums = contents.split(',');

var input1 = "";
var input2 = "";
var output = 0;
var max = 0;
testInput = "3,31,3,32,1002,32,10,32,1001,31,-2,31,1007,31,0,33,\
1002,33,7,33,1,33,31,31,1,32,31,31,4,31,99,0,0,0";

console.log("test: " + runPart1(1,0,4,3,2,testInput));

function runPart1(a, b, c, d, e, contents) {
    input1 = a;
    input2 = 0;

    nums = contents.split(',');
    input2 = run(nums, 0)[0];

    input1 = b;
    nums = contents.split(',');
    input2 = run(nums, 0)[0];

    input1 = c;
    nums = contents.split(',');
    input2 = run(nums, 0)[0];

    input1 = d;
    nums = contents.split(',');
    input2 = run(nums, 0)[0];

    input1 = e;
    nums = contents.split(',');
    output = run(nums, 0)[0];

    return output;
}

function runPart2(a,b,c,d,e,contents) {
    let codeA = contents.split(',');
    let codeB = contents.split(',');
    let codeC = contents.split(',');
    let codeD = contents.split(',');
    let codeE = contents.split(',');

    let ipA = 0;
    let ipB = 0;
    let ipC = 0;
    let ipD = 0;
    let ipE = 0;

    let output = [];
    output.push(0);
    output.push(0);
    input1 = a;
    do {
        input1 = a;
        input2 = parseInt(output[0]);
        output = run(codeA, ipA);
        if (output === "") break;
        input2 = parseInt(output[0]);
        ipA = output[1];

        input1 = b;
        output = run(codeB, ipB);
        if (output[0] === "") break;
        input2 = parseInt(output[0])
        ipB = output[1];

        input1 = c;
        output = run(codeC, ipC);
        input2 = parseInt(output[0]);
        ipC = output[1];

        input1 = d;
        output = run(codeD, ipD);
        if (output[0] === "") break;
        input2 = parseInt(output[0]);
        ipD = output[1];

        input1 = e;
        output = run(codeE, ipE);
        if (output[0] === "") break;
        input2 = parseInt(output[0]);
        ipE = output[1];

        answer = input2;
    } while (output !== "");

    return answer;
}

var answer = "";

for (let a = 0; a < 5; a++) {
    for (let b = 0; b < 5; b++) {
        if (b === a) continue;
        for (let c = 0; c < 5; c++) {
            if (c === b || c === a) continue;
            for (let d = 0; d < 5; d++) {
                if (d === c || d === b || d === a) continue;
                for (let e = 0; e < 5; e++) {
                    if (e === d || e === c || e === b || e === a) continue;
                    //console.log(a.toString() + b.toString() + c.toString() + d.toString() + e.toString());
                    output = runPart1(a, b, c, d, e, contents);

                    if (output > max) {
                        max = output;
                    }
                }
            }
        }
    }
}

console.log("part 1: " + max);

testInput = "3,26,1001,26,-4,26,3,27,1002,27,2,27,1,27,26,\
27,4,27,1001,28,-1,28,1005,28,6,99,0,0,5"

console.log("test2: " + runPart2(9,8,7,6,5,testInput));

testInput = "3,52,1001,52,-5,52,3,53,1,52,56,54,1007,54,5,55,1005,55,26,1001,54,\
-5,54,1105,1,12,1,53,54,53,1008,54,0,55,1001,55,1,55,2,53,55,53,4,\
53,1001,56,-1,56,1005,56,6,99,0,0,0,0,10"

console.log("test2: " + runPart2(9,7,8,5,6,testInput));

for (let a = 5; a < 10; a++) {
    for (let b = 5; b < 10; b++) {
        if (b === a) continue;
        for (let c = 5; c < 10; c++) {
            if (c === b || c === a) continue;
            for (let d = 5; d < 10; d++) {
                if (d === c || d === b || d === a) continue;
                for (let e = 5; e < 10; e++) {
                    if (e === d || e === c || e === b || e === a) continue;
                    //console.log(a.toString() + b.toString() + c.toString() + d.toString() + e.toString());
                    // TODO this inf loops when you give it "95678" but luckily it gets the max before then
                    output = runPart2(a, b, c, d, e, contents);
                    if (output > max) {
                        max = output;
                        //console.log(max);
                    }
                }
            }
        }
    }
}

console.log("part 2: " + max);

function getOperand(nums, imm0, i) {
    if (imm0) {
        var op = parseInt(nums[i]);
    } else {
        var op = parseInt(nums[nums[i]]);
    }
    return op;
}

function run(nums, ip)
{
    let input = 0;
    let buffer = "";
    let i = ip;
    let startIp = ip;
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
            // get input
            if (input === 0 && startIp === 0) {
                nums[nums[i+1]] = input1;
            } else {
                nums[nums[i+1]] = input2; 
            }
            input++;
            i += 2;
        } else if (op === 4) {
            // add output code to buffer
            op = getOperand(nums, imm0, i+1);
            buffer += op + '\n';
            i += 2;
            var arr = [];
            arr.push(buffer);
            arr.push(i);
            return arr;
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