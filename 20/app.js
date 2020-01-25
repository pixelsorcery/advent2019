"use strict";
const fs = require('fs')
const input = fs.readFileSync("input.txt").toString();

let map    = input.split("");
let width  = 0;
let height = 0;

// find dimensions
function processInput(map) {
    for(let i = 0; i < map.length; i++) {
        if (map[i] === '\n') {
            if (width === 0) width = i+1;
            height++;
        }
    }
}

processInput(map);

let portalMap = {};

// find all doors on the outside
let y = 2;
let x = 2;
let mode = [[1, 0], [0, 1], [-1, 0], [0, -1]];
let modeIdx = 0;
let outer = {};
do {
    if (map[y * width + x] === '.') {
        if (modeIdx === 0) {
            portalMap[map[(y-2)*width+x].toString()+map[(y-1)*width+x].toString()] = [x,y];
        } else if (modeIdx === 1) {
            portalMap[map[y*width+(x+1)].toString()+map[y*width+(x+2)].toString()] = [x,y];
        } else if (modeIdx === 2) { 
            portalMap[map[(y+1)*width+x].toString()+map[(y+2)*width+x].toString()] = [x,y];
        } else {
            portalMap[map[y*width+(x-2)].toString()+map[y*width+(x-1)].toString()] = [x,y];
        }
        outer[[x,y]] = 1;
    }

    if (modeIdx === 0 && (x === (width - 4))) {
        modeIdx++;
    } else if (modeIdx === 1 && (y === (height - 2))) {
        modeIdx++;
    } else if (modeIdx === 2 && (x === 2)) {
        modeIdx++;
    }

    x += mode[modeIdx][0];
    y += mode[modeIdx][1];
} while(!(y === 2 && x === 2));


function getVal(x,y) {
    return map[y * width + x];
}

// get inner donut dimensions
let ul = [];
let ur = [];
let ll = [];
let lr = [];
for (let y = 2; y < height - 2; y++) {
    for (let x = 2; x < width; x++) {
        if (getVal(x, y) === '#' && getVal(x+1,y) === '#' && getVal(x,y+1) === '#' && getVal(x+1,y+1) === ' ') {
            ul = [x,y];
        } else if (getVal(x, y) === '#' && getVal(x-1,y) === '#' && getVal(x,y+1) === '#' && getVal(x-1,y+1) === ' ') {
            ur = [x,y];
        } else if (getVal(x, y) === '#' && getVal(x+1,y) === '#' && getVal(x,y-1) === '#' && getVal(x+1,y-1) === ' ') {
            ll = [x,y];
        } else if (getVal(x, y) === '#' && getVal(x-1,y) === '#' && getVal(x,y-1) === '#' && getVal(x-1,y-1) === ' ') {
            lr = [x,y];
        }
    }
}

x = ul[0];
y = ul[1];
modeIdx = 0;
let portalMap2 = {};
do {
    if (map[y * width + x] === '.') {
        if (modeIdx === 0) {
            const location = map[(y+1)*width+x].toString() + map[(y+2)*width+x].toString();
            // create a map to map the portals both ways
            portalMap2[portalMap[location]] = [x,y];
            portalMap2[[x,y]] = portalMap[location];
        } else if (modeIdx === 1) {
            const location = map[y*width+(x-2)].toString()+map[y*width+(x-1)].toString();
            portalMap2[portalMap[location]] = [x,y];
            portalMap2[[x,y]] = portalMap[location];
        } else if (modeIdx === 2) { 
            const location = map[(y-2)*width+x].toString()+map[(y-1)*width+x].toString();
            portalMap2[portalMap[location]] = [x,y];
            portalMap2[[x,y]] = portalMap[location];
        } else {
            const location = map[y*width+(x+1)].toString()+map[y*width+(x+2)].toString()
            portalMap2[portalMap[location]] = [x,y];
            portalMap2[[x,y]] = portalMap[location];
        }
    }

    if (modeIdx === 0 && (x === (ur[0]))) {
        modeIdx++;
    } else if (modeIdx === 1 && (y === lr[1])) {
        modeIdx++;
    } else if (modeIdx === 2 && (x === ll[0])) {
        modeIdx++;
    }

    x += mode[modeIdx][0];
    y += mode[modeIdx][1];
} while(!(y === ul[1] && x === ul[0]));

let startPos = portalMap["AA"];

let queue = [];
queue.push([startPos, 0]);

const paths = [[1,0], [-1,0], [0,1], [0,-1]];
let answer  = 0;
let memo    = {};
// bfs
while (queue.length > 0 && answer === 0) {
    let state = queue.shift();

    if (typeof memo[state[0]] !== "undefined") {
        continue;
    }

    memo[state[0]] = 1;

    for (let i = 0; i < paths.length; i++) {
        let newPos = state[0].slice();
        newPos[0] += paths[i][0];
        newPos[1] += paths[i][1];

        if (portalMap["ZZ"][0] === newPos[0] &&
            portalMap["ZZ"][1] === newPos[1]) {
            answer = state[1] + 1;
            break;
        }

        if (map[newPos[1] * width + newPos[0]] != '.') {
            continue;
        }

        if (typeof portalMap2[newPos] !== "undefined") {
            newPos = portalMap2[newPos];
            queue.push([newPos, state[1] + 2]);
            continue;
        }

        queue.push([newPos, state[1] + 1]);
    }
}

console.log("part 1:", answer);

queue = [];
queue.push([startPos, 0, 0]);

answer  = 0;
memo    = {};
// bfs
while (queue.length > 0 && answer === 0) {
    let state = queue.shift();

    // memoize on the level now
    if (typeof memo[[state[0], state[2]]] !== "undefined") {
        continue;
    }

    memo[[state[0], state[2]]] = 1;

    for (let i = 0; i < paths.length; i++) {
        let newPos = state[0].slice();
        newPos[0] += paths[i][0];
        newPos[1] += paths[i][1];

        if (portalMap["ZZ"][0] === newPos[0] &&
            portalMap["ZZ"][1] === newPos[1]) {

            if (state[2] === 0) {
                // exit is only on level 0
                answer = state[1] + 1;
                break;
            } else if (state[2] !== 0) {
                continue;
            }
        }

        if (map[newPos[1] * width + newPos[0]] != '.') {
            continue;
        }

        if (typeof portalMap2[newPos] !== "undefined") {
            let level = state[2];
            if (typeof outer[newPos] !== "undefined") {
                // if outer go down a level else go up a level
                level--;
            } else {
                level++;
            }

            if (level < 0) {
                continue;
            }

            newPos = portalMap2[newPos];

            queue.push([newPos, state[1] + 2, level]);
            continue;
        }

        queue.push([newPos, state[1] + 1, state[2]]);
    }
}

console.log("part 2:", answer);