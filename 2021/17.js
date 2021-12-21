'use strict';

const input = { x: { from: 287, to: 309 }, y: { from: -76, to: -48 } };

function step(data) {
  data.probe[0] += data.velocity[0];
  data.probe[1] += data.velocity[1];
  data.velocity[0] -= Math.sign(data.velocity[0]);
  data.velocity[1] -= 1;

  return data;
}

function isInArea(data) {
  return data.probe[0] >= input.x.from && data.probe[0] <= input.x.to && data.probe[1] >= input.y.from && data.probe[1] <= input.y.to;
}

function calculateForVelocity(x, y) {
  let data = {
    probe: [0,0],
    velocity: [x,y]
  };
  let localHighestPoint = -Infinity;

  while(data.probe[0] < input.x.to && data.probe[1] >= input.y.from) {
    data = step(data);
    localHighestPoint = Math.max(localHighestPoint, data.probe[1]);

    if (isInArea(data)) {
      return localHighestPoint;
    }
  }

  return false;
}

function part1(isHighestRequested) {
  let highestPoint = -Infinity;
  let properVelocities = new Set();

  for (let i = -500; i < 500; i++) {
    for (let j = -500; j < 500; j++) {
      let highestPointForVelocity = calculateForVelocity(i, j);

      if (highestPointForVelocity !== false) {
        properVelocities.add(`${i},${j}`)
        highestPoint = Math.max(highestPoint, highestPointForVelocity);
      }
    }
  }

  return isHighestRequested ? highestPoint : properVelocities.size;
}

console.log('part1: ' + part1(true));
console.log('part2: ' + part1(false));

