'use strict';

const fs = require('fs');
const path = require("path");
const fileName = path.basename(__filename, path.extname(__filename));
const data = processData(fs.readFileSync(`./${fileName}`, 'utf8').split('\n').slice(0, -1));

function processData(dataRows) {
  let data = [];
  let index = 0;
  let tmp = [];

  dataRows.map(row => {
    if (row === '') {
      data.push(tmp);
      tmp = [];
      index++;
    } else {
      if (row.slice(0, 3) !== '---') {
        tmp.push(row.split(',').map(item => parseInt(item)));
      }
    }
  });

  data.push(tmp);

  return data;
}

function getDistance(x, y) {
  return Math.sqrt(Math.pow(x[0] - y[0], 2) + Math.pow(x[1] - y[1], 2) + Math.pow(x[2] - y[2], 2));
}

function getManhattanDistance(x, y) {
  return Math.abs(x[0] - y[0]) + Math.abs(x[1] - y[1]) + Math.abs(x[2] - y[2]);
}

function getDistances(scanner) {
  let distances = [];

  for (let i = 0; i < scanner.length; i++) {
    for (let j = 0; j < scanner.length; j++) {
      if (i !== j) {
        distances.push({ points: [scanner[i], scanner[j]], distance: getDistance(scanner[i], scanner[j]) });
      }
    }
  }

  return distances;
}

function checkIfDistancesAreEmpty(distances) {
  let alma = distances.filter(element => element.length > 0).length;
  console.log(alma);
  return alma === 0;
}

function getPointsForDistances(distancesData, distances) {
  let points = [];

  distancesData.forEach(data => {
    if (distances.includes(data.distance)) {
      let pointA = JSON.stringify(data.points[0]);
      let pointB = JSON.stringify(data.points[1]);

      if (!points.includes(pointA)) {
        points.push(pointA);
      }

      if (!points.includes(pointB)) {
        points.push(pointB);
      }
    }
  });

  return points.map(item => JSON.parse(item));
}

function getOrientations(x, y, z) {
  return [
    [x, y, z],
    [x, -y, -z],
    [x, z, -y],
    [x, -z, y],
    [-x, -y, z],
    [-x, y, -z],
    [-x, z, y],
    [-x, -z, -y],
    [y, z, x],
    [y, -z, -x],
    [y, x, -z],
    [y, -x, z],
    [-y, -z, x],
    [-y, z, -x],
    [-y, -x, -z],
    [-y, x, z],
    [z, x, y],
    [z, -x, -y],
    [z, y, -x],
    [z, -y, x],
    [-z, -x, y],
    [-z, x, -y],
    [-z, y, x],
    [-z, -y, -x],
  ]
}

function calculateOrientations(points) {
  let calculatedOrientations = Array.from(Array(24), () => new Array(0))

  points.forEach(point => {
    const orientations = getOrientations(point[0], point[1], point[2]);

    for (let i = 0; i < 24; i++) {
      calculatedOrientations[i].push(orientations[i]);
    }
  });

  return calculatedOrientations;
}

function getOffsetForPoints(pointA, pointB) {
  return [
    pointA[0] - pointB[0],
    pointA[1] - pointB[1],
    pointA[2] - pointB[2],
  ];
}

function getOffsets(commonPointInMap, orientation) {
  return orientation.map(element => getOffsetForPoints(commonPointInMap[0], element));
}

function getProperOffset(commonPointInMap, orientation) {
  let offsets = getOffsets(commonPointInMap, orientation);

  for (let i = 0; i < offsets.length; i++) {
    let matches = 0;

    commonPointInMap.forEach(item => {
      let isFoundInOrientation = orientation.filter(element => {
        let offsetOfPoints = getOffsetForPoints(item, element);

        return offsetOfPoints[0] === offsets[i][0] && offsetOfPoints[1] === offsets[i][1] && offsetOfPoints[2] === offsets[i][2]
      }).length === 1;

      if (isFoundInOrientation) {
        matches++;
      }
    });

    if (matches === commonPointInMap.length) {
      return offsets[i];
    }
  }

  return false;
}

function buildNewMap(map, points) {
  let newMap = map.map(item => JSON.stringify(item));

  points.map(item => JSON.stringify(item)).forEach(point => {
    if (!newMap.includes(point)) {
      newMap.push(point);
    }
  });

  return newMap.map(item => JSON.parse(item));
}

function getProperCoordinates(scanner, properOffset, j) {
  let orientationForScanner = calculateOrientations(scanner)[j];

  return orientationForScanner.map(item => {
    return [item[0] + properOffset[0], item[1] + properOffset[1], item[2] + properOffset[2]];
  });
}

function part1() {
  let scanners = JSON.parse(JSON.stringify(data));
  let scannerCoordinates = [[0,0,0]];
  let map = scanners[0];
  let distances = scanners.map(scanner => getDistances(scanner));
  let isEmpty = false

  distances[0] = [];

  while (!isEmpty) {
    const mapDistances = getDistances(map);

    for (let i = 0; i < distances.length; i++) {
      let otherDistances = distances[i].map(item => item.distance);
      const intersection = mapDistances.filter(value => otherDistances.includes(value.distance)).map(item => item.distance);

      if (intersection.length >= 132) {
        let commonPointInMap = getPointsForDistances(mapDistances, intersection);
        let commonPointInScanner = getPointsForDistances(distances[i], intersection);
        let orientations = calculateOrientations(commonPointInScanner);

        for (let j = 0; j < orientations.length; j++) {
          let properOffset = getProperOffset(commonPointInMap, orientations[j]);

          if (properOffset) {
            scannerCoordinates.push(properOffset);
            map = buildNewMap(map, getProperCoordinates(scanners[i], properOffset, j));
            distances[i] = [];
            break;
          }
        }
      }

      isEmpty = checkIfDistancesAreEmpty(distances);
    }
  }

  let maxDistance = -Infinity;

  for (let i = 0; i < scannerCoordinates.length; i++) {
    for (let j = 0; j < scannerCoordinates.length; j++) {
      if (i !== j) {
        const distance = getManhattanDistance(scannerCoordinates[i], scannerCoordinates[j])
        if (distance > maxDistance) {
          maxDistance = distance;
        }
      }
    }
  }

  console.log('part1: ' + map.length);
  console.log('part1: ' + maxDistance);
}

part1();

