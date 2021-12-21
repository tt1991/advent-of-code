'use strict';

const fs = require('fs');
const path = require("path");
const fileName = path.basename(__filename, path.extname(__filename));
const data = processData(fs.readFileSync(`./${fileName}`, 'utf8').split('\n').slice(0, -1));
const originalLetters = ['a', 'b', 'c', 'd', 'e', 'f', 'g'];
const permutations = permutator(originalLetters);
const mapping = ['abcefg', 'cf', 'acdeg', 'acdfg', 'bcdf', 'abdfg', 'abdefg', 'acf', 'abcdefg', 'abcdfg' ];
const segmentCountForNumbers = mapping.map(item => item.length);

function processData(dataRows) {
  return dataRows.map(row => {
    const splittedRow = row.split(' | ');

    return {
      input: splittedRow[0].split(' '),
      output: splittedRow[1].split(' ')
    };
  });
}

function permutator(inputArr) {
  let result = [];

  const permute = (arr, m = []) => {
    if (arr.length === 0) {
      result.push(m)
    } else {
      for (let i = 0; i < arr.length; i++) {
        let curr = arr.slice();
        let next = curr.splice(i, 1);
        permute(curr.slice(), m.concat(next))
      }
    }
  };

  permute(inputArr);

  return result;
}

function getAllIndexes(arr, val) {
  let indexes = [];

  for(let i = 0; i < arr.length; i++) {
    if (arr[i] === val) {
      indexes.push(i);
    }
  }

  return indexes;
}

function isMatching(number, alma, permutation) {
  const indexes = mapping[number].split('').map(letter => originalLetters.indexOf(letter));
  const lettersInPermutation = indexes.map(index => permutation[index]);

  return alma[number][0].split('').sort().join('') === lettersInPermutation.sort().join('');
}

function isMultiMatching(numbers, alma, permutation) {
  let doNotCheck = [];

  numbers.forEach(number => {
    const indexes = mapping[number].split('').map(letter => originalLetters.indexOf(letter));
    const lettersInPermutation = indexes.map(index => permutation[index]);

    alma[number].forEach(item => {
      const buildedLetters = item.split('').sort().join('');

      if (buildedLetters === lettersInPermutation.sort().join('') && !doNotCheck.includes(buildedLetters)) {
        doNotCheck.push(buildedLetters)
      }
    });
  });

  return doNotCheck.length === 3;
}

function checkPermutation(alma, permutation) {
  let isTrueForOne = isMatching(1, alma, permutation);
  let isTrueForFour = isMatching(4, alma, permutation);
  let isTrueForEight = isMatching(8, alma, permutation);
  let isTrueForSeven = isMatching(7, alma, permutation)
  let isTrueForTwoThreeFive = isMultiMatching([2, 3, 5], alma, permutation);
  let isTrueForZeroSixNine = isMultiMatching([0, 6, 9], alma, permutation);

  return  isTrueForOne && isTrueForFour && isTrueForSeven && isTrueForEight && isTrueForTwoThreeFive && isTrueForZeroSixNine;
}

function getNumber(letters, permutation) {
  let indexes = letters.split('').map(letter => permutation.indexOf(letter));
  let lettersInOriginal = indexes.map(index => originalLetters[index]).sort().join('');

  return mapping.indexOf(lettersInOriginal);
}

function getPossibleNumbers(row) {
  const possibleNumbers = [[], [], [], [], [], [], [], [], [], []];
  const numbers = row.output.concat(row.input);

  numbers.forEach(number => {
    const mappingIndexes = getAllIndexes(segmentCountForNumbers, number.length)

    mappingIndexes.forEach(index => {
      const sortedNumber = number.split('').sort().join('');

      if (!possibleNumbers[index].includes(sortedNumber)) {
        possibleNumbers[index].push(sortedNumber);
      }
    });
  })

  return possibleNumbers;
}

function part1() {
  const map = {
    2: [1],
    3: [7],
    4: [4],
    5: [2, 3, 5],
    6: [0, 6, 9],
    7: [8]
  };
  let count = 0;

  data.forEach(row => {
    row.output.forEach(item => {
      if (map[item.split('').length].length === 1) {
        count++;
      }
    });
  });

  return count;
}

function part2() {

  let sum = 0;

  data.forEach(row => {
    const possibleNumbers = getPossibleNumbers(row);
    const possiblePermutations = permutations.filter(permutation => checkPermutation(possibleNumbers, permutation));

    const result = 1000 * getNumber(row.output[0], possiblePermutations[0]) +
      100 * getNumber(row.output[1], possiblePermutations[0]) +
      10 * getNumber(row.output[2], possiblePermutations[0]) +
      getNumber(row.output[3], possiblePermutations[0]);

    sum += result;
  });

  return sum;
}

console.log('part1: ' + part1());
console.log('part2: ' + part2());
