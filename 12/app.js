const fs = require('fs');
const input = fs.readFileSync("input.txt").toString().split('\n');

var positions = [];
for (let i = 0; i < input.length; i++) {
    vals = input[i].match(/<x=(-?\d*), y=(-?\d*), z=(-?\d*)>/).map(str => parseInt(str));
    vals.shift();
    positions.push(vals);
}

var velocities = [];
for (let i = 0; i < positions.length; i++) {
    velocities.push([0,0,0]);
}

var gcd = function(x, y) {
    x = Math.abs(x);
    y = Math.abs(y);

    while(y) {
        var t = y;
        y = x % y;
        x = t;
    }

    return x;
}

var printStats = function(pos, vel) {
    for (let i = 0; i < pos.length; i++) {
        var buffer = (pos[i][0] + "\t" + pos[i][1] + "\t" + pos[i][2] 
                      + "\t" + vel[i][0] + "\t" + vel[i][1] + "\t" + vel[i][2]);
        console.log(buffer);
    }
}

var getEnergy = function(pos, vel) {
    var sum = 0;
    for (let i = 0; i < pos.length; i++) {
        sum += (Math.abs(pos[i][0]) + Math.abs(pos[i][1]) + Math.abs(pos[i][2])) * 
               (Math.abs(vel[i][0]) + Math.abs(vel[i][1]) + Math.abs(vel[i][2]));
    }

    return sum;
}

var simulate = function () {
    for (let i = 0; i < positions.length; i++) { // row
        for (let j = 0; j < positions[i].length; j++) { // dimension
            let sum = 0;
            for (let k = 0; k < positions.length; k++) { // all other rows
                if (i === k) continue;
                if (positions[i][j] < positions[k][j]) {
                    velocities[i][j] += 1;
                } else if (positions[i][j] > positions[k][j]){
                    velocities[i][j] -= 1;
                }
            }
        }
    }

    // apply velocity
    for (let i = 0; i < positions.length; i++) {
        for (let j = 0; j < positions[i].length; j++) {
            positions[i][j] += velocities[i][j];
        }
    }
}

for (let c = 0; c < 2773; c++) {
    simulate();
    //console.log("step " + (parseInt(c)+1)); 
    //printStats(positions, velocities);
    //console.log(positions[0][0], positions[1][0], positions[2][0], positions[3][0]);
}

//printStats(positions, velocities);

var part1 = getEnergy(positions, velocities);

console.log("part 1: " + part1);

positions = [];
for (let i = 0; i < input.length; i++) {
    vals = input[i].match(/<x=(-?\d*), y=(-?\d*), z=(-?\d*)>/).map(str => parseInt(str));
    vals.shift();
    positions.push(vals);
}

velocities = [];
for (let i = 0; i < positions.length; i++) {
    velocities.push([0,0,0]);
}

var c = 0;
var run = true;
var startkeyx = positions[0][0] + "," + positions[1][0] + "," + positions[2][0] + "," + positions[3][0];
var startkeyy = positions[0][1] + "," + positions[1][1] + "," + positions[2][1] + "," + positions[3][1];
var startkeyz = positions[0][2] + "," + positions[1][2] + "," + positions[2][2] + "," + positions[3][2];

var zerov = "0,0,0,0";

var px = 0;
var py = 0;
var pz = 0;

while (run) { 
    simulate();

    var keyx = positions[0][0] + "," + positions[1][0] + "," + positions[2][0]+ "," + positions[3][0];
    var keyy = positions[0][1] + "," + positions[1][1] + "," + positions[2][1]+ "," + positions[3][1];
    var keyz = positions[0][2] + "," + positions[1][2] + "," + positions[2][2]+ "," + positions[3][2];

    var vx = velocities[0][0] + "," + velocities[1][0] + "," + velocities[2][0]+ "," + velocities[3][0];
    var vy = velocities[0][1] + "," + velocities[1][1] + "," + velocities[2][1]+ "," + velocities[3][1];
    var vz = velocities[0][2] + "," + velocities[1][2] + "," + velocities[2][2]+ "," + velocities[3][2];

    if (px === 0 && startkeyx === keyx && vx === zerov) {
        px = c+1;
    }

    if (py === 0 && startkeyy === keyy && vy === zerov) {
        py = c+1;
    }

    if (pz === 0 && startkeyz === keyz && vz === zerov) {
        pz = c+1;
    }

    c++;

    if (px && py && pz) { run = false; }
}

g = gcd(gcd(px, py), pz);

function lcm(x, y)
{
    return (x * y) / gcd(x, y);
}

lcm1 = lcm(px, py);
lcm2 = lcm(py, pz);

console.log("part 2: " + lcm(lcm1, lcm2));