'use strict';

const fs = require('fs');
const path = require("path");
const fileName = path.basename(__filename, path.extname(__filename));
const data = fs.readFileSync(`./${fileName}`, 'utf8').split(',').map(item => parseInt(item));

function getTimes(fishArray = []) {
  let times = { '0': 0, '1': 0, '2': 0, '3': 0, '4': 0, '5': 0, '6': 0, '7': 0, '8': 0 }

  fishArray.forEach(fish => {
    times[fish] += 1;
  })

  return times;
}

function stepTime(times) {
  let newTimes = getTimes();

  Object.keys(times).forEach(key => {
    if (key === '0') {
      newTimes['8'] += times[key];
      newTimes['6'] += times[key];
    } else {
      const newTimeKey = (parseInt(key) - 1).toString();
      newTimes[newTimeKey] += times[key];
    }
  });

  return newTimes;
}

function part1(days) {
  let times = getTimes(data);

  for (let i = 0; i < days; i++) {
    times = stepTime(times);
  }

  return Object.values(times).reduce((acc, fishNumber) => acc + fishNumber);
}

console.log('part1: ' + part1(80));
console.log('part2: ' + part1(256));

