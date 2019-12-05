var fs = require('fs');
var strings = fs.readFileSync('input.txt').toString().split('\n')

// tests
//strings[0] = "R75,D30,R83,U83,L12,D49,R71,U7,L72";
//strings[1] = "U62,R66,U55,R34,D71,R55,D58,R83";

//strings[0] = "R8,U5,L5,D3";
//strings[1] = "U7,R6,D4,L4";

firstPath = strings[0].split(',');
secondPath = strings[1].split(',');

var map = [];
var collisions = [];

var write = function(path, map, val) {
    let x = 0;
    let y = 0;
    for (let j = 0; j < path.length; j++)
    {
        let numVal = parseInt(path[j].match(/\d+/));

        for (let i = 0; i < numVal; i++)
        {
            switch(path[j][0])
            {
            case 'R':
                x++;
                break;
            case 'U':
                y++;
                break;
            case 'L':
                x--;
                break;
            case 'D':
                y--;
                break;
            }

            let key = x.toString() + '_' + y.toString();
            //console.log(key);
            if (map[key] !== val && (typeof map[key] !== 'undefined'))
            {
                collisions.push({x, y});
                map[key] = 'x';
            }
            else
            {
                map[key] = val;
            }
        }
    }
}

write(firstPath, map, 'a');
write(secondPath, map, 'b');

var answer = 99999999;

for(let i = 0; i < collisions.length; i++)
{
    answer = Math.min(answer, Math.abs(collisions[i].x) + Math.abs(collisions[i].y));
}

console.log(answer);

// parth 2
// trace each wire and find the shortest path to each x

minStepsMap = [];

var trace = function(path, map) {
    let x = 0;
    let y = 0;
    let totalSteps = 0;
    for (let j = 0; j < path.length; j++)
    {
        let numVal = parseInt(path[j].match(/\d+/));

        for (let i = 0; i < numVal; i++)
        {
            switch(path[j][0])
            {
            case 'R':
                x++;
                break;
            case 'U':
                y++;
                break;
            case 'L':
                x--;
                break;
            case 'D':
                y--;
                break;
            }
            
            totalSteps++;
            let key = x.toString() + '_' + y.toString();

            if (map[key] === 'x')
            {
                if (typeof minStepsMap[key] === 'undefined') {
                    minStepsMap[key] = totalSteps;
                }
                else
                {
                    minStepsMap[key] += totalSteps;
                }
            }
        }
    }
}

trace(firstPath, map);
trace(secondPath, map);

answer = 999999999;
for (i in minStepsMap) 
{
    answer = Math.min(answer, minStepsMap[i]);
}

console.log(answer);

