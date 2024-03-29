import {
  PLAYFIELDS_COLUMNS,
  PLAYFIELDS_ROWS,
  TETROMINOES,
  TETROMINO_NAMES,
} from "./constant.js";

const btnRestart = document.querySelector(".btn-restart");
const downBtn = document.querySelector(".down");
const lineElement = document.querySelector(".line");
const leftBtn = document.querySelector(".left");
const overElement = document.querySelector(".over");
const overlay = document.querySelector(".overlay");
const pauseElement = document.querySelector(".paused");
const putBtn = document.querySelector(".put");
const restartElement = document.querySelector(".restart");
const rightBtn = document.querySelector(".right");
const scoreBtn = document.querySelector(".score-btn");
const scoreElement = document.querySelector(".score");
const timer = document.querySelector(".timer");
const totalElement = document.querySelector(".total");
const upBtn = document.querySelector(".up");
const winElement = document.querySelector(".win");
let cells;
let cellsNext;
let line;
let playfield;
let nameElement;
let nameNext;
let nextPlayfield;
let score;
let tetromino;
let tetrominoNext;
let time;
let timedId = null;
let timerID = null;
let total = 0;
let isGameOver = false;
let isPaused = false;

document.addEventListener("keydown", onKeyDown);
btnRestart.addEventListener("click", restart);
downBtn.addEventListener("click", moveTetrominoDown);
leftBtn.addEventListener("click", moveTetrominoLeft);
pauseElement.addEventListener("click", togglePauseGame);
putBtn.addEventListener("click", dropTetrominoDown);
restartElement.addEventListener("click", restartBTN);
rightBtn.addEventListener("click", moveTetrominoRight);
upBtn.addEventListener("click", rotate);

init();

function timerGame() {
  timerID = setInterval(function () {
    if (!isPaused) time += 1;
    let minutes = Math.floor(time / 60);
    let seconds = time % 60;
    timer.innerHTML =
      minutes.toString().padStart(2, 0) +
      ":" +
      seconds.toString().padStart(2, 0);
  }, 1000);
}

function init() {
  if (timerID) clearInterval(timerID);
  time = 0;
  timerGame();
  score = 0;
  line = 0;
  isGameOver = false;
  generatePlayField();
  nameElement = getRandomElement(TETROMINO_NAMES);
  generateTetromino(nameElement);
  cells = document.querySelectorAll(".grid div");
  cellsNext = document.querySelectorAll(".next div");
  generateNext();
  nextFigure();
  moveDown();
  localStorage.getItem("total")
    ? (total = +localStorage.getItem("total"))
    : 0;
  scoreElement.innerHTML = 0;
  totalElement.innerHTML = total;
  overElement.style.display = "none";
  winElement.style.display = "none";
}

function generateNext() {
  for (let i = 0; i < 12; i++) {
    const div = document.createElement("div");
    document.querySelector(".next").append(div);
  }
  nextPlayfield = new Array(3).fill().map(() => new Array(4).fill(0));
}

function nextFigure() {
  const matrixSizeNext = tetrominoNext.matrixNext.length;
  for (let row = 0; row < matrixSizeNext; row++) {
    for (let column = 0; column < matrixSizeNext; column++) {
      if (tetrominoNext.matrixNext[row][column]) {
        nextPlayfield[tetrominoNext.row][
          tetrominoNext.column + column
        ] = tetrominoNext.nameNext;
      }
    }
  }

  cellsNext = document.querySelectorAll(".next div");

  const nameNext = tetrominoNext.nameNext;
  const sizeNext = tetrominoNext.matrixNext.length;
  for (let row = 0; row < sizeNext; row++) {
    for (let column = 0; column < sizeNext; column++) {
      if (TETROMINOES[nameNext][row][column] === 0) continue;
      const cellIndexNext = row * 4 + column;

      cellsNext[cellIndexNext].classList.add(nameNext);
    }
  }
}

function restart() {
  document.querySelector(".grid").innerHTML = "";
  document.querySelector(".next").innerHTML = "";
  overlay.style.display = "none";
  init();
}

function convertPositionToIndex(row, column) {
  return row * PLAYFIELDS_COLUMNS + column;
}

function getRandomElement(arr) {
  const randomIndex = Math.round(Math.random() * (arr.length - 1));
  return arr[randomIndex];
}

function countScore(destroyRows) {
  switch (destroyRows) {
    case 1:
      score += 10;
      break;
    case 2:
      score += 20;
      break;
    case 3:
      score += 50;
      break;
    case 4:
      score += 100;
      break;
    case 5:
      score += 200;
  }
  line += destroyRows;
  scoreElement.innerHTML = score.toString().padStart(2, 0);
}

function generatePlayField() {
  for (let i = 0; i < PLAYFIELDS_COLUMNS * PLAYFIELDS_ROWS; i++) {
    const div = document.createElement("div");
    document.querySelector(".grid").append(div);
  }
  playfield = new Array(PLAYFIELDS_ROWS)
    .fill()
    .map(() => new Array(PLAYFIELDS_COLUMNS).fill(0));
}

function generateTetromino(nameElement) {
  nameNext = getRandomElement(TETROMINO_NAMES);
  const matrix = TETROMINOES[nameElement];
  const matrixNext = TETROMINOES[nameNext];
  const column = Math.floor((PLAYFIELDS_COLUMNS - matrix.length) / 2);
  const rowTetro = -2;

  tetromino = {
    name: nameElement,
    matrix,
    row: rowTetro,
    column,
  };

  tetrominoNext = {
    nameNext,
    matrixNext,
    row: 0,
    column: 0,
  };
}

function placeTetromino() {
  const matrixSize = tetromino.matrix.length;
  for (let row = 0; row < matrixSize; row++) {
    for (let column = 0; column < matrixSize; column++) {
      if (isOutsideOfTopboard(row)) {
        isGameOver = true;
        return;
      }
      if (tetromino.matrix[row][column]) {
        playfield[tetromino.row + row][tetromino.column + column] =
          tetromino.name;
      }
    }
  }

  const filledRows = findFilledRows();
  removeFillRows(filledRows);
  generateTetromino(nameNext);
  countScore(filledRows.length);
  cellsNext.forEach((cell) => cell.removeAttribute("class"));
  nextFigure();
}

function removeFillRows(filledRows) {
  for (let i = 0; i < filledRows.length; i++) {
    const row = filledRows[i];
    dropRowsAbove(row);
  }
}

function dropRowsAbove(rowDelete) {
  for (let row = rowDelete; row > 0; row--) {
    playfield[row] = playfield[row - 1];
  }
  playfield[0] = new Array(PLAYFIELDS_COLUMNS).fill(0);
}

function findFilledRows() {
  const fillRows = [];
  for (let row = 0; row < PLAYFIELDS_ROWS; row++) {
    let filledColumns = 0;
    for (let column = 0; column < PLAYFIELDS_COLUMNS; column++) {
      if (playfield[row][column] != 0) {
        filledColumns++;
      }
    }
    if (PLAYFIELDS_COLUMNS === filledColumns) {
      fillRows.push(row);
    }
  }
  return fillRows;
}

function drawPlayField() {
  for (let row = 0; row < PLAYFIELDS_ROWS; row++) {
    for (let column = 0; column < PLAYFIELDS_COLUMNS; column++) {
      if (playfield[row][column] == 0) continue;

      const name = playfield[row][column];
      const cellIndex = convertPositionToIndex(row, column);
      // console.log(cellIndex);
      cells[cellIndex].classList.add(name);
    }
  }
}

function drawTetromino() {
  const name = tetromino.name;
  const tetrominoMatrixSize = tetromino.matrix.length;

  for (let row = 0; row < tetrominoMatrixSize; row++) {
    for (let column = 0; column < tetrominoMatrixSize; column++) {
      if (isOutsideOfTopboard(row)) continue;
      if (!tetromino.matrix[row][column]) continue;
      if (tetromino.row + row < 0) continue;
      const cellIndex = convertPositionToIndex(
        tetromino.row + row,
        tetromino.column + column
      );
      // cells[cellIndex].innerHTML = showRotated[row][column];
      // console.log(cellIndex);
      cells[cellIndex].classList.add(name);
    }
  }
}

// drawTetromino();
// drawPlayField();

function draw() {
  cells.forEach((cell) => cell.removeAttribute("class"));
  drawTetromino();
  drawPlayField();
}

// let showRotated = [
//   [1, 2, 3],
//   [4, 5, 6],
//   [7, 8, 9],
// ];

function rotateTetromino() {
  const oldMatrix = tetromino.matrix;
  const rotatedMatrix = rotateMatrix(tetromino.matrix);
  // showRotated = rotateMatrix(showRotated);

  tetromino.matrix = rotatedMatrix;
  if (!isValid()) {
    tetromino.matrix = oldMatrix;
  }
}

draw();

function rotate() {
  rotateTetromino();
  draw();
}

function onKeyDown(e) {
  if (e.key === "Escape") {
    togglePauseGame();
  }
  if (!isPaused) {
    switch (e.key) {
      case " ":
        dropTetrominoDown();
        break;
      case "ArrowUp":
        rotate();
        break;
      case "ArrowDown":
        moveTetrominoDown();
        break;
      case "ArrowLeft":
        moveTetrominoLeft();
        break;
      case "ArrowRight":
        moveTetrominoRight();
        break;
    }
  }
  draw();
}

function dropTetrominoDown() {
  while (isValid()) {
    tetromino.row++;
  }
  tetromino.row--;
}

function rotateMatrix(matrixTetromino) {
  const N = matrixTetromino.length;
  const rotateMatrix = [];
  for (let i = 0; i < N; i++) {
    rotateMatrix[i] = [];
    for (let j = 0; j < N; j++) {
      rotateMatrix[i][j] = matrixTetromino[N - j - 1][i];
    }
  }
  return rotateMatrix;
}

function moveTetrominoDown() {
  tetromino.row += 1;
  if (!isValid()) {
    tetromino.row -= 1;
    placeTetromino();
  }
  startLoop();
}

function moveTetrominoLeft() {
  tetromino.column -= 1;
  if (!isValid()) {
    tetromino.column += 1;
  }
}

function moveTetrominoRight() {
  tetromino.column += 1;
  if (!isValid()) {
    tetromino.column -= 1;
  }
}

function moveDown() {
  moveTetrominoDown();
  draw();
  stopLoop();
  startLoop();
  if (isGameOver) {
    gameOver();
  }
}

function gameOver() {
  stopLoop();
  clearInterval(timerID);
  overlay.style.display = "flex";
  if (+localStorage.getItem("total") < score) {
    localStorage.setItem("total", score);
    winElement.style.display = "block";
  } else {
    overElement.style.display = "block";
  }
  scoreBtn.innerHTML = score;
  lineElement.innerHTML = line;
}

function startLoop() {
  if (!timedId) {
    timedId = setTimeout(() => {
      requestAnimationFrame(moveDown);
    }, 700);
  }
}

function stopLoop() {
  cancelAnimationFrame(timedId);
  clearTimeout(timedId);

  timedId = null;
}

function togglePauseGame() {
  if (!isPaused) {
    stopLoop();
  } else {
    startLoop();
  }
  isPaused = !isPaused;
}

function isValid() {
  const matrixSize = tetromino.matrix.length;
  for (let row = 0; row < matrixSize; row++) {
    for (let column = 0; column < matrixSize; column++) {
      // if(tetromino.matrix[row][column]) continue;
      if (isOutsideOfGameboard(row, column)) {
        return false;
      }
      if (hasCollisions(row, column)) {
        return false;
      }
    }
  }
  return true;
}

function isOutsideOfTopboard(row) {
  return tetromino.row + row < 0;
}

function isOutsideOfGameboard(row, column) {
  return (
    tetromino.matrix[row][column] &&
    (tetromino.column + column < 0 ||
      tetromino.column + column >= PLAYFIELDS_COLUMNS ||
      tetromino.row + row >= PLAYFIELDS_ROWS)
  );
}

function hasCollisions(row, column) {
  return (
    tetromino.matrix[row][column] &&
    playfield[tetromino.row + row]?.[tetromino.column + column]
  );
}

function restartBTN() {
  restart();
  this.blur();
}
