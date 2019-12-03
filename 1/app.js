var fs = require('fs');
var array = fs.readFileSync('input.txt').toString().split("\n");

var answer = 0;

var part1 = 0;

if (part1) {
    for (i in array) {
        let val = parseInt(array[i]);
        val = Math.floor(val/3);
        val -= 2;
        answer += val;
        console.log(answer);
    };
}

if (part1 == 0) {
    for (i in array) {
        let val = parseInt(array[i]);
        while(val > 0) {
            val = Math.floor(val/3);
            val -= 2;
            if (val > 0) answer += val;
        }
    }
}
console.log(answer);