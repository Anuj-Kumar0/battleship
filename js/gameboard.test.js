import gameBoard from "./gameboard.js";

describe("gameBoard.receiveAttack", () => {
  let board;

  beforeEach(() => {
    board = gameBoard();
    board.placeShips(3, [
      [0, 0],
      [0, 1],
      [0, 2],
    ]);
  });

  test("records a hit", () => {
    const result = board.receiveAttack([0, 1]);

    expect(result).toBe("hit");
    expect(board.ships[0].hits).toContainEqual([0, 1]);
  });

  test("records multiple hits on same ship", () => {
    board.receiveAttack([0, 0]);
    board.receiveAttack([0, 1]);

    expect(board.ships[0].hits.length).toBe(2);
  });

  test("missed shots are tracked correctly", () => {
    board.receiveAttack([5, 5]);
    board.receiveAttack([6, 6]);

    expect(board.missedShot).toEqual([
      [5, 5],
      [6, 6],
    ]);
  });
});
