import ship from "./ship.js";

export default function gameBoard() {
  const ships = [];
  const missedShot = [];

  function placeShips(length, coordinates) {
    const newShip = ship(length);
    ships.push({ ship: newShip, coordinates, hits: [] });
  }

  function receiveAttack(coordinate) {
    for (let i = 0; i < ships.length; i++) {
      const singleShip = ships[i];

      for (let j = 0; j < singleShip.coordinates.length; j++) {
        const recordCord = singleShip.coordinates[j];

        if (
          recordCord[0] === coordinate[0] &&
          recordCord[1] === coordinate[1]
        ) {
          singleShip.ship.hit();
          singleShip.hits.push(coordinate);
          return "hit";
        }
      }
    }

    missedShot.push(coordinate);
    return "miss";
  }

  function allShipsSunk() {
    return ships.every((s) => s.ship.isSunk());
  }

  return {
    ships,
    placeShips,
    receiveAttack,
    missedShot,
    allShipsSunk,
  };
}
