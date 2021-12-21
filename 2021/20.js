'use strict';

const fs = require('fs');
const path = require("path");
const fileName = path.basename(__filename, path.extname(__filename));
const data = processData(fs.readFileSync(`./${fileName}`, 'utf8').split('\n').slice(0, -1));

function processData(dataRows) {
  let dataItem = {
    algorithm: [],
    map: new Set()
  };

  dataRows.forEach((row, x) => {
    if (x === 0) {
      dataItem.algorithm = row.split('');
    } else if (x >= 2) {
      row.split('').forEach((item, y) => {
        if (item === '#') {
          dataItem.map.add(`${x - 2},${y}`);
        }
      });
    }
  });

  return dataItem;
}

function getBoundries(map) {
  let boundries = {
    x: { min: Infinity, max: -Infinity },
    y: { min: Infinity, max: -Infinity },
  };

  [...map].forEach(item => {
    let point = item.split(',').map(element => parseInt(element));

    if (point[0] < boundries.x.min) {
      boundries.x.min = point[0];
    }

    if (point[0] > boundries.x.max) {
      boundries.x.max = point[0];
    }

    if (point[1] < boundries.y.min) {
      boundries.y.min = point[1];
    }

    if (point[1] > boundries.y.max) {
      boundries.y.max = point[1];
    }
  });

  return boundries;
}

function getBinary(map, x, y, isEven) {
  let binaryString = '';

  for (let m of [-1, 0, 1]) {
    for (let n of [-1, 0, 1]) {
      const isLight = map.has(`${x + m},${y + n}`);
      binaryString += isLight === isEven ? '1' : '0';
    }
  }

  return parseInt(binaryString, 2);
}

function step(map, isEven) {
 let newMap = new Set();
 let boundaries = getBoundries(map);

  for (let i = boundaries.x.min - 10; i <= boundaries.x.max + 10; i++) {
    for (let j = boundaries.y.min - 10; j <= boundaries.y.max + 10; j++) {
      const algorithmIndex = getBinary(map, i, j, isEven);
      const isLight = data.algorithm[algorithmIndex] === '#';

      if (isLight !== isEven) {
        newMap.add(`${i},${j}`);
      }
    }
  }

  return newMap;
}

function part1(number) {
  let map = new Set(data.map);

  for (let i = 0; i < number; i++) {
    map = step(map, i % 2 === 0);
  }

  return map.size;
}

console.log('part1: ' + part1(2));
console.log('part2: ' + part1(50));

