'use strict';

const fs = require('fs');
const path = require("path");
const fileName = path.basename(__filename, path.extname(__filename));
const data = processData(fs.readFileSync(`./${fileName}`, 'utf8').split('\n').slice(0, -1));
const binaryLength = data[0].length;

function processData(dataRows) {
 return dataRows.map(row => row.split(''));
}

function toNumber(items) {
 return parseInt(items.join(''), 2);
}

function find(isOxygen, items) {
 let position = 0;
 let sum = 0;

 while (items.length !== 1) {
  sum = 0;

  items.forEach(item => {
   sum += parseInt(item[position]);
  });

  const digit = isOxygen ?
    (sum >= (items.length / 2) ? '1' : '0') :
    (sum >= (items.length / 2) ? '0' : '1');
  items = items.filter(item => item[position] === digit);

  position = (position + 1) % binaryLength;
 }

 return items[0];
}

function part1() {
 const bitCounts = new Array(binaryLength).fill(0);

 data.forEach(item => {
  for (let i = 0; i < item.length; i++) {
    bitCounts[i] += parseInt(item[i]);
  }
 });

 const gamma = bitCounts.map(digit => digit > (data.length / 2) ? '1' : '0');
 const epsilon = gamma.map(digit => digit === '1' ? '0' : '1');

 return toNumber(gamma) * toNumber(epsilon);
}

function part2() {
 let oxygen = find(true, JSON.parse(JSON.stringify(data)));
 let co2 = find(false, JSON.parse(JSON.stringify(data)));

 return toNumber(oxygen) * toNumber(co2);
}

console.log('part1: ' + part1());
console.log('part2: ' + part2());

