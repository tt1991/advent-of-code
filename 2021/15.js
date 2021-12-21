'use strict';

const fs = require('fs');
const path = require("path");
const Graph = require('node-dijkstra');
const fileName = path.basename(__filename, path.extname(__filename));
const data = processData(fs.readFileSync(`./${fileName}`, 'utf8').split('\n').slice(0, -1));

function processData(dataRows) {
  return dataRows.map(row => {
    return row.split('').map(item => parseInt(item));
  });
}

function calculatePathValue(map, path) {
  return path.reduce((acc, element) => {
    const point = element.split(',').map(item => parseInt(item));
    acc += map[point[0]][point[1]];

    return acc;
  }, 0);
}

function buildRoute(map) {
  const route = new Graph();

  for (let i = 0; i < map.length; i++ ) {
    for (let j = 0; j < map[i].length; j++ ) {
      let node = {};
      let neighbours = [[0, 1], [0, -1], [1, 0], [-1, 0]];

      for (let k = 0; k < neighbours.length; k++) {
        let newPoint = [i + neighbours[k][0], j + neighbours[k][1]];

        if (newPoint[0] >= 0 && newPoint[0] < map.length && newPoint[1] >= 0 && newPoint[1] < map[0].length) {
          node[`${newPoint[0]},${newPoint[1]}`] = map[newPoint[0]][newPoint[1]];
        }
      }

      route.addNode(`${i},${j}`, node);
    }
  }

  return route;
}

function getNewRow(row, i) {
  return row.map(element => (element + i) > 9 ? element + i - 9 : element + i );
}

function buildMap(map) {
  let newMap = [];

  for (let i = 0; i < map.length; i++) {
    let row = map[i];
    newMap[i] = [];

    for (let j = 0; j < 5; j++) {
      newMap[i] = newMap[i].concat(getNewRow(row, j));
    }
  }

  for (let i = 1; i < 5; i++) {
    for (let j = 0; j < map.length; j++) {
      let row = newMap[j];
      newMap.push(getNewRow(row, i));
    }
  }

  return newMap;
}

function part1(biggerMap) {
  const map = biggerMap ? buildMap(data) : JSON.parse(JSON.stringify(data));
  const route = buildRoute(map);
  const path = route.path('0,0', `${map.length - 1},${map[0].length - 1}`, { trim: false }).slice(1);

  return calculatePathValue(map, path);
}

console.log('part1: ' + part1(false));
console.log('part2: ' + part1(true));
