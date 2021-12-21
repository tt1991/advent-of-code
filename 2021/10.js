'use strict';

const fs = require('fs');
const path = require("path");
const fileName = path.basename(__filename, path.extname(__filename));
const data = processData(fs.readFileSync(`./${fileName}`, 'utf8').split('\n').slice(0, -1));

function processData(dataRows) {
  return dataRows.map(row => {
    return row.split('');
  });
}

function calculateErrorPoint(items) {
  const points = {
    ')': 3,
    ']': 57,
    '}': 1197,
    '>': 25137
  };

  return items.reduce((sum, item) => sum + points[item], 0);
}

function calculateExtraClosesPoints(extraCloses) {
  const points = {
    ')': 1,
    ']': 2,
    '}': 3,
    '>': 4
  };

  const scores = extraCloses.map(extraClose => extraClose.reduce((sum, item) => sum * 5 + points[item], 0));

  return scores.sort((a, b) => a - b)[Math.floor(extraCloses.length / 2)];
}

function processLines() {
  const opens = ['(', '[', '{', '<'];
  const closes = [')', ']', '}', '>'];
  let collectedErrors = [];
  let extraCloses = [];

  data.forEach(row => {
    let needToClose = [];

    for (let i = 0; i < row.length; i++) {
      if (opens.includes(row[i])) {
        needToClose.push(row[i]);
      }

      if (closes.includes(row[i])) {
        if (needToClose.pop() !== opens[closes.indexOf(row[i])]) {
          collectedErrors.push(row[i]);
          return;
        }
      }
    }

    const extraClose = needToClose.reverse().reduce((acc, item) => {
      acc.push(closes[opens.indexOf(item)]);
      return acc;
    }, []);

    extraCloses.push(extraClose);
  })

  return { collectedErrors, extraCloses };
}

function part1(isErrorCheck) {
  let { collectedErrors, extraCloses } = processLines();

  return isErrorCheck ?
    calculateErrorPoint(collectedErrors) :
    calculateExtraClosesPoints(extraCloses);
}

console.log('part1: ' + part1(true));
console.log('part2: ' + part1(false));

