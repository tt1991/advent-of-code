'use strict';

const fs = require('fs');
const path = require("path");
const fileName = path.basename(__filename, path.extname(__filename));
const data = processData(fs.readFileSync(`./${fileName}`, 'utf8').split('\n').slice(0, -1));

function processData(dataRows) {
 return dataRows.map(item => parseInt(item));
}

function part1(offset) {
 const window = offset - 1;
 let increaseSum = 0;
 let lastItem = 9999;

 for (let i = window; i < data.length; i++) {
  if (lastItem < data[i]) {
   increaseSum++;
  }

  lastItem = data[i - window];
 }

 return increaseSum;
}

console.log('part1: ' + part1(1));
console.log('part2: ' + part1(3));

