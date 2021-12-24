'use strict';

const fs = require('fs');
const path = require("path");
const fileName = path.basename(__filename, path.extname(__filename));
const data = processData(fs.readFileSync(`./${fileName}`, 'utf8').split('\n').slice(0, -1));

function processData(dataRows) {
  let processedData = {
    index: 0,
    inputIndex: 0,
    inputs: [],
    registers: {
      w: 0,
      x: 0,
      y: 0,
      z: 0
    },
    commands: []
  };

  processedData.commands = dataRows.map(row => {
    const splittedRow = row.split(' ');
    const value = splittedRow[2];
    return {
      command: splittedRow[0],
      to: splittedRow[1],
      value: isNaN(value) ? value : parseInt(value)
    };
  });

  return processedData;
}

function run(program) {
  switch (program.commands[program.index].command) {
    case 'inp': {
      program.registers[program.commands[program.index].to] = program.inputs[program.inputIndex++];
      break;
    }
    case 'add': {
      program.registers[program.commands[program.index].to] =
        program.registers[program.commands[program.index].to] +
        (
          isNaN(program.commands[program.index].value) ?
          program.registers[program.commands[program.index].value] :
          program.commands[program.index].value
        )
      break;
    }
    case 'mul': {
      program.registers[program.commands[program.index].to] =
        program.registers[program.commands[program.index].to] *
        (
          isNaN(program.commands[program.index].value) ?
            program.registers[program.commands[program.index].value] :
            program.commands[program.index].value
        )
      break;
    }
    case 'div': {
      program.registers[program.commands[program.index].to] =
        Math.floor(program.registers[program.commands[program.index].to] /
        (
          isNaN(program.commands[program.index].value) ?
            program.registers[program.commands[program.index].value] :
            program.commands[program.index].value
        ))
      break;
    }
    case 'mod': {
      program.registers[program.commands[program.index].to] =
        program.registers[program.commands[program.index].to] %
          (
            isNaN(program.commands[program.index].value) ?
              program.registers[program.commands[program.index].value] :
              program.commands[program.index].value
          )
      break;
    }
    case 'eql': {
      program.registers[program.commands[program.index].to] =
        (program.registers[program.commands[program.index].to] ===
        (
          isNaN(program.commands[program.index].value) ?
            program.registers[program.commands[program.index].value] :
            program.commands[program.index].value
        )) ? 1 : 0
      break;
    }
  }

  return program;
}

function checkModelNumber(inputs) {
  let program = JSON.parse(JSON.stringify(data));
  program.inputs = inputs;

  for (let i = 0; i < program.commands.length; i++) {
    program.index = i;
    program = run(program);
  }

  return program.registers.z === 0;
}

function part1(modelNumber) {
  let inputs = modelNumber.toString().split('').map(Number);

  return checkModelNumber(inputs);
}

// After reverse engineering the inputs, I found the following relations between them
//  input[1] = input[14] - 5
//  input[2] = input[13] - 4
//  input[3] = input[12] + 8
//  input[4] = input[5] - 1
//  input[6] = input[7] + 7
//  input[9] = input[10] + 5
//  input[8] = input[11] + 3
// From this, I can easily calculate the proper modelNumber


console.log('part1: ' + part1(45989929946199));
console.log('part2: ' + part1(11912814611156));

