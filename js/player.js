import gameBoard from "./gameboard.js";

export default function player(type = "human") {
  const board = gameBoard();
  const previousMoves = [];

  function getRandomMove() {
    let x, y;
    do {
      x = Math.floor(Math.random() * 10);
      y = Math.floor(Math.random() * 10);
    } while (previousMoves.some(([a, b]) => a === x && b === y));

    previousMoves.push([x, y]);
    return [x, y];
  }
  return { type, board, getRandomMove };
}
