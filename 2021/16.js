'use strict';

const fs = require('fs');
const path = require("path");
const fileName = path.basename(__filename, path.extname(__filename));
const originalData = fs.readFileSync(`./${fileName}`, 'utf8').slice(0, -1).split('');
const mapping = {
  '0': '0000', '1': '0001', '2': '0010', '3': '0011', '4': '0100', '5': '0101', '6': '0110', '7': '0111',
  '8': '1000', '9': '1001', 'A': '1010', 'B': '1011', 'C': '1100', 'D': '1101', 'E': '1110', 'F': '1111',
}

function stringToBinary(string) {
  return string.map(character => mapping[character]).join('');
}

function calculate(typeId, subPocketResults) {
  switch (typeId) {
    case 0: {
      return subPocketResults.reduce((acc, number) => acc + number, 0)
    }
    case 1: {
      return subPocketResults.reduce((acc, number) => acc * number, 1)
    }
    case 2: {
      return Math.min.apply(Math, subPocketResults);
    }
    case 3: {
      return Math.max.apply(Math, subPocketResults);
    }
    case 5: {
      return +(subPocketResults[0] > subPocketResults[1]);
    }
    case 6: {
      return +(subPocketResults[0] < subPocketResults[1]);
    }
    case 7: {
      return +(subPocketResults[0] === subPocketResults[1]);
    }
  }
}

function cutOffAndParseInt(data, number) {
  return parseInt(cutOff(data, number), 2);
}

function cutOff(data, number) {
  let element = data.binary[0].slice(0, number);
  data.binary[0] = data.binary[0].slice(number);

  return element;
}

function calculateNumber(data) {
  let tmp = '';

  while (true) {
    let element = cutOff(data, 5)
    let firstBit = element.slice(0, 1)[0];
    let value = element.slice(1);

    tmp += value;

    if (firstBit === '0') {
      break;
    }
  }

  return parseInt(tmp, 2);
}

function handleSubPockets(data) {
  let lengthTypeId = cutOff(data, 1);
  let subPocketResults = [];

  if (lengthTypeId === '0') {
    let length = cutOffAndParseInt(data, 15);
    let packet = [cutOff(data, length)];

    while(packet[0].length) {
      subPocketResults.push(processBinary({ binary: packet }))
    }
  } else {
    let pocketNumbers = cutOffAndParseInt(data, 11);

    for (let i = 0; i < pocketNumbers; i++) {
      subPocketResults.push(processBinary({ binary: data.binary }));
    }
  }

  return subPocketResults;
}

function processBinary(data) {
  let version = cutOffAndParseInt(data, 3);
  let typeId = cutOffAndParseInt(data, 3);

  sumOfVersions += version;

  if (typeId === 4) {
    return calculateNumber(data);
  } else {
    let subPocketResults = handleSubPockets(data);
    return calculate(typeId, subPocketResults);
  }
}

let sumOfVersions = 0;

function part1(isPart1) {
  let binary = stringToBinary(originalData);
  const result = processBinary({ binary: [binary] });

  return isPart1 ? sumOfVersions : result;
}

console.log('part1: ' + part1(true));
console.log('part2: ' + part1(false));
