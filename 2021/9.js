'use strict';

const fs = require('fs');
const path = require("path");
const fileName = path.basename(__filename, path.extname(__filename));
const data = processData(fs.readFileSync(`./${fileName}`, 'utf8').split('\n').slice(0, -1));

function processData(dataRows) {
  return dataRows.map(row => {
      return row.split('').map(item => parseInt(item));
  });
}

function isValidCoordinates(x, y) {
  return x >= 0 && x < data.length && y >= 0 && y < data[0].length;
}

function getNeighbours(x, y) {
  return [[x - 1, y], [x + 1, y], [x, y - 1], [x, y + 1]];
}

function isLowPoint(x, y) {
  let count = 0;

  getNeighbours(x, y).forEach(neighbour => {
    if (isValidCoordinates(neighbour[0], neighbour[1])) {
      if (data[neighbour[0]][neighbour[1]] > data[x][y]) {
        count++;
      }
    } else {
      count++;
    }
  });

  return count === 4;
}

function isValidCoordinatesForBasin(x, y, map) {
  return isValidCoordinates(x, y) && map[x][y] !== 9 && map[x][y] !== null;
}

function calculateBasins(x, y, startingPoint, basins) {
  if (!Object.keys(basins).includes(startingPoint)) {
    basins[startingPoint] = 0;
  } else {
    basins[startingPoint] += 1;
    data[x][y] = null
  }

  getNeighbours(x, y).forEach(neighbour => {
    if (isValidCoordinatesForBasin(neighbour[0], neighbour[1], data)) {
      basins = calculateBasins(neighbour[0], neighbour[1], startingPoint, basins);
    }
  })

  return basins;
}

function getLowPoints() {
  let lowPoints = [];

  for (let i = 0; i < data.length; i++) {
    for (let j = 0; j < data[i].length; j++) {
      if (isLowPoint(i, j)) {
        lowPoints.push([i, j]);
      }
    }
  }

  return lowPoints;
}

function part1() {
  return getLowPoints().reduce((acc, lowPoint) => acc + 1 + data[lowPoint[0]][lowPoint[1]], 0);
}

function part2() {
  const basins = getLowPoints().reduce((basins, point) => calculateBasins(point[0], point[1], `${point[0]}-${point[1]}`, basins), {});
  return Object.values(basins).sort((a, b) => a - b).reverse().slice(0, 3).reduce((acc, item) => acc * item );
}

console.log('part1: ' + part1());
console.log('part2: ' + part2());

