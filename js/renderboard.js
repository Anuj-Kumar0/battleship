export default function renderBoard() {
  const playerDiv = document.querySelector("#player-board");
  const computerDiv = document.querySelector("#computer-board");

  function drawBoard(board, container, hideShips = false) {
    container.innerHTML = "";
    for (let x = 0; x < 10; x++) {
      for (let y = 0; y < 10; y++) {
        const cell = document.createElement("div");
        cell.classList.add("cell");
        cell.dataset.x = x;
        cell.dataset.y = y;

        const hasShip = board.ships.some((s) =>
          s.coordinates.some((c) => c[0] === x && c[1] === y)
        );
        if (hasShip && !hideShips) cell.classList.add("ship-cell");

        const hit = board.ships.some((s) =>
          s.hits.some((c) => c[0] === x && c[1] === y)
        );
        if (hit) cell.classList.add("hit");

        const missed = board.missedShot.some((c) => c[0] === x && c[1] === y);
        if (missed) cell.classList.add("miss");

        container.appendChild(cell);
      }
    }
  }

  function updateBoards(player, computer) {
    drawBoard(player.board, playerDiv);
    drawBoard(computer.board, computerDiv, true);
  }

  return { updateBoards, drawBoard, playerDiv, computerDiv };
}
