import ship from "./ship.js";
import gameBoard from "./gameboard.js";

describe("ship factory", () => {
  test("length of the ship", () => {
    const Ship = ship(3);
    expect(Ship.length).toBe(3);
  });

  test("number of hits", () => {
    const Ship = ship(3);
    const shipHit = Ship.hit();
    expect(shipHit).toBe(1);
  });

  test("sunk status", () => {
    const Ship = ship(3);
    Ship.hit();
    Ship.hit();
    Ship.hit();
    expect(Ship.isSunk()).toBe(true);
  });
});

describe("gameboard", () => {
  test("place a ship at given coordinates", () => {
    const board = gameBoard();
    board.placeShips(3, [
      [0, 0],
      [0, 1],
      [0, 2],
    ]);
    expect(board.ships.length).toBe(1);
    expect(board.ships[0].ship.length).toBe(3);
    expect(board.ships[0].coordinates).toEqual([
      [0, 0],
      [0, 1],
      [0, 2],
    ]);
  });

  test("record miss", () => {
    const board = gameBoard();
    board.placeShips(3, [
      [0, 0],
      [0, 1],
      [0, 2],
    ]);

    const result = board.receiveAttack([3, 2]);
    expect(result).toBe("miss");
    expect(board.missedShot).toEqual([[3, 2]]);
  });

  test("all ships sunk?", () => {
    const board = gameBoard();
    board.placeShips(2, [
      [0, 0],
      [0, 1],
    ]);

    board.receiveAttack([0, 0]);
    board.receiveAttack([0, 1]);
    expect(board.allShipsSunk()).toBe(true);
  });
});
