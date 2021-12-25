'use strict';

const fs = require('fs');
const path = require("path");
const fileName = path.basename(__filename, path.extname(__filename));
const data = processData(fs.readFileSync(`./${fileName}`, 'utf8').split('\n').slice(0, -1));

function processData(dataRows) {
  return dataRows.map(row => {
    return row.split('');
  });
}

function getNewMap() {
  let newMap = [];

  for (let i = 0; i < data.length; i++) {
    newMap[i] = new Array(data[0].length).fill('.');
  }

  return newMap;
}

function getNextLocation(x, y, map, direction) {
  if (direction === 'east') {
    if (y === map[x].length - 1) {
      return [x, 0]
    } else {
      return [x, y + 1];
    }
  } else {
    if (x === map.length - 1) {
      return [0, y]
    } else {
      return [x + 1, y];
    }
  }
}

function stepCucumber(map, direction) {
  let lastState = JSON.parse(JSON.stringify(map));
  let needToSkip = new Set();
  let moveCount = 0;
  let symbol = direction === 'east' ? '>' : 'v';

  for (let i = 0; i < map.length; i++) {
    for (let j = 0; j < map[i].length; j++) {
      if (map[i][j] === symbol) {
        let key = `${i},${j}`;
        if (!needToSkip.has(key)) {
          let nextLocation = getNextLocation(i, j, map, direction);

          if (lastState[nextLocation[0]][nextLocation[1]] === '.') {
            moveCount++;
            map[nextLocation[0]][nextLocation[1]] = symbol;
            map[i][j] = '.';
            needToSkip.add(`${nextLocation[0]},${nextLocation[1]}`)
          }
        } else {
          needToSkip.delete(key);
        }
      }
    }
  }

  return { map, moveCount };
}

function step(map) {
  let resultForEast = stepCucumber(map, 'east');
  map = resultForEast.map;

  let resultForWest = stepCucumber(map, 'west');
  map = resultForWest.map;

  return { map, moveCount: resultForEast.moveCount + resultForWest.moveCount };
}

function drawMap(map) {
  for (let i = 0; i < map.length; i++) {
    console.log(map[i].join(''));
  }
}

function part1() {
  let map = JSON.parse(JSON.stringify(data));
  let hasMoved = true;
  let stepCount = 1;

  while(hasMoved) {
    let result = step(map);

    if (result.moveCount === 0) {
      hasMoved = false;
    } else {
      map = result.map;
      stepCount++;
    }
  }

  return stepCount;
}

console.log('part1: ' + part1());

