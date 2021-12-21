'use strict';

const fs = require('fs');
const path = require("path");
const fileName = path.basename(__filename, path.extname(__filename));
const data = processData(fs.readFileSync(`./${fileName}`, 'utf8').split('\n').slice(0, -1));

function processData(dataRows) {
 const data = {
  numbers: [],
  boards: []
 };

 let count = 0;
 let board = [];

 dataRows.map((row, index) => {
  if (index === 0) {
   data.numbers = row.split(',').map(item => parseInt(item));
  } else {
   if(row !== '') {
    board.push(row.split(' ').map(item => parseInt(item)));
    count++;
   }

   if (count === 5) {
    count = 0;
    data.boards.push(board);
    board = [];
   }
  }
 });

 return data;
}

function play(number, boards) {
 boards.forEach(board => {
  for (let i = 0; i < 5; i++) {
   for (let j = 0; j < 5; j++) {
    if (board[i][j] === number) {
     board[i][j] = 'x';
    }
   }
  }
 });

 return boards;
}

function checkRows(board, index) {
 let count = 0;

 for (let i = 0; i < 5; i++) {
  if (board[index][i] === 'x') {
   count++;
  }
 }

 return count === 5;
}

function checkColumn(board, index) {
 let count = 0;

 for (let i = 0; i < 5; i++) {
  if (board[i][index] === 'x') {
   count++;
  }
 }

 return count === 5;
}

function checkBoard(board) {
 for (let i = 0; i < 5; i++) {
  if (checkColumn(board, i) || checkRows(board, i)) {
   return true;
  }
 }

 return false;
}

function getBingos(boards) {
 let bingoIndexes = [];

 for (let i = 0; i < boards.length; i++) {
  if (checkBoard(boards[i])) {
   bingoIndexes.push(i);
  }
 }

 return bingoIndexes;
}

function calculateScore(number, board) {
 let sum = 0;

 for (let i = 0; i < 5; i++) {
  for (let j = 0; j < 5; j++) {
   if (board[i][j] !== 'x') {
    sum += board[i][j];
   }
  }
 }

 return sum * number;
}

function removeBingos(indexesOfBingos, boards) {
 return boards.filter((board, index) => {
  return !indexesOfBingos.includes(index);
 });
}

function part1() {
 let newData = JSON.parse(JSON.stringify(data));
 let index = 0;
 let bingoBoards = [];

 while(bingoBoards.length === 0) {
  newData.boards = play(newData.numbers[index], newData.boards);
  bingoBoards = getBingos(newData.boards);
  index++;
 }

 return calculateScore(newData.numbers[index - 1], newData.boards[bingoBoards[0]]);
}

function part2() {
 let newData = JSON.parse(JSON.stringify(data));
 let index = 0;
 let lastBingoBoard = null;
 let lastBingoNumberIndex = 0;

 while(index < newData.numbers.length) {
  newData.boards = play(newData.numbers[index], newData.boards);
  const bingoBoards = getBingos(newData.boards);

  if (bingoBoards.length > 0) {
   lastBingoBoard = newData.boards[bingoBoards[0]];
   lastBingoNumberIndex = index;
   newData.boards = removeBingos(bingoBoards, newData.boards);
  }

  index++;
 }

 return calculateScore(newData.numbers[lastBingoNumberIndex], lastBingoBoard);
}

console.log('part1: ' + part1());
console.log('part2: ' + part2());

