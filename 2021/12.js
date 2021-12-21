'use strict';

const fs = require('fs');
const path = require("path");
const fileName = path.basename(__filename, path.extname(__filename));
const data = processData(fs.readFileSync(`./${fileName}`, 'utf8').split('\n').slice(0, -1));

function processData(dataRows) {
  return dataRows.map(row => {
    return row.split('-');
  });
}

function buildGraph() {
  let graph = {};

  data.forEach(row => {
    if (Object.keys(graph).includes(row[0])) {
      if (!graph[row[0]].includes(row[1])) {
        graph[row[0]].push(row[1]);
      }
    } else {
      graph[row[0]] = [row[1]];
    }

    if (Object.keys(graph).includes(row[1])) {
      if (!graph[row[1]].includes(row[0])) {
        graph[row[1]].push(row[0]);
      }
    } else {
      graph[row[1]] = [row[0]];
    }
  });

  return graph;
}

function countPaths(graph, start, end, seen = [], hadDouble) {
  if (start === end) {
    return 1;
  }

  let count = 0;

  for (let item of graph[start]) {
    let tmpHadDouble = JSON.parse(JSON.stringify(hadDouble));

    if (item === item.toLowerCase() && seen.includes(item)) {
      if (tmpHadDouble || ['start', 'end'].includes(item)) {
        continue;
      } else {
        tmpHadDouble = true;
      }
    }

    seen.push(start);

    count += countPaths(graph, item, end, JSON.parse(JSON.stringify(seen)), tmpHadDouble);
  }

  return count;
}

function part1(enableDouble) {
  let graph = buildGraph();
  return countPaths(graph, 'start', 'end', [], enableDouble);
}

console.log('part1: ' + part1(true));
console.log('part2: ' + part1(false));

