'use strict';

const fs = require('fs');
const path = require("path");
const fileName = path.basename(__filename, path.extname(__filename));
const data = processData(fs.readFileSync(`./${fileName}`, 'utf8').split('\n').slice(0, -1));
const size = 1000;

function processData(dataRows) {
  const regex = new RegExp(/(\d+),(\d+) -> (\d+),(\d+)/)

  return dataRows.map(row => {
    const match = regex.exec(row);

    return { from: [parseInt(match[1]), parseInt(match[2])], to: [parseInt(match[3]), parseInt(match[4])] }
  });
}

function isPointOnLine(point, line) {
  return (line.to[1] - line.from[1]) * (point.x - line.from[0]) === (line.to[0] - line.from[0]) * (point.y - line.from[1]);
}

function getPoints(line) {
  let points = [];

  let x = [line.from[0], line.to[0]].sort((a, b) => a - b);
  let y = [line.from[1], line.to[1]].sort((a, b) => a - b);

  for (let i = x[0]; i <= x[1]; i++) {
    for (let j = y[0]; j <= y[1]; j++) {
      if (isPointOnLine({ x: i, y: j}, line)) {
        points.push([i, j]);
      }
    }
  }

  return points;
}

function isStraightLine(line) {
  return line.from[0] === line.to[0] || line.from[1] === line.to[1];
}

function addLine(line, map, onlyStraight) {
  if (onlyStraight && !isStraightLine(line)) {
    return map;
  }

  const points = getPoints(line);

  points.forEach(point => {
    map[point[0]][point[1]] += 1;
  });

  return map;
}

function createMap(size) {
  let map = new Array(size);

  for(let i = 0; i < size; i++) {
    map[i] = new Array(size).fill(0);
  }

  return map;
}

function countIntersections(map) {
  let count = 0;

  for(let i = 0; i < size; i++) {
    for(let j = 0; j < size; j++) {
      if (map[i][j] >= 2) {
        count++;
      }
    }
  }

  return count;
}

function part1(onlyStraight) {
  let map = createMap(size);

  data.forEach(row => {
    map = addLine(row, map, onlyStraight);
  });

  return countIntersections(map);
}

console.log('part1: ' + part1(true));
console.log('part2: ' + part1(false));

