'use strict';

const fs = require('fs');
const path = require("path");
const fileName = path.basename(__filename, path.extname(__filename));
let data = processData(fs.readFileSync(`./${fileName}`, 'utf8').split('\n').slice(0, -1));
const originalData = JSON.parse(JSON.stringify(data));

function processData(dataRows) {
  return dataRows.map(row => {
    return row.split('').map(item => parseInt(item));
  });
}

function flash(x, y) {
  let neighbours = [[0, 1], [0, -1], [1, 0], [-1, 0], [1, 1], [-1, -1], [1, -1], [-1, 1]];
  let flashCount = 1;
  data[x][y] = 0;

  neighbours.forEach(neighbour => {
    const newX = x + neighbour[0];
    const newY = y + neighbour[1];

    if (newX >= 0 && newX < 10 && newY >= 0 && newY < 10 && data[newX][newY] !== 0) {
      data[newX][newY] += 1;

      if (data[newX][newY] > 9) {
        flashCount += flash(newX, newY);
      }
    }
  });

  return flashCount;
}

function increaseData() {
  for (let i = 0; i < 10; i++) {
    for (let j = 0; j < 10; j++) {
      data[i][j] += 1;
    }
  }
}

function calculateFlashes() {
  let count = 0;

  for (let i = 0; i < 10; i++) {
    for (let j = 0; j < 10; j++) {
      if (data[i][j] > 9) {
        count += flash(i, j);
      }
    }
  }

  return count;
}

function getZeroCount() {
  let zeroCount = 0;

  for (let i = 0; i < 10; i++) {
    for (let j = 0; j < 10; j++) {
      if (data[i][j] === 0) {
        zeroCount += 1;
      }
    }
  }

  return zeroCount;
}

function part1(isFlashCountNeeded) {
  data = JSON.parse(JSON.stringify(originalData));
  let stepCount = 0;
  let flashCount = 0;

  while(++stepCount) {
    increaseData()
    flashCount += calculateFlashes();

    if (isFlashCountNeeded && stepCount === 100) {
      return flashCount;
    }

    if (!isFlashCountNeeded && getZeroCount() === 100) {
      return stepCount;
    }
  }
}

console.log('part1: ' + part1(true));
console.log('part2: ' + part1(false));
