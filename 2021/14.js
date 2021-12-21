'use strict';

const fs = require('fs');
const path = require("path");
const fileName = path.basename(__filename, path.extname(__filename));
const data = processData(fs.readFileSync(`./${fileName}`, 'utf8').split('\n').slice(0, -1));

function processData(dataRows) {
  let processedData = {
    template: '',
    frequencies: {},
    rules: {}
  }

  dataRows.map((row, index) => {
    if (index === 0) {
      processedData.template = row;
      processedData.frequencies = initFrequencies(row);
    }

    if (index >= 2) {
      const splittedRow = row.split(' -> ');
      processedData.rules[splittedRow[0]] = splittedRow[1];
    }
  });

  return processedData;
}

function initFrequencies(template) {
  let frequencies = {};
  const splittedText = template.split('');

  for (let i = 0; i < splittedText.length - 1; i++) {
    const key = `${splittedText[i]}${splittedText[i + 1]}`;

    frequencies[key] = (frequencies[key] || 0) + 1;
  }

  return frequencies;
}

function step(frequencies) {
  let newFrequencies = {};

  Object.keys(frequencies).forEach(key => {
    if (Object.keys(data.rules).includes(key)) {
      let newFrequency1 = `${key.charAt(0)}${data.rules[key]}`;
      let newFrequency2 = `${data.rules[key]}${key.charAt(1)}`;

      newFrequencies[newFrequency1] = (newFrequencies[newFrequency1] || 0) + frequencies[key];
      newFrequencies[newFrequency2] = (newFrequencies[newFrequency2] || 0) + frequencies[key];
    }
  });

  return newFrequencies;
}

function buildLetters(frequencies) {
  const lastLetter = data.template.split('').pop();
  let letters = { [lastLetter]: 1 };

  Object.keys(frequencies).forEach(key => {
    let letter = key.split('')[0];
    letters[letter] = (letters[letter] || 0) + frequencies[key];
  });

  return letters;
}

function part1(stepCount) {
  let frequencies = JSON.parse(JSON.stringify(data.frequencies));

  for (let i = 0; i < stepCount; i++) {
    frequencies = step(frequencies);
  }

  let letters = Object.values(buildLetters(frequencies)).sort((a, b) => b - a);

  return letters[0] - letters.pop();
}

console.log('part1: ' + part1(10));
console.log('part2: ' + part1(40));
