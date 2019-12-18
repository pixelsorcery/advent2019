const fs = require('fs')
const input = fs.readFileSync('input.txt').toString();

const lines = input.split('\n');

var dim = lines.length;

var getSlope = function(a1, a2) {
    x = a2.x - a1.x;
    y = a2.y - a1.y;

    var ox = x;
    var oy = y;

    x = Math.abs(x);
    y = Math.abs(y);

    // divide x/y by gcd to get simplified fraction
    while(y) {
        var t = y;
        y = x % y;
        x = t;
    }

    return ([ox/x, oy/x]);
};

var asteroids = [];

// read in all the asteroid positions
for (let y = 0; y < lines.length; y++) {
    for (let x = 0; x < lines[y].length; x++) {
        if (lines[y][x] === '#') {
            asteroids.push({x, y});
        }
    }
}

var visited = Array(asteroids.length).fill(0);

// for each asteroid, go through every other asteroid and add
// asteroids along the path to a list
var asteroidmap = [];
for (let i = 0; i < asteroids.length; i++) {
    visited = [];
    for( let j = 0; j < asteroids.length; j++) { 
        // visited is key, this lets us skip asteroids that are occluded
        if (asteroids[i] === asteroids[j] || visited[asteroids[j].x + "_" + asteroids[j].y] === 1) { continue; }
        var slope = getSlope(asteroids[i], asteroids[j]);

        //console.log(slope);
        // walk along slope and mark every asteroid hit along that line
        let sx = asteroids[i].x;
        let sy = asteroids[i].y;

        let x = sx;
        let y = sy;

        x += slope[0];
        y += slope[1];

        while (x >= 0 && x < dim && y >= 0 && y < dim) {
            if (lines[y][x] === "#") {
                visited[x + "_" + y] = 1;
            }

            x += slope[0];
            y += slope[1];
        }

        if (typeof asteroidmap[asteroids[i].x + "_" + asteroids[i].y] === "undefined") {
            asteroidmap[asteroids[i].x + "_" + asteroids[i].y] = 1;
        } else {
            asteroidmap[asteroids[i].x + "_" + asteroids[i].y]++;
        }
    }
}

var part1 = 0; 
var laserCenter = "";
for(i in asteroidmap) {
    //console.log(i , " ", asteroidmap[i]);
    if (asteroidmap[i] > part1) {
        part1 = asteroidmap[i];
        laserCenter = i;
    }
}

console.log("part 1: " + part1);

var coords = laserCenter.split("_");
var lx = parseInt(coords[0]);
var ly = parseInt(coords[1]);

dx = lx;
dy = ly - dim;

var center = { 
    x: lx,
    y: ly
};

var target = { 
    x: dx,
    y: dy
};

visited = [];
var asteroidsDestroyed = 0;
var part2 = 0; 

var distance = function(a, b) {
    return Math.sqrt(Math.pow(b.x - a.x, 2) + Math.pow(b.y - a.y, 2));
}

var anglemap = [];

for (let i = 0; i < asteroids.length; i++) {
    if (asteroids[i].x == lx && asteroids[i].y == ly) { continue; }

    let slope = getSlope(center, asteroids[i]);

    let x = slope[0];
    let y = slope[1];

    let cx = 0;
    let cy = 1;

    let dot = cx * x + cy * y;
    let det = cx * y - cy * x;

    // calculate the angle of each asteroid off of the vertical line
    angle = Math.atan2(det, dot);
    degrees = angle * (180/Math.PI);
    degrees += 180; // add 180 to make up for atan2 going from -180 to 180.
    //console.log(degrees);
    var obj = {
        a: degrees,
        asteroid: asteroids[i]
    };
    anglemap.push(obj);
}

// sort first by angle, second by distance
anglemap.sort(function(a, b) {
    if (a.a < b.a) return -11;
    else if (a.a > b.a) return 1;
    else if (a.a === b.a) {
        if (distance(center, a.asteroid) > distance(center, b.asteroid)) return 1;
        else return -1;
    }
});

var hit = 0;
var astroid;
var hitmap = new Array(anglemap.length).fill(0);
var idx = 0;
while( hit <=200)
{
    // skip asteroids that are at the same angle, wait until we go around again
    while((hitmap[idx] === 1) || 
          (idx > 0) && (anglemap[idx].a === anglemap[idx-1].a)
         ) {
        idx++;
    }
    // mark each hit
    if (hitmap[idx] == 0) {
        hitmap[idx] = 1;
        hit++;

        //console.log("hit " + hit + ": " + anglemap[idx].asteroid.x + ", "+ anglemap[idx].asteroid.y);
        if (hit == 200) break;
    }

    idx++;

    if (idx === anglemap.length) {
        idx = 0;
    }
}

part2 = anglemap[idx].asteroid.x * 100 + anglemap[idx].asteroid.y;

console.log("part 2: " + part2);
