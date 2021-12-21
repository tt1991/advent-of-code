'use strict';

function step(game, currentPlayer, dice) {
  for (let i = 0; i < 3; i++) {
    dice = ++dice % 100;
    game[currentPlayer].position += dice;
  }

  while (game[currentPlayer].position > 10) {
    game[currentPlayer].position -= 10;
  }

  game[currentPlayer].points += game[currentPlayer].position;

  return { game, dice };
}

function playWithPlayer(player, allGames, gamesInProgress, playerWinCount = 0, newAllGames = {}) {
  for (let game in allGames) {
    let gameCount = allGames[game];

    gamesInProgress -= gameCount;

    let splittedSate = game.split(',').map(Number);
    let position = player === 'player1' ? splittedSate[0] : splittedSate[2];
    let points = player === 'player1' ? splittedSate[1] : splittedSate[3];
    let enemyPosition = player === 'player1' ? splittedSate[2] : splittedSate[0];
    let enemyPoints = player === 'player1' ? splittedSate[3] : splittedSate[1];

    for (let roll1 of [1, 2, 3]) {
      for (let roll2 of [1, 2, 3]) {
        for (let roll3 of [1, 2, 3]) {
          let newPosition = position + roll1 + roll2 + roll3;

          while (newPosition > 10) {
            newPosition -= 10;
          }

          let newPoints = points + newPosition;

          if (newPoints >= 21) {
            playerWinCount += gameCount;
          } else {
            let key = player === 'player1' ?
              `${newPosition},${newPoints},${enemyPosition},${enemyPoints}` :
              `${enemyPosition},${enemyPoints},${newPosition},${newPoints}`;
            newAllGames[key] = (newAllGames[key] || 0) + gameCount;
            gamesInProgress += gameCount;
          }
        }
      }
    }
  }

  return { gamesInProgress, playerWinCount, newAllGames };
}

function part1(player1, player2) {
  let game = { player1: { position: player1, points: 0 }, player2: { position: player2, points: 0 } }
  let dice = 0;
  let rollCount = 0;
  let currentPlayer = 'player1';

  while (game.player1.points < 1000 && game.player2.points < 1000) {
    let result = step(game, currentPlayer, dice);

    game = result.game;
    dice = result.dice;
    rollCount += 3;
    currentPlayer = currentPlayer === 'player1' ? 'player2' : 'player1';
  }

  return Math.min(game.player1.points, game.player2.points) * rollCount;
}

function part2(player1, player2) {
  let allGames = {};
  let gamesInProgress = 1;
  let winCounts = { player1: 0, player2: 0 };
  let currentPlayer = 'player1';

  allGames[`${player1},0,${player2},0`] = 1;

  while (gamesInProgress > 0) {
    let result = playWithPlayer(currentPlayer, allGames, gamesInProgress);

    gamesInProgress = result.gamesInProgress;
    allGames = result.newAllGames;
    winCounts[currentPlayer] += result.playerWinCount;
    currentPlayer = currentPlayer === 'player1' ? 'player2' : 'player1';
  }

  return Math.max(winCounts.player1, winCounts.player2);
}

console.log('part1: ' + part1(7, 3));
console.log('part2: ' + part2(7, 3));
