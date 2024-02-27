const scoreElement = document.querySelector(".score");

function convertPositionToIndex(row, column) {
  return row * PLAYFIELDS_COLUMNS + column;
}

function getRandomElement(arr) {
  const randomIndex = Math.round(Math.random() * (arr.length - 1));
  return arr[randomIndex];
}

let playfield;
let tetromino;

let score = 0;

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
    // default:
    //   score += 200;
  }
  scoreElement.innerHTML = score;
}

function generatePlayField() {
  for (let i = 0; i < PLAYFIELDS_COLUMNS * PLAYFIELDS_ROWS; i++) {
    const div = document.createElement("div");
    document.querySelector(".grid").append(div);
  }
  playfield = new Array(PLAYFIELDS_ROWS)
    .fill()
    .map(() => new Array(PLAYFIELDS_COLUMNS).fill(0));
  // console.log(playfield);
}

function generateTetromino() {
  const name = getRandomElement(TETROMINO_NAMES);
  const matrix = TETROMINOES[name];
  // console.log(matrix.length);
  const column = Math.floor((PLAYFIELDS_COLUMNS - matrix.length) / 2);
  const rowTetro = -2;

  tetromino = {
    name,
    matrix,
    row: rowTetro,
    column,
  };
}

function placeTetromino() {
  const matrixSize = tetromino.matrix.length;
  for (let row = 0; row < matrixSize; row++) {
    for (let column = 0; column < matrixSize; column++) {
      if (tetromino.matrix[row][column]) {
        playfield[tetromino.row + row][tetromino.column + column] =
          tetromino.name;
      }
    }
  }

  const filledRows = findFilledRows();
  removeFillRows(filledRows);
  generateTetromino();
  countScore(filledRows.length);
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

generatePlayField();
generateTetromino();
const cells = document.querySelectorAll(".grid div");

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
    //column
  }
  //row
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

document.addEventListener("keydown", onKeyDown);
function onKeyDown(e) {
  switch (e.key) {
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
  draw();
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
}
let timedId = null;
moveDown();
function startLoop() {
  setTimeout(() => {
    timedId = requestAnimationFrame(moveDown);
  }, 700);
}

function stopLoop() {
  cancelAnimationFrame(timedId);
  timedId = clearTimeout(timedId);
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
