"use strict";
const fs = require('fs');
const input = fs.readFileSync("input.txt").toString();

function isKey(char)
{
    let isKey = false;
    if (char >= 'a' && char <= 'z') isKey = true;
    return isKey;
}

function isDoor(char)
{
    let isKey = false;
    if (char >= 'A' && char <= 'Z') isKey = true;
    return isKey;
}

let allKeysMask = 0;
let keys = [];
let width = 0;
let height = 0;
let startPos = [];
let keyLocations = {};
function processInput(map) {
    for(let i = 0; i < map.length; i++) {
        if (map[i] === '\n') {
            if (width === 0) width = i+1;
            height++;
        }

        let ypos = height;
        let xpos = i % width;

        if (map[i] === '@') {
            startPos.push([xpos,ypos]);
            keyLocations[startPos.length.toString()] = [xpos, ypos];
        }

        if (isKey(map[i])) {
            allKeysMask |= 1 << (map[i].charCodeAt(0) - 'a'.charCodeAt(0));
            keyLocations[map[i]] = [xpos, ypos];
            keys.push(map[i]);
        }
    }
}

function setBit(mask, bit){
    let newMask = mask | 1 << (bit.charCodeAt(0) - 'a'.charCodeAt(0));
    return newMask;
}

processInput(input);

function haveKey(mask, char) {
    let hasKey = false;
    let bit = char.charCodeAt(0) - 'A'.charCodeAt(0);
    if (mask & (1 << bit)) {
        hasKey = true;
    }
    return hasKey;
}

function makeMemoKey(pos, mask) {
    let key = "";

    for (let i in pos) {
        key += pos[i][0].toString() + ',' + pos[i][1].toString() + ',';
    }
    return key + mask.toString();
}

function haveBeenHereBefore(pos, mask, dist) {
    let key = makeMemoKey(pos, mask);
    let result = false;
    if (typeof pathMemo[key] !== "undefined") {
        if (pathMemo[key] <= dist) {
            result = true;
        }
    }
    pathMemo[key] = dist;
    return result;
}

function haveBeenHereBeforeIdx(idx, mask, dist) {
    let key = idx.toString() + "," + mask.toString();
    let result = false;
    if (typeof pathMemo[key] !== "undefined") {
        if (pathMemo[key] <= dist) {
            result = true;
        }
    }
    pathMemo[key] = dist;
    return result;
}

const dirs = [{x:0, y:1}, {x:0, y:-1}, {x:1, y:0}, {x:-1, y:0}];

let pathMemo = {};

function run(map) {
    let curQueue = [];
    let answer = 999999;
    let keyQueue = [];
    let maxDist = 0;
    curQueue.push({pos:startPos.slice(), dist:0, mask:0});
    while (curQueue.length > 0) {
        // pop the front (bfs)
        let state = curQueue.shift();

        if( haveBeenHereBefore(state.pos, state.mask, state.dist)) {
            continue;
        }

        for (let h = 0; h < state.pos.length; h++) {
            for (let i = 0; i < dirs.length; i++) {
                // get next position
                let posIdx = (state.pos[h][1]+dirs[i].y) * width + (state.pos[h][0] + dirs[i].x);

                let newPos = state.pos.slice();
                newPos[h]  = state.pos[h].slice(); // makes a copy
                newPos[h][0] += dirs[i].x;
                newPos[h][1] += dirs[i].y;

                let newState = {pos:newPos, dist:state.dist+1, mask:state.mask};

                if (map[posIdx] != '#') {
                    if (isDoor(map[posIdx])) {
                        if (haveKey(state.mask, map[posIdx])) {
                            curQueue.push(newState);
                        }
                    } else if (isKey(map[posIdx]) && 
                                !(newState.mask & (1 << (map[posIdx].charCodeAt(0) - 'a'.charCodeAt(0))))) {
                        newState.mask |= 1 << (map[posIdx].charCodeAt(0) - 'a'.charCodeAt(0));

                        if (newState.mask === allKeysMask) {
                            if (newState.dist < answer) {
                                answer = newState.dist;
                            }
                            continue;
                        }

                        curQueue.push(newState);
                    } else {
                        curQueue.push(newState);
                    }
                } 
            }
        }
    }
    return answer;
}

//console.log("part 1:", run(input));

// part 2: different approach, bfs maze search is too slow for 4 robots at once,
//         try dfs dijkstra style algo using only key positions

function findShortestPath(map, a, b) {
    let startPos = keyLocations[a];
    let endPos = keyLocations[b];
    let doors = 0;
    let queue = [];
    queue.push([startPos, doors, 0]);
    let visited = {};

    while (queue.length > 0) {
        let state = queue.shift();

        if (typeof visited[state[0]] === "undefined") {
            visited[state[0]] = 1;
        } else {
            continue;
        }

        for (let i = 0; i < dirs.length; i++) {
            // get next position
            let posIdx = (state[0][1]+dirs[i].y) * width + (state[0][0] + dirs[i].x);
            let newPos = state[0].slice();
            let doors = 
            newPos[0] += dirs[i].x;
            newPos[1] += dirs[i].y;

            let newMask = state[1];

            if (map[posIdx] == '#') {
                continue;
            }

            if (isDoor(map[posIdx])) {
                newMask = setBit(state[1], map[posIdx].toLowerCase());
                queue.push([newPos, newMask, state[2] + 1]);
                continue;
            } else if (newPos[0] === endPos[0] && newPos[1] === endPos[1]) {
                return [state[2] + 1, state[1]];
            } else {
                queue.push([newPos, newMask, state[2] + 1]);
            }
        }
    }
    // if no path was found we end up here
    return [-1, 0];
}

function processPaths() {
    for (let i = 0; i < keys.length; i++) {
        for (let j = 0; j < keys.length; j++) {
            if (i === j) continue;
            let path = findShortestPath(input2, keys[i], keys[j]);
            if (path[0] > -1)
            keyPaths[[keys[i],keys[j]]] = path;
        }
    }
}

function run2(map) {
    let startState = {robots:['1','2','3','4'], mask:0, dist:0};
    
    let memo = {};

    let answer = 0;

    let queue = [];
    queue.push(startState);

    while (queue.length > 0) {
        // run algo
        let state = queue.pop();

        if (answer > 0 && state.dist >= answer) {
            continue;
        }

        for (let i = 0; i < state.robots.length; i++) {
            // find all paths for robot
            for (let k = 0; k < keys.length; k++) {
                let key = [state.robots[i], keys[k]];
                if (typeof keyPaths[key] === "undefined") {
                    continue;
                }
                let keyPath = keyPaths[key];

                if ((state.mask & keyPath[1]) === keyPath[1]) {
                    let newRobots = state.robots.slice();
                    newRobots[i] = keys[k];
                    let newMask = 0;
                    newMask = state.mask | 1 << (keys[k].charCodeAt(0) - 'a'.charCodeAt(0));

                    if (newMask === state.mask) {
                        continue;
                    }
                    if (newMask === allKeysMask) {
                        if (answer === 0) {
                            answer = state.dist + keyPath[0];
                        } else if (state.dist + keyPath[0] < answer) {
                            answer = state.dist + keyPath[0];
                            console.log("potential answer:", answer);
                        }
                        continue;
                    }

                    let curKey = [newRobots, newMask];
                    if (typeof memo[curKey] !== "undefined" && 
                        memo[curKey] <= state.dist + keyPath[0] ) {
                        continue;
                    }

                    memo[curKey] = state.dist + keyPath[0];

                    let newState = {robots:newRobots, mask:newMask, dist:(state.dist + keyPath[0])}
                    queue.push(newState);
                }
            }
        }
    }

    return answer;
}

const input2 = fs.readFileSync("input2.txt").toString();

// reset everything
startPos    = [];
pathMemo    = {};
keys        = [];
width       = 0;
height      = 0;
allKeysMask = 0;
keyLocations = {};
let keyPaths = {};
processInput(input2);

keys.push("1");
keys.push("2");
keys.push("3");
keys.push("4");

processPaths();

console.log("part 2:", run2(input2));