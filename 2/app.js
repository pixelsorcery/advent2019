const fs = require('fs')

var contents = fs.readFileSync('input.txt', 'utf8');

nums = contents.split(',');

const result = part1(nums);
console.log(result);

const result2 = part2(contents);
console.log(result2);

function run(nums)
{
    let i = 0;
    while (1)
    {
        if (nums[i] === '99') {
            break;            
        }
        else if (nums[i] === '1') {
            nums[nums[i+3]] = parseInt(nums[nums[i+1]]) + parseInt(nums[nums[i+2]]);
        }
        else if (nums[i] === '2') {
            nums[nums[i+3]] = parseInt(nums[nums[i+1]]) * parseInt(nums[nums[i+2]]);
        }
        i += 4;
    }

    return nums[0];
}

function part1(nums) {

    nums[1] = 12;
    nums[2] = 2;
    let result = run(nums);

    return result;
}

function part2(contents) {

    let nums = [];
    let result = 0;
    for (var i = 0; i < 100; i++) {
        for (var j = 0; j < 100; j++) {
            nums = contents.split(',');
            nums[1] = i;
            nums[2] = j;

            result = run(nums);
            if (result === 19690720) {
                break;
            }
        }
        if (result === 19690720) {
            break;
        }
    }

    return 100 * i + j;
}