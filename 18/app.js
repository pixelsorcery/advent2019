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

let width = 0;
let height = 0;
let startPos = [];
for(let i = 0; i < input.length; i++) {
    if (input[i] === '\n') {
        if (width === 0) width = i+1;
        height++;
    }

    if (input[i] === '@') {
        let ypos = height;
        let xpos = i % width;
        startPos.push([xpos,ypos]);
    }

    if (isKey(input[i])) {
        allKeysMask |= 1 << (input[i].charCodeAt(0) - 'a'.charCodeAt(0));
    }
}

let part1 = 9999999;

function haveKey(mask, char) {
    let hasKey = false;
    let bit = char.charCodeAt(0) - 'A'.charCodeAt(0);
    if (mask & (1 << bit)) {
        hasKey = true;
    }
    return hasKey;
}

function makeMemoKey(x, y, mask) {
    return x + ',' + y + ',' + mask;
}

function haveBeenHereBefore(x, y, mask, dist) {
    let key = makeMemoKey(x, y, mask);
    let result = false;
    if (typeof pathMemo[key] !== "undefined") {
        if (pathMemo[key] <= dist) {
            result = true;
        }
        else {
            pathMemo[key] = dist;
        }
    } else {
        pathMemo[key] = dist;
    }

    return result;
}

const dirs = [{x:0, y:1}, {x:0, y:-1}, {x:1, y:0}, {x:-1, y:0}];

let pathMemo = {};
let curQueue = [];

for (let i = 0; i < startPos.length; i++) {
    curQueue.push({x:startPos[i][0], y:startPos[i][1], dist:0, mask:0});
}

while (curQueue.length > 0) {
    // pop the front (bfs)
    let state = curQueue.shift();

    if( haveBeenHereBefore(state.x, state.y, state.mask, state.dist)) {
        continue;
    }

    for (let i = 0; i < dirs.length; i++) {
        // get next position
        let posIdx = (state.y+dirs[i].y) * width + (state.x + dirs[i].x);

        let newState = {x:state.x+dirs[i].x, y:state.y+dirs[i].y, dist:state.dist+1, mask:state.mask};

        if (input[posIdx] != '#') {
            if (isDoor(input[posIdx])) {
                if (haveKey(state.mask, input[posIdx])) {
                    curQueue.push(newState);
                } else {
                    curQueue.push(state);
                }
            } else if (isKey(input[posIdx]) && 
                        !(newState.mask & (1 << (input[posIdx].charCodeAt(0) - 'a'.charCodeAt(0))))) {
                // add new location in if it's nearer than a previous location and key is the same
                newState.mask |= 1 << (input[posIdx].charCodeAt(0) - 'a'.charCodeAt(0));

                if (newState.mask === allKeysMask) {
                    if (newState.dist < part1) {
                        part1 = newState.dist;
                        pathMemo[newState.x + ','+ newState.y + ',' + newState.mask] = newState.dist;
                        console.log("potential answer:", part1);
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

console.log("part 1:", part1);