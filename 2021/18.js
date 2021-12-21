'use strict';

const fs = require('fs');
const path = require("path");
const fileName = path.basename(__filename, path.extname(__filename));
const data = processData(fs.readFileSync(`./${fileName}`, 'utf8').split('\n').slice(0, -1));

function processData(dataRows) {
  return dataRows.map(row => {
    return JSON.parse(row);
  });
}

function splitElement(x) {
  return [[Math.floor(x / 2)], [Math.ceil(x / 2)]];
}

function firstNumberOnRight(x) {
  while (x.length !== 1) {
    x = x[1];
  }

  return x;
}

function firstNumberOnLeft(x) {
  while (x.length !== 1) {
    x = x[0];
  }
  return x;
}

function split(x, depth, toLeft, toRight) {
  if (x.length === 1) {
    return [x, false];
  }

  if (depth >= 4) {
    toLeft[0] += x[0][0];
    toRight[0] += x[1][0];

    return [[0], true];
  }


  for (const [index, value] of [[toLeft, firstNumberOnLeft(x[1])], [firstNumberOnRight(x[0]), toRight]].entries()) {
    let result = split(x[index], depth + 1, value[0], value[1]);

    if (result[1]) {
      x[index] = result[0];
      return [x, result[1]];
    }
  }

  return [x, false];
}

function explode(x, depth, toLeft, toRight) {
  if (x.length === 1) {
    if (x[0] >= 10) {
      return [splitElement(x[0]), true];
    }

    return [x, false];
  }

  for (const [index, value] of [[toLeft, firstNumberOnLeft(x[1])], [firstNumberOnRight(x[0]), toRight]].entries()) {
    let result = explode(x[index], depth + 1, value[0], value[1]);

    if (result[1]) {
      x[index] = result[0];
      return [x, result[1]];
    }
  }

  return [x, false];
}

function reduce(x, depth) {
  let result = split(x, depth, [], []);

  return result[1] ? result : explode(x, depth, [], []);
}

function convert(arr) {
  if (Array.isArray(arr)) {
    arr[0] = convert(arr[0]);
    arr[1] = convert(arr[1]);

    return arr;
  }

  return [arr];
}

function mag(x) {
  return x.length === 1 ? x[0] : 3 * mag(x[0]) + 2 * mag(x[1]);
}

function part1() {
  let result = [convert(JSON.parse(JSON.stringify(data[0])))];

  for (let i = 1; i < data.length; i++) {
    result = reduce([result[0], convert(JSON.parse(JSON.stringify(data[i])))], 0, [], []);

    while (result[1]) {
      result = reduce(result[0], 0, [], []);
    }
  }

  return mag(result[0]);
}

function part2() {
  let m = [];

  for (let i = 0; i < data.length; i++) {
    for (let j = 0; j < data.length; j++) {
      if (i !== j) {
        let result = [[convert(JSON.parse(JSON.stringify(data[i]))), convert(JSON.parse(JSON.stringify(data[j])))]]
        result = reduce(result[0], 0);

        while (result[1]) {
          result = reduce(result[0], 0);
        }

        m.push(mag(result[0]));
      }
    }
  }

  return m.reduce((acc, item) => {
    return Math.max(acc, item)
  }, 0)
}

console.log('part1: ' + part1());
console.log('part2: ' + part2());

