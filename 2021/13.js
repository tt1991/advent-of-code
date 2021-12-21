'use strict';

const fs = require('fs');
const path = require("path");
const fileName = path.basename(__filename, path.extname(__filename));
const data = processData(fs.readFileSync(`./${fileName}`, 'utf8').split('\n').slice(0, -1));

function processData(dataRows) {
  let procdessedData = {
    points: new Set(),
    instructions: []
  };
  let firstType = true;

  dataRows.forEach(row => {
    if (row === '') {
      firstType = false;
    } else {
      if (firstType) {
        const splittedRow = row.split(',');
        procdessedData.points.add(`${splittedRow[0]},${splittedRow[1]}`);
      } else {
        const splittedRow = row.split(' ')[2].split('=');
        procdessedData.instructions.push({ type: splittedRow[0], value:  parseInt(splittedRow[1]) })
      }
    }
  });

  return procdessedData;
}

function foldLeft(point, value) {
  return point[1] < value ? `${point[0]},${point[1]}` : `${point[0]},${2 * value - point[1]}`
}

function foldUp(point, value) {
  return point[0] < value ? `${point[0]},${point[1]}` : `${2 * value - point[0]},${point[1]}`
}

function foldOnce(instruction, points) {
  let newPoints = new Set();

  points.forEach(pointAsString => {
    let point = pointAsString.split(',').map(item => parseInt(item));

    if (instruction.type === 'y') {
      if (point[1] !== instruction.value) {
        newPoints.add(foldLeft(point, instruction.value));
      }
    } else if (instruction.type === 'x') {
      if (point[0] !== instruction.value) {
        newPoints.add(foldUp(point, instruction.value));
      }
    }
  });

  return newPoints;
}

function deepCopyData() {
  return {
    points: new Set(data.points),
    instructions: data.instructions
  };
}

function drawPaper(paper) {
  let map = new Array(6);

  for (let i = 0; i < 6; i++) {
    map[i] = new Array(38).fill(' ');
  }

  paper.points.forEach(pointAsString => {
    let point = pointAsString.split(',').map(item => parseInt(item));
    map[point[1]][point[0]] = 'x';
  });

  for (let i = 0; i < 6; i++) {
    console.log(map[i].join(''));
  }
}

function part1() {
  return foldOnce(data.instructions[0], data.points).size;
}

function part2() {
  let paper = deepCopyData();

  paper.instructions.forEach(instruction => {
    paper.points = foldOnce(instruction, paper.points);
  });

  drawPaper(paper);
}

console.log('part1: ' + part1());
console.log('part2:'); part2();

