"use strict";
const fs = require('fs');
const input = fs.readFileSync("input.txt").toString().split('\n');

function dealInto(deck) {
    return deck.reverse();
}

function cut(deck, x) {
    let newDeck = [];
    let idx = 0;

    if (x < 0) {
        x = deck.length - Math.abs(x);
    }

    for (let i = x; i < deck.length; i++, idx++) {
        newDeck[idx] = deck[i];
    }

    for (let i = 0; i < x; i++, idx++) {
        newDeck[idx] = deck[i];
    }

    return newDeck;
}

function dealWith(deck, x) {
    let newDeck = [];
    let idx = 0;
    let left = deck.length;
    let i = 0;
    while (left > 0) {
        if (typeof newDeck[idx] === "undefined") {
            newDeck[idx] = deck[i];
            idx += x;
            i++;
            left--;
        } else {
            idx += x;
        }

        idx %= deck.length;
    }

    return newDeck;
}

let cards = [];
for (let i = 0; i < 10007; i++) {
    cards[i] = i;
}

let answers = "";
for (let i = 0; i < input.length; i++) {
    let tok = input[i].split(" ");
    if (tok[0] === "cut") {
        cards = cut(cards, parseInt(tok[1]));
    } else if (tok[1] === "with") {
        cards = dealWith(cards, parseInt(tok[3]))
    } else if (tok[1] === "into") {
        cards = dealInto(cards);
    }
}

for (let i = 0; i < cards.length; i++)
{
    if (cards[i] === 2019) {
        console.log("part 1:", i);
    }
}

// mathematical approach...
for (let i = 0; i < 10007; i++) {
    cards[i] = i;
}

