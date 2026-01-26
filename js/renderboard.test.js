/**
 * @jest-environment jsdom
 */

import renderBoard from "./renderboard.js";
import player from "./player.js";

describe("renderBoard", () => {
  let human;
  let computer;
  let render;

  beforeEach(() => {
    document.body.innerHTML = `
      <div id="player-board"></div>
      <div id="computer-board"></div>
    `;

    human = player("human");
    computer = player("computer");

    human.board.placeShips(2, [
      [0, 0],
      [0, 1],
    ]);

    render = renderBoard();
    render.updateBoards(human, computer);
  });

  test("renders 100 cells per board", () => {
    const playerCells = document.querySelectorAll("#player-board .cell");
    const computerCells = document.querySelectorAll("#computer-board .cell");

    expect(playerCells.length).toBe(100);
    expect(computerCells.length).toBe(100);
  });

  test("shows ship cells on player board", () => {
    const shipCells = document.querySelectorAll("#player-board .ship-cell");
    expect(shipCells.length).toBe(2);
  });

  test("hides ships on computer board", () => {
    const shipCells = document.querySelectorAll("#computer-board .ship-cell");
    expect(shipCells.length).toBe(0);
  });
});
