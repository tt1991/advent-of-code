'use strict';

const fs = require('fs');
const path = require("path");
const fileName = path.basename(__filename, path.extname(__filename));
const data = processData(fs.readFileSync(`./${fileName}`, 'utf8').split('\n').slice(0, -1));

function processData(dataRows) {
  return dataRows.map(row => {
    let splittedRow = row.split(' ');
    let splittedRow2 = splittedRow[1].split(',');
    let x = splittedRow2[0].slice(2).split('..').map(Number);
    let y = splittedRow2[1].slice(2).split('..').map(Number);
    let z = splittedRow2[2].slice(2).split('..').map(Number);

    return {
      type: splittedRow[0],
      x: { from: x[0], to: x[1] + 1 },
      y: { from: y[0], to: y[1] + 1 },
      z: { from: z[0], to: z[1] + 1 },
    };
  });
}

function getPoints(x, y, z) {
  let points = [];

  for (let i = Math.max(x.from, -50); i < Math.min(x.to, 50); i++)
  for (let j = Math.max(y.from, -50); j < Math.min(y.to, 50); j++)
  for (let k = Math.max(z.from, -50); k < Math.min(z.to, 50); k++) {
      points.push({ x: i, y: j, z: k });
  }

  return points;
}

function turnOn(map, x, y, z) {
  getPoints(x, y, z).forEach(point => {
    let key = `${point.x},${point.y},${point.z}`;
    map.add(key);
  });

  return map;
}

function turnOff(map, x, y, z) {
  getPoints(x, y, z).forEach(point => {
    let key = `${point.x},${point.y},${point.z}`;
    map.delete(key);
  });

  return map;
}

function step(row, map) {
  map = row.type === 'on' ?
    turnOn(map, row.x, row.y, row.z) :
    turnOff(map, row.x, row.y, row.z);

  return map;
}

function hasOverlap(a, b, key) {
  return a[key].to > b[key].from && a[key].from < b[key].to;
}

function hasIntersection(a, b) {
  return hasOverlap(a, b, 'x') && hasOverlap(a, b, 'y') && hasOverlap(a, b, 'z');
}

function getVolume(cube) {
  return (cube.x.to - cube.x.from) * (cube.y.to - cube.y.from) * (cube.z.to - cube.z.from);
}

function getSubCube(cube, direction, key, line) {
  let subCube = JSON.parse(JSON.stringify(cube));

  if (direction === 'left') {
    subCube[key].to = line[key].from;
  } else {
    subCube[key].from = line[key].to;
  }

  return subCube;
}

function addSubCube(cube, direction, key, line, newCubes) {
  let fromToKey = direction === 'left' ? 'from' : 'to';
  let ifStatement = direction === 'left' ?
    cube[key][fromToKey] < line[key][fromToKey] :
    cube[key][fromToKey] > line[key][fromToKey];

  if (ifStatement) {
    let subCube = getSubCube(cube, direction, key, line);
    cube[key][fromToKey] = line[key][fromToKey];
    newCubes.push(subCube);
  }
}

function calculateSubCubes(line, cubes) {
  let newCubes = [];

  for (let cube of cubes) {
    if (hasIntersection(line, cube)) {
      addSubCube(cube, 'left', 'x', line, newCubes);
      addSubCube(cube, 'right', 'x', line, newCubes);
      addSubCube(cube, 'left', 'y', line, newCubes);
      addSubCube(cube, 'right', 'y', line, newCubes);
      addSubCube(cube, 'left', 'z', line, newCubes);
      addSubCube(cube, 'right', 'z', line, newCubes);
    } else {
      newCubes.push(cube);
    }
  }

  return newCubes;
}

function part1() {
  let map = new Set();

  map = data.reduce((acc, row) => step(row, acc), map);

  return map.size;
}

function part2() {
  let cubes = [];

  cubes = data.reduce((acc, line) => [...calculateSubCubes(line, acc), line], cubes);

  return cubes.reduce((acc, cube) => acc + (cube.type === 'on' ? getVolume(cube) : 0), 0);
}

console.log('part1: ' + part1());
console.log('part2: ' + part2());

