import Player from "./player.js";
import renderBoard from "./renderboard.js";

const render = renderBoard();
const human = Player("human");
const computer = Player("computer");

let gameStarted = false;
let horizontal = true;

const SHIP_SIZES = [5, 4, 3, 3, 2]; //Number of ships
const rotateBtn = document.querySelector("#rotate-btn");
const randomBtn = document.querySelector("#random-btn");
const startBtn = document.querySelector("#start-btn");
const restartBtn = document.querySelector("#restart-btn");
const placementStatus = document.querySelector("#placement-status");
const turnIndicator = document.querySelector("#turn-indicator");
const shipPalette = document.querySelector("#ship-palette");
const playerBoard = document.querySelector("#player-board");

//Rotate Button
rotateBtn.addEventListener("click", () => {
  horizontal = !horizontal;
  rotateBtn.textContent = `Rotate (${horizontal ? "Horizontal" : "Vertical"})`;
});

//Create draggable ships
function createShipPalette() {
  shipPalette.innerHTML = "";
  SHIP_SIZES.forEach((size, i) => {
    const shipDiv = document.createElement("div");
    shipDiv.classList.add("draggable-ship");
    shipDiv.style.width = horizontal
      ? `${30 * size + (size - 1) * 2}px`
      : "30px";
    shipDiv.style.height = horizontal
      ? "30px"
      : `${30 * size + (size - 1) * 2}px`;
    shipDiv.draggable = true;
    shipDiv.dataset.length = size;
    shipPalette.appendChild(shipDiv);
  });
}
createShipPalette();

// Board Drag Events
playerBoard.addEventListener("dragover", (e) => {
  e.preventDefault();
  e.target.classList.add("drag-over");
});

playerBoard.addEventListener("dragleave", (e) => {
  e.target.classList.remove("drag-over");
});

playerBoard.addEventListener("drop", (e) => {
  e.preventDefault();
  e.target.classList.remove("drag-over");

  const length = Number(e.dataTransfer.getData("length"));
  const x = Number(e.target.dataset.x);
  const y = Number(e.target.dataset.y);

  if (Number.isNaN(x) || Number.isNaN(y)) return;

  const coords = [];
  for (let i = 0; i < length; i++) {
    const nx = horizontal ? x + i : x;
    const ny = horizontal ? y : y + i;
    if (nx > 9 || ny > 9) return;
    coords.push([nx, ny]);
  }

  //For overlapping ships
  const overlap = coords.some((c) =>
    human.board.ships.some((s) =>
      s.coordinates.some(([a, b]) => a === c[0] && b === c[1])
    )
  );
  if (overlap) return;

  human.board.placeShips(length, coords);
  render.updateBoards(human, computer);
  const shipToRemove = [...shipPalette.children].find(
    (el) => Number(el.dataset.length) === length
  );
  if (shipToRemove) shipToRemove.remove();

  if (shipPalette.children.length === 0) {
    placementStatus.textContent = "All ships placed! Click Start Game.";
    startBtn.disabled = false;
  }
});

// Ship drag start
shipPalette.addEventListener("dragstart", (e) => {
  if (!e.target.classList.contains("draggable-ship")) return;
  e.dataTransfer.setData("length", e.target.dataset.length);
});

//Randomize and Start Game
randomBtn.addEventListener("click", () => {
  randomizeBoard(human.board);
  randomizeBoard(computer.board);
  render.updateBoards(human, computer);
  placementStatus.textContent = "Ships placed randomly!";
  shipPalette.innerHTML = "";
  startBtn.disabled = false;
});

startBtn.addEventListener("click", () => {
  if (shipPalette.children.length > 0) return alert("Place all ships first!");
  randomizeBoard(computer.board);
  render.updateBoards(human, computer);
  placementStatus.textContent = "";
  rotateBtn.disabled = true;
  randomBtn.disabled = true;
  startBtn.disabled = true;
  gameStarted = true;
  turnIndicator.textContent = "Your Turn";
});

//Random Placement Helper
function getRandomCoords(length) {
  const horizontal = Math.random() < 0.5;
  const startX = Math.floor(Math.random() * (horizontal ? 10 - length : 10));
  const startY = Math.floor(Math.random() * (horizontal ? 10 : 10 - length));
  const coords = [];
  for (let i = 0; i < length; i++) {
    coords.push(horizontal ? [startX + i, startY] : [startX, startY + i]);
  }
  return coords;
}

function randomizeBoard(board) {
  board.ships.length = 0;
  SHIP_SIZES.forEach((size) => {
    let coords;
    do {
      coords = getRandomCoords(size);
    } while (
      coords.some((c) =>
        board.ships.some((s) =>
          s.coordinates.some((p) => p[0] === c[0] && p[1] === c[1])
        )
      )
    );
    board.placeShips(size, coords);
  });
}

//Attacking
document.querySelector("#computer-board").addEventListener("click", (e) => {
  if (!gameStarted) return;
  if (!e.target.classList.contains("cell")) return;

  const x = Number(e.target.dataset.x);
  const y = Number(e.target.dataset.y);

  const alreadyAttacked =
    computer.board.missedShot.some(([a, b]) => a === x && b === y) ||
    computer.board.ships.some((s) =>
      s.hits.some(([a, b]) => a === x && b === y)
    );
  if (alreadyAttacked) return;

  computer.board.receiveAttack([x, y]);
  render.updateBoards(human, computer);
  if (checkWinner()) return;

  turnIndicator.textContent = "Computer’s Turn...";
  setTimeout(computerTurn, 400);
});

function computerTurn() {
  const [x, y] = computer.getRandomMove();
  human.board.receiveAttack([x, y]);
  render.updateBoards(human, computer);
  if (checkWinner()) return;
  turnIndicator.textContent = "Your Turn";
}

function checkWinner() {
  if (computer.board.allShipsSunk()) {
    turnIndicator.textContent = "You Win!";
    gameStarted = false;
    restartBtn.hidden = false;
    return true;
  }

  if (human.board.allShipsSunk()) {
    turnIndicator.textContent = "Computer Wins!";
    gameStarted = false;
    restartBtn.hidden = false;
    return true;
  }

  return false;
}

restartBtn.addEventListener("click", () => {
  human.board.ships.length = 0;
  human.board.missedShot.length = 0;
  computer.board.ships.length = 0;
  computer.board.missedShot.length = 0;

  shipPalette.innerHTML = "";
  createShipPalette();
  placementStatus.textContent = "Drag your ships onto the board";
  turnIndicator.textContent = "";
  restartBtn.hidden = true;

  rotateBtn.disabled = false;
  randomBtn.disabled = false;
  startBtn.disabled = true;

  gameStarted = false;
  render.updateBoards(human, computer);
});
