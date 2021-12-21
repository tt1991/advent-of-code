'use strict';

const fs = require('fs');
const path = require("path");
const fileName = path.basename(__filename, path.extname(__filename));
const data = fs.readFileSync(`./${fileName}`, 'utf8').split(',').map(item => parseInt(item));

function getCostForPosition(position, crabs) {
  return crabs.reduce((acc, crab) => {
    acc += Math.abs(position - crab);
    return acc;
  }, 0)
}

function getCostForPositionWithIncrease(position, crabs) {
  return crabs.reduce((acc, crab) => {
    acc += (Math.abs(position - crab) * (Math.abs(position - crab) + 1)) / 2;
    return acc;
  }, 0)
}

function part1(isIncreaseFuel) {
  let crabs = JSON.parse(JSON.stringify(data));
  let minCost = Infinity;

  for (let i = Math.min(...crabs); i <= Math.max(...crabs); i++) {
    const cost = isIncreaseFuel ? getCostForPositionWithIncrease(i, crabs) : getCostForPosition(i, crabs);

    if (cost < minCost) {
      minCost = cost;
    }
  }

  return minCost;
}

console.log('part1: ' + part1(false));
console.log('part2: ' + part1(true));

