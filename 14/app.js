"use strict";

const fs = require('fs');
var input = fs.readFileSync("input.txt", ).toString().split('\n');

var objectMap = [];
for (let i in input)
{
    let matchArr = [...input[i].matchAll(/\d+\s\w+/g)].map(function(x) { return x[0]});
    let val = matchArr.pop();
    val = val.split(' ');
    objectMap[val[1]] = {amt : val[0], formula : matchArr};
}

var extra = {};

function calculateOre(list) {
    let totalOre = 0;
    while(list.length > 0) {
        let item = list.pop();

        if (item[0] === "ORE") {
            totalOre += item[1];
            continue;
        }
        // get the formula to make the item
        let formula = objectMap[item[0]].formula;

        for (let i in formula) {
            // for each item in the formula, see what ingredients it
            // needs and how many multiples of it are necessary
            let ingredient = formula[i].split(' ')[1];
            let amountNeeded = formula[i].split(' ')[0] * item[1];

            if (typeof extra[ingredient] !== "undefined" &&
                (extra[ingredient] > 0)) {
                if (extra[ingredient] > amountNeeded) {
                    extra[ingredient] -= amountNeeded;
                    continue;
                } else {
                    amountNeeded -= extra[ingredient];
                    extra[ingredient] = 0;
                }
            }

            // look up the recipe amount
            let amountInRecipe = 1;
            if (ingredient != "ORE") {
                amountInRecipe = objectMap[ingredient].amt; 
            } else {
            }

            let multiplier = parseInt(amountNeeded / amountInRecipe);
            if (amountNeeded % amountInRecipe > 0) multiplier++;
            let extraAmount = (multiplier * amountInRecipe) - amountNeeded;

            if (multiplier === 0) {
                continue;
            }

            if (extraAmount > 0) {
                if (typeof extra[ingredient] === "undefined") {
                    extra[ingredient] = extraAmount;
                } else {
                    extra[ingredient] += extraAmount;
                }
            }
            

            list.push([ingredient, multiplier]);
        }
    }

    return totalOre;
}

var list = [["FUEL", 1]];
console.log("part 1: ", calculateOre(list));

var answer = 0;
var numFuel = 4906794;
while (answer < 1000000000000) {
    answer = calculateOre([["FUEL", numFuel]]);
    if (answer > 1000000000000) {
        numFuel--;
        break;
    }
    numFuel++;
}

console.log("part 2: ", numFuel);
