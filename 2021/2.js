'use strict';

const fs = require('fs');
const path = require("path");
const fileName = path.basename(__filename, path.extname(__filename));
const data = processData(fs.readFileSync(`./${fileName}`, 'utf8').split('\n').slice(0, -1));

function processData(dataRows) {
 return dataRows.map(row => {
  const splittedRow = row.split(' ');
  return { direction: splittedRow[0], value: parseInt(splittedRow[1]) };
 });
}

function step(position, item, isPart2) {
 switch (item.direction) {
  case 'forward': {
   position.horizontal += item.value;

   if (isPart2) {
    position.depth += position.aim * item.value;
   }
   break;
  }
  case 'up': {
   if (isPart2) {
    position.aim -= item.value;
   } else {
    position.depth -= item.value;
   }
   break;
  }
  case 'down': {
   if (isPart2) {
    position.aim += item.value;
   } else {
    position.depth += item.value;
   }
   break;
  }
 }

 return position;
}

function part1(isPart2 = false) {
 let position = { horizontal: 0, depth: 0, aim: 0 };

 data.forEach(item => { position = step(position, item, isPart2) })

 return position.depth * position.horizontal;
}

console.log('part1: ' + part1());
console.log('part2: ' + part1(true));

