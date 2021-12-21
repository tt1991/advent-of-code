'use strict';

const fs = require('fs');
const path = require("path");
const fileName = path.basename(__filename, path.extname(__filename));
const data = processData(fs.readFileSync(`./${fileName}`, 'utf8').split('\n').slice(0, -1));

function processData(dataRows) {
  //const regex = new RegExp(//)

  return dataRows.map(row => {
    //const match = regex.exec(row);

    return row;
  });
}

function part1() {

}

function part2() {}

console.log('part1: ' + part1());
console.log('part2: ' + part2());

