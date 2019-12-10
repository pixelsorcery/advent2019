const fs = require('fs')
const contents = fs.readFileSync('input.txt').toString();

var nodes = contents.split('\n');

//test
//nodes = "COM)B,B)C,C)D,D)E,E)F,B)G,G)H,D)I,E)J,J)K,K)L,K)YOU,I)SAN".split(",");

map = [];

// build tree
for (let i = 0; i < nodes.length; i++) {
    vals = nodes[i].split(')');
    if (typeof map[vals[0]] === 'undefined') { 
        map[vals[0]] = new Array; }
    map[vals[0]].push(vals[1]);
}

// traverse through tree - start at COM (center of mass)
var curNode = "COM";
var answer = 0;
var stack = [];

stack.push({str:curNode, depth:0});

while(stack.length > 0) {
    curNode = stack[0];
    stack.shift();
    answer += curNode.depth;
    if (typeof map[curNode.str] != "undefined")
    {
        for (let i = 0; i < map[curNode.str].length; i++) {
            let val = map[curNode.str][i];
            stack.push({str:val, depth:curNode.depth + 1});
        }
    }
}

console.log("part 1: " + answer);

var findPath = function(startNode, destination) {
    curNode = startNode;

    var paths = [[curNode]];

    while (paths.length > 0) {
        let numPaths = paths.length;
        let lastPath = paths[numPaths-1];
        if (lastPath[lastPath.length-1] == destination) {
            return lastPath;
        }
        
        curPath = paths.pop();
        let curNode = curPath[curPath.length-1];
        if (typeof map[curNode] !== "undefined") {
            for(let i = 0; i < map[curNode].length; i++) {
                temp = lastPath.slice();
                temp.push(map[curNode][i]);
                paths.push(temp);
            }
        }
    }
}

var queue = [];
sanPath = findPath("COM", "SAN");
youPath = findPath("COM", "YOU");

var common = 0;

for (let i = 0; i <= Math.min(sanPath.length, youPath.length); i++) {
    if (sanPath[i] !== youPath[i]) {
        common = i;
        break;
    }
}

answer = sanPath.length - 1 + youPath.length - 1 - (2 * common);

console.log("part 2: " + answer);